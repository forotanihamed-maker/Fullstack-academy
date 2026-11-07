// kind: "browser" = ادیتور زنده دارد | "concept" = فعلاً درس و پروژه‌ی دانلودی
export const stages = [
  ["html","HTML","browser"],["css","CSS","browser"],["javascript","JavaScript","browser"],
  ["async-js","جاوااسکریپت ناهمزمان","browser"],["api","API و ارتباط با بک‌اند","browser"],
  ["git","Git و GitHub","concept"],["react","React","browser"],["typescript","TypeScript","concept"],
  ["frontend-pro","فرانت‌اند حرفه‌ای","concept"],["nodejs","Node.js","concept"],["express","Express.js","concept"],
  ["database","پایگاه داده","concept"],["auth","احراز هویت و دسترسی","concept"],
  ["backend-pro","بک‌اند حرفه‌ای‌تر","concept"],["security","امنیت","concept"],["testing","تست‌نویسی","concept"],
  ["deployment","استقرار","concept"],["docker","Docker","concept"],["cicd","CI/CD","concept"],
].map(([slug,title,kind],i)=>({order:i+1,slug,title,kind}));
