# HospitalGuru.com — Database Schema
## Entity-Relationship Design (PostgreSQL / MySQL)

---

## 1. USER MANAGEMENT

### Table: `users`
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK, default gen_random_uuid() | Primary key |
| email | VARCHAR(255) | UNIQUE, NOT NULL | Login email |
| phone | VARCHAR(20) | UNIQUE | Mobile number (with country code) |
| phone_verified | BOOLEAN | DEFAULT false | OTP verification status |
| email_verified | BOOLEAN | DEFAULT false | Email verification status |
| password_hash | VARCHAR(255) | NOT NULL | Bcrypt hash |
| role | ENUM | NOT NULL | 'patient', 'doctor', 'hospital_admin', 'intl_hospital', 'case_manager', 'admin' |
| preferred_language | VARCHAR(5) | DEFAULT 'en' | Language code (en, ru, kk, uk, az, hy, ka, uz) |
| status | ENUM | DEFAULT 'active' | 'active', 'suspended', 'pending_verification' |
| last_login_at | TIMESTAMPTZ | | |
| created_at | TIMESTAMPTZ | DEFAULT NOW() | |
| updated_at | TIMESTAMPTZ | DEFAULT NOW() | |

---

### Table: `user_sessions`
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | |
| user_id | UUID | FK → users.id | |
| token_hash | VARCHAR(255) | UNIQUE | Hashed session token |
| device_type | VARCHAR(50) | | 'web', 'ios', 'android' |
| device_info | JSONB | | Browser/device metadata |
| ip_address | INET | | |
| expires_at | TIMESTAMPTZ | | |
| created_at | TIMESTAMPTZ | DEFAULT NOW() | |

---

### Table: `patient_profiles`
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | |
| user_id | UUID | FK → users.id, UNIQUE | |
| first_name | VARCHAR(100) | NOT NULL | |
| last_name | VARCHAR(100) | NOT NULL | |
| first_name_ru | VARCHAR(100) | | Russian transliteration |
| last_name_ru | VARCHAR(100) | | |
| date_of_birth | DATE | | |
| gender | ENUM | | 'male', 'female', 'other', 'prefer_not_to_say' |
| nationality | VARCHAR(5) | FK → countries.code | |
| country_of_residence | VARCHAR(5) | FK → countries.code | |
| city | VARCHAR(100) | | |
| whatsapp_number | VARCHAR(20) | | |
| telegram_handle | VARCHAR(100) | | |
| emergency_contact_name | VARCHAR(200) | | |
| emergency_contact_phone | VARCHAR(20) | | |
| blood_group | ENUM | | 'A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-' |
| allergies | TEXT[] | | Array of known allergies |
| chronic_conditions | TEXT[] | | |
| current_medications | TEXT[] | | |
| assigned_case_manager_id | UUID | FK → users.id | |
| profile_photo_url | VARCHAR(500) | | |
| created_at | TIMESTAMPTZ | DEFAULT NOW() | |
| updated_at | TIMESTAMPTZ | DEFAULT NOW() | |

---

### Table: `doctor_profiles`
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | |
| user_id | UUID | FK → users.id, UNIQUE | |
| first_name | VARCHAR(100) | NOT NULL | |
| last_name | VARCHAR(100) | NOT NULL | |
| title | ENUM | | 'Dr', 'Prof', 'Assoc. Prof' |
| gender | ENUM | | 'male', 'female', 'other' |
| date_of_birth | DATE | | |
| nationality | VARCHAR(5) | FK → countries.code | |
| current_country | VARCHAR(5) | FK → countries.code | |
| current_city | VARCHAR(100) | | |
| primary_specialty_id | UUID | FK → specialties.id | |
| secondary_specialty_ids | UUID[] | | Array of specialty IDs |
| years_of_experience | SMALLINT | | |
| bio | TEXT | | Professional summary |
| bio_ru | TEXT | | Russian version |
| languages_spoken | VARCHAR(5)[] | | Array of language codes |
| registration_number | VARCHAR(100) | | Medical Council of India reg. no. |
| registration_council | VARCHAR(200) | | e.g., "Medical Council of India" |
| consultation_fee_usd | DECIMAL(10,2) | | |
| available_for_recruitment | BOOLEAN | DEFAULT true | Open to international jobs |
| available_for_teleconsult | BOOLEAN | DEFAULT true | Open to video consults |
| linkedin_url | VARCHAR(500) | | |
| hospital_id | UUID | FK → hospitals.id, NULLABLE | Current hospital affiliation |
| profile_photo_url | VARCHAR(500) | | |
| slug | VARCHAR(200) | UNIQUE | URL-friendly identifier |
| verification_status | ENUM | DEFAULT 'pending' | 'pending', 'verified', 'rejected' |
| verified_at | TIMESTAMPTZ | | |
| created_at | TIMESTAMPTZ | DEFAULT NOW() | |
| updated_at | TIMESTAMPTZ | DEFAULT NOW() | |

---

### Table: `doctor_education`
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | |
| doctor_id | UUID | FK → doctor_profiles.id | |
| degree | VARCHAR(100) | | e.g., 'MBBS', 'MS', 'MCh', 'MD', 'DM', 'Fellowship' |
| specialization | VARCHAR(200) | | |
| institution | VARCHAR(300) | | |
| country | VARCHAR(5) | FK → countries.code | |
| year_start | SMALLINT | | |
| year_end | SMALLINT | | |
| is_international | BOOLEAN | DEFAULT false | |
| created_at | TIMESTAMPTZ | DEFAULT NOW() | |

---

### Table: `doctor_experience`
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | |
| doctor_id | UUID | FK → doctor_profiles.id | |
| position | VARCHAR(200) | | e.g., 'Senior Consultant Cardiologist' |
| institution | VARCHAR(300) | | |
| country | VARCHAR(5) | FK → countries.code | |
| city | VARCHAR(100) | | |
| year_start | SMALLINT | | |
| year_end | SMALLINT | NULLABLE | NULL = current |
| is_current | BOOLEAN | DEFAULT false | |
| description | TEXT | | |
| created_at | TIMESTAMPTZ | DEFAULT NOW() | |

---

## 2. HOSPITALS

### Table: `hospitals`
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | |
| admin_user_id | UUID | FK → users.id | Hospital admin account |
| name | VARCHAR(300) | NOT NULL | |
| name_ru | VARCHAR(300) | | Russian name |
| slug | VARCHAR(200) | UNIQUE | |
| type | ENUM | | 'multi_specialty', 'cancer_center', 'cardiac_center', 'orthopedic', 'fertility', 'neuroscience', 'general' |
| description | TEXT | | |
| description_ru | TEXT | | |
| founded_year | SMALLINT | | |
| total_beds | SMALLINT | | |
| icu_beds | SMALLINT | | |
| country | VARCHAR(5) | DEFAULT 'IN' | India |
| state | VARCHAR(100) | | |
| city | VARCHAR(100) | NOT NULL | |
| address | TEXT | | |
| pin_code | VARCHAR(10) | | |
| latitude | DECIMAL(10,8) | | |
| longitude | DECIMAL(11,8) | | |
| phone | VARCHAR(20) | | |
| email | VARCHAR(255) | | |
| website | VARCHAR(500) | | |
| whatsapp_number | VARCHAR(20) | | |
| international_patient_coordinator | VARCHAR(200) | | Contact name |
| intl_coordinator_phone | VARCHAR(20) | | |
| intl_coordinator_email | VARCHAR(255) | | |
| distance_from_airport_km | DECIMAL(5,2) | | |
| nearest_airport | VARCHAR(100) | | |
| hero_image_url | VARCHAR(500) | | |
| rating_avg | DECIMAL(3,2) | DEFAULT 0 | Calculated field |
| review_count | INTEGER | DEFAULT 0 | Calculated field |
| is_featured | BOOLEAN | DEFAULT false | Featured on homepage |
| is_active | BOOLEAN | DEFAULT true | |
| verification_status | ENUM | DEFAULT 'pending' | 'pending', 'verified', 'rejected' |
| created_at | TIMESTAMPTZ | DEFAULT NOW() | |
| updated_at | TIMESTAMPTZ | DEFAULT NOW() | |

---

### Table: `hospital_accreditations`
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | |
| hospital_id | UUID | FK → hospitals.id | |
| accreditation_type | ENUM | | 'JCI', 'NABH', 'ISO_9001', 'ISO_27001', 'NABL', 'CRISIL', 'other' |
| accreditation_body | VARCHAR(200) | | |
| certificate_number | VARCHAR(100) | | |
| issued_date | DATE | | |
| expiry_date | DATE | | |
| document_url | VARCHAR(500) | | |
| created_at | TIMESTAMPTZ | DEFAULT NOW() | |

---

### Table: `hospital_specialties`
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| hospital_id | UUID | FK → hospitals.id | Composite PK |
| specialty_id | UUID | FK → specialties.id | Composite PK |
| is_center_of_excellence | BOOLEAN | DEFAULT false | |
| created_at | TIMESTAMPTZ | DEFAULT NOW() | |

---

### Table: `hospital_gallery`
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | |
| hospital_id | UUID | FK → hospitals.id | |
| media_type | ENUM | | 'image', 'video', 'virtual_tour' |
| url | VARCHAR(500) | NOT NULL | |
| thumbnail_url | VARCHAR(500) | | |
| caption | VARCHAR(300) | | |
| caption_ru | VARCHAR(300) | | |
| category | ENUM | | 'exterior', 'rooms', 'ot', 'icu', 'lobby', 'equipment' |
| sort_order | SMALLINT | DEFAULT 0 | |
| created_at | TIMESTAMPTZ | DEFAULT NOW() | |

---

### Table: `hospital_amenities`
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | |
| hospital_id | UUID | FK → hospitals.id | |
| amenity | VARCHAR(200) | | e.g., 'Russian interpreter', 'Prayer room', 'ATM' |
| amenity_ru | VARCHAR(200) | | |
| category | ENUM | | 'language_support', 'accommodation', 'transport', 'spiritual', 'food', 'financial', 'other' |

---

## 3. SPECIALTIES & TREATMENTS

### Table: `specialties`
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | |
| name | VARCHAR(100) | NOT NULL UNIQUE | e.g., 'Cardiology' |
| name_ru | VARCHAR(100) | | Russian |
| slug | VARCHAR(100) | UNIQUE | |
| icon_url | VARCHAR(500) | | |
| description | TEXT | | |
| description_ru | TEXT | | |
| parent_specialty_id | UUID | FK → specialties.id, NULLABLE | For sub-specialties |
| sort_order | SMALLINT | DEFAULT 0 | |
| is_active | BOOLEAN | DEFAULT true | |

---

### Table: `treatments`
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | |
| specialty_id | UUID | FK → specialties.id | |
| name | VARCHAR(200) | NOT NULL | e.g., 'Coronary Artery Bypass Grafting' |
| name_ru | VARCHAR(200) | | |
| common_name | VARCHAR(200) | | e.g., 'Heart Bypass Surgery' |
| common_name_ru | VARCHAR(200) | | |
| slug | VARCHAR(200) | UNIQUE | |
| description | TEXT | | Patient-friendly description |
| description_ru | TEXT | | |
| duration_min_days | SMALLINT | | Min hospital stay |
| duration_max_days | SMALLINT | | Max hospital stay |
| recovery_days | INTEGER | | Total recovery estimate |
| india_cost_usd_min | DECIMAL(10,2) | | |
| india_cost_usd_max | DECIMAL(10,2) | | |
| russia_cost_usd_avg | DECIMAL(10,2) | | For CIS comparison |
| is_popular | BOOLEAN | DEFAULT false | |
| is_active | BOOLEAN | DEFAULT true | |
| created_at | TIMESTAMPTZ | DEFAULT NOW() | |
| updated_at | TIMESTAMPTZ | DEFAULT NOW() | |

---

### Table: `hospital_treatments`
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | |
| hospital_id | UUID | FK → hospitals.id | |
| treatment_id | UUID | FK → treatments.id | |
| cost_usd_min | DECIMAL(10,2) | | Hospital-specific pricing |
| cost_usd_max | DECIMAL(10,2) | | |
| cost_includes | TEXT | | What's included |
| cost_excludes | TEXT | | What's excluded |
| is_active | BOOLEAN | DEFAULT true | |

---

## 4. DOCUMENT MANAGEMENT

### Table: `documents`
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | |
| owner_user_id | UUID | FK → users.id | Uploader |
| document_category | ENUM | NOT NULL | See Document Categories below |
| document_type | ENUM | NOT NULL | See Document Types below |
| file_name | VARCHAR(300) | NOT NULL | Original filename |
| file_path | VARCHAR(500) | NOT NULL | Storage path (S3/GCS key) |
| file_size_bytes | BIGINT | | |
| mime_type | VARCHAR(100) | | |
| file_extension | VARCHAR(10) | | |
| description | VARCHAR(500) | | User-provided description |
| issue_date | DATE | | Date on document |
| expiry_date | DATE | | For certificates with expiry |
| issued_by | VARCHAR(300) | | Issuing authority/hospital |
| is_verified | BOOLEAN | DEFAULT false | Admin verification |
| verified_by_user_id | UUID | FK → users.id, NULLABLE | |
| verified_at | TIMESTAMPTZ | | |
| is_shared_globally | BOOLEAN | DEFAULT false | Visible to all matched providers |
| access_token | VARCHAR(100) | UNIQUE | For secure sharing links |
| virus_scan_status | ENUM | DEFAULT 'pending' | 'pending', 'clean', 'infected' |
| created_at | TIMESTAMPTZ | DEFAULT NOW() | |
| updated_at | TIMESTAMPTZ | DEFAULT NOW() | |

**Document Categories:**
- `PATIENT_MEDICAL` — Patient medical records
- `DOCTOR_CREDENTIAL` — Doctor professional documents
- `HOSPITAL_ACCREDITATION` — Hospital certificates

**Patient Medical Document Types:**
- `lab_report` — Blood tests, urine tests, biopsies
- `radiology` — X-Ray, MRI, CT Scan, PET Scan, Ultrasound
- `prescription` — Doctor prescriptions
- `discharge_summary` — Hospital discharge papers
- `operative_note` — Surgical notes
- `pathology_report` — Pathology/histology reports
- `ecg_echocardiogram` — Cardiac reports
- `ophthalmology_report`
- `dental_report`
- `vaccination_record`
- `insurance_document`
- `identity_document` — Passport copy
- `visa_document`
- `other_medical`

**Doctor Credential Document Types:**
- `mbbs_degree` — Primary medical degree
- `postgraduate_degree` — MD, MS, DNB, etc.
- `fellowship_certificate`
- `medical_council_registration` — MCI / State medical council
- `experience_letter`
- `noc_letter` — No Objection Certificate
- `publications_list`
- `cme_certificate` — Continuing Medical Education
- `passport_copy`
- `good_standing_certificate`
- `other_credential`

**Supported MIME Types / Formats:**
- `application/pdf` (.pdf)
- `image/jpeg` (.jpg, .jpeg)
- `image/png` (.png)
- `image/webp` (.webp)
- `image/tiff` (.tiff) — For high-res medical imaging
- `application/dicom` (.dcm) — DICOM medical imaging standard
- `application/msword` (.doc)
- `application/vnd.openxmlformats-officedocument.wordprocessingml.document` (.docx)
- `application/vnd.ms-excel` (.xls)
- `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet` (.xlsx)

**File Size Limits:**
- Standard documents (PDF, Word, images): 50 MB max
- DICOM files: 500 MB max
- Total storage per patient: 5 GB
- Total storage per doctor: 2 GB

---

### Table: `document_shares`
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | |
| document_id | UUID | FK → documents.id | |
| shared_by_user_id | UUID | FK → users.id | |
| shared_with_user_id | UUID | FK → users.id, NULLABLE | Specific user share |
| shared_with_hospital_id | UUID | FK → hospitals.id, NULLABLE | Hospital share |
| shared_with_inquiry_id | UUID | FK → inquiries.id, NULLABLE | Context of share |
| can_download | BOOLEAN | DEFAULT true | |
| expires_at | TIMESTAMPTZ | NULLABLE | Optional expiry |
| viewed_at | TIMESTAMPTZ | | First view timestamp |
| created_at | TIMESTAMPTZ | DEFAULT NOW() | |

---

## 5. INQUIRIES & CONSULTATIONS

### Table: `inquiries`
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | |
| inquiry_number | VARCHAR(20) | UNIQUE | Human-readable: HG-2024-00001 |
| patient_user_id | UUID | FK → users.id, NULLABLE | NULL if guest |
| guest_name | VARCHAR(200) | | For non-logged-in users |
| guest_email | VARCHAR(255) | | |
| guest_phone | VARCHAR(20) | | |
| guest_country | VARCHAR(5) | FK → countries.code | |
| treatment_id | UUID | FK → treatments.id, NULLABLE | |
| specialty_id | UUID | FK → specialties.id, NULLABLE | |
| hospital_id | UUID | FK → hospitals.id, NULLABLE | Specific hospital request |
| doctor_id | UUID | FK → doctor_profiles.id, NULLABLE | |
| medical_condition_summary | TEXT | | Patient's description |
| urgency | ENUM | | 'routine', 'urgent', 'emergency' |
| preferred_travel_date | DATE | | |
| budget_range_usd | VARCHAR(50) | | e.g., '5000-10000' |
| status | ENUM | DEFAULT 'new' | 'new', 'in_progress', 'quote_sent', 'accepted', 'rejected', 'completed', 'cancelled' |
| assigned_case_manager_id | UUID | FK → users.id, NULLABLE | |
| source | ENUM | | 'web_form', 'whatsapp', 'phone', 'referral' |
| utm_source | VARCHAR(100) | | |
| utm_medium | VARCHAR(100) | | |
| utm_campaign | VARCHAR(100) | | |
| created_at | TIMESTAMPTZ | DEFAULT NOW() | |
| updated_at | TIMESTAMPTZ | DEFAULT NOW() | |

---

### Table: `consultations`
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | |
| inquiry_id | UUID | FK → inquiries.id, NULLABLE | |
| patient_user_id | UUID | FK → users.id | |
| doctor_user_id | UUID | FK → users.id | |
| type | ENUM | NOT NULL | 'video', 'in_person', 'chat' |
| status | ENUM | | 'scheduled', 'in_progress', 'completed', 'cancelled', 'no_show' |
| scheduled_at | TIMESTAMPTZ | | |
| duration_minutes | SMALLINT | DEFAULT 30 | |
| actual_start_at | TIMESTAMPTZ | | |
| actual_end_at | TIMESTAMPTZ | | |
| meeting_link | VARCHAR(500) | | Video call URL |
| meeting_provider | VARCHAR(50) | | 'zoom', 'jitsi', 'daily.co' |
| fee_usd | DECIMAL(10,2) | | |
| payment_status | ENUM | | 'free', 'pending', 'paid' |
| notes | TEXT | | Doctor's consultation notes |
| prescription | TEXT | | Post-consultation prescription |
| follow_up_date | DATE | | |
| language | VARCHAR(5) | DEFAULT 'en' | Language of consultation |
| created_at | TIMESTAMPTZ | DEFAULT NOW() | |
| updated_at | TIMESTAMPTZ | DEFAULT NOW() | |

---

### Table: `cost_estimates`
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | |
| inquiry_id | UUID | FK → inquiries.id | |
| hospital_id | UUID | FK → hospitals.id | |
| treatment_id | UUID | FK → treatments.id | |
| doctor_id | UUID | FK → doctor_profiles.id, NULLABLE | |
| package_name | VARCHAR(200) | | |
| cost_usd | DECIMAL(10,2) | NOT NULL | |
| cost_breakdown | JSONB | | Line-item breakdown |
| includes | TEXT[] | | What's included |
| excludes | TEXT[] | | |
| validity_days | SMALLINT | DEFAULT 30 | |
| notes | TEXT | | |
| status | ENUM | DEFAULT 'pending' | 'pending', 'accepted', 'rejected', 'expired' |
| patient_response_at | TIMESTAMPTZ | | |
| created_at | TIMESTAMPTZ | DEFAULT NOW() | |

---

## 6. DOCTOR RECRUITMENT

### Table: `international_hospitals`
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | |
| admin_user_id | UUID | FK → users.id | |
| name | VARCHAR(300) | NOT NULL | |
| slug | VARCHAR(200) | UNIQUE | |
| country | VARCHAR(5) | FK → countries.code | |
| city | VARCHAR(100) | | |
| website | VARCHAR(500) | | |
| description | TEXT | | |
| logo_url | VARCHAR(500) | | |
| accreditations | VARCHAR(100)[] | | |
| contact_email | VARCHAR(255) | | |
| contact_phone | VARCHAR(20) | | |
| verification_status | ENUM | DEFAULT 'pending' | |
| created_at | TIMESTAMPTZ | DEFAULT NOW() | |

---

### Table: `job_postings`
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | |
| job_number | VARCHAR(20) | UNIQUE | HGJ-2024-00001 |
| international_hospital_id | UUID | FK → international_hospitals.id | |
| title | VARCHAR(200) | NOT NULL | e.g., 'Senior Consultant Cardiologist' |
| specialty_id | UUID | FK → specialties.id | |
| sub_specialty | VARCHAR(200) | | |
| job_type | ENUM | | 'permanent', 'contract', 'locum', 'visiting' |
| experience_min_years | SMALLINT | | |
| experience_max_years | SMALLINT | | |
| qualifications_required | TEXT[] | | e.g., ['MBBS', 'MCh Cardiology'] |
| description | TEXT | | |
| responsibilities | TEXT[] | | |
| benefits | TEXT[] | | |
| salary_min_usd | DECIMAL(12,2) | | |
| salary_max_usd | DECIMAL(12,2) | | |
| salary_currency | VARCHAR(5) | DEFAULT 'USD' | |
| visa_sponsored | BOOLEAN | DEFAULT false | |
| accommodation_provided | BOOLEAN | DEFAULT false | |
| flight_allowance | BOOLEAN | DEFAULT false | |
| country | VARCHAR(5) | FK → countries.code | |
| city | VARCHAR(100) | | |
| status | ENUM | DEFAULT 'active' | 'draft', 'active', 'paused', 'closed', 'filled' |
| application_deadline | DATE | | |
| posted_at | TIMESTAMPTZ | | |
| created_at | TIMESTAMPTZ | DEFAULT NOW() | |
| updated_at | TIMESTAMPTZ | DEFAULT NOW() | |

---

### Table: `job_applications`
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | |
| application_number | VARCHAR(20) | UNIQUE | HGA-2024-00001 |
| job_posting_id | UUID | FK → job_postings.id | |
| doctor_user_id | UUID | FK → users.id | |
| cover_letter | TEXT | | |
| status | ENUM | DEFAULT 'submitted' | 'submitted', 'under_review', 'shortlisted', 'interview_scheduled', 'offered', 'accepted', 'rejected', 'withdrawn' |
| applied_at | TIMESTAMPTZ | DEFAULT NOW() | |
| reviewed_at | TIMESTAMPTZ | | |
| interview_at | TIMESTAMPTZ | | |
| interview_notes | TEXT | | |
| rejection_reason | VARCHAR(500) | | |
| offer_details | JSONB | | Offer package details |
| offer_responded_at | TIMESTAMPTZ | | |
| created_at | TIMESTAMPTZ | DEFAULT NOW() | |
| updated_at | TIMESTAMPTZ | DEFAULT NOW() | |

---

## 7. REVIEWS & RATINGS

### Table: `reviews`
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | |
| reviewer_user_id | UUID | FK → users.id | |
| reviewable_type | ENUM | NOT NULL | 'hospital', 'doctor' |
| reviewable_id | UUID | NOT NULL | hospital.id or doctor_profile.id |
| consultation_id | UUID | FK → consultations.id, NULLABLE | |
| overall_rating | SMALLINT | NOT NULL | 1-5 |
| cleanliness_rating | SMALLINT | | Hospital only, 1-5 |
| staff_rating | SMALLINT | | 1-5 |
| communication_rating | SMALLINT | | 1-5 |
| value_rating | SMALLINT | | 1-5 |
| title | VARCHAR(300) | | |
| body | TEXT | | |
| treatment_received | VARCHAR(200) | | |
| travel_from_country | VARCHAR(5) | FK → countries.code | |
| is_verified_patient | BOOLEAN | DEFAULT false | |
| is_published | BOOLEAN | DEFAULT false | Requires moderation |
| published_at | TIMESTAMPTZ | | |
| response_by_hospital | TEXT | | Hospital's response |
| created_at | TIMESTAMPTZ | DEFAULT NOW() | |

---

## 8. MESSAGING

### Table: `conversations`
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | |
| type | ENUM | | 'patient_case_manager', 'patient_hospital', 'patient_doctor', 'doctor_hospital', 'support' |
| inquiry_id | UUID | FK → inquiries.id, NULLABLE | |
| created_at | TIMESTAMPTZ | DEFAULT NOW() | |

### Table: `conversation_participants`
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| conversation_id | UUID | FK → conversations.id | Composite PK |
| user_id | UUID | FK → users.id | Composite PK |
| last_read_at | TIMESTAMPTZ | | |
| is_active | BOOLEAN | DEFAULT true | |

### Table: `messages`
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | |
| conversation_id | UUID | FK → conversations.id | |
| sender_user_id | UUID | FK → users.id | |
| message_type | ENUM | | 'text', 'document', 'image', 'system' |
| content | TEXT | | |
| document_id | UUID | FK → documents.id, NULLABLE | For document shares |
| is_read | BOOLEAN | DEFAULT false | |
| created_at | TIMESTAMPTZ | DEFAULT NOW() | |

---

## 9. REFERENCE DATA

### Table: `countries`
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| code | VARCHAR(5) | PK | ISO 3166-1 alpha-2 |
| name | VARCHAR(100) | NOT NULL | |
| name_ru | VARCHAR(100) | | Russian name |
| region | ENUM | | 'cis', 'south_asia', 'middle_east', 'europe', 'other' |
| flag_emoji | VARCHAR(10) | | |
| phone_code | VARCHAR(10) | | |
| currency_code | VARCHAR(5) | | |
| is_active | BOOLEAN | DEFAULT true | |

**CIS Countries loaded by default:**
`RU, KZ, UA, BY, MD, AM, AZ, GE, KG, TJ, TM, UZ`

---

### Table: `cities`
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | |
| country_code | VARCHAR(5) | FK → countries.code | |
| name | VARCHAR(100) | NOT NULL | |
| name_ru | VARCHAR(100) | | |
| is_medical_hub | BOOLEAN | DEFAULT false | Major Indian medical cities |
| is_active | BOOLEAN | DEFAULT true | |

**Indian Medical Hub Cities:**
Mumbai, Delhi/NCR, Chennai, Bangalore, Hyderabad, Pune, Kolkata, Ahmedabad, Jaipur, Kochi

---

### Table: `notifications`
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | |
| user_id | UUID | FK → users.id | |
| type | VARCHAR(100) | | e.g., 'inquiry_update', 'consultation_reminder', 'job_application_update' |
| title | VARCHAR(300) | | |
| body | TEXT | | |
| data | JSONB | | Extra payload |
| channel | ENUM | | 'push', 'email', 'sms', 'in_app' |
| is_read | BOOLEAN | DEFAULT false | |
| sent_at | TIMESTAMPTZ | | |
| created_at | TIMESTAMPTZ | DEFAULT NOW() | |

---

## 10. INDEXES (Performance)

```sql
-- User lookups
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_users_role ON users(role);

-- Doctor search
CREATE INDEX idx_doctor_specialty ON doctor_profiles(primary_specialty_id);
CREATE INDEX idx_doctor_city ON doctor_profiles(current_city);
CREATE INDEX idx_doctor_verification ON doctor_profiles(verification_status);
CREATE INDEX idx_doctor_recruitment ON doctor_profiles(available_for_recruitment);

-- Hospital search
CREATE INDEX idx_hospital_city ON hospitals(city);
CREATE INDEX idx_hospital_rating ON hospitals(rating_avg DESC);
CREATE INDEX idx_hospital_featured ON hospitals(is_featured) WHERE is_featured = true;

-- Documents
CREATE INDEX idx_documents_owner ON documents(owner_user_id);
CREATE INDEX idx_documents_category ON documents(document_category);

-- Inquiries
CREATE INDEX idx_inquiries_patient ON inquiries(patient_user_id);
CREATE INDEX idx_inquiries_status ON inquiries(status);
CREATE INDEX idx_inquiries_created ON inquiries(created_at DESC);

-- Job postings
CREATE INDEX idx_jobs_specialty ON job_postings(specialty_id);
CREATE INDEX idx_jobs_country ON job_postings(country);
CREATE INDEX idx_jobs_status ON job_postings(status) WHERE status = 'active';

-- Full-text search (PostgreSQL)
CREATE INDEX idx_hospitals_fts ON hospitals USING GIN(to_tsvector('english', name || ' ' || COALESCE(description, '')));
CREATE INDEX idx_doctors_fts ON doctor_profiles USING GIN(to_tsvector('english', first_name || ' ' || last_name || ' ' || COALESCE(bio, '')));
CREATE INDEX idx_treatments_fts ON treatments USING GIN(to_tsvector('english', name || ' ' || COALESCE(common_name, '') || ' ' || COALESCE(description, '')));
```
