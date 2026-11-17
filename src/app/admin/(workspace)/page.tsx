import Link from "next/link";
import { connection } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { adminModules } from "@/lib/admin-modules";

export default async function AdminDashboardPage() {
  await connection();
  const supabase = await createSupabaseServerClient();
  const [products, posts, rates, areas] = await Promise.all([
    supabase.from("products").select("id", { count: "exact", head: true }),
    supabase.from("blog_posts").select("id", { count: "exact", head: true }).eq("status", "published"),
    supabase.from("rental_rates").select("id", { count: "exact", head: true }),
    supabase.from("service_areas").select("id", { count: "exact", head: true }),
  ]);
  const failedQuery = [products, posts, rates, areas].find(({ error }) => error);
  if (failedQuery?.error) throw new Error(`Unable to load dashboard metrics: ${failedQuery.error.message}`);

  const metrics = [
    { label: "Catalogue products", value: products.count ?? 0, icon: "01", module: "products", tone: "mint" },
    { label: "Published articles", value: posts.count ?? 0, icon: "02", module: "blog-posts", tone: "blue" },
    { label: "Rental plans", value: rates.count ?? 0, icon: "03", module: "rental-rates", tone: "amber" },
    { label: "Service areas", value: areas.count ?? 0, icon: "04", module: "locations", tone: "violet" },
  ];

  return (
    <div className="admin-dashboard">
      <div className="admin-page-heading">
        <div>
          <p className="admin-kicker">YOUR BUSINESS AT A GLANCE</p>
          <h1>Overview</h1>
          <p className="admin-page-subtitle">A clear view of your catalogue, content, and customer-facing information.</p>
        </div>
        <Link className="admin-button admin-button-primary" href="/admin/products">
          <span aria-hidden="true">＋</span> Add a product
        </Link>
      </div>

      <section className="admin-metric-grid" aria-label="Content overview">
        {metrics.map((metric) => (
          <Link className="admin-metric-card" href={`/admin/${metric.module}`} key={metric.label}>
            <span className={`admin-metric-icon ${metric.tone}`} aria-hidden="true">{metric.icon}</span>
            <span className="admin-metric-label">{metric.label}</span>
            <strong>{metric.value.toLocaleString("en-ZA")}</strong>
            <span className="admin-metric-link">Manage <span aria-hidden="true">↗</span></span>
          </Link>
        ))}
      </section>

      <section className="admin-dashboard-lower">
        <div className="admin-panel admin-quick-actions">
          <div className="admin-panel-heading">
            <div><p className="admin-kicker">MOVE THINGS FORWARD</p><h2>Quick actions</h2></div>
          </div>
          <div className="admin-action-grid">
            {[
              { label: "Add product", detail: "Update your inventory", module: "products", icon: "↗" },
              { label: "Write an article", detail: "Create a blog post", module: "blog-posts", icon: "✎" },
              { label: "Update rental rates", detail: "Edit daily, weekly, monthly", module: "rental-rates", icon: "R" },
              { label: "Edit FAQs", detail: "Keep answers current", module: "faqs", icon: "?" },
            ].map((action) => (
              <Link className="admin-action-card" href={`/admin/${action.module}`} key={action.label}>
                <span>{action.icon}</span>
                <strong>{action.label}</strong>
                <small>{action.detail}</small>
              </Link>
            ))}
          </div>
        </div>

        <div className="admin-panel admin-guidance-panel">
          <span className="admin-guidance-icon">✦</span>
          <p className="admin-kicker">PUBLISH WITH CONFIDENCE</p>
          <h2>Keep every detail accurate.</h2>
          <p>Changes to published products, rental rates, FAQs, and service areas update the public site directly.</p>
          <Link className="admin-inline-link" href="/admin/settings">Review site settings <span aria-hidden="true">→</span></Link>
        </div>
      </section>

      <section className="admin-panel admin-module-overview">
        <div className="admin-panel-heading">
          <div><p className="admin-kicker">CONTENT WORKSPACE</p><h2>Manage your site</h2></div>
          <span className="admin-panel-caption">{Object.keys(adminModules).length} management areas</span>
        </div>
        <div className="admin-module-grid">
          {Object.values(adminModules).map((module) => (
            <Link href={`/admin/${module.key}`} className="admin-module-card" key={module.key}>
              <strong>{module.title}</strong>
              <span>{module.description}</span>
              <span className="admin-module-arrow" aria-hidden="true">↗</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
