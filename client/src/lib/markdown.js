// ابزارهای کمکی مارک‌داون: شناسه‌ی Heading (با پشتیبانی از فارسی) و استخراج فهرست مطالب

// متن Heading را به شناسه‌ی قابل‌لینک تبدیل می‌کند: «۹.۱ برگرداندن تغییرات» → «۹۱-برگرداندن-تغییرات»
export function slugify(text) {
  const slug = text
    .trim()
    .toLowerCase()
    .replace(/[\u200c\u200e\u200f]/g, "") // نیم‌فاصله و علامت‌های جهت
    .replace(/[^\p{L}\p{N}\s-]/gu, "")    // فقط حرف، عدد، فاصله و خط تیره
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  return slug || "section";
}

// برای Headingهای تکراری پسوند -1، -2، ... اضافه می‌کند
export function createSlugger() {
  const used = new Map();

  return (text) => {
    const base = slugify(text);
    const count = used.get(base) ?? 0;
    used.set(base, count + 1);
    return count === 0 ? base : `${base}-${count}`;
  };
}

// علامت‌های درون‌خطی مارک‌داون را از متن Heading حذف می‌کند
// (محتوای داخل `...` دست‌نخورده می‌ماند؛ مثلاً `<template>` یک تگ HTML به حساب نمی‌آید)
export function stripInline(markdown) {
  const codeSpans = [];
  const protectedText = markdown.replace(/`([^`]*)`/g, (_, code) => {
    codeSpans.push(code);
    return `\u0000${codeSpans.length - 1}\u0000`;
  });

  return protectedText
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/(\*\*|__)(.+?)\1/g, "$2")
    .replace(/\*(.+?)\*/g, "$1")
    .replace(/(^|[^\w])_([^_]+)_(?=[^\w]|$)/g, "$1$2")
    .replace(/<[^>]+>/g, "")
    .replace(/\\([\\`*_{}[\]()#+\-.!])/g, "$1")
    .replace(/\u0000(\d+)\u0000/g, (_, i) => codeSpans[Number(i)])
    .trim();
}

// Headingهای یک متن مارک‌داون را به‌ترتیب برمی‌گرداند (Headingهای داخل بلوک کد نادیده گرفته می‌شوند)
export function extractHeadings(markdown) {
  const slug = createSlugger();
  const headings = [];
  let fence = null;

  for (const line of markdown.split(/\r?\n/)) {
    if (fence) {
      const close = new RegExp(`^\\s{0,3}\\${fence.char}{${fence.len},}\\s*$`);
      if (close.test(line)) fence = null;
      continue;
    }

    const open = /^\s{0,3}(`{3,}|~{3,})/.exec(line);
    if (open) {
      fence = { char: open[1][0], len: open[1].length };
      continue;
    }

    const match = /^(#{1,6})\s+(.+?)(?:\s+#+)?\s*$/.exec(line);
    if (match) {
      const text = stripInline(match[2]);
      headings.push({ level: match[1].length, text, id: slug(text) });
    }
  }

  return headings;
}

// کدام Headingها در فهرست کنار صفحه بیایند؟
// اگر درس با Heading سطح ۱ بخش‌بندی شده (مثل «# 1. عنوان»)، سطح ۱ و ۲؛ وگرنه سطح ۲ و ۳ (سطح ۱ فقط عنوان است)
export function selectTocHeadings(headings) {
  const h1Count = headings.filter((h) => h.level === 1).length;
  const minLevel = h1Count > 3 ? 1 : 2;
  const inRange = headings.filter((h) => h.level >= minLevel && h.level <= minLevel + 1);

  return inRange.length > 60 ? inRange.filter((h) => h.level === minLevel) : inRange;
}

// افزونه‌ی remark: به i-امین Heading متن، شناسه‌ی i-امین آیتم فهرست را می‌دهد
// (فهرست و شناسه‌ها از یک منبع می‌آیند، پس همیشه با هم هماهنگ‌اند)
export function remarkHeadingIds(headings) {
  return (tree) => {
    let index = 0;

    (function walk(node) {
      if (node.type === "heading") {
        const heading = headings[index++];
        if (heading) {
          node.data = {
            ...node.data,
            hProperties: { ...node.data?.hProperties, id: heading.id },
          };
        }
      }
      node.children?.forEach(walk);
    })(tree);
  };
}
