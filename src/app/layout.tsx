import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { SITE } from "@/lib/listings";
import { SITE_IS_PRIVATE } from "@/lib/site-config";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: {
    default: "Confinement Centres Singapore — Compare Verified Listings",
    template: "%s",
  },
  description:
    "Compare verified confinement centres, nanny agencies, postnatal services and meal providers in Singapore.",
  icons: { icon: "/favicon.svg" },
  // Inherited by every page. While private this is a noindex partner to
  // robots.txt; once public it states index/follow explicitly. That is the
  // crawler default either way, so this is a declaration of intent rather
  // than a behaviour change — it makes the directive visible in the markup
  // and to auditing tools instead of implied by its absence.
  //
  // Pages that must NOT be indexed override this locally (see not-found.tsx).
  robots: SITE_IS_PRIVATE
    ? {
        index: false,
        follow: false,
        nocache: true,
        googleBot: { index: false, follow: false, noimageindex: true },
      }
    : {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          // Let Google show full-length snippets and large image previews
          // rather than truncating them at its default discretion.
          "max-snippet": -1,
          "max-image-preview": "large",
          "max-video-preview": -1,
        },
      },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-SG" className={poppins.variable}>
      <body style={{ fontFamily: "var(--font-poppins), Poppins, sans-serif" }}>{children}</body>
    </html>
  );
}
