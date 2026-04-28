import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PrepaNextGen - Institut Technologique International",
  description: "Inspirer chaque enfant à devenir un innovateur. Institut technologique international dédié aux élèves de 7 à 18 ans à Abidjan, Côte d'Ivoire.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
