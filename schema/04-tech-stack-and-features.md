# HospitalGuru.com — Tech Stack & Feature Specification

---

## 1. RECOMMENDED TECH STACK

### Frontend (Web)
| Layer | Technology | Reason |
|-------|-----------|--------|
| Framework | **Next.js 15** (React) | SSR/SSG for SEO, App Router, i18n built-in |
| Language | **TypeScript** | Type safety for medical data models |
| Styling | **Tailwind CSS** + shadcn/ui | Rapid UI, consistent design system |
| State Management | **Zustand** + React Query | Server state (React Query) + client state (Zustand) |
| Forms | **React Hook Form** + Zod | Type-safe form validation |
| i18n | **next-intl** | Multi-language (EN, RU, KK, UK, etc.) |
| Real-time | **Socket.io** client | Chat/notifications |
| File Upload | **Uppy.js** | Multi-format, drag-and-drop, camera capture on mobile |
| Maps | **Mapbox GL** or **Google Maps API** | Hospital location maps |
| Video Calls | **Daily.co SDK** or **Jitsi Meet** | Telemedicine consultations |
| Analytics | **PostHog** (self-hosted option) | GDPR-compliant analytics |

### Mobile (Hybrid PWA + Native)
| Option | Technology | Target |
|--------|-----------|--------|
| PWA (Phase 1) | Next.js PWA + next-pwa | iOS Safari, Android Chrome |
| Native Apps (Phase 2) | **React Native** + Expo | iOS App Store + Google Play |
| Push Notifications | **Firebase Cloud Messaging** | Both platforms |
| Camera/Documents | Expo ImagePicker + DocumentPicker | Mobile document upload |

### Backend / API
| Layer | Technology | Reason |
|-------|-----------|--------|
| Runtime | **Node.js** + **Express.js** / **Fastify** | High performance, JSON-native |
| Language | **TypeScript** | Consistent codebase |
| ORM | **Prisma** | Type-safe DB queries, migrations |
| Authentication | **JWT** + **Refresh Tokens** | Stateless, mobile-compatible |
| OAuth | **Passport.js** | Google, Apple sign-in |
| File Storage | **AWS S3** or **Cloudflare R2** | Scalable, secure document storage |
| File Processing | **Sharp** (image resize) + virus scan | ClamAV integration |
| Search | **Elasticsearch** or **Meilisearch** | Full-text, multilingual search |
| Real-time | **Socket.io** | Chat, notifications |
| Email | **AWS SES** or **Resend** | Transactional emails |
| SMS | **Twilio** | OTP, appointment reminders |
| WhatsApp | **Twilio WhatsApp API** or **360Dialog** | CIS-preferred channel |

### Database
| Component | Technology |
|-----------|-----------|
| Primary DB | **PostgreSQL 16** |
| Cache | **Redis** (session, rate limiting, search cache) |
| Queue | **BullMQ** (Redis-backed) for async jobs |
| Search Index | **Meilisearch** (self-hosted) or Elasticsearch |

### Infrastructure / DevOps
| Component | Technology |
|-----------|-----------|
| Cloud Provider | **AWS** or **Google Cloud Platform** |
| Containers | **Docker** + **Docker Compose** |
| Orchestration | **Kubernetes** (production) |
| CDN | **Cloudflare** |
| File CDN | **AWS CloudFront** for documents |
| CI/CD | **GitHub Actions** |
| Monitoring | **Grafana** + **Prometheus** |
| Error Tracking | **Sentry** |
| Logging | **Loki** or **AWS CloudWatch** |
| Secrets | **AWS Secrets Manager** / **HashiCorp Vault** |

---

## 2. SECURITY ARCHITECTURE

### Authentication & Authorization
- JWT access tokens (15 min expiry) + refresh tokens (30 days)
- Role-Based Access Control (RBAC) with 6 roles
- Phone OTP verification via Twilio
- Email verification on registration
- Google OAuth + Apple Sign-In
- 2FA option for doctors (TOTP via authenticator app)
- Rate limiting on all auth endpoints

### Document Security
- All documents encrypted at rest (AES-256) on S3
- Signed URLs with 15-minute expiry for downloads
- ClamAV virus scanning on every upload
- DICOM file validation to prevent malicious payloads
- Document access logs for audit trail
- Users can revoke document shares at any time

### Data Privacy & Compliance
- **GDPR** — Right to erasure, data portability, consent management
- **Russian Federal Law 152-FZ** — Personal data localization option (Russian data on Russian servers)
- **HIPAA-aligned** practices for medical record handling
- Cookie consent management (multi-language)
- Data retention policies per document type
- Admin cannot access patient medical documents without audit trail

---

## 3. FEATURE COMPARISON: HospitalGuru vs Vaidam

| Feature | Vaidam | HospitalGuru |
|---------|--------|-------------|
| Medical Tourism | ✅ India + multi-country | ✅ India-focused, CIS-specialized |
| CIS Language Support | Russian only | EN + RU + KK + UK + AZ + HY + KA + UZ |
| Doctor Recruitment | ❌ | ✅ Full recruitment module |
| Patient Document Vault | Basic | ✅ DICOM + 10 formats + 5GB storage |
| Doctor Credential Vault | ❌ | ✅ Full certificate management |
| Video Consultations | ✅ | ✅ |
| Cost Comparison | ✅ India vs global | ✅ India vs specific CIS countries |
| Hospital Comparison Tool | ❌ | ✅ Side-by-side compare |
| WhatsApp Integration | ✅ | ✅ |
| Telegram Integration | ❌ | ✅ (popular in CIS) |
| PWA / Mobile App | Basic | ✅ PWA Phase 1, React Native Phase 2 |
| Trip Planner | Basic | ✅ Visa + accommodation + currency |
| CIS Visa Guides | ❌ | ✅ Per-country visa guides |
| International Jobs Board | ❌ | ✅ Full job posting system |
| Real-time Chat | ❌ | ✅ WebSocket-based |
| Google/Apple SSO | ❌ | ✅ |
| 2FA for Professionals | ❌ | ✅ |

---

## 4. UNIQUE FEATURES (Beyond Vaidam)

### 4.1 CIS Medical Tourism Module
- Dedicated landing pages per CIS country (Russia, Kazakhstan, Ukraine, etc.)
- Per-country visa guide with step-by-step instructions
- Cost comparison: India vs specific CIS country (country-specific pricing context)
- CIS-specific patient testimonials
- Russian-language first support (Russian is lingua franca across CIS)
- Telegram deep links (widely used in Russia/CIS, more than WhatsApp)
- Payment methods: accepts card + bank transfer + optionally crypto for privacy

### 4.2 Doctor Recruitment Module
- Indian doctors create profile with full credential vault
- International hospitals (UAE, UK, Germany, Singapore, etc.) post jobs
- AI-powered job matching (doctor profile ↔ job requirements)
- Salary benchmarking guide by specialty and country
- Document sharing directly with applying hospital
- Application tracking dashboard
- Interview scheduling integration

### 4.3 Telemedicine Integration
- Book video consultation with Indian specialist before travel decision
- Share uploaded medical documents during the call
- Post-consultation follow-up via chat
- Multilingual consultations with interpreter service option

### 4.4 Hospital Comparison Tool
- Select 2-4 hospitals to compare side-by-side
- Compare: costs, accreditations, doctor count, rating, distance from airport, amenities
- Export comparison as PDF

### 4.5 Trip Planner
- Visa requirement checker (CIS passport + India entry)
- Accommodation finder (partner hotels near hospitals)
- Airport transfer booking
- Live currency converter (INR/RUB/KZT/USD/EUR)
- Medical travel insurance partners
- Translator service booking (Russian ↔ Hindi/English)

### 4.6 Smart Cost Estimator
- Patient enters: condition, severity, preferred city → gets instant cost range
- Break down by: surgery, anesthesia, hospital stay, diagnostics, rehabilitation
- Show savings vs home country in local currency

---

## 5. ADMIN PANEL FEATURES

### HospitalGuru Admin Dashboard (`/admin`)
- **Users**: view, filter, suspend, verify, assign case managers
- **Hospitals**: review applications, verify, feature, manage profiles
- **Doctors**: review profiles, verify credentials, feature
- **Jobs**: moderate job postings
- **Inquiries**: overview, reassign case managers, pipeline view
- **Documents**: view verification queue (virus scan passed documents needing manual review)
- **Content**: manage blog posts, treatment pages, visa guides
- **Analytics**: patient acquisition by country, conversion funnel, revenue metrics
- **Notifications**: broadcast announcements to user segments

### Case Manager Portal
- Assigned patient queue
- Inquiry timeline view
- Direct patient messaging
- Hospital inquiry forwarding
- Cost estimate coordination
- Appointment scheduling assistance

---

## 6. NOTIFICATION SYSTEM

### Notification Events → Channels

| Event | Email | SMS | Push | In-App |
|-------|-------|-----|------|--------|
| Registration confirmation | ✅ | | | |
| Email verification | ✅ | | | |
| Phone OTP | | ✅ | | |
| Inquiry received | ✅ | ✅ | ✅ | ✅ |
| Cost estimate received | ✅ | | ✅ | ✅ |
| Consultation reminder (24h) | ✅ | ✅ | ✅ | ✅ |
| Consultation reminder (1h) | | ✅ | ✅ | ✅ |
| New message received | | | ✅ | ✅ |
| Document shared with you | ✅ | | ✅ | ✅ |
| Document verified by admin | ✅ | | ✅ | ✅ |
| Job application status update | ✅ | | ✅ | ✅ |
| New job matching profile | ✅ | | ✅ | ✅ |
| Certificate expiry reminder | ✅ | | ✅ | ✅ |
| New review received | ✅ | | | ✅ |

---

## 7. SEO STRATEGY

### URL Structure (SEO-friendly)
- `/hospitals/apollo-hospitals-chennai`
- `/doctors/dr-rajesh-sharma-cardiologist-mumbai`
- `/treatments/knee-replacement-india`
- `/specialties/cardiology`
- `/blog/medical-tourism-india-from-russia-guide`

### Multilingual SEO
- `hreflang` tags for all language variants
- Russian URLs: `/ru/hospitals/`, `/ru/doctors/`
- Separate sitemaps per language

### Structured Data (Schema.org)
- `Hospital` schema for hospital pages
- `Physician` schema for doctor pages
- `MedicalProcedure` schema for treatment pages
- `FAQPage` schema for FAQ sections
- `Review`/`AggregateRating` schema for ratings
- `JobPosting` schema for recruitment pages

---

## 8. MOBILE APP SCREENS (React Native — Phase 2)

### Patient App
1. Splash / Onboarding (language select)
2. Home Feed (specialties, featured hospitals, stories)
3. Search (treatment/hospital/doctor)
4. Filters Sheet (full filter experience)
5. Hospital Detail
6. Doctor Detail
7. Consultation Booking
8. Document Upload (camera + file picker)
9. My Documents
10. My Inquiries
11. Chat
12. Notifications
13. Trip Planner
14. Profile / Settings

### Doctor App
1. Home (my schedule, pending applications)
2. Browse Jobs
3. Job Detail + Apply
4. My Applications (status tracker)
5. Credential Vault (upload certificates)
6. My Consultations
7. Chat
8. Profile

---

## 9. THIRD-PARTY INTEGRATIONS

| Service | Purpose |
|---------|---------|
| Twilio | SMS OTP, WhatsApp messaging |
| Telegram Bot API | CIS patient messaging |
| Firebase | Push notifications (FCM) |
| Google Maps / Mapbox | Hospital locations |
| Daily.co / Jitsi | Video consultations |
| Stripe / Razorpay | Payment processing (consultation fees) |
| AWS S3 / Cloudflare R2 | Document storage |
| ClamAV | Virus scanning |
| Meilisearch | Full-text search |
| Resend / AWS SES | Transactional emails |
| PostHog | Analytics |
| Sentry | Error monitoring |
| Cloudflare | CDN + DDoS protection |

---

## 10. PHASE ROADMAP

### Phase 1 — MVP (Months 1-4)
- [ ] Patient registration + profile
- [ ] Doctor registration + profile
- [ ] Hospital listing and profiles
- [ ] Treatment pages with cost data
- [ ] Inquiry submission (guest + logged in)
- [ ] Document upload (patient medical + doctor credentials)
- [ ] Basic messaging (patient ↔ case manager)
- [ ] EN + RU language support
- [ ] Admin panel (basic)
- [ ] PWA (mobile-optimized web)

### Phase 2 — Core Features (Months 5-7)
- [ ] Video consultation booking + calls
- [ ] Doctor recruitment module (jobs + applications)
- [ ] Hospital comparison tool
- [ ] Reviews and ratings
- [ ] Cost estimator
- [ ] Trip planner (visa guides)
- [ ] Full CIS language support (8 languages)
- [ ] Push notifications
- [ ] Advanced search with Meilisearch

### Phase 3 — Growth (Months 8-12)
- [ ] React Native mobile apps (iOS + Android)
- [ ] AI-powered doctor-job matching
- [ ] AI-powered hospital recommendation engine
- [ ] Telemedicine with interpreter service
- [ ] Payment gateway (consultation fees)
- [ ] Partner hotel booking integration
- [ ] Smart cost estimator
- [ ] Advanced analytics dashboard
