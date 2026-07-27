import { Poppins } from "next/font/google";
import "../globals.css";
import type { Metadata } from "next";
import TopHeader from "../components/layout/TopHeader";
import Footer from "../components/layout/Footer";

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
      <body className={`${poppins.variable} font-sans bg-white`}>
        <TopHeader />
        {children}
        <Footer />
      </body>
    </html>
  );
}
