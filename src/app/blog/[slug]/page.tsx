import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import Markdown from "react-markdown";
import { RequestTimeMarker } from "@/components/request-time-marker";
import { getPublishedBlogPost } from "@/lib/cms";
import { createPageMetadata } from "@/lib/site-seo";

type BlogPostPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedBlogPost(slug);
  if (!post) return {};

  return createPageMetadata({
    title: post.seo_title || post.title,
    description: post.seo_description || post.excerpt,
    path: `/blog/${post.slug}`,
  });
}

async function BlogArticle({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getPublishedBlogPost(slug);
  if (!post) notFound();

  return (
    <main className="content-page blog-article">
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <ol>
          <li><Link href="/">Home</Link></li>
          <li><Link href="/blog">Journal</Link></li>
          <li aria-current="page">{post.title}</li>
        </ol>
      </nav>
      <article>
        <div className="eyebrow"><span /> THE CARTSCOUT JOURNAL</div>
        <h1>{post.title}</h1>
        {post.published_at && (
          <p className="blog-card-date">
            {new Intl.DateTimeFormat("en-ZA", { dateStyle: "long" }).format(new Date(post.published_at))}
          </p>
        )}
        {post.excerpt && <p className="blog-article-excerpt">{post.excerpt}</p>}
        <div className="blog-markdown">
          <Markdown>{post.body_markdown}</Markdown>
        </div>
      </article>
    </main>
  );
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  return (
    <>
      <Suspense fallback={null}><RequestTimeMarker /></Suspense>
      <Suspense fallback={<main className="content-page blog-article" role="status">Loading article...</main>}>
        <BlogArticle params={params} />
      </Suspense>
    </>
  );
}
