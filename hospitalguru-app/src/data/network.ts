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
// ─────────────────────────────────────────────────────────────────────────────

export type NetworkContact = {
  name: string;
  email: string;
};

export const NETWORK: Record<string, NetworkContact[]> = {
  cardiology: [
    { name: "Fortis Escorts Heart Institute — International Patients",  email: "international@fortishealthcare.com" },
    { name: "Medanta Heart Institute — International Patients",         email: "international.patients@medanta.org" },
    { name: "Apollo Hospitals Cardiac Sciences",                        email: "international@apollohospitals.com" },
    { name: "Max Hospital — Cardiology & Cardiac Surgery",              email: "internationalpatients@maxhealthcare.in" },
  ],

  oncology: [
    { name: "Tata Memorial Centre — International Patients",            email: "internationalpatients@tmc.gov.in" },
    { name: "Apollo Cancer Centres",                                    email: "international@apollohospitals.com" },
    { name: "HCG Oncology — International Desk",                        email: "international@hcgoncology.com" },
    { name: "Fortis Memorial — Oncology International",                 email: "international@fortishealthcare.com" },
  ],

  orthopedics: [
    { name: "Fortis Memorial — Orthopedics International",              email: "international@fortishealthcare.com" },
    { name: "Apollo Hospitals — Joint Replacement & Spine",             email: "international@apollohospitals.com" },
    { name: "Max Hospital — Orthopedics International",                 email: "internationalpatients@maxhealthcare.in" },
    { name: "Narayana Health — Orthopedics",                            email: "international@narayanahealth.org" },
  ],

  neurology: [
    { name: "Medanta — Neurosciences International",                    email: "international.patients@medanta.org" },
    { name: "Apollo Hospitals — Neurology & Neurosurgery",              email: "international@apollohospitals.com" },
    { name: "Fortis Memorial — Neurosciences",                          email: "international@fortishealthcare.com" },
  ],

  ivf: [
    { name: "Apollo Fertility — International Patients",                email: "international@apollohospitals.com" },
    { name: "Cloudnine Hospitals — IVF International",                  email: "international@cloudninecare.com" },
    { name: "Fortis La Femme — Fertility",                              email: "international@fortishealthcare.com" },
  ],

  transplant: [
    { name: "Apollo Hospitals — Transplant International",              email: "international@apollohospitals.com" },
    { name: "Medanta — Organ Transplant International",                 email: "international.patients@medanta.org" },
    { name: "Global Hospital — Transplant Dept",                        email: "international@globalhospitalsindia.com" },
    { name: "Narayana Health — Transplant",                             email: "international@narayanahealth.org" },
  ],

  spine: [
    { name: "Apollo Hospitals — Spine Surgery International",           email: "international@apollohospitals.com" },
    { name: "Medanta — Spine Surgery",                                  email: "international.patients@medanta.org" },
    { name: "Max Hospital — Spine Surgery",                             email: "internationalpatients@maxhealthcare.in" },
  ],

  cosmetic: [
    { name: "Apollo Cosmetic Clinics — International",                  email: "international@apollohospitals.com" },
    { name: "Fortis — Plastic & Cosmetic Surgery",                      email: "international@fortishealthcare.com" },
  ],

  ophthalmology: [
    { name: "Sankara Nethralaya — International Patients",              email: "international@sankaranethralaya.org" },
    { name: "LV Prasad Eye Institute — International",                  email: "international@lvpei.org" },
    { name: "Apollo Hospitals — Eye Care",                              email: "international@apollohospitals.com" },
  ],

  dental: [
    { name: "Apollo White Dental — International",                      email: "international@apollohospitals.com" },
    { name: "Fortis — Dental International",                            email: "international@fortishealthcare.com" },
  ],

  urology: [
    { name: "Medanta — Urology & Kidney Transplant",                    email: "international.patients@medanta.org" },
    { name: "Apollo Hospitals — Urology",                               email: "international@apollohospitals.com" },
    { name: "Max Hospital — Urology",                                   email: "internationalpatients@maxhealthcare.in" },
  ],

  gastroenterology: [
    { name: "Medanta — Gastroenterology International",                 email: "international.patients@medanta.org" },
    { name: "Apollo Hospitals — Gastroenterology",                      email: "international@apollohospitals.com" },
    { name: "Fortis — Gastroenterology",                                email: "international@fortishealthcare.com" },
  ],

  general: [
    { name: "Apollo Hospitals — International Patients",                email: "international@apollohospitals.com" },
    { name: "Fortis Healthcare — International Patients",               email: "international@fortishealthcare.com" },
    { name: "Medanta — International Patients",                         email: "international.patients@medanta.org" },
    { name: "Narayana Health — International Patients",                 email: "international@narayanahealth.org" },
    { name: "Max Hospital — International Patients",                    email: "internationalpatients@maxhealthcare.in" },
  ],
};
