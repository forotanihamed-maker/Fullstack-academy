import Link from "next/link";

export default function NotFound() {
  return (
    <section className="card">
      <h1>صفحه پیدا نشد</h1>
      <p>صفحه‌ای که دنبال آن هستید وجود ندارد یا آدرس آن تغییر کرده است.</p>
      <p><Link href="/">← بازگشت به صفحه اصلی</Link></p>
    </section>
  );
}
