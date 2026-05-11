import { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://elimufinder.co.ke";

  const supabase = await createClient();
  const { data: schools } = await supabase
    .from("schools")
    .select("slug, updated_at")
    .eq("status", "approved");

  const schoolUrls: MetadataRoute.Sitemap = (schools ?? []).map((s) => ({
    url: `${baseUrl}/schools/${s.slug}`,
    lastModified: new Date(s.updated_at),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${baseUrl}/search`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/submit`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.5 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.4 },
    ...schoolUrls,
  ];
}
