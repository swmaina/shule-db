import type { Metadata } from "next";
import SubmitSchoolForm from "@/components/schools/SubmitSchoolForm";

export const metadata: Metadata = {
  title: "Add a School",
  description: "Add a special, integrated, or inclusive school to the Elimu Finder directory.",
};

export default function SubmitPage() {
  return (
    <main className="min-h-screen bg-stone-50">
      <div className="max-w-2xl mx-auto px-6 py-12">
        <div className="text-center mb-10">
          <h1 className="font-display font-bold text-3xl mb-2">Add a school</h1>
          <p className="text-stone-500 text-sm leading-relaxed">
            Help other families find this school. All submissions are reviewed before going live.
            Takes about 2 minutes.
          </p>
        </div>
        <SubmitSchoolForm />
      </div>
    </main>
  );
}
