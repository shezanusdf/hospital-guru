# HospitalGuru.com — Site Architecture
## Medical Tourism Platform: CIS Countries → India | Indian Doctor Recruitment

---

## 1. PLATFORM OVERVIEW

**Primary Audiences:**
1. **Patients** from CIS countries (Russia, Kazakhstan, Ukraine, Belarus, Moldova, Armenia, Azerbaijan, Georgia, Kyrgyzstan, Tajikistan, Turkmenistan, Uzbekistan) seeking treatment in India
2. **Indian Doctors & Medical Professionals** seeking opportunities at international hospitals
3. **Indian Hospitals** listing their services and doctors
4. **International Hospitals** (UAE, Germany, UK, USA, etc.) recruiting Indian medical talent

**Core Value Propositions:**
- For Patients: Trusted, end-to-end medical journey from CIS → India
- For Doctors: Career advancement via international placement
- For Hospitals: Vetted patient pipeline and talent recruitment

---

## 2. SITE STRUCTURE (Information Architecture)

```
hospitalguru.com/
│
├── / (Home)
│
├── /for-patients/
│   ├── how-it-works
│   ├── why-india
│   ├── cis-patients              ← CIS-specific landing page
│   ├── visa-assistance
│   ├── travel-logistics
│   └── patient-stories
│
├── /hospitals/
│   ├── (listing with filters)
│   ├── /hospitals/[slug]         ← Individual hospital page
│   └── /hospitals/compare        ← Side-by-side comparison
│
├── /doctors/
│   ├── (listing with filters)
│   └── /doctors/[slug]           ← Individual doctor profile
│
├── /treatments/
│   ├── (listing by specialty)
│   ├── /treatments/[slug]        ← Treatment detail + cost estimate
│   └── /treatments/cost-comparison
│
├── /specialties/
│   └── /specialties/[slug]       ← e.g., /specialties/cardiology
│
├── /careers/                     ← Doctor Recruitment Module
│   ├── (job listings for doctors)
│   ├── /careers/[job-id]
│   ├── why-work-abroad
│   └── salary-guide
│
├── /knowledge-center/
│   ├── blog/
│   ├── /blog/[slug]
│   ├── videos/
│   ├── visa-guide/[country]      ← Per CIS country visa info
│   ├── treatment-guides/
│   └── faq/
│
├── /about/
│   ├── our-story
│   ├── team
│   ├── accreditation
│   ├── partners
│   └── contact
│
├── /auth/
│   ├── login
│   ├── register
│   ├── register/patient
│   ├── register/doctor
│   ├── forgot-password
│   └── verify-email
│
└── /dashboard/                   ← Role-based authenticated area
    ├── /dashboard/patient/
    │   ├── profile
    │   ├── medical-records       ← Document upload hub
    │   ├── appointments
    │   ├── consultations
    │   ├── messages
    │   ├── cost-estimates
    │   └── trip-planner
    │
    ├── /dashboard/doctor/
    │   ├── profile
    │   ├── certificates          ← Certificate upload hub
    │   ├── job-applications
    │   ├── consultations
    │   ├── messages
    │   └── availability
    │
    ├── /dashboard/hospital-admin/
    │   ├── hospital-profile
    │   ├── doctors-management
    │   ├── inquiries
    │   ├── appointments
    │   └── analytics
    │
    └── /dashboard/admin/         ← HospitalGuru super admin
        ├── users
        ├── hospitals
        ├── doctors
        ├── jobs
        ├── content
        └── analytics
```

---

## 3. PAGE-BY-PAGE SPECIFICATION

### 3.1 Home Page ( / )

**Hero Section**
- Headline targeting CIS patients (multilingual: EN / RU / KZ / UK)
- Search bar: "Find Treatment" — inputs: Condition/Treatment, Country (India pre-selected), City
- CTA buttons: "Get Free Consultation" | "Find a Doctor"
- Trust badges: patient count, hospital count, doctor count, Google rating

**Stats Bar**
- 50,000+ Patients Assisted | 200+ Partner Hospitals | 1,500+ Specialist Doctors | 15+ CIS Countries Served

**Featured Specialties** (icon grid)
- Cardiology, Oncology, Orthopedics, Neurology, IVF/Fertility, Transplants, Spine Surgery, Cosmetic Surgery

**How It Works** (3-step for patients)
1. Submit medical records → 2. Get matched to hospital/doctor → 3. Travel & get treated

**Top Hospitals Carousel**

**Top Doctors Carousel**

**Cost Comparison Table** (key procedures: India vs CIS country average)

**For Doctors Section** — CTA for doctor recruitment

**Patient Stories** (video testimonials preferred)

**Knowledge Center** (latest blog posts)

**Partners / Accreditation Logos**

**Language Switcher**: EN | RU | KZ | UK | AZ | HY | GE

---

### 3.2 Hospitals Listing ( /hospitals )

**Filters (Left Panel)**
- City (Mumbai, Delhi, Chennai, Bangalore, Hyderabad, Pune, Kolkata)
- Specialty / Department
- Accreditation (JCI, NABH, ISO)
- Hospital Type (Multi-specialty, Cancer Center, Heart Institute, etc.)
- Rating (4+ stars, etc.)
- Sort: Rating | Most Reviews | Alphabetical

**Hospital Card**
- Hospital name, city, hero image
- Accreditation badges
- Top 5 specialties
- Starting cost indicator
- Patient rating + review count
- "View Profile" | "Get Quote" CTAs

---

### 3.3 Hospital Profile ( /hospitals/[slug] )

- Gallery (photos, 360 tour if available)
- Overview (about, founding year, beds, location)
- Accreditations & Rankings
- Departments & Specialties
- Associated Doctors (with quick links)
- Treatments & Pricing
- Infrastructure (rooms, ICU, labs, pharmacy)
- International Patient Services
- Location & Distance from airport
- Reviews & Ratings
- "Send Inquiry" sticky CTA
- "Request Cost Estimate" form

---

### 3.4 Doctors Listing ( /doctors )

**Filters**
- Specialty
- City / Hospital
- Experience (5-10 yrs, 10-20 yrs, 20+ yrs)
- Language spoken (Russian, English, Hindi, etc.)
- Consultation type (In-person, Video)
- Rating

**Doctor Card**
- Photo, name, credentials (MBBS, MS, MCh, MD, DM, etc.)
- Specialty & sub-specialty
- Hospital affiliation
- Years of experience
- Languages spoken
- Consultation fee
- Rating + review count
- "View Profile" | "Book Consultation" CTAs

---

### 3.5 Doctor Profile ( /doctors/[slug] )

- Professional photo
- Credentials and qualifications
- Hospital affiliation
- Specializations
- Education & Training (MBBS, Residency, Fellowship)
- International training highlights
- Publications & Research
- Languages spoken (key for CIS patients)
- Patient reviews & ratings
- Availability calendar
- "Book Video Consultation" | "Send Medical Records" CTAs

---

### 3.6 Treatments ( /treatments/[slug] )

- Condition overview (patient-friendly language)
- Why India for this treatment
- Cost in India vs CIS country average
- Success rates / statistics
- Recommended hospitals for this treatment
- Recommended doctors
- Patient journey timeline
- FAQ
- "Get Free Quote" CTA

---

### 3.7 Careers / Doctor Recruitment ( /careers )

**For International Hospitals (posting jobs):**
- Job listings with filters: Country, Specialty, Experience Level
- "Post a Job" CTA → Hospital registration

**For Indian Doctors (applying):**
- Why work internationally
- Salary guide by country and specialty
- Process: Register → Upload credentials → Apply → Interview → Placement
- Featured opportunities

**Job Listing Card**
- Hospital name, country, city
- Position title
- Specialty required
- Experience required
- Salary range
- Benefits (visa sponsorship, accommodation, etc.)
- "Apply Now" CTA

---

### 3.8 Patient Dashboard ( /dashboard/patient )

**Medical Records Hub**
- Upload medical reports, imaging (MRI, CT, X-ray), prescriptions
- Organize by: Date | Type | Body System
- Share with specific doctor or hospital
- Download / delete

**Appointments**
- Upcoming, past, and pending appointments
- Video consultation join button
- Rebook / cancel

**Cost Estimates**
- Received estimates from hospitals
- Comparison view
- Accept / request more info

**Trip Planner**
- Visa checklist by country
- Accommodation suggestions
- Airport transfer booking
- Currency converter (INR / RUB / KZT / EUR / USD)

**Messages**
- Direct chat with assigned Case Manager
- Chat with hospital/doctor office

---

### 3.9 Doctor Dashboard ( /dashboard/doctor )

**Professional Profile**
- Photo, bio, credentials
- Hospital affiliation
- Availability settings

**Certificate Vault**
- Upload: Degree certificates, medical council registration, fellowship certificates, CME certificates, passport, work experience letters
- Verification status per document
- Expiry date tracking

**Job Applications**
- Applied jobs with status tracker
- Saved/favorited jobs
- Recommended jobs

**Consultations**
- Scheduled video consultations with patients
- Patient medical records shared with you
- Notes and follow-up scheduling

---

## 4. LANGUAGE & LOCALIZATION

| Language | Code | Target Country |
|----------|------|----------------|
| English | en | Default / International |
| Russian | ru | Russia, Kazakhstan, Belarus, Kyrgyzstan |
| Ukrainian | uk | Ukraine |
| Kazakh | kk | Kazakhstan |
| Azerbaijani | az | Azerbaijan |
| Armenian | hy | Armenia |
| Georgian | ka | Georgia |
| Uzbek | uz | Uzbekistan |

**Content Localization Strategy:**
- All public-facing pages: EN + RU minimum (RU is lingua franca across CIS)
- Patient dashboard: EN + RU + local language
- Doctor/Admin dashboards: English only

---

## 5. MOBILE OPTIMIZATION

**Responsive Breakpoints:**
- Mobile: 320px – 767px
- Tablet: 768px – 1023px
- Desktop: 1024px+

**Mobile-First Features:**
- Bottom navigation bar (Home, Search, Consult, Messages, Profile)
- Touch-friendly filters (drawer/sheet style)
- Swipeable carousels for hospitals/doctors
- Click-to-call / WhatsApp deep links
- Document upload via camera (take photo of report directly)
- Offline mode for saved hospitals/doctors (PWA)

**PWA (Progressive Web App):**
- Installable on iOS (Safari) and Android (Chrome)
- Push notifications for appointment reminders, chat messages, application status
- Add to home screen prompt

---

## 6. TRUST & COMPLIANCE FEATURES

- **SSL / HTTPS** throughout
- **GDPR compliance** (European and CIS data protection)
- **Personal Data Localization** (Russian Federal Law 152-FZ compliance)
- **HIPAA-aligned** data handling for medical records
- **ISO 27001** security certification target
- **Cookie consent** banner (multi-language)
- **Privacy Policy & Terms** in EN + RU minimum
