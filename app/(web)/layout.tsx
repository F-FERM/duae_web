
import { Poppins } from "next/font/google";
import "../globals.css";
import type { Metadata } from "next";
import TopHeader from "../components/layout/TopHeader";
import Footer from "../components/layout/Footer";
import FloatingButtons from "../components/layout/FloatingButtons";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "WWD UAE",
  description: "Wood World Decor",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} bg-white`}>
        <TopHeader />
        {children}
        <Footer />
        <FloatingButtons />
      </body>
    </html>
  );
}
