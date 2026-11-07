import { useMemo, useSyncExternalStore } from "react";

// پیشرفت یادگیری در localStorage ذخیره می‌شود (بدون نیاز به ثبت‌نام)
const KEY = "fs-progress:v1";
const EVENT = "fs-progress-change";
const GROUPS = ["lessons", "exercises", "projects"];

function parse(raw) {
  let data = {};
  try {
    data = raw ? JSON.parse(raw) : {};
  } catch {
    data = {};
  }

  const clean = {};
  for (const group of GROUPS) {
    const value = data?.[group];
    clean[group] = value && typeof value === "object" && !Array.isArray(value) ? value : {};
  }
  return clean;
}

function getSnapshot() {
  try {
    return localStorage.getItem(KEY) ?? "";
  } catch {
    return "";
  }
}

function subscribe(callback) {
  window.addEventListener(EVENT, callback);
  window.addEventListener("storage", callback); // تغییر در تب دیگر
  return () => {
    window.removeEventListener(EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

function update(group, id, value) {
  const next = parse(getSnapshot());

  if (value) next[group][id] = true;
  else delete next[group][id];

  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* ذخیره نشد؛ برنامه ادامه می‌دهد */
  }
  window.dispatchEvent(new Event(EVENT));
}

// Hook: هر Component که از آن استفاده کند، با تغییر پیشرفت دوباره رندر می‌شود
export function useProgress() {
  const raw = useSyncExternalStore(subscribe, getSnapshot, () => "");
  return useMemo(() => parse(raw), [raw]);
}

export const toggleLesson = (file, value) => update("lessons", file, value);
export const toggleProject = (file, value) => update("projects", file, value);
export const markExerciseSolved = (id) => update("exercises", id, true);

// کلید قدیمی (solved:ID) را هم می‌شناسیم تا تمرین‌های حل‌شده‌ی قبلی از دست نروند
function legacySolved(id) {
  try {
    return localStorage.getItem(`solved:${id}`) === "1";
  } catch {
    return false;
  }
}

export const isExerciseSolved = (progress, id) => progress.exercises[id] === true || legacySolved(id);
