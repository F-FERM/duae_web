import { Poppins } from "next/font/google";
import type { Metadata } from "next";
import "../globals.css";
import AdminShell from "./AdminShell";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Admin | WWD UAE",
  description: "Admin panel for content management",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} font-sans text-slate-900`}>
        <AdminShell>{children}</AdminShell>
      </body>
    </html>
  );
}
