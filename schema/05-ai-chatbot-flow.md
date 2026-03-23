# HospitalGuru — AI Chatbot Flow Architecture

---

## 1. SYSTEM OVERVIEW

```
┌─────────────────────────────────────────────────────────────────────┐
│                     CIS PATIENT JOURNEY                             │
│                                                                     │
│  Patient visits                                                     │
│  hospitalguru.com  ──►  ChatWidget (floating)  ──►  GuruBot (AI)   │
│                                                         │           │
│                                                    Claude API       │
│                                                   (Haiku model)     │
│                                                         │           │
│                                                    /api/chat        │
│                                                         │           │
│                                              ┌──────────┴────────┐  │
│                                              │   SQLite / PG DB  │  │
│                                              │  ChatSession      │  │
│                                              │  Message          │  │
│                                              │  Inquiry (auto)   │  │
│                                              └───────────────────┘  │
│                                                         │           │
│                                              Case Manager notified  │
│                                              (email / dashboard)    │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 2. CHATBOT CONVERSATION STAGES

```
STAGE 1          STAGE 2          STAGE 3          STAGE 4
GREETING    ──►  UNDERSTAND  ──►  EDUCATE     ──►  COLLECT
                 CONDITION        & QUALIFY         CONTACT
                                                      │
                                              ┌───────▼────────┐
                                              │ AUTO-CREATE     │
                                              │ INQUIRY IN DB   │
                                              └───────┬────────┘
                                                      │
                    ┌─────────────────────────────────┤
                    ▼                                 ▼
              URGENT ROUTE                    STANDARD ROUTE
              (cancer, cardiac)               (elective)
                    │                                 │
                    ▼                                 ▼
            Case manager call              Email + WhatsApp
            within 2 hours                within 24 hours
```

---

## 3. LANGUAGE-AWARE FLOW

```
User sends first message
         │
         ▼
  Cyrillic detected? ──YES──► Switch to Russian (RU) mode
         │                           │
        NO                    Respond in Russian throughout
         │                           │
         ▼                           ▼
  English mode              Stage 2+ continues in RU

Both modes:
  - Greet in EN + RU on first message
  - Match user language from second message onwards
  - Always match user's chosen language
```

---

## 4. CIS ROUTING LOGIC

```
Patient Country Detected
         │
    ┌────┴────────────────────────────────┐
    ▼                                     ▼
 UZBEKISTAN /                      OTHER CIS COUNTRY
 CENTRAL ASIA                      (Russia, Kazakhstan,
    │                               Ukraine, Belarus, etc.)
    ▼                                     │
Mention:                                  ▼
"Global International Hospital     Standard India pathway:
 Tashkent — our CIS first-        - Apollo, Medanta, Fortis
 contact partner. You can         - Russian-speaking case
 visit them locally before         manager assigned
 traveling to India."              - WhatsApp + Telegram

Both paths → India treatment plan → Cost estimate → Inquiry
```

---

## 5. DATA COLLECTION SEQUENCE

The bot collects data **conversationally** (never as a form dump):

```
Turn 1-2:   Condition/diagnosis (what brings you here?)
Turn 2-3:   Duration, previous treatment, reports available?
Turn 3-4:   Urgency assessment (auto-classified by AI)
Turn 4-5:   Present cost savings & hospital options
Turn 5-6:   "To send you details I need..." → Name
Turn 6-7:   Email address
Turn 7-8:   WhatsApp / phone number
Turn 8-9:   Country, preferred travel timeframe
Turn 9+:    Confirm, create inquiry, hand off
```

### Structured Data Auto-Extracted from Conversation

```json
{
  "name": "Иван Петров",
  "email": "ivan@mail.ru",
  "phone": "+79001234567",
  "country": "Russia",
  "condition": "Knee replacement - bilateral OA Stage 3",
  "urgency": "routine",
  "budget": "5000-10000 USD",
  "language": "ru",
  "leadCaptured": true,
  "sessionToken": "cuid-abc123"
}
```

---

## 6. INQUIRY AUTO-CREATION TRIGGER

```
Condition: leadCaptured = true
  (email OR phone collected)
           │
           ▼
  db.inquiry.create({
    inquiryNumber: "HG-{timestamp}",
    guestName, guestEmail, guestPhone,
    guestCountry, guestLanguage,
    medicalSummary, urgency,
    source: "chatbot",
    status: "new",
    chatContext: JSON (full structured data)
  })
           │
           ▼
  db.chatSession.update({
    inquiryId: inquiry.id,
    leadCaptured: true
  })
           │
           ▼
  [FUTURE] Notify case manager via:
    - Email (AWS SES / Resend)
    - WhatsApp (Twilio)
    - Dashboard notification
```

---

## 7. URGENCY CLASSIFICATION

| Keyword / Context | Classification | Action |
|-------------------|---------------|--------|
| cancer, tumor, malignant, рак | urgent | Fast-track, 2hr response |
| heart attack, chest pain, stroke | emergency | Local emergency first |
| bypass, CABG, stent needed | urgent | 2hr case manager call |
| IVF, fertility, ЭКО | routine | Standard 24hr flow |
| knee, hip replacement | routine | Standard 24hr flow |
| transplant (liver, kidney) | urgent | Fast-track |
| second opinion | routine | Standard flow |

---

## 8. FULL TECH FLOW DIAGRAM

```
Browser                  Next.js App              Database (SQLite/PG)
   │                          │                           │
   │── POST /api/chat ────────►                           │
   │   { messages[], sessionToken }                       │
   │                          │                           │
   │                 ┌────────┴────────┐                  │
   │                 │ Find/create     ├──────────────────►│
   │                 │ ChatSession     │◄──────────────────┤
   │                 └────────┬────────┘                  │
   │                          │                           │
   │                 ┌────────┴────────┐                  │
   │                 │ Save user msg   ├──────────────────►│
   │                 └────────┬────────┘                  │
   │                          │                           │
   │                 ┌────────┴────────┐                  │
   │                 │ extractStructured│                  │
   │                 │ Data(messages)  │                  │
   │                 └────────┬────────┘                  │
   │                          │                           │
   │                 ┌────────┴────────┐                  │
   │                 │ Claude API      │                  │
   │                 │ (streaming)     │                  │
   │◄── SSE stream ──┤ SYSTEM_PROMPT + │                  │
   │  data: {text}   │ messages        │                  │
   │                 └────────┬────────┘                  │
   │                          │ (after stream complete)   │
   │                 ┌────────┴────────┐                  │
   │                 │ Save assistant  ├──────────────────►│
   │                 │ message         │                  │
   │                 └────────┬────────┘                  │
   │                          │                           │
   │                 ┌────────┴────────┐                  │
   │                 │ leadCaptured?   │                  │
   │                 │ Yes → create    ├──────────────────►│
   │                 │ Inquiry in DB   │  inquiry.create  │
   │                 └────────┬────────┘                  │
   │                          │                           │
   │◄── data: {done, sessionToken, leadCaptured} ─────────│
```

---

## 9. DATABASE TABLES TOUCHED BY CHATBOT

| Table | Operation | When |
|-------|-----------|------|
| `ChatSession` | CREATE | First message |
| `Message` | CREATE (user) | Each user message |
| `Message` | CREATE (assistant) | After stream completes |
| `ChatSession` | UPDATE (language, collectedData) | After each turn |
| `Inquiry` | CREATE | When email/phone collected |
| `ChatSession` | UPDATE (inquiryId) | When inquiry created |

---

## 10. ADMIN VISIBILITY

Case managers can see in the admin dashboard:
- All chat sessions (active, completed, abandoned)
- Full conversation transcript
- Structured data extracted per session
- Inquiry auto-created from chat
- Patient country, language, condition summary
- Lead status (captured / not yet)

**Query to see all new chatbot leads:**
```sql
SELECT i.*, cs.collectedData, cs.language
FROM Inquiry i
JOIN ChatSession cs ON cs.inquiryId = i.id
WHERE i.source = 'chatbot'
  AND i.status = 'new'
ORDER BY i.createdAt DESC;
```

---

## 11. GLOBAL INTERNATIONAL HOSPITAL TASHKENT — INTEGRATION PLAN

**Role:** CIS first-contact partner for Central Asian patients (Uzbekistan, Kazakhstan, Kyrgyzstan, Tajikistan, Turkmenistan)

**Chatbot Integration:**
- When country = Uzbekistan/CIS detected → bot mentions GIH Tashkent
- Patients can visit GIH Tashkent for pre-consultation before India travel
- GIH refers patients to HospitalGuru for India treatment coordination

**Data flow once details are received:**
1. Update `Hospital` record: `slug = "global-international-hospital-tashkent"` with real address, phone, email
2. Add to CIS routing logic in `chatbot-prompt.ts`
3. Add WhatsApp number to quick-reply suggestions
4. Featured in `/hospitals?cis_partner=true` API filter

---

## 12. PHASE 2 ENHANCEMENTS (Next Sprint)

| Enhancement | Priority | Description |
|-------------|----------|-------------|
| Email notification to case manager | HIGH | AWS SES when inquiry created |
| WhatsApp intake | HIGH | Twilio WhatsApp API alternative to web chat |
| Telegram Bot | HIGH | Popular in Russia/CIS — @HospitalGuruBot |
| Document upload in chat | MEDIUM | Patient can upload MRI/reports mid-chat |
| Language auto-detect API | MEDIUM | Better than regex for Kazakh/Uzbek |
| Voice message support | LOW | Transcribe audio → text for mobile users |
| CRM integration | LOW | Sync inquiries to HubSpot/Zoho |
| AI appointment scheduling | MEDIUM | Book video consultation directly from chat |
| Returning patient recognition | MEDIUM | Identify by sessionToken, personalize |
