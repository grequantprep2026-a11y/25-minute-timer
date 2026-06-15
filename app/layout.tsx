import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "25 Minute Timer – Free Online Pomodoro Focus Timer",
  description:
    "Use our free 25-minute timer online. Perfect for Pomodoro technique, studying, working, or any focus session. No download required — start your 25 min timer instantly.",
  keywords: [
    "25 minute timer",
    "25 min timer",
    "pomodoro timer",
    "online timer 25 minutes",
    "focus timer",
    "study timer",
    "countdown timer 25 minutes",
    "free timer online",
  ],
  authors: [{ name: "FocusTimer" }],
  robots: "index, follow",
  openGraph: {
    title: "25 Minute Timer – Free Online Pomodoro Focus Timer",
    description:
      "Start your free 25-minute focus timer instantly. Perfect for Pomodoro sessions, deep work, and study sprints.",
    type: "website",
    url: "https://yourdomain.com",
    images: [
      {
        url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80",
        width: 1200,
        height: 630,
        alt: "25 Minute Focus Timer – Mountain lake background",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "25 Minute Timer – Free Online Focus Timer",
    description:
      "Start your free 25-minute Pomodoro timer. No signup, no download — focus instantly.",
    images: [
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80",
    ],
  },
  alternates: {
    canonical: "https://yourdomain.com",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Structured Data – SoftwareApplication */}
        <meta name="google-site-verification" content="fsuB0os2zhe1ez8vT85opTjmU4nqLdUZA4BLA1qBeTI" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "25 Minute Timer",
              url: "https://yourdomain.com",
              description:
                "A free online 25-minute countdown timer for Pomodoro focus sessions.",
              applicationCategory: "UtilitiesApplication",
              operatingSystem: "Any",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD",
              },
            }),
          }}
        />
        {/* FAQ Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: [
                {
                  "@type": "Question",
                  name: "What is a 25-minute timer used for?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "A 25-minute timer is most commonly used for the Pomodoro Technique — a time management method where you work for 25 minutes, then take a 5-minute break. It helps improve focus, reduce distractions, and boost productivity.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Does this 25-minute timer work without downloading anything?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Yes. This is a fully browser-based 25-minute timer. No app download or signup required — just click Start.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Will I hear an alarm when the 25 minutes are up?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Yes. An audio alert plays automatically when your 25-minute countdown reaches zero.",
                  },
                },
              ],
            }),
          }}
        />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}