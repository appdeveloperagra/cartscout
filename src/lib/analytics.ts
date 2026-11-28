export function trackEvent(
  event: string,
  parameters: Record<string, string | number | boolean> = {},
) {
  if (typeof window === "undefined") return;
  const dataLayer = (window as typeof window & {
    dataLayer?: Array<Record<string, unknown>>;
  }).dataLayer;
  if (!dataLayer) return;
  dataLayer.push({ event, ...parameters });
}
