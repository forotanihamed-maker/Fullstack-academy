"use client";
import { FormEvent, useState } from "react";
import Link from "next/link";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [success, setSuccess] = useState(false);
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault(); setBusy(true); setMessage("");
    try {
      const response = await fetch("/api/auth/register", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, email, password }) });
      const data: { message: string } = await response.json();
      setMessage(data.message); setSuccess(response.ok);
      if (response.ok) { setName(""); setEmail(""); setPassword(""); }
    } catch { setMessage("ارتباط با سرور برقرار نشد."); setSuccess(false); }
    finally { setBusy(false); }
  }
  return <section className="card auth-card"><h1>ایجاد حساب کاربری</h1><p>برای ذخیره‌ی مسیر یادگیری، حساب بساز.</p><form onSubmit={submit} className="auth-form"><label>نام<input autoComplete="name" required minLength={2} maxLength={80} value={name} onChange={e=>setName(e.target.value)} /></label><label>ایمیل<input type="email" autoComplete="email" required value={email} onChange={e=>setEmail(e.target.value)} dir="ltr" /></label><label>رمز عبور<input type="password" autoComplete="new-password" required minLength={8} maxLength={128} value={password} onChange={e=>setPassword(e.target.value)} dir="ltr" /><small>حداقل ۸ کاراکتر</small></label><button className="run" disabled={busy}>{busy?"در حال ثبت‌نام…":"ثبت‌نام"}</button>{message&&<p role="status" className={success?"auth-success":"auth-error"}>{message}</p>}</form><p><Link href="/">بازگشت به صفحه‌ی اصلی</Link></p></section>;
}
