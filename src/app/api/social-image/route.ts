import { createElement } from "react";
import { ImageResponse } from "next/og";
import SocialImage from "@/components/social-image";

export function GET() {
  return new ImageResponse(createElement(SocialImage), {
    width: 1200,
    height: 630,
  });
}
