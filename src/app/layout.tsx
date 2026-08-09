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
    default: "ConfinementFinderSG — Find Your Perfect Confinement Centre",
    template: "%s",
  },
  description:
    "Compare verified confinement centres, nanny agencies, postnatal services and meal providers in Singapore.",
  icons: { icon: "/favicon.svg" },
  ...(SITE_IS_PRIVATE && {
    robots: {
      index: false,
      follow: false,
      nocache: true,
      googleBot: { index: false, follow: false, noimageindex: true },
    },
  }),
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-SG" className={poppins.variable}>
      <body style={{ fontFamily: "var(--font-poppins), Poppins, sans-serif" }}>{children}</body>
    </html>
  );
}
