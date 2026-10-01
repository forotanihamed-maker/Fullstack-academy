import "./globals.css";
import Link from "next/link";
import { Vazirmatn } from "next/font/google";
import Sidebar from "../components/Sidebar";
import { getSections } from "../lib/content";

const font = Vazirmatn({ subsets: ["arabic", "latin"], display: "swap" });

export const metadata = { title: "آکادمی فول‌استک جاوااسکریپت", description: "جزوه و تمرین برای یادگیری وب" };

export default function RootLayout({ children }) {
  const sections = getSections();
  return (
    <html lang="fa" dir="rtl">
      <body className={font.className}>
        <header><Link href="/">آکادمی فول‌استک جاوااسکریپت</Link></header>
        <div className="shell">
          <Sidebar sections={sections} />
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}
