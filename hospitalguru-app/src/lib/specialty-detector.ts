// ─── Specialty Detector ───────────────────────────────────────────────────────
// Maps a patient's free-text treatmentName to a specialty slug that matches
// a key in src/data/network.ts. Falls back to "general" if no match found.
// ─────────────────────────────────────────────────────────────────────────────

const SPECIALTY_KEYWORDS: Record<string, string[]> = {
  cardiology: [
    "heart", "cardiac", "cardio", "bypass", "angioplasty", "angiography",
    "valve", "pacemaker", "arrhythmia", "coronary", "echocardiogram",
    "heart attack", "myocardial", "aorta", "stent", "сердце", "кардио",
  ],
  oncology: [
    "cancer", "tumor", "tumour", "oncology", "chemo", "chemotherapy",
    "radiation", "lymphoma", "leukemia", "leukaemia", "melanoma", "biopsy",
    "carcinoma", "sarcoma", "breast cancer", "lung cancer", "colon cancer",
    "prostate cancer", "рак", "онколог", "опухоль",
  ],
  orthopedics: [
    "knee", "hip", "joint", "bone", "fracture", "orthopedic", "orthopaedic",
    "replacement", "ligament", "acl", "meniscus", "shoulder", "elbow",
    "arthritis", "arthroscopy", "колено", "сустав", "ортопед",
  ],
  neurology: [
    "brain", "neuro", "neurology", "neurosurgery", "stroke", "epilepsy",
    "parkinson", "alzheimer", "spine tumor", "brain tumor", "головной мозг",
    "невролог", "инсульт",
  ],
  ivf: [
    "ivf", "fertility", "infertility", "embryo", "egg freezing", "surrogacy",
    "iui", "icsi", "sperm", "reproductive", "conception", "pregnant",
    "эко", "бесплодие", "оплодотворение",
  ],
  transplant: [
    "transplant", "liver transplant", "kidney transplant", "bone marrow",
    "stem cell", "heart transplant", "lung transplant", "трансплант",
    "пересадка", "донор",
  ],
  spine: [
    "spine", "spinal", "disc", "herniated", "herniation", "scoliosis",
    "laminectomy", "fusion", "vertebra", "lumbar", "cervical disc",
    "позвоночник", "диск", "грыжа",
  ],
  cosmetic: [
    "cosmetic", "plastic surgery", "rhinoplasty", "liposuction", "facelift",
    "breast augmentation", "blepharoplasty", "botox", "filler",
    "пластика", "косметолог", "ринопластика",
  ],
  ophthalmology: [
    "eye", "vision", "lasik", "cataract", "glaucoma", "retina",
    "ophthalmology", "cornea", "squint", "глаз", "зрение", "катаракта",
  ],
  dental: [
    "dental", "teeth", "tooth", "implant", "braces", "orthodontic",
    "root canal", "crown", "veneers", "зубы", "стоматолог", "имплант",
  ],
  urology: [
    "kidney", "urology", "urological", "prostate", "bladder", "ureter",
    "kidney stone", "почки", "урология", "простата",
  ],
  gastroenterology: [
    "liver", "stomach", "gastro", "gastroenterology", "colonoscopy",
    "endoscopy", "pancreas", "gallbladder", "crohn", "colitis", "ibs",
    "печень", "желудок", "гастро",
  ],
};

export function detectSpecialty(treatmentName?: string | null): string {
  if (!treatmentName) return "general";

  const lower = treatmentName.toLowerCase();

  for (const [specialty, keywords] of Object.entries(SPECIALTY_KEYWORDS)) {
    if (keywords.some((kw) => lower.includes(kw))) {
      return specialty;
    }
  }

  return "general";
}
