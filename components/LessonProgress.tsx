"use client";
import { useEffect, useState } from "react";

const KEY = "fullstack-academy-progress-v1";

export default function LessonProgress({ lessonId }: { lessonId: string }) {
  const [done, setDone] = useState(false);

  useEffect(() => {
    try {
      const data = JSON.parse(localStorage.getItem(KEY) || "{}") as Record<string, boolean>;
      setDone(Boolean(data[lessonId]));
    } catch {}
  }, [lessonId]);

  function toggle() {
    const data = JSON.parse(localStorage.getItem(KEY) || "{}") as Record<string, boolean>;
    data[lessonId] = !done;
    localStorage.setItem(KEY, JSON.stringify(data));
    setDone(!done);
  }

  return (
    <div className="lesson-progress">
      <button type="button" className={done ? "completed" : ""} onClick={toggle} aria-pressed={done}>
        {done ? "✓ این درس را تمام کردم" : "○ علامت‌گذاری به‌عنوان تکمیل‌شده"}
      </button>
      <small>پیشرفت این بخش فعلاً روی همین دستگاه ذخیره می‌شود.</small>
    </div>
  );
}
