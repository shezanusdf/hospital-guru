# HospitalGuru.com — API Schema
## RESTful API Design (v1)

Base URL: `https://api.hospitalguru.com/v1`

---

## 1. AUTHENTICATION

### POST `/auth/register/patient`
Register a new patient account.

**Request Body:**
```json
{
  "email": "ivan@email.com",
  "phone": "+79001234567",
  "password": "SecurePass123!",
  "first_name": "Ivan",
  "last_name": "Petrov",
  "country_of_residence": "RU",
  "preferred_language": "ru"
}
```
**Response 201:**
```json
{
  "user_id": "uuid",
  "message": "Verification email sent",
  "requires_verification": true
}
```

---

### POST `/auth/register/doctor`
Register a new doctor/medical professional account.

**Request Body:**
```json
{
  "email": "dr.sharma@email.com",
  "phone": "+919876543210",
  "password": "SecurePass123!",
  "first_name": "Rajesh",
  "last_name": "Sharma",
  "title": "Dr",
  "primary_specialty_id": "uuid",
  "registration_number": "MCI-12345",
  "preferred_language": "en"
}
```

---

### POST `/auth/login`
**Request Body:**
```json
{
  "email": "user@email.com",
  "password": "password",
  "device_type": "web"
}
```
**Response 200:**
```json
{
  "access_token": "jwt_token",
  "refresh_token": "refresh_token",
  "expires_in": 3600,
  "user": {
    "id": "uuid",
    "role": "patient",
    "preferred_language": "ru"
  }
}
```

### POST `/auth/logout`
### POST `/auth/refresh-token`
### POST `/auth/forgot-password`
### POST `/auth/reset-password`
### POST `/auth/verify-email`
### POST `/auth/send-otp` — SMS OTP for phone verification
### POST `/auth/verify-otp`
### POST `/auth/social/google` — Google OAuth
### POST `/auth/social/apple` — Apple Sign-In

---

## 2. PATIENT ENDPOINTS

All routes require `Authorization: Bearer <token>` with `role: patient`

### GET `/patient/profile`
### PUT `/patient/profile`

**Request Body (partial update):**
```json
{
  "first_name": "Ivan",
  "last_name": "Petrov",
  "date_of_birth": "1985-06-15",
  "gender": "male",
  "blood_group": "O+",
  "allergies": ["Penicillin", "Aspirin"],
  "chronic_conditions": ["Type 2 Diabetes"],
  "whatsapp_number": "+79001234567",
  "telegram_handle": "@ivanpetrov"
}
```

### GET `/patient/dashboard`
Returns summary: pending inquiries, upcoming consultations, unread messages, document count.

---

## 3. DOCUMENT ENDPOINTS

### POST `/documents/upload`
**Content-Type:** `multipart/form-data`

**Form Fields:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| file | File | Yes | The document file |
| document_category | string | Yes | 'PATIENT_MEDICAL' or 'DOCTOR_CREDENTIAL' |
| document_type | string | Yes | e.g., 'lab_report', 'mbbs_degree' |
| description | string | No | User description |
| issue_date | date | No | YYYY-MM-DD |
| expiry_date | date | No | For certificates |
| issued_by | string | No | Issuing authority |

**Response 201:**
```json
{
  "document_id": "uuid",
  "file_name": "blood_test_2024.pdf",
  "document_type": "lab_report",
  "file_size_bytes": 245760,
  "virus_scan_status": "pending",
  "upload_url": "https://storage.hospitalguru.com/...",
  "created_at": "2024-03-22T10:00:00Z"
}
```

**Supported formats returned in response:**
```json
{
  "allowed_mime_types": [
    "application/pdf",
    "image/jpeg", "image/png", "image/webp", "image/tiff",
    "application/dicom",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  ],
  "max_file_size_mb": 50,
  "max_dicom_size_mb": 500
}
```

---

### GET `/documents`
List user's documents with optional filters.

**Query Params:**
- `category` — PATIENT_MEDICAL | DOCTOR_CREDENTIAL
- `type` — document_type filter
- `page`, `per_page`
- `sort` — created_at | issue_date

**Response 200:**
```json
{
  "data": [
    {
      "id": "uuid",
      "document_type": "lab_report",
      "file_name": "CBC_report.pdf",
      "description": "Complete Blood Count - March 2024",
      "issue_date": "2024-03-10",
      "issued_by": "City Hospital Moscow",
      "file_size_bytes": 245760,
      "is_verified": false,
      "mime_type": "application/pdf",
      "download_url": "signed_url_valid_15min",
      "created_at": "2024-03-22T10:00:00Z"
    }
  ],
  "meta": { "total": 12, "page": 1, "per_page": 20 }
}
```

### GET `/documents/:id`
### DELETE `/documents/:id`

### POST `/documents/:id/share`
Share a document with a specific user or hospital.

**Request Body:**
```json
{
  "share_with_user_id": "uuid",
  "share_with_hospital_id": "uuid",
  "inquiry_id": "uuid",
  "can_download": true,
  "expires_at": "2024-04-22T00:00:00Z"
}
```

### GET `/documents/:id/download`
Returns a time-limited signed URL for downloading the document.

---

## 4. HOSPITALS ENDPOINTS

### GET `/hospitals`
Public endpoint. Search and filter hospitals.

**Query Params:**
| Param | Type | Description |
|-------|------|-------------|
| city | string | City name or ID |
| specialty_id | uuid | Filter by specialty |
| accreditation | string | 'JCI', 'NABH', etc. |
| type | string | Hospital type |
| min_rating | number | 1-5 |
| sort | string | 'rating', 'reviews', 'name' |
| q | string | Full-text search |
| page | number | |
| per_page | number | Default 20 |
| lang | string | Response language (en/ru) |

**Response 200:**
```json
{
  "data": [
    {
      "id": "uuid",
      "name": "Apollo Hospitals Chennai",
      "city": "Chennai",
      "rating_avg": 4.8,
      "review_count": 1240,
      "accreditations": ["JCI", "NABH"],
      "top_specialties": ["Cardiology", "Oncology", "Transplants"],
      "hero_image_url": "https://...",
      "starting_cost_usd": 3500,
      "slug": "apollo-hospitals-chennai",
      "is_featured": true
    }
  ],
  "meta": { "total": 87, "page": 1, "per_page": 20 },
  "filters_applied": { "city": "Chennai" }
}
```

### GET `/hospitals/:slug`
Full hospital profile.

### GET `/hospitals/:slug/doctors`
Doctors associated with this hospital.

### GET `/hospitals/:slug/treatments`
Treatments and pricing at this hospital.

### GET `/hospitals/:slug/reviews`
### POST `/hospitals/:id/inquiry` — Submit inquiry to specific hospital

---

## 5. DOCTORS ENDPOINTS

### GET `/doctors`
**Query Params:** specialty_id, city, hospital_id, language, experience_min, experience_max, consultation_type, sort, q, page, per_page

### GET `/doctors/:slug`
Full doctor profile.

### GET `/doctors/:slug/availability`
Returns available consultation slots.

```json
{
  "doctor_id": "uuid",
  "timezone": "Asia/Kolkata",
  "available_slots": [
    {
      "date": "2024-03-25",
      "slots": ["09:00", "10:00", "14:00", "15:30"]
    }
  ]
}
```

### GET `/doctors/:slug/reviews`

---

## 6. TREATMENTS ENDPOINTS

### GET `/treatments`
**Query Params:** specialty_id, is_popular, q, page, per_page

### GET `/treatments/:slug`
Full treatment info with cost data.

### GET `/treatments/cost-comparison`
Returns India vs CIS country cost comparison table.

```json
{
  "treatments": [
    {
      "name": "Knee Replacement",
      "india_cost_usd_min": 4000,
      "india_cost_usd_max": 7000,
      "russia_cost_usd_avg": 25000,
      "savings_percentage": 75
    }
  ]
}
```

---

## 7. SPECIALTIES ENDPOINTS

### GET `/specialties` — List all specialties
### GET `/specialties/:slug` — Specialty detail with hospitals and doctors

---

## 8. INQUIRIES ENDPOINTS

### POST `/inquiries`
Submit a medical inquiry (works for both guests and logged-in patients).

**Request Body:**
```json
{
  "treatment_id": "uuid",
  "hospital_id": "uuid",
  "medical_condition_summary": "I have been diagnosed with coronary artery disease and need a bypass surgery. Attached are my ECG and angiography reports.",
  "urgency": "urgent",
  "preferred_travel_date": "2024-05-01",
  "budget_range_usd": "5000-10000",
  "document_ids": ["uuid1", "uuid2"],
  "source": "web_form"
}
```

**Response 201:**
```json
{
  "inquiry_id": "uuid",
  "inquiry_number": "HG-2024-00142",
  "message": "Inquiry submitted. Our case manager will contact you within 24 hours.",
  "estimated_response_hours": 24
}
```

### GET `/inquiries` — Patient's inquiry list
### GET `/inquiries/:id` — Inquiry detail with all updates
### PUT `/inquiries/:id/cancel`

---

## 9. CONSULTATIONS ENDPOINTS

### GET `/consultations` — User's consultations
### GET `/consultations/:id`
### POST `/consultations/:id/join` — Get video call link
### POST `/consultations/:id/cancel`
### POST `/consultations/:id/reschedule`

---

## 10. CAREER / RECRUITMENT ENDPOINTS

### GET `/jobs`
Public job listings.

**Query Params:** specialty_id, country, job_type, experience_min, salary_min, visa_sponsored, sort, q, page, per_page

**Response 200:**
```json
{
  "data": [
    {
      "id": "uuid",
      "job_number": "HGJ-2024-00018",
      "title": "Senior Consultant Cardiologist",
      "hospital": {
        "name": "King's College Hospital Dubai",
        "country": "AE",
        "city": "Dubai",
        "logo_url": "https://..."
      },
      "specialty": "Cardiology",
      "job_type": "permanent",
      "experience_min_years": 10,
      "salary_min_usd": 180000,
      "salary_max_usd": 250000,
      "visa_sponsored": true,
      "accommodation_provided": true,
      "posted_at": "2024-03-20T00:00:00Z",
      "application_deadline": "2024-04-30"
    }
  ],
  "meta": { "total": 34, "page": 1, "per_page": 20 }
}
```

### GET `/jobs/:id`
Full job posting detail.

### POST `/jobs/:id/apply`
Requires doctor authentication.

**Request Body:**
```json
{
  "cover_letter": "Dear Hiring Committee...",
  "document_ids": ["uuid-credential-1", "uuid-credential-2"]
}
```

### GET `/doctor/applications`
Doctor's application list with status.

### GET `/doctor/applications/:id`
Application detail.

### PUT `/doctor/applications/:id/withdraw`

---

## 11. REVIEWS ENDPOINTS

### POST `/reviews`
**Request Body:**
```json
{
  "reviewable_type": "hospital",
  "reviewable_id": "uuid",
  "consultation_id": "uuid",
  "overall_rating": 5,
  "cleanliness_rating": 5,
  "staff_rating": 4,
  "communication_rating": 5,
  "value_rating": 5,
  "title": "Excellent cardiac surgery experience",
  "body": "I travelled from Almaty for bypass surgery...",
  "treatment_received": "CABG",
  "travel_from_country": "KZ"
}
```

### GET `/reviews?reviewable_type=hospital&reviewable_id=uuid`

---

## 12. MESSAGING ENDPOINTS

### GET `/conversations`
### GET `/conversations/:id/messages`
### POST `/conversations/:id/messages`
```json
{
  "message_type": "text",
  "content": "Hello, I have a question about my upcoming procedure."
}
```
### POST `/conversations/:id/messages` (with document)
```json
{
  "message_type": "document",
  "document_id": "uuid",
  "content": "Please review my latest MRI report."
}
```

**WebSocket:** `wss://api.hospitalguru.com/v1/ws/conversations/:id`
For real-time messaging.

---

## 13. SEARCH ENDPOINT

### GET `/search`
Universal search across hospitals, doctors, and treatments.

**Query Params:** `q`, `type` (hospitals|doctors|treatments|all), `lang`

**Response:**
```json
{
  "hospitals": [...],
  "doctors": [...],
  "treatments": [...],
  "query": "heart surgery",
  "suggestions": ["Cardiac Surgery", "Coronary Bypass", "Heart Valve Repair"]
}
```

---

## 14. NOTIFICATIONS

### GET `/notifications`
### PUT `/notifications/:id/read`
### PUT `/notifications/read-all`
### GET `/notifications/preferences`
### PUT `/notifications/preferences`

```json
{
  "push_enabled": true,
  "email_enabled": true,
  "sms_enabled": true,
  "channels": {
    "inquiry_updates": ["push", "email"],
    "consultation_reminders": ["push", "sms"],
    "job_application_updates": ["push", "email"],
    "messages": ["push"]
  }
}
```

---

## 15. REFERENCE DATA

### GET `/reference/countries` — Countries list (with CIS flagged)
### GET `/reference/cities?country=IN` — Cities by country
### GET `/reference/specialties` — All specialties
### GET `/reference/document-types` — Supported document types
### GET `/reference/languages` — Supported languages

---

## 16. ERROR RESPONSES

Standard error format:
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "The file size exceeds the 50MB limit.",
    "details": {
      "field": "file",
      "max_size_mb": 50,
      "received_size_mb": 72.3
    }
  },
  "request_id": "req_abc123"
}
```

**Error Codes:**
| HTTP | Code | Description |
|------|------|-------------|
| 400 | VALIDATION_ERROR | Invalid request data |
| 401 | UNAUTHORIZED | Missing or invalid token |
| 403 | FORBIDDEN | Insufficient permissions |
| 404 | NOT_FOUND | Resource not found |
| 409 | CONFLICT | Duplicate resource |
| 413 | FILE_TOO_LARGE | Upload exceeds size limit |
| 415 | UNSUPPORTED_MEDIA_TYPE | File format not allowed |
| 422 | UNPROCESSABLE_ENTITY | Business logic violation |
| 429 | RATE_LIMITED | Too many requests |
| 500 | INTERNAL_ERROR | Server error |

---

## 17. RATE LIMITS

| Endpoint Group | Limit |
|---------------|-------|
| Auth (login/register) | 10 req/min per IP |
| Document upload | 20 uploads/hour per user |
| Search | 60 req/min per IP |
| General API | 120 req/min per user |
| WebSocket messages | 60 msg/min per connection |
