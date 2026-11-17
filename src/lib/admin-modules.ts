export type AdminFieldType =
  | "text"
  | "image"
  | "gallery"
  | "textarea"
  | "number"
  | "date"
  | "datetime-local"
  | "boolean"
  | "select"
  | "json"
  | "relation";

export type AdminField = {
  name: string;
  label: string;
  type: AdminFieldType;
  required?: boolean;
  nullable?: boolean;
  step?: string;
  defaultValue?: string | number | boolean;
  options?: { label: string; value: string }[];
  relatedTable?: string;
  relatedValue?: string;
  relatedLabel?: string;
  helpText?: string;
};

export type AdminModule = {
  key: string;
  title: string;
  description: string;
  table: string;
  primaryKey: string[];
  orderBy: string;
  orderAscending?: boolean;
  columns: string[];
  fields: AdminField[];
  canCreate?: boolean;
  canDelete?: boolean;
  notice?: string;
};

export const adminModules: Record<string, AdminModule> = {
  products: {
    key: "products",
    title: "Products",
    description: "Manage catalogue details, whole-rand prices, stock, and publishing.",
    table: "products",
    primaryKey: ["id"],
    orderBy: "display_order",
    columns: ["name", "price_zar", "in_stock", "is_published"],
    fields: [
      { name: "source_product_id", label: "Source product ID", type: "number", step: "1", nullable: true },
      { name: "slug", label: "URL slug", type: "text", required: true },
      { name: "name", label: "Product name", type: "text", required: true },
      { name: "description", label: "Description", type: "textarea" },
      { name: "seo_title", label: "SEO title", type: "text", nullable: true },
      { name: "seo_description", label: "SEO description", type: "textarea", nullable: true },
      { name: "price_zar", label: "Price (ZAR, whole rand)", type: "number", step: "1", required: true },
      { name: "source_price", label: "Source price", type: "number", step: "0.01", nullable: true },
      { name: "source_currency", label: "Source currency", type: "text", nullable: true },
      { name: "exchange_rate_zar_per_unit", label: "Exchange rate", type: "number", step: "0.000001", nullable: true },
      { name: "exchange_rate_as_of", label: "Exchange rate date", type: "date", nullable: true },
      { name: "source_url", label: "Source product URL", type: "text", nullable: true },
      { name: "image_url", label: "Featured image", type: "image", nullable: true, helpText: "Upload an image or enter its public image URL. A featured image is required before publishing." },
      { name: "image_gallery", label: "Product gallery", type: "gallery", helpText: "Upload up to 12 images. Uncheck an image to remove it from this product." },
      { name: "in_stock", label: "In stock", type: "boolean", defaultValue: true },
      { name: "is_published", label: "Published", type: "boolean", defaultValue: false },
      { name: "is_featured", label: "Featured", type: "boolean" },
      { name: "display_order", label: "Display order", type: "number", step: "1", defaultValue: 0 },
    ],
  },
  "product-categories": {
    key: "product-categories",
    title: "Product categories",
    description: "Create and organize catalogue categories.",
    table: "product_categories",
    primaryKey: ["id"],
    orderBy: "display_order",
    columns: ["name", "slug", "is_active"],
    fields: [
      { name: "name", label: "Category name", type: "text", required: true },
      { name: "slug", label: "URL slug", type: "text", required: true },
      { name: "description", label: "Description", type: "textarea" },
      { name: "display_order", label: "Display order", type: "number", step: "1", defaultValue: 0 },
      { name: "is_active", label: "Active", type: "boolean", defaultValue: true },
    ],
  },
  "product-categorization": {
    key: "product-categorization",
    title: "Product assignments",
    description: "Assign products to catalogue categories.",
    table: "product_category_assignments",
    primaryKey: ["product_id", "category_id"],
    orderBy: "created_at",
    columns: ["product_id", "category_id"],
    fields: [
      { name: "product_id", label: "Product", type: "relation", required: true, relatedTable: "products", relatedValue: "id", relatedLabel: "name" },
      { name: "category_id", label: "Category", type: "relation", required: true, relatedTable: "product_categories", relatedValue: "id", relatedLabel: "name" },
    ],
  },
  "blog-posts": {
    key: "blog-posts",
    title: "Posts",
    description: "Write, schedule, publish, and optimize articles.",
    table: "blog_posts",
    primaryKey: ["id"],
    orderBy: "updated_at",
    orderAscending: false,
    columns: ["title", "status", "published_at"],
    fields: [
      { name: "title", label: "Article title", type: "text", required: true },
      { name: "slug", label: "URL slug", type: "text", required: true },
      { name: "category_id", label: "Category", type: "relation", nullable: true, relatedTable: "blog_categories", relatedValue: "id", relatedLabel: "name" },
      { name: "excerpt", label: "Excerpt", type: "textarea" },
      { name: "body_markdown", label: "Article content (Markdown)", type: "textarea" },
      { name: "featured_image_url", label: "Featured image", type: "image", nullable: true },
      { name: "status", label: "Publication status", type: "select", required: true, defaultValue: "draft", options: [
        { label: "Draft", value: "draft" },
        { label: "Scheduled", value: "scheduled" },
        { label: "Published", value: "published" },
        { label: "Archived", value: "archived" },
      ] },
      { name: "published_at", label: "Publication date and time", type: "datetime-local", nullable: true },
      { name: "seo_title", label: "SEO title", type: "text", nullable: true },
      { name: "seo_description", label: "SEO description", type: "textarea", nullable: true },
    ],
  },
  "blog-categories": {
    key: "blog-categories",
    title: "Blog categories",
    description: "Organize published articles.",
    table: "blog_categories",
    primaryKey: ["id"],
    orderBy: "name",
    columns: ["name", "slug", "is_active"],
    fields: [
      { name: "name", label: "Category name", type: "text", required: true },
      { name: "slug", label: "URL slug", type: "text", required: true },
      { name: "description", label: "Description", type: "textarea" },
      { name: "is_active", label: "Active", type: "boolean", defaultValue: true },
    ],
  },
  "blog-tags": {
    key: "blog-tags",
    title: "Blog tags",
    description: "Manage discoverability tags for articles.",
    table: "blog_tags",
    primaryKey: ["id"],
    orderBy: "name",
    columns: ["name", "slug", "is_active"],
    fields: [
      { name: "name", label: "Tag name", type: "text", required: true },
      { name: "slug", label: "URL slug", type: "text", required: true },
      { name: "is_active", label: "Active", type: "boolean", defaultValue: true },
    ],
  },
  "blog-tag-assignments": {
    key: "blog-tag-assignments",
    title: "Tag posts",
    description: "Connect tags to blog articles.",
    table: "blog_post_tags",
    primaryKey: ["post_id", "tag_id"],
    orderBy: "post_id",
    columns: ["post_id", "tag_id"],
    fields: [
      { name: "post_id", label: "Article", type: "relation", required: true, relatedTable: "blog_posts", relatedValue: "id", relatedLabel: "title" },
      { name: "tag_id", label: "Tag", type: "relation", required: true, relatedTable: "blog_tags", relatedValue: "id", relatedLabel: "name" },
    ],
  },
  faqs: {
    key: "faqs",
    title: "FAQs",
    description: "Manage customer questions and answers on the public site.",
    table: "faqs",
    primaryKey: ["id"],
    orderBy: "display_order",
    columns: ["question", "category", "is_published"],
    fields: [
      { name: "question", label: "Question", type: "text", required: true },
      { name: "answer", label: "Answer", type: "textarea", required: true },
      { name: "category", label: "Section", type: "select", required: true, defaultValue: "general", options: [
        { label: "General", value: "general" },
        { label: "Rental", value: "rental" },
      ] },
      { name: "display_order", label: "Display order", type: "number", step: "1", defaultValue: 0 },
      { name: "is_published", label: "Published", type: "boolean", defaultValue: true },
    ],
  },
  "rental-rates": {
    key: "rental-rates",
    title: "Rental rates",
    description: "Set daily, weekly, and monthly South African rand rates.",
    table: "rental_rates",
    primaryKey: ["id"],
    orderBy: "display_order",
    columns: ["name", "daily_price_zar", "weekly_price_zar", "monthly_price_zar", "is_published"],
    fields: [
      { name: "name", label: "Vehicle type", type: "text", required: true },
      { name: "passenger_capacity", label: "Passenger capacity", type: "number", step: "1", nullable: true },
      { name: "daily_price_zar", label: "Daily rate (ZAR)", type: "number", step: "1", required: true },
      { name: "weekly_price_zar", label: "Weekly rate (ZAR)", type: "number", step: "1", required: true },
      { name: "monthly_price_zar", label: "Monthly rate (ZAR)", type: "number", step: "1", required: true },
      { name: "includes_delivery", label: "Includes delivery", type: "boolean" },
      { name: "is_published", label: "Published", type: "boolean", defaultValue: true },
      { name: "display_order", label: "Display order", type: "number", step: "1", defaultValue: 0 },
    ],
  },
  locations: {
    key: "locations",
    title: "Service areas",
    description: "Manage location pages, towns, and local guidance.",
    table: "service_areas",
    primaryKey: ["id"],
    orderBy: "display_order",
    columns: ["name", "slug", "is_published"],
    fields: [
      { name: "name", label: "Province or region name", type: "text", required: true },
      { name: "slug", label: "URL slug", type: "text", required: true },
      { name: "towns", label: "Towns (JSON array)", type: "json", required: true, defaultValue: "[]" },
      { name: "overview", label: "Overview", type: "textarea", required: true },
      { name: "use_cases", label: "Use cases (JSON array)", type: "json", required: true, defaultValue: "[]" },
      { name: "considerations", label: "Local considerations", type: "textarea", required: true },
      { name: "is_published", label: "Published", type: "boolean", defaultValue: true },
      { name: "display_order", label: "Display order", type: "number", step: "1", defaultValue: 0 },
    ],
  },
  settings: {
    key: "settings",
    title: "Site settings",
    description: "Manage public contact details and other site configuration.",
    table: "site_settings",
    primaryKey: ["key"],
    orderBy: "key",
    columns: ["key", "is_public", "updated_at"],
    fields: [
      { name: "key", label: "Setting key", type: "text", required: true },
      { name: "value", label: "Setting value (JSON)", type: "json", required: true, defaultValue: "{}", helpText: "For public_contact, provide email, phone, phone_display, and address (a JSON array of address lines)." },
      { name: "is_public", label: "Available to public pages", type: "boolean" },
    ],
  },
};

type AdminNavLink = { key: string; label: string; href: string };
type AdminNavGroup = { key: string; label: string; items: AdminNavLink[] };

export const adminNavigation: (AdminNavLink | AdminNavGroup)[] = [
  { key: "overview", label: "Overview", href: "/admin" },
  {
    key: "catalogue",
    label: "Catalogue",
    items: [
      { key: "products", label: "Products", href: "/admin/products" },
      { key: "product-categories", label: "Categories", href: "/admin/product-categories" },
      { key: "product-categorization", label: "Product assignments", href: "/admin/product-categorization" },
    ],
  },
  {
    key: "blog-management",
    label: "Blog management",
    items: [
      { key: "blog", label: "Overview", href: "/admin/blog" },
      { key: "blog-posts", label: "Posts", href: "/admin/blog-posts" },
      { key: "blog-categories", label: "Categories", href: "/admin/blog-categories" },
      { key: "blog-tags", label: "Tags", href: "/admin/blog-tags" },
    ],
  },
  {
    key: "operations",
    label: "Operations",
    items: [
      { key: "rental-rates", label: "Rental rates", href: "/admin/rental-rates" },
      { key: "locations", label: "Service areas", href: "/admin/locations" },
      { key: "faqs", label: "FAQs", href: "/admin/faqs" },
    ],
  },
  {
    key: "administration",
    label: "Administration",
    items: [
      { key: "settings", label: "Site settings", href: "/admin/settings" },
      { key: "admins", label: "Admin access", href: "/admin/admins" },
    ],
  },
];
