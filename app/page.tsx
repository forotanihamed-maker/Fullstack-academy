import Link from "next/link";
import { getSections } from "../lib/content";

export default function Home() {
  const sections = getSections();
  const ready = sections.filter((s) => s.ready);
  return (
    <div className="card">
      <h1>از صفر تا Full-Stack با TypeScript</h1>
      <p>مسیر یادگیری در {sections.length} بخش؛ هر بخش جزوه، کوییز و در صورت امکان تمرین کد دارد.</p>
      <h2>درس‌های آماده</h2>
      <ul>{ready.map((s) => (<li key={s.slug}><Link href={"/" + s.slug}>{s.title}</Link></li>))}</ul>
    </div>
  );
}
