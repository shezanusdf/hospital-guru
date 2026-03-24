import { NextRequest } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { db } from "@/lib/db";
import { SYSTEM_PROMPT, extractStructuredData } from "@/lib/chatbot-prompt";
import { sendInquiryNotification } from "@/lib/email";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages, leadAlreadyCaptured } = body as {
      messages: { role: "user" | "assistant"; content: string }[];
      leadAlreadyCaptured?: boolean;
    };

    if (!messages || messages.length === 0) {
      return Response.json({ error: "Messages required" }, { status: 400 });
    }

    // ── Stream response from Claude ───────────────────────────────────────
    const stream = await anthropic.messages.stream({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 600,
      system: SYSTEM_PROMPT,
      messages: messages.map((m) => ({
        role: m.role,
        content: m.content,
      })),
    });

    // ── Stream to client, collect full response ───────────────────────────
    const encoder = new TextEncoder();
    let fullResponse = "";

    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            if (
              chunk.type === "content_block_delta" &&
              chunk.delta.type === "text_delta"
            ) {
              const text = chunk.delta.text;
              fullResponse += text;
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({ text })}\n\n`)
              );
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
