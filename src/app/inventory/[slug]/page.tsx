import { permanentRedirect } from "next/navigation";

export const instant = false;

type LegacyProductPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function LegacyProductPage({ params }: LegacyProductPageProps) {
  const { slug } = await params;
  permanentRedirect(`/${slug}`);
}
