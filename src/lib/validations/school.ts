import { z } from "zod";
import { KENYA_COUNTIES } from "@/types";

const countyEnum = z.enum([...KENYA_COUNTIES] as [string, ...string[]]);

export const submitSchoolSchema = z.object({
  name: z.string().min(3, "School name must be at least 3 characters").max(200),
  county: countyEnum,
  town: z.string().min(2).max(100),
  estate: z.string().max(100).optional(),
  physical_address: z.string().max(300).optional(),

  school_type: z.enum(["special", "integrated", "inclusive"]),
  levels: z
    .array(z.enum(["ECD", "primary", "junior_secondary", "senior_secondary", "TVET", "tertiary"]))
    .min(1, "Select at least one level"),

  conditions_supported: z
    .array(
      z.enum([
        "autism", "ADHD", "intellectual_disability", "cerebral_palsy",
        "dyslexia", "dyscalculia", "dyspraxia", "hearing_impairment",
        "visual_impairment", "deafblind", "speech_language", "down_syndrome",
        "multiple_disabilities", "physical_disability", "epilepsy",
        "anxiety_disorders", "other",
      ])
    )
    .min(1, "Select at least one condition"),

  phone: z
    .string()
    .regex(/^(\+254|0)[17]\d{8}$/, "Enter a valid Kenyan phone number")
    .optional()
    .or(z.literal("")),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  website: z.string().url("Must be a valid URL (include https://)").optional().or(z.literal("")),

  is_boarding: z.boolean(),
  fee_range: z.enum(["free", "low", "medium", "high", "unknown"]).optional(),
  fee_notes: z.string().max(300).optional(),
  admission_requirements: z.string().max(1000).optional(),
  description: z.string().max(2000).optional(),

  // Submitter info (not stored on school, used for follow-up)
  submitter_name: z.string().min(2).max(100),
  submitter_email: z.string().email("Enter a valid email"),
  submitter_role: z.enum(["parent", "teacher", "admin", "other"]),
});

export type SubmitSchoolFormData = z.infer<typeof submitSchoolSchema>;

export const searchSchema = z.object({
  query: z.string().optional(),
  county: countyEnum.optional(),
  school_type: z.enum(["special", "integrated", "inclusive"]).optional(),
  levels: z.array(z.string()).optional(),
  conditions: z.array(z.string()).optional(),
  is_boarding: z.boolean().optional(),
  fee_range: z.enum(["free", "low", "medium", "high", "unknown"]).optional(),
  page: z.coerce.number().int().positive().default(1),
});
