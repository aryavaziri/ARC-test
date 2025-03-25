import type { Metadata } from "next";
import "./globals.css";
import Provider from "@/app/Provider";
import { Suspense } from "react";
import Nav from "@/components/UI/Nav";
import { Jost } from "next/font/google";
import ToastWrapper from "./ToastWrapper";

export const metadata: Metadata = {
  title: "ARCerp",
  description: "",
};

const jost = Jost({
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${jost.className} antialiased`} >
        <Provider>
          <ToastWrapper />
          <Suspense fallback={<p>Loading...</p>}>
            <Nav />
            {children}
            {/* <Footer /> */}
          </Suspense>
        </Provider>
      </body>
    </html>
  );
}
