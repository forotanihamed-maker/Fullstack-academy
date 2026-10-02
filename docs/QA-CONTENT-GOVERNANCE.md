# QUALITY ASSURANCE & CONTENT GOVERNANCE

## 1. Purpose

این سند معیار کنترل کیفیت پلتفرم و محتوای آن است.

---

# 2. Lesson QA

### Content
- [ ] عنوان واضح
- [ ] هدف مشخص
- [ ] prerequisite درست
- [ ] توضیح مرحله‌ای
- [ ] مثال
- [ ] exercise
- [ ] quiz
- [ ] summary
- [ ] next step

### Technical
- [ ] کد syntax صحیح دارد
- [ ] مثال قابل اجرا است
- [ ] playground قابل اجرا است
- [ ] خروجی مثال با توضیح منطبق است
- [ ] لینک‌ها سالم‌اند

### UX
- [ ] متن خوانا
- [ ] code block مناسب
- [ ] موبایل
- [ ] keyboard
- [ ] focus
- [ ] error state

---

# 3. Exercise QA

هر Exercise باید:
- یک هدف مشخص داشته باشد
- قابل حل باشد
- پاسخ قطعی یا معیار پذیرش مشخص داشته باشد
- hint داشته باشد
- feedback داشته باشد
- به skill مشخص متصل باشد

---

# 4. Quiz QA

- پاسخ صحیح دقیقاً تعریف شده
- explanation وجود دارد
- distractorها معقول‌اند
- سؤال مبهم نیست
- صرفاً حفظیات نیست

---

# 5. Project QA

- requirements مشخص
- milestone مشخص
- acceptance criteria
- starter state
- expected outcome
- extension ideas

---

# 6. Journey QA

هر milestone باید مشخص کند:

```text
What was learned?
What was built?
What changed from previous milestone?
What skill is required?
What is the next architectural step?
```

---

# 7. Code QA

برای هر release:

```bash
npm run lint
npm run typecheck
npm run build
npm run test
```

در صورت وجود:

```bash
npm run test:e2e
npm run content:validate
```

---

# 8. Offline QA

تست شود:

- بدون اینترنت صفحه اصلی باز می‌شود
- lessonها باز می‌شوند
- assetها local هستند
- playgroundهای offline اجرا می‌شوند
- progress local ذخیره می‌شود
- refresh progress را خراب نمی‌کند

---

# 9. Accessibility QA

- keyboard only
- tab order
- headings
- labels
- focus
- contrast
- reduced motion
- screen reader basics

---

# 10. Regression QA

هر تغییر در:

- LessonView
- Playground
- Exercise
- Quiz
- Sidebar
- content loader

باید روی چند lesson نماینده تست شود.

نماینده‌ها:

1. HTML
2. CSS
3. JavaScript
4. TypeScript
5. React
6. Backend

---

# 11. Content Versioning

Content باید version داشته باشد:

```text
contentVersion
schemaVersion
```

تغییر schema نباید محتوای قبلی را بی‌دلیل خراب کند.

---

# 12. Editorial Governance

هر محتوای جدید:

Draft
→ Technical Review
→ Educational Review
→ QA
→ Publish

---

# 13. No Hidden Dependencies

یک درس نباید به صورت مخفی به درس دیگری وابسته باشد.

Prerequisite باید explicit باشد.

---

# 14. No Orphan Content

هر lesson باید:

- module داشته باشد
- navigation داشته باشد
- skill mapping داشته باشد
- حداقل یک practice connection داشته باشد

هر project باید:
- prerequisite داشته باشد
- milestone داشته باشد
- به curriculum متصل باشد

---

# 15. Success Metrics

به جای صرفاً page views:

- lesson completion
- exercise pass rate
- quiz retry rate
- project milestone completion
- time-to-first-success
- number of completed projects
- journey completion
- return-to-practice rate

این metrics برای بهبود آموزشی هستند، نه صرفاً افزایش مصرف محتوا.
