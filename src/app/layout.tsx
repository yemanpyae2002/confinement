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
  // While private, every page carries a noindex tag as a belt-and-braces
  // partner to robots.txt. Once public the key is omitted entirely rather
  // than set to index/follow, since that is already the crawler default.
  ...(SITE_IS_PRIVATE
    ? {
        robots: {
          index: false,
          follow: false,
          nocache: true,
          googleBot: { index: false, follow: false, noimageindex: true },
        },
      }
    : {}),
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-SG" className={poppins.variable}>
      <body style={{ fontFamily: "var(--font-poppins), Poppins, sans-serif" }}>{children}</body>
    </html>
  );
}
