import { fetchApiData, API_ENDPOINTS, normalizeLanguage } from "@/lib/api";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lang = searchParams.get("lang") || "en";

  try {
    const data = await fetchApiData<any>(API_ENDPOINTS.BLOGS, normalizeLanguage(lang));
    const posts = Array.isArray(data?.posts) ? data.posts : Array.isArray(data?.blogs) ? data.blogs : [];

    const slugify = (title: string) =>
      title
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim();

    const mappedPosts = posts.map((p: any) => ({
      blogId: p.blogId,
      id: p.id,
      title: p.title,
      titleSlug: slugify(p.title),
      expectedSlug: `${slugify(p.title)}-${p.blogId || p.id}`,
    }));

    return Response.json({
      success: true,
      totalPosts: posts.length,
      lang,
      normalizedLang: normalizeLanguage(lang),
      posts: mappedPosts,
    });
  } catch (error) {
    return Response.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
