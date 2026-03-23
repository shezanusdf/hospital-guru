# HospitalGuru.com — Schema Documentation

Medical tourism platform: CIS Countries → India + Indian Doctor Recruitment

---

## Schema Files

| File | Description |
|------|-------------|
| [01-site-architecture.md](01-site-architecture.md) | Full site map, all pages, user flows, localization strategy, mobile/PWA spec |
| [02-database-schema.md](02-database-schema.md) | All database tables, columns, types, constraints, indexes |
| [03-api-schema.md](03-api-schema.md) | RESTful API endpoints, request/response formats, error codes |
| [04-tech-stack-and-features.md](04-tech-stack-and-features.md) | Tech stack decisions, security, feature comparison vs Vaidam, roadmap |

---

## Platform Summary

### Two Core Modules

**1. Medical Tourism (CIS → India)**
- Patients from 12 CIS countries find hospitals and doctors in India
- 8-language support (EN, RU, KK, UK, AZ, HY, KA, UZ)
- End-to-end journey: inquiry → quote → consultation → travel → treatment
- Patient document vault (medical records, imaging, DICOM support)

**2. Doctor Recruitment (India → International)**
- Indian doctors create profiles and upload credentials
- International hospitals post jobs
- Application tracking and interview management

### User Roles
1. **Patient** — CIS country patient seeking treatment in India
2. **Doctor** — Indian medical professional
3. **Hospital Admin** — Indian hospital managing their profile
4. **International Hospital** — Foreign hospital recruiting Indian doctors
5. **Case Manager** — HospitalGuru staff managing patient journeys
6. **Admin** — HospitalGuru super admin

### Supported Document Formats
**Medical Records:** PDF, JPG, PNG, TIFF, DICOM, DOC, DOCX
**Doctor Credentials:** PDF, JPG, PNG, DOC, DOCX
**Max size:** 50MB standard / 500MB DICOM

### Technology
- **Frontend:** Next.js 15 + TypeScript + Tailwind CSS
- **Backend:** Node.js + Fastify + Prisma + PostgreSQL
- **Mobile:** PWA (Phase 1) → React Native (Phase 2)
- **Storage:** AWS S3 with signed URLs
- **Search:** Meilisearch (multilingual)
- **Real-time:** Socket.io (chat + notifications)
