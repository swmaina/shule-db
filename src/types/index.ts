// ─── Enums ────────────────────────────────────────────────────────────────────

export type SchoolType = "special" | "integrated" | "inclusive";

export type SchoolLevel =
  | "ECD"
  | "primary"
  | "junior_secondary"
  | "senior_secondary"
  | "TVET"
  | "tertiary";

export type ConditionSupported =
  | "autism"
  | "ADHD"
  | "intellectual_disability"
  | "cerebral_palsy"
  | "dyslexia"
  | "dyscalculia"
  | "dyspraxia"
  | "hearing_impairment"
  | "visual_impairment"
  | "deafblind"
  | "speech_language"
  | "down_syndrome"
  | "multiple_disabilities"
  | "physical_disability"
  | "epilepsy"
  | "anxiety_disorders"
  | "other";

export type SchoolStatus = "pending" | "approved" | "rejected";

export type FeeRange = "free" | "low" | "medium" | "high" | "unknown";

// ─── Kenya Counties ────────────────────────────────────────────────────────────

export const KENYA_COUNTIES = [
  "Baringo", "Bomet", "Bungoma", "Busia", "Elgeyo-Marakwet",
  "Embu", "Garissa", "Homa Bay", "Isiolo", "Kajiado",
  "Kakamega", "Kericho", "Kiambu", "Kilifi", "Kirinyaga",
  "Kisii", "Kisumu", "Kitui", "Kwale", "Laikipia",
  "Lamu", "Machakos", "Makueni", "Mandera", "Marsabit",
  "Meru", "Migori", "Mombasa", "Murang'a", "Nairobi",
  "Nakuru", "Nandi", "Narok", "Nyamira", "Nyandarua",
  "Nyeri", "Samburu", "Siaya", "Taita-Taveta", "Tana River",
  "Tharaka-Nithi", "Trans Nzoia", "Turkana", "Uasin Gishu",
  "Vihiga", "Wajir", "West Pokot",
] as const;

export type KenyanCounty = (typeof KENYA_COUNTIES)[number];

// ─── Core Models ──────────────────────────────────────────────────────────────

export interface School {
  id: string;
  slug: string;
  name: string;

  // Location
  county: KenyanCounty;
  town: string;
  estate?: string;
  physical_address?: string;
  lat?: number;
  lng?: number;

  // Classification
  school_type: SchoolType;
  levels: SchoolLevel[];
  conditions_supported: ConditionSupported[];

  // Contact
  phone?: string;
  email?: string;
  website?: string;
  facebook_url?: string;

  // Details
  is_boarding: boolean;
  fee_range?: FeeRange;
  fee_notes?: string;          // e.g. "Subsidy available for low-income families"
  admission_requirements?: string;
  description?: string;
  photos?: string[];           // Supabase storage URLs

  // Trust signals
  status: SchoolStatus;
  is_verified: boolean;        // verified by school admin
  last_verified_at?: string;
  verified_by_admin_id?: string;

  // Metadata
  submitted_by?: string;       // user_id or null for public submissions
  created_at: string;
  updated_at: string;
}

export interface SchoolAdmin {
  id: string;
  user_id: string;
  school_id: string;
  verified_at?: string;
  created_at: string;
}

export interface SubmissionPayload {
  name: string;
  county: KenyanCounty;
  town: string;
  estate?: string;
  physical_address?: string;
  school_type: SchoolType;
  levels: SchoolLevel[];
  conditions_supported: ConditionSupported[];
  phone?: string;
  email?: string;
  website?: string;
  is_boarding: boolean;
  fee_range?: FeeRange;
  fee_notes?: string;
  admission_requirements?: string;
  description?: string;
  submitter_name: string;
  submitter_email: string;
  submitter_role: "parent" | "teacher" | "admin" | "other";
}

// ─── Search / Filter ──────────────────────────────────────────────────────────

export interface SearchFilters {
  query?: string;
  county?: KenyanCounty;
  school_type?: SchoolType;
  levels?: SchoolLevel[];
  conditions?: ConditionSupported[];
  is_boarding?: boolean;
  fee_range?: FeeRange;
}

export interface SearchResult {
  schools: School[];
  total: number;
  page: number;
  per_page: number;
}

// ─── Label Maps (for UI display) ─────────────────────────────────────────────

export const SCHOOL_TYPE_LABELS: Record<SchoolType, string> = {
  special:    "Special School",
  integrated: "Integrated Unit",
  inclusive:  "Inclusive Mainstream",
};

export const LEVEL_LABELS: Record<SchoolLevel, string> = {
  ECD:              "Early Childhood (ECD)",
  primary:          "Primary (Grades 1–6)",
  junior_secondary: "Junior Secondary (Grades 7–9)",
  senior_secondary: "Senior Secondary (Grades 10–12)",
  TVET:             "TVET / Vocational",
  tertiary:         "College / University",
};

export const CONDITION_LABELS: Record<ConditionSupported, string> = {
  autism:               "Autism Spectrum",
  ADHD:                 "ADHD",
  intellectual_disability: "Intellectual Disability",
  cerebral_palsy:       "Cerebral Palsy",
  dyslexia:             "Dyslexia",
  dyscalculia:          "Dyscalculia",
  dyspraxia:            "Dyspraxia / DCD",
  hearing_impairment:   "Hearing Impairment",
  visual_impairment:    "Visual Impairment",
  deafblind:            "Deafblind",
  speech_language:      "Speech & Language",
  down_syndrome:        "Down Syndrome",
  multiple_disabilities:"Multiple Disabilities",
  physical_disability:  "Physical Disability",
  epilepsy:             "Epilepsy",
  anxiety_disorders:    "Anxiety / Mental Health",
  other:                "Other",
};

export const FEE_RANGE_LABELS: Record<FeeRange, string> = {
  free:    "Free / Government Subsidised",
  low:     "Low (under KES 30k/yr)",
  medium:  "Medium (KES 30k–100k/yr)",
  high:    "High (over KES 100k/yr)",
  unknown: "Not specified",
};
