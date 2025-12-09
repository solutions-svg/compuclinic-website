import { createClient } from 'next-sanity';

// 1. Setup Sanity Client
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2023-05-03',
  useCdn: false,
});

// 2. The Route Handler
export async function GET() {
  // Fetch the 20 most recent posts with their AI summaries
  const posts = await client.fetch(`
    *[_type == "post"] | order(publishedAt desc)[0...20] {
      title,
      "slug": slug.current,
      publishedAt,
      // We explicitly fetch the 'aiSummary' field we added to the schema
      aiSummary,
      // If no aiSummary exists, we fall back to a snippet of the body
      "bodySnippet": pt::text(body)[0...200]
    }
  `);

  // 3. Construct the Plain Text Output
  let content = `# Website Content Index for AI Agents\n`;
  content += `Description: This is a technical blog about computer repair and IT support.\n`;
  content += `Base URL: https://my-ai-blog.vercel.app\n\n`;
  
  content += `## Latest Articles\n\n`;

  posts.forEach((post: any) => {
    const summary = post.aiSummary || post.bodySnippet || "No summary available.";
    const date = new Date(post.publishedAt).toLocaleDateString();
    
    content += `### ${post.title}\n`;
    content += `Published: ${date}\n`;
    content += `Link: /posts/${post.slug}\n`;
    content += `Summary: ${summary}\n`;
    content += `\n---\n\n`;
  });

  // 4. Return as Text File
  return new Response(content, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=600',
    },
  });
}