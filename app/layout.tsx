import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BOESA — Biodiversity Outcomes of Eastern and Southern Africa",
  description:
    "Explore the groundbreaking research on biodiversity, forests, and seascapes across Eastern and Southern Africa. A landmark publication by leading conservation scientists.",
  keywords: ["biodiversity", "Africa", "conservation", "forests", "seascapes", "BOESA", "eastern Africa", "southern Africa"],
  openGraph: {
    title: "BOESA — Biodiversity Outcomes of Eastern and Southern Africa",
    description: "A landmark publication on Africa's rich natural heritage.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
