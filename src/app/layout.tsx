import type { Metadata } from "next";
import "./globals.css";
import Provider from "@/app/Provider";
import { Suspense } from "react";
import Nav from "@/components/UI/Nav";
import { Poppins } from "next/font/google";

export const metadata: Metadata = {
  title: "ArcERP",
  description: "ArcERP solutions",
};

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.className} antialiased relative`}>
        <Provider>
          <Suspense fallback={<p>Loading...</p>}>
            <Nav />
            {children}
          </Suspense>
        </Provider>
      </body>
    </html>
  );
}
