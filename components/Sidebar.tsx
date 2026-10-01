"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function Sidebar({ sections }) {
  const path = decodeURIComponent(usePathname());
  const [open, setOpen] = useState(false);
  return (
    <>
      <button className="menu" onClick={() => setOpen(!open)}>☰ فهرست درس‌ها</button>
      <nav className={open ? "open" : ""}>
        {sections.map((s, i) =>
          s.ready ? (
            <Link key={s.slug} href={"/" + s.slug} className={path === "/" + s.slug ? "on" : ""} onClick={() => setOpen(false)}>
              <span className="n">{i}</span>{s.title}
            </Link>
          ) : (
            <span key={s.slug} className="soon"><span className="n">{i}</span>{s.title}</span>
          )
        )}
      </nav>
    </>
  );
}
