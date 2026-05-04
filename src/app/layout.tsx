import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "OpenBy | Buy Timing Intelligence",
  description: "Electronics price intelligence with OpenBy Index scoring.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className="flex min-h-screen flex-col bg-slate-50 font-sans antialiased"
      >
        {children}
      </body>
    </html>
  );
}
