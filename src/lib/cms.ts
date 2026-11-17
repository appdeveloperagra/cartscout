import "server-only";

import { connection } from "next/server";
import inventory from "@/data/products.json";
import { faqs, type FAQItem } from "@/lib/faqs";
import { provinces, type Province } from "@/lib/provinces";
import { rentalFaqs, rentalRates, type RentalRate } from "@/lib/rentals";
import { createSupabasePublicClient } from "@/lib/supabase/public";
import type { CatalogProduct } from "@/lib/products";
import {
  contactEmail,
  contactPhone,
  contactPhoneDisplay,
} from "@/lib/contact";

export type PublicContactSettings = {
  email: string;
  phone: string;
  phone_display: string;
  address: string[];
  phone_href: string;
  whatsapp_href: string;
};

const fallbackContactSettings: PublicContactSettings = {
  email: contactEmail,
  phone: contactPhone,
  phone_display: contactPhoneDisplay,
  address: [
    "135 Rivonia Road",
    "Sandton (Sandown / Central Sandton)",
    "City of Johannesburg Metropolitan Municipality",
    "Gauteng",
    "2196",
    "South Africa",
  ],
  phone_href: `tel:${contactPhone}`,
  whatsapp_href: `https://wa.me/${contactPhone.replace(/\D/g, "")}`,
};

export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  body_markdown: string;
  featured_image_url: string | null;
  status: "draft" | "scheduled" | "published" | "archived";
  published_at: string | null;
  seo_title: string | null;
  seo_description: string | null;
  created_at: string;
  updated_at: string;
};

function throwQueryError(operation: string, message: string): never {
  throw new Error(`Failed to ${operation}: ${message}`);
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((line): line is string => typeof line === "string");
}

function getFallbackProducts(): CatalogProduct[] {
  return (inventory.products as CatalogProduct[]).map((product) => ({
    ...product,
    slug: `${product.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}-${product.id}`,
    description: "",
    imageGallery: [],
    seoTitle: null,
    seoDescription: null,
  }));
}

function mapPublicProduct(product: {
  id: string;
  source_product_id: number | null;
  slug: string;
  name: string;
  description: string;
  price_zar: number;
  source_url: string | null;
  image_url: string | null;
  image_gallery: unknown;
  in_stock: boolean;
  seo_title: string | null;
  seo_description: string | null;
}): CatalogProduct {
  return {
    id: product.source_product_id ?? product.id,
    slug: product.slug,
    name: product.name,
    description: product.description,
    price: Number(product.price_zar),
    currency: "ZAR",
    url: product.source_url ?? "",
    imageUrl: product.image_url,
    imageGallery: isStringArray(product.image_gallery) ? product.image_gallery : [],
    inStock: product.in_stock,
    seoTitle: product.seo_title,
    seoDescription: product.seo_description,
  };
}

export async function getPublicContactSettings(): Promise<PublicContactSettings> {
  const client = createSupabasePublicClient();
  if (!client) return fallbackContactSettings;

  await connection();
  const { data, error } = await client
    .from("site_settings")
    .select("value")
    .eq("key", "public_contact")
    .eq("is_public", true)
    .maybeSingle();

  if (error) throwQueryError("load contact settings", error.message);
  if (!data) return fallbackContactSettings;

  if (!data.value || typeof data.value !== "object" || Array.isArray(data.value)) {
    throwQueryError("load contact settings", "The public_contact setting must be a JSON object.");
  }
  const value = data.value as Record<string, unknown>;
  if (
    typeof value.email !== "string" ||
    !value.email.trim().includes("@") ||
    typeof value.phone !== "string" ||
    typeof value.phone_display !== "string" ||
    !value.phone_display.trim() ||
    !isStringArray(value.address)
  ) {
    throwQueryError("load contact settings", "The public_contact setting is invalid.");
  }

  const phone = value.phone.trim();
  const digits = phone.replace(/\D/g, "");
  if (!digits) throwQueryError("load contact settings", "The public phone number is invalid.");

  return {
    email: value.email.trim(),
    phone,
    phone_display: value.phone_display.trim(),
    address: value.address,
    phone_href: `tel:${phone.replace(/[^\d+]/g, "")}`,
    whatsapp_href: `https://wa.me/${digits}`,
  };
}

export async function getPublicProducts(): Promise<CatalogProduct[]> {
  const client = createSupabasePublicClient();
  if (!client) return getFallbackProducts();

  await connection();
  const { data, error } = await client
    .from("products")
    .select("id, source_product_id, slug, name, description, price_zar, source_url, image_url, image_gallery, in_stock, seo_title, seo_description")
    .eq("is_published", true)
    .order("is_featured", { ascending: false })
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) throwQueryError("load the catalogue", error.message);
  if (!data) throwQueryError("load the catalogue", "The database returned no result.");

  return data.map(mapPublicProduct);
}

export async function getPublicProduct(slug: string): Promise<CatalogProduct | null> {
  const client = createSupabasePublicClient();
  if (!client) return getFallbackProducts().find((product) => product.slug === slug) ?? null;

  await connection();
  const { data, error } = await client
    .from("products")
    .select("id, source_product_id, slug, name, description, price_zar, source_url, image_url, image_gallery, in_stock, seo_title, seo_description")
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();

  if (error) throwQueryError("load the product", error.message);
  return data ? mapPublicProduct(data) : null;
}

export async function getPublicFaqs(category: "general" | "rental" = "general"): Promise<FAQItem[]> {
  const client = createSupabasePublicClient();
  if (!client) return category === "rental" ? rentalFaqs : faqs;

  await connection();
  const { data, error } = await client
    .from("faqs")
    .select("id, question, answer, category, display_order")
    .eq("category", category)
    .eq("is_published", true)
    .order("display_order", { ascending: true });

  if (error) throwQueryError("load FAQs", error.message);
  if (!data) throwQueryError("load FAQs", "The database returned no result.");
  return data;
}

export async function getPublicRentalRates(): Promise<RentalRate[]> {
  const client = createSupabasePublicClient();
  if (!client) return rentalRates;

  await connection();
  const { data, error } = await client
    .from("rental_rates")
    .select("id, name, passenger_capacity, daily_price_zar, weekly_price_zar, monthly_price_zar, includes_delivery, is_published, display_order")
    .eq("is_published", true)
    .order("display_order", { ascending: true });

  if (error) throwQueryError("load rental rates", error.message);
  if (!data) throwQueryError("load rental rates", "The database returned no result.");
  return data.map((rate) => ({
    ...rate,
    daily_price_zar: Number(rate.daily_price_zar),
    weekly_price_zar: Number(rate.weekly_price_zar),
    monthly_price_zar: Number(rate.monthly_price_zar),
  }));
}

export async function getPublicServiceAreas(): Promise<Province[]> {
  const client = createSupabasePublicClient();
  if (!client) return provinces;

  await connection();
  const { data, error } = await client
    .from("service_areas")
    .select("slug, name, towns, overview, use_cases, considerations")
    .eq("is_published", true)
    .order("display_order", { ascending: true });

  if (error) throwQueryError("load service areas", error.message);
  if (!data) throwQueryError("load service areas", "The database returned no result.");
  return data.map((area) => ({
    slug: area.slug,
    name: area.name,
    towns: area.towns as string[],
    overview: area.overview,
    useCases: area.use_cases as string[],
    considerations: area.considerations,
  }));
}

export async function getPublishedBlogPosts(): Promise<BlogPost[]> {
  const client = createSupabasePublicClient();
  if (!client) return [];

  await connection();
  const { data, error } = await client
    .from("blog_posts")
    .select("id, title, slug, excerpt, body_markdown, featured_image_url, status, published_at, seo_title, seo_description, created_at, updated_at")
    .eq("status", "published")
    .lte("published_at", new Date().toISOString())
    .order("published_at", { ascending: false });

  if (error) throwQueryError("load blog posts", error.message);
  if (!data) throwQueryError("load blog posts", "The database returned no result.");
  return data;
}

export async function getPublishedBlogPost(slug: string): Promise<BlogPost | null> {
  const client = createSupabasePublicClient();
  if (!client) return null;

  await connection();
  const { data, error } = await client
    .from("blog_posts")
    .select("id, title, slug, excerpt, body_markdown, featured_image_url, status, published_at, seo_title, seo_description, created_at, updated_at")
    .eq("slug", slug)
    .eq("status", "published")
    .lte("published_at", new Date().toISOString())
    .maybeSingle();

  if (error) throwQueryError("load the blog post", error.message);
  return data;
}
