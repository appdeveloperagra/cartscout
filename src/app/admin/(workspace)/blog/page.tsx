import Link from "next/link";

const blogTools = [
  {
    title: "Posts",
    description: "Draft, schedule, publish, and optimize your articles.",
    href: "/admin/blog-posts",
    action: "Manage posts",
    icon: "01",
  },
  {
    title: "Categories",
    description: "Organize posts into clear sections for readers.",
    href: "/admin/blog-categories",
    action: "Manage categories",
    icon: "02",
  },
  {
    title: "Tags",
    description: "Maintain tags and connect them to relevant posts.",
    href: "/admin/blog-tags",
    action: "Manage tags",
    icon: "03",
  },
];

export default function BlogManagementPage() {
  return (
    <div className="admin-blog-page">
      <div className="admin-page-heading">
        <div>
          <p className="admin-kicker">PUBLISHING</p>
          <h1>Blog management</h1>
          <p className="admin-page-subtitle">
            Manage your posts and the categories and tags that organize them.
          </p>
        </div>
      </div>

      <section className="admin-blog-tools" aria-label="Blog management tools">
        {blogTools.map((tool) => (
          <article className="admin-blog-tool-card" key={tool.title}>
            <span className="admin-blog-tool-icon" aria-hidden="true">{tool.icon}</span>
            <h2>{tool.title}</h2>
            <p>{tool.description}</p>
            <Link className="admin-inline-link" href={tool.href}>{tool.action} <span aria-hidden="true">→</span></Link>
            {tool.title === "Tags" && (
              <Link className="admin-blog-secondary-link" href="/admin/blog-tag-assignments">
                Connect tags to posts <span aria-hidden="true">↗</span>
              </Link>
            )}
          </article>
        ))}
      </section>
      <p className="admin-blog-note">
        Superadmins can create and publish content. Staff accounts can review published material only.
      </p>
    </div>
  );
}
