import { Poppins } from "next/font/google";
import type { Metadata } from "next";
import "../globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Admin Login | WWD UAE",
  description: "Login to the admin panel",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${poppins.variable} font-sans bg-[#f3f4f6] text-slate-900`}
      >
        {children}
      </body>
    </html>
  );
}
