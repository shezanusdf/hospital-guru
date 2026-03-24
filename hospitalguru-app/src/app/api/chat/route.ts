import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { SYSTEM_PROMPT, extractStructuredData } from "@/lib/chatbot-prompt";
import { sendInquiryNotification } from "@/lib/email";

// OpenRouter API — uses OpenAI-compatible format
// Free models: no API key cost, just sign up at openrouter.ai
const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const OPENROUTER_MODEL = process.env.OPENROUTER_MODEL || "meta-llama/llama-3.1-8b-instruct:free";

export async function POST(req: NextRequest) {
  try {
    if (!process.env.OPENROUTER_API_KEY) {
      return Response.json(
        { error: "Chat is not configured yet. Please set OPENROUTER_API_KEY." },
        { status: 503 }
      );
    }

    const body = await req.json();
    const { messages, leadAlreadyCaptured } = body as {
      messages: { role: "user" | "assistant"; content: string }[];
      leadAlreadyCaptured?: boolean;
    };

    if (!messages || messages.length === 0) {
      return Response.json({ error: "Messages required" }, { status: 400 });
    }

    // ── Stream response from OpenRouter ─────────────────────────────────
    const response = await fetch(OPENROUTER_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
        "X-Title": "HospitalGuru",
      },
      body: JSON.stringify({
        model: OPENROUTER_MODEL,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages.map((m) => ({ role: m.role, content: m.content })),
        ],
        max_tokens: 600,
        stream: true,
      }),
    });

    if (!response.ok || !response.body) {
      const err = await response.text();
      console.error("[OpenRouter]", response.status, err);
      return Response.json({ error: "AI service unavailable" }, { status: 502 });
    }

    // ── Stream to client, collect full response ─────────────────────────
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();
    let fullResponse = "";

    const readable = new ReadableStream({
      async start(controller) {
        try {
          const reader = response.body!.getReader();
          let buffer = "";

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split("\n");
            buffer = lines.pop() || "";

            for (const line of lines) {
              if (!line.startsWith("data: ") || line === "data: [DONE]") continue;

              try {
                const json = JSON.parse(line.slice(6));
                const text = json.choices?.[0]?.delta?.content;
                if (text) {
                  fullResponse += text;
                  controller.enqueue(
                    encoder.encode(`data: ${JSON.stringify({ text })}\n\n`)
                  );
                }
              } catch {
                // Skip malformed chunks
              }
            }
          }

          // ── After streaming: check if lead is captured ─────────────────
          const updatedStructured = extractStructuredData([
            ...messages,
            { role: "assistant", content: fullResponse },
          ]);

          // Auto-create inquiry when lead is captured for the first time
          let inquiryNumber: string | null = null;
          if (updatedStructured.leadCaptured && !leadAlreadyCaptured) {
            try {
              const inquiry = await db.inquiry.create({
                data: {
                  inquiryNumber: `HG-${Date.now()}`,
                  guestName:     (updatedStructured.name     as string) || null,
                  guestEmail:    (updatedStructured.email    as string) || null,
                  guestPhone:    (updatedStructured.phone    as string) || null,
                  guestCountry:  (updatedStructured.country  as string) || null,
                  guestLanguage: (updatedStructured.language as string) || "en",
                  medicalSummary:(updatedStructured.condition as string) || null,
                  urgency:       (updatedStructured.urgency  as string) || "routine",
                  source:        "chatbot",
                  status:        "new",
                  chatContext:   JSON.stringify(updatedStructured),
                },
              });
              inquiryNumber = inquiry.inquiryNumber;

              // ── Fire email notification (non-blocking) ──────────────────
              if (process.env.EMAIL_APP_PASSWORD) {
                sendInquiryNotification({
                  inquiryNumber: inquiry.inquiryNumber,
                  name:          (updatedStructured.name     as string) || null,
                  email:         (updatedStructured.email    as string) || null,
                  phone:         (updatedStructured.phone    as string) || null,
                  country:       (updatedStructured.country  as string) || null,
                  condition:     (updatedStructured.condition as string) || null,
                  urgency:       (updatedStructured.urgency  as string) || "routine",
                  language:      (updatedStructured.language as string) || "en",
                  chatContext:   JSON.stringify(updatedStructured),
                  source:        "chatbot",
                  createdAt:     inquiry.createdAt,
                }).catch((e) => console.error("[Email]", e));
              }
            } catch (e) {
              console.error("[Inquiry create]", e);
            }
          }

          // Send final metadata
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({
                done: true,
                leadCaptured: updatedStructured.leadCaptured,
                inquiryNumber,
              })}\n\n`
            )
          );
          controller.close();
        } catch (err) {
          controller.error(err);
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "X-Accel-Buffering": "no",
      },
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
