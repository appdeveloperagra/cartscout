import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { getPublishedBlogPosts } from "@/lib/cms";
import { createPageMetadata } from "@/lib/site-seo";

export const metadata: Metadata = createPageMetadata({
  title: "Golf Cart Journal",
  description: "Guides, news, and practical advice from CartScout.",
  path: "/blog",
});

async function BlogIndex() {
  const posts = await getPublishedBlogPosts();

  return (
    <main className="content-page blog-page">
      <div className="eyebrow"><span /> THE CARTSCOUT JOURNAL</div>
      <h1>Ideas for your next ride.</h1>
      <p className="page-intro">Guides and practical advice for buying, using, and renting golf carts.</p>
      {posts.length ? (
        <div className="blog-grid">
          {posts.map((post) => (
            <article className="blog-card" key={post.id}>
              <span className="blog-card-date">
                {post.published_at
                  ? new Intl.DateTimeFormat("en-ZA", { dateStyle: "long" }).format(new Date(post.published_at))
                  : ""}
              </span>
              <h2><Link href={`/blog/${post.slug}`}>{post.title}</Link></h2>
              <p>{post.excerpt}</p>
              <Link className="inline-link" href={`/blog/${post.slug}`}>Read article <span aria-hidden="true">→</span></Link>
            </article>
          ))}
        </div>
      ) : (
        <div className="blog-empty">
          <h2>No articles are published yet.</h2>
        </div>
      )}
    </main>
  );
}

export default function BlogPage() {
  return (
    <Suspense fallback={<main className="content-page blog-page" role="status">Loading articles...</main>}>
      <BlogIndex />
    </Suspense>
  );
}
