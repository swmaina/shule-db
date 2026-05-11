"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  submitSchoolSchema,
  type SubmitSchoolFormData,
} from "@/lib/validations/school";
import {
  KENYA_COUNTIES, SCHOOL_TYPE_LABELS, LEVEL_LABELS,
  CONDITION_LABELS, FEE_RANGE_LABELS,
} from "@/types";
import { cn } from "@/lib/utils/helpers";

const STEPS = ["School details", "Learning support", "Contact & fees", "Your info"];

export default function SubmitSchoolForm() {
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<SubmitSchoolFormData>({
    resolver: zodResolver(submitSchoolSchema),
    defaultValues: {
      is_boarding: false,
      levels: [],
      conditions_supported: [],
    },
  });

  const levels = watch("levels") ?? [];
  const conditions = watch("conditions_supported") ?? [];

  function toggleArrayValue<T extends string>(
    field: "levels" | "conditions_supported",
    value: T,
    current: T[]
  ) {
    const next = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    setValue(field, next as any, { shouldValidate: true });
  }

  async function onSubmit(data: SubmitSchoolFormData) {
    setSubmitting(true);
    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Submission failed");
      toast.success("School submitted! We'll review it within 48 hours.");
      router.push("/");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
      {/* Step indicator */}
      <div className="flex border-b border-stone-100">
        {STEPS.map((s, i) => (
          <div
            key={s}
            className={cn(
              "flex-1 py-3 text-center text-xs font-display font-semibold transition-colors",
              i === step
                ? "bg-brand-500 text-white"
                : i < step
                ? "bg-brand-50 text-brand-600"
                : "text-stone-400"
            )}
          >
            {i + 1}. {s}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
        {/* Step 0 — School details */}
        {step === 0 && (
          <>
            <Field label="School name *" error={errors.name?.message}>
              <input {...register("name")} className={inputCls(!!errors.name)} placeholder="e.g. Joytown Special School" />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="County *" error={errors.county?.message}>
                <select {...register("county")} className={inputCls(!!errors.county)}>
                  <option value="">Select county</option>
                  {KENYA_COUNTIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </Field>
              <Field label="Town / Sub-county *" error={errors.town?.message}>
                <input {...register("town")} className={inputCls(!!errors.town)} placeholder="e.g. Thika" />
              </Field>
            </div>
            <Field label="Estate / Neighbourhood" error={errors.estate?.message}>
              <input {...register("estate")} className={inputCls(!!errors.estate)} placeholder="e.g. Makongeni" />
            </Field>
            <Field label="Physical address" error={errors.physical_address?.message}>
              <input {...register("physical_address")} className={inputCls(!!errors.physical_address)} placeholder="Street, building, or landmark" />
            </Field>
            <Field label="School type *" error={errors.school_type?.message}>
              <select {...register("school_type")} className={inputCls(!!errors.school_type)}>
                <option value="">Select type</option>
                {Object.entries(SCHOOL_TYPE_LABELS).map(([v, l]) => (
                  <option key={v} value={v}>{l}</option>
                ))}
              </select>
            </Field>
            <Field label="Boarding" error={undefined}>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" {...register("is_boarding")} className="w-4 h-4 accent-brand-500" />
                <span className="text-sm text-stone-700">This school offers boarding</span>
              </label>
            </Field>
          </>
        )}

        {/* Step 1 — Learning support */}
        {step === 1 && (
          <>
            <Field label="Education levels offered *" error={errors.levels?.message}>
              <div className="flex flex-wrap gap-2">
                {Object.entries(LEVEL_LABELS).map(([v, l]) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => toggleArrayValue("levels", v as any, levels as any)}
                    className={cn(
                      "px-3 py-1.5 rounded-full text-sm border transition-colors",
                      levels.includes(v as any)
                        ? "bg-brand-500 text-white border-brand-500"
                        : "border-stone-200 text-stone-600 hover:border-brand-300"
                    )}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </Field>

            <Field label="Conditions supported *" error={errors.conditions_supported?.message}>
              <div className="flex flex-wrap gap-2">
                {Object.entries(CONDITION_LABELS).map(([v, l]) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => toggleArrayValue("conditions_supported", v as any, conditions as any)}
                    className={cn(
                      "px-3 py-1.5 rounded-full text-sm border transition-colors",
                      conditions.includes(v as any)
                        ? "bg-brand-500 text-white border-brand-500"
                        : "border-stone-200 text-stone-600 hover:border-brand-300"
                    )}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </Field>

            <Field label="Admission requirements" error={errors.admission_requirements?.message}>
              <textarea
                {...register("admission_requirements")}
                rows={3}
                className={inputCls(!!errors.admission_requirements)}
                placeholder="e.g. Assessment by educational psychologist required. Age 3–18."
              />
            </Field>

            <Field label="Description (optional)" error={errors.description?.message}>
              <textarea
                {...register("description")}
                rows={3}
                className={inputCls(!!errors.description)}
                placeholder="Brief description of the school's approach, facilities, or unique offering."
              />
            </Field>
          </>
        )}

        {/* Step 2 — Contact & fees */}
        {step === 2 && (
          <>
            <Field label="Phone number" error={errors.phone?.message}>
              <input {...register("phone")} className={inputCls(!!errors.phone)} placeholder="0712 345 678" />
            </Field>
            <Field label="Email address" error={errors.email?.message}>
              <input {...register("email")} type="email" className={inputCls(!!errors.email)} placeholder="school@example.com" />
            </Field>
            <Field label="Website" error={errors.website?.message}>
              <input {...register("website")} className={inputCls(!!errors.website)} placeholder="https://..." />
            </Field>
            <Field label="Fee range" error={errors.fee_range?.message}>
              <select {...register("fee_range")} className={inputCls(!!errors.fee_range)}>
                <option value="">Unknown / prefer not to say</option>
                {Object.entries(FEE_RANGE_LABELS).map(([v, l]) => (
                  <option key={v} value={v}>{l}</option>
                ))}
              </select>
            </Field>
            <Field label="Fee notes" error={errors.fee_notes?.message}>
              <input
                {...register("fee_notes")}
                className={inputCls(!!errors.fee_notes)}
                placeholder="e.g. Bursaries available, NHIF accepted"
              />
            </Field>
          </>
        )}

        {/* Step 3 — Submitter info */}
        {step === 3 && (
          <>
            <p className="text-sm text-stone-500 bg-stone-50 rounded-xl p-3">
              We use this to follow up if we need to verify details. It won't be published.
            </p>
            <Field label="Your name *" error={errors.submitter_name?.message}>
              <input {...register("submitter_name")} className={inputCls(!!errors.submitter_name)} />
            </Field>
            <Field label="Your email *" error={errors.submitter_email?.message}>
              <input {...register("submitter_email")} type="email" className={inputCls(!!errors.submitter_email)} />
            </Field>
            <Field label="Your role *" error={errors.submitter_role?.message}>
              <select {...register("submitter_role")} className={inputCls(!!errors.submitter_role)}>
                <option value="">Select role</option>
                <option value="parent">Parent / Guardian</option>
                <option value="teacher">Teacher / Staff</option>
                <option value="admin">School Administrator</option>
                <option value="other">Other</option>
              </select>
            </Field>
          </>
        )}

        {/* Navigation */}
        <div className="flex justify-between pt-2">
          {step > 0 ? (
            <button
              type="button"
              onClick={() => setStep((s) => s - 1)}
              className="text-sm text-stone-500 hover:text-stone-800 font-semibold"
            >
              ← Back
            </button>
          ) : <span />}

          {step < STEPS.length - 1 ? (
            <button
              type="button"
              onClick={() => setStep((s) => s + 1)}
              className="bg-brand-500 hover:bg-brand-600 text-white font-display font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors"
            >
              Next →
            </button>
          ) : (
            <button
              type="submit"
              disabled={submitting}
              className="bg-brand-500 hover:bg-brand-600 disabled:opacity-50 text-white font-display font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors"
            >
              {submitting ? "Submitting…" : "Submit school"}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-xs font-display font-semibold text-stone-600 mb-1.5">
        {label}
      </label>
      {children}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}

function inputCls(hasError: boolean) {
  return cn(
    "w-full border rounded-lg px-3 py-2.5 text-sm outline-none transition-colors",
    hasError
      ? "border-red-300 focus:ring-2 focus:ring-red-200"
      : "border-stone-200 focus:ring-2 focus:ring-brand-300"
  );
}
