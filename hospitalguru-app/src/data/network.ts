// ─── HospitalGuru Partner Network ────────────────────────────────────────────
//
// Map each specialty to a list of hospital / doctor contacts.
// When a lead is approved, the system auto-detects the specialty from the
// patient's treatmentName and emails ONLY the relevant contacts.
//
// TO ADD A NEW CONTACT: append an entry to the relevant specialty array.
// TO ADD A NEW SPECIALTY: add a new key matching the slug in specialty-detector.ts
//
// "name"  — display name shown in the anonymized case-sheet email
// "email" — the contact's inbox (international patient coordinator / dept head)
//
// ⚠️  TESTING MODE — all contacts point to dummy email.
//     Replace with real hospital emails as you onboard partners.
// ─────────────────────────────────────────────────────────────────────────────

export type NetworkContact = {
  name: string;
  email: string;
};

const TEST_EMAIL = "shezan.biz@gmail.com";

export const NETWORK: Record<string, NetworkContact[]> = {
  cardiology: [
    { name: "Fortis Escorts Heart Institute — International Patients",  email: TEST_EMAIL },
    { name: "Medanta Heart Institute — International Patients",         email: TEST_EMAIL },
    { name: "Apollo Hospitals Cardiac Sciences",                        email: TEST_EMAIL },
    { name: "Max Hospital — Cardiology & Cardiac Surgery",              email: TEST_EMAIL },
  ],

  oncology: [
    { name: "Tata Memorial Centre — International Patients",            email: TEST_EMAIL },
    { name: "Apollo Cancer Centres",                                    email: TEST_EMAIL },
    { name: "HCG Oncology — International Desk",                        email: TEST_EMAIL },
    { name: "Fortis Memorial — Oncology International",                 email: TEST_EMAIL },
  ],

  orthopedics: [
    { name: "Fortis Memorial — Orthopedics International",              email: TEST_EMAIL },
    { name: "Apollo Hospitals — Joint Replacement & Spine",             email: TEST_EMAIL },
    { name: "Max Hospital — Orthopedics International",                 email: TEST_EMAIL },
    { name: "Narayana Health — Orthopedics",                            email: TEST_EMAIL },
  ],

  neurology: [
    { name: "Medanta — Neurosciences International",                    email: TEST_EMAIL },
    { name: "Apollo Hospitals — Neurology & Neurosurgery",              email: TEST_EMAIL },
    { name: "Fortis Memorial — Neurosciences",                          email: TEST_EMAIL },
  ],

  ivf: [
    { name: "Apollo Fertility — International Patients",                email: TEST_EMAIL },
    { name: "Cloudnine Hospitals — IVF International",                  email: TEST_EMAIL },
    { name: "Fortis La Femme — Fertility",                              email: TEST_EMAIL },
  ],

  transplant: [
    { name: "Apollo Hospitals — Transplant International",              email: TEST_EMAIL },
    { name: "Medanta — Organ Transplant International",                 email: TEST_EMAIL },
    { name: "Global Hospital — Transplant Dept",                        email: TEST_EMAIL },
    { name: "Narayana Health — Transplant",                             email: TEST_EMAIL },
  ],

  spine: [
    { name: "Apollo Hospitals — Spine Surgery International",           email: TEST_EMAIL },
    { name: "Medanta — Spine Surgery",                                  email: TEST_EMAIL },
    { name: "Max Hospital — Spine Surgery",                             email: TEST_EMAIL },
  ],

  cosmetic: [
    { name: "Apollo Cosmetic Clinics — International",                  email: TEST_EMAIL },
    { name: "Fortis — Plastic & Cosmetic Surgery",                      email: TEST_EMAIL },
  ],

  ophthalmology: [
    { name: "Sankara Nethralaya — International Patients",              email: TEST_EMAIL },
    { name: "LV Prasad Eye Institute — International",                  email: TEST_EMAIL },
    { name: "Apollo Hospitals — Eye Care",                              email: TEST_EMAIL },
  ],

  dental: [
    { name: "Apollo White Dental — International",                      email: TEST_EMAIL },
    { name: "Fortis — Dental International",                            email: TEST_EMAIL },
  ],

  urology: [
    { name: "Medanta — Urology & Kidney Transplant",                    email: TEST_EMAIL },
    { name: "Apollo Hospitals — Urology",                               email: TEST_EMAIL },
    { name: "Max Hospital — Urology",                                   email: TEST_EMAIL },
  ],

  gastroenterology: [
    { name: "Medanta — Gastroenterology International",                 email: TEST_EMAIL },
    { name: "Apollo Hospitals — Gastroenterology",                      email: TEST_EMAIL },
    { name: "Fortis — Gastroenterology",                                email: TEST_EMAIL },
  ],

  general: [
    { name: "Apollo Hospitals — International Patients",                email: TEST_EMAIL },
    { name: "Fortis Healthcare — International Patients",               email: TEST_EMAIL },
    { name: "Medanta — International Patients",                         email: TEST_EMAIL },
    { name: "Narayana Health — International Patients",                 email: TEST_EMAIL },
    { name: "Max Hospital — International Patients",                    email: TEST_EMAIL },
  ],
};
