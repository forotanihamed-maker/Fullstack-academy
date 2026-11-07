# Git و GitHub — کنترل نسخه برای پروژه‌هایت

> **مرحله ۶ از مسیر فول‌استک — Git و GitHub**  
> مباحث این فصل: Version Control، Repository، سه ناحیه‌ی Git، Commit، Branch، Merge و Conflict، Remote، Push / Pull / Fetch، `.gitignore`، برگرداندن تغییرات، GitHub، Pull Request، Stash، Rebase، Tag، README  
> پیش‌نیاز: کار با Terminal در حد اجرای دستور  
> زمان پیشنهادی: ۵ تا ۷ روز

---

## هدف فصل

تا حالا پروژه‌هایت فقط روی کامپیوتر خودت بوده‌اند و تاریخچه‌شان به «کپی پوشه با اسم‌های جدید» خلاصه می‌شود. در کار حرفه‌ای هیچ کس این‌طور کار نمی‌کند. **Git** تاریخچه‌ی کامل پروژه را نگه می‌دارد، اجازه می‌دهد هر زمان به نسخه‌ی قبلی برگردی، چند کار را موازی پیش ببری و با دیگران همکاری کنی. **GitHub** هم جایی است که پروژه‌هایت را آنلاین نگه می‌داری و به دیگران (و کارفرماها) نشان می‌دهی.

بعد از این فصل باید بتوانی:

- توضیح بدهی Git چیست و چه فرقی با GitHub دارد
- Git را نصب و تنظیم کنی
- سه ناحیه‌ی Git (Working Directory، Staging Area، Repository) را بشناسی
- Commit بسازی و تاریخچه را بخوانی
- `.gitignore` بنویسی و از Commit شدن چیزهای خطرناک جلوگیری کنی
- تغییرات را با `restore`، `reset`، `revert` و `reflog` ایمن برگردانی
- با Branch کار کنی، Merge انجام بدهی و Conflict را حل کنی
- پروژه را روی GitHub بگذاری (Push) و از آنجا بگیری (Clone و Pull)
- با Pull Request کار کنی و جریان کار تیمی GitHub Flow را بدانی
- `stash`، `rebase` و `tag` را در حد پایه بشناسی
- یک README خوب برای پروژه بنویسی
- خطاهای رایج Git را بفهمی و رفع کنی

> **یک قاعده برای یادگیری Git:** فقط خواندن کافی نیست. هر دستور را در یک پوشه‌ی آزمایشی خودت اجرا کن؛ Git را فقط با تکرار یاد می‌گیری و ترس از آن با کار کردن از بین می‌رود.

---

# 1. Version Control چیست؟

فرض کن روی یک پروژه کار می‌کنی و چنین پوشه‌هایی داری:

```text
site/
site-final/
site-final-v2/
site-final-v2-REAL/
site-final-v2-REAL-fixed/
```

مشکل‌ها:

- نمی‌دانی هر نسخه دقیقاً چه فرقی با قبلی دارد
- اگر باگی بعد از چند روز پیدا شود، نمی‌دانی از کجا شروع شد
- اگر کسی دیگر هم روی پروژه کار کند، فایل‌ها قاطی می‌شوند
- بازگشت به نسخه‌ی خوب قبلی سخت یا ناممکن است

**Version Control System (VCS)** ابزاری است که تغییرات فایل‌ها را در طول زمان ثبت می‌کند. **Git** محبوب‌ترین VCS دنیا است.

چهار مزیت اصلی:

```text
۱) تاریخچه: هر تغییر ثبت می‌شود (چه کسی، چه زمانی، چرا)
۲) بازگشت: می‌توانی به هر نقطه‌ی قبلی برگردی
۳) کار موازی: چند قابلیت را همزمان (در Branchهای جدا) پیش ببری
۴) همکاری: چند نفر روی یک پروژه کار کنند بدون خراب کردن کار هم
```

Git **توزیع‌شده** (Distributed) است: هر کس یک کپی کامل از تاریخچه‌ی پروژه را روی کامپیوتر خودش دارد. پس بدون اینترنت هم می‌توانی Commit بسازی و تاریخچه را ببینی.

---

# 2. Git در برابر GitHub

این دو اغلب با هم اشتباه گرفته می‌شوند:

| | Git | GitHub |
|---|-----|--------|
| چیست؟ | یک **ابزار** (برنامه) روی کامپیوتر | یک **سرویس آنلاین** برای نگه‌داری Repositoryها |
| کجا کار می‌کند؟ | محلی (Local) | روی اینترنت |
| کارش | ثبت تاریخچه، Branch، Merge | میزبانی کد، Pull Request، Issue، همکاری، نمایش پروژه |
| بدون دیگری کار می‌کند؟ | بله | نه (بدون Git معنی ندارد) |

تشبیه: Git مثل برنامه‌ی ویرایش و ذخیره‌ی فایل است، GitHub مثل Google Drive یا Dropbox ولی مخصوص کد.

جایگزین‌های GitHub: **GitLab** و **Bitbucket**. مفاهیم این فصل در همه‌ی آن‌ها یکی است؛ فقط ظاهر و بعضی امکانات فرق دارد.

---

# 3. نصب و پیکربندی اولیه

**نصب:** از سایت رسمی `git-scm.com` نصاب مخصوص سیستم‌عامل را بگیر. در ویندوز با نصب **Git for Windows** علاوه بر دستور `git`، یک Terminal به نام **Git Bash** هم نصب می‌شود. (می‌توانی از PowerShell هم استفاده کنی.)

بررسی نصب (بعد از نصب Terminal را ببند و دوباره باز کن):

```bash
git --version
```

```text
git version 2.43.0
```

(شماره‌ی نسخه‌ی تو ممکن است فرق کند.)

**تنظیم هویت (یک بار برای همیشه):** هر Commit نام و ایمیل سازنده‌اش را دارد:

```bash
git config --global user.name "Your Name"
git config --global user.email "you@example.com"
```

اگر این کار را نکنی، اولین `commit` این خطا را می‌دهد:

```text
Author identity unknown

*** Please tell me who you are.
```

ایمیلی که به GitHub می‌دهی، همان را اینجا بنویس تا Commitها به حساب تو وصل شوند.

**تنظیمات مفید:**

```bash
# نام Branch پیش‌فرض برای Repositoryهای جدید
git config --global init.defaultBranch main

# ویرایشگر پیش‌فرض (VS Code)
git config --global core.editor "code --wait"

# دیدن همه‌ی تنظیمات
git config --list
```

> `--global` یعنی تنظیم برای همه‌ی پروژه‌های این کاربر. بدون آن، تنظیم فقط برای همان Repository است.

---

# 4. سه ناحیه‌ی Git

مهم‌ترین مدل ذهنی Git:

```text
Working Directory      Staging Area (Index)        Repository (.git)
(پوشه‌ی کار)           (صحنه‌ی آماده‌سازی)           (تاریخچه)

 فایل‌هایی که          تغییراتی که برای            Commitهای ثبت‌شده
 ویرایش می‌کنی         Commit بعدی انتخاب کرده‌ای   (نسخه‌های دائمی)

        ── git add ──→            ── git commit ──→
        ←─ git restore ──         
```

تشبیه: عکس گروهی گرفتن.

```text
Working Directory = آدم‌ها در صحنه (هر لحظه ممکن است جابه‌جا شوند)
Staging Area      = آدم‌هایی که صدا زدی بیایند در قاب عکس
Commit            = کلیک دوربین؛ عکس ثبت شد و تغییر نمی‌کند
```

Staging Area اجازه می‌دهد از بین تغییرات فعلی فقط **بخشی** را Commit کنی (مثلاً دو فایل از پنج فایل تغییریافته)، تا هر Commit یک کار منطقی را ثبت کند.

**وضعیت‌های یک فایل:**

| وضعیت | معنی |
|-------|------|
| **Untracked** | فایل جدید که Git هنوز نمی‌شناسد |
| **Modified** | فایل Commit‌شده که تغییر کرده ولی هنوز Stage نشده |
| **Staged** | تغییرش برای Commit بعدی انتخاب شده |
| **Committed** | در تاریخچه ثبت شده |

**Commit چیست؟** یک «عکس فوری» (Snapshot) از کل پروژه در یک لحظه، همراه با پیام، نویسنده و زمان. هر Commit یک شناسه‌ی یکتا (Hash) مثل `fd1897f` دارد و به Commit قبلی‌اش اشاره می‌کند؛ همین زنجیره «تاریخچه» را می‌سازد.

---

# 5. اولین Repository

**Repository** (به‌اختصار Repo) پوشه‌ای است که Git تاریخچه‌اش را نگه می‌دارد. 

```bash
mkdir my-site
cd my-site
git init
```

```text
Initialized empty Git repository in .../my-site/.git/
```

`git init` یک پوشه‌ی مخفی به نام `.git` می‌سازد که همه‌ی تاریخچه آنجاست. **هرگز آن را دستی ویرایش یا حذف نکن** (حذفش یعنی از دست رفتن تمام تاریخچه).

وضعیت را ببین:

```bash
git status
```

```text
On branch main

No commits yet

nothing to commit (create/copy files and use "git add" to track)
```

حالا یک فایل بساز (مثلاً `index.html`) و دوباره `git status` بزن:

```text
Untracked files:
  (use "git add <file>..." to include in what will be committed)
	index.html

nothing added to commit but untracked files present (use "git add" to track)
```

فایل را به Staging Area ببر:

```bash
git add index.html
git status
```

```text
Changes to be committed:
  (use "git rm --cached <file>..." to unstage)
	new file:   index.html
```

و Commit کن:

```bash
git commit -m "feat: add index page"
```

```text
[main (root-commit) fd1897f] feat: add index page
 1 file changed, 1 insertion(+)
 create mode 100644 index.html
```

اولین Commit ساخته شد. (`root-commit` یعنی اولین Commit پروژه.)

> متن پیام‌های Git بین نسخه‌ها کمی فرق می‌کند، ولی مفهوم یکی است.

---

# 6. چرخه‌ی کاری روزمره

هر روز با همین چرخه کار می‌کنی:

```text
۱) فایل‌ها را ویرایش کن
۲) git status       ← چه تغییر کرده؟
۳) git diff         ← دقیقاً چه تغییری؟
۴) git add ...      ← کدام تغییرها در Commit بعدی باشند؟
۵) git commit -m "..."
```

**`git add`:**

```bash
git add index.html          # یک فایل
git add css/ js/            # چند مسیر
git add .                   # همه‌ی تغییرات پوشه‌ی فعلی (و زیرپوشه‌ها)
```

> `git add .` راحت است ولی قبلش حتماً `git status` را بخوان تا چیزی که نباید (مثل `.env`) وارد Commit نشود.

**خلاصه‌ی وضعیت:**

```bash
git status -s
```

```text
 M index.html        ← تغییر کرده، Stage نشده  (ستون راست)
M  style.css         ← Stage شده               (ستون چپ)
?? notes.txt         ← Untracked
A  new.js            ← فایل جدید Stage شده
```

**دیدن تغییرات با `git diff`:**

```bash
git diff             # تغییراتی که هنوز Stage نشده‌اند
git diff --staged    # تغییراتی که Stage شده‌اند (قرار است Commit شوند)
```

```text
diff --git a/index.html b/index.html
--- a/index.html
+++ b/index.html
@@ -1 +1,2 @@
 hello
+<h1>Hi</h1>
```

خطوط با `+` اضافه و خطوط با `-` حذف شده‌اند.

**میان‌بر Commit:**

```bash
git commit -am "fix: correct heading"
```

`-a` همه‌ی فایل‌های **قبلاً ردیابی‌شده** (Tracked) را خودکار Stage می‌کند؛ ولی فایل‌های **جدید** (Untracked) را شامل نمی‌شود.

**تاریخچه با `git log`:**

```bash
git log                      # کامل
git log --oneline            # هر Commit یک خط
git log --oneline --graph --decorate --all   # نمودار Branchها
git log -p                   # همراه با تغییرات هر Commit
git log --stat               # فایل‌های تغییریافته در هر Commit
```

```text
4db284b feat: add stylesheet
d7f97f3 feat: add heading
fd1897f feat: add index page
```

و یک Commit مشخص:

```bash
git show d7f97f3
```

---

# 7. نوشتن پیام Commit خوب

پیام Commit برای **خودِ آینده‌ات و هم‌تیمی‌هایت** است. «fix»، «update»، «changes» یا «asdf» هیچ اطلاعاتی نمی‌دهند.

قواعد:

- یک خط کوتاه (حدود ۵۰ کاراکتر)
- با **فعل امری** و توصیف «چه کاری انجام شد» (`add`، `fix`، `remove`، `update`)
- هر Commit **یک تغییر منطقی** (نه یک روز کار کامل)
- در صورت نیاز، بعد از یک خط خالی توضیح بیشتر (چرا)

**الگوی رایج: Conventional Commits**

```text
feat: add login form          ← قابلیت جدید
fix: correct price rounding   ← رفع باگ
docs: update README           ← مستندات
style: format CSS             ← ظاهر کد (بدون تغییر منطق)
refactor: split api client    ← بازنویسی بدون تغییر رفتار
test: add tests for utils     ← تست
chore: update dependencies    ← کارهای متفرقه
```

مثال بد و خوب:

```text
❌ update
❌ fixed stuff
❌ final version

✅ feat: add responsive navbar
✅ fix: prevent double submit on order form
```

برای پیام چندخطی، `-m` را دو بار بنویس:

```bash
git commit -m "fix: prevent double submit" -m "Disable the button while the request is pending."
```

---

# 8. `.gitignore`

بعضی فایل‌ها نباید وارد Repository شوند: پوشه‌های سنگین قابل‌بازسازی (`node_modules`)، فایل‌های ساخته‌شده (`dist`)، فایل‌های محرمانه (`.env`) و فایل‌های سیستمی.

فایلی به نام `.gitignore` در ریشه‌ی پروژه بساز:

```text
# وابستگی‌ها
node_modules/

# خروجی build
dist/
build/

# متغیرهای محیطی و رمزها
.env
.env.local

# فایل‌های سیستمی و ویرایشگر
.DS_Store
Thumbs.db
.vscode/
*.log
```

قواعد الگو:

| الگو | معنی |
|------|------|
| `node_modules/` | کل پوشه با این نام |
| `*.log` | همه‌ی فایل‌هایی که به `.log` ختم می‌شوند |
| `.env` | فایلی با این نام (در هر مسیر) |
| `!important.log` | استثنا: این یکی را نادیده نگیر |
| `#` | کامنت |

بررسی اینکه چرا یک فایل Ignore شده:

```bash
git check-ignore -v .env
```

```text
.gitignore:2:.env	.env
```

**اگر فایل را قبل از `.gitignore` Commit کرده‌ای:** `.gitignore` روی فایل‌هایی که قبلاً ردیابی شده‌اند اثر ندارد. باید آن‌ها را از ردیابی خارج کنی (فایل روی دیسک می‌ماند):

```bash
git rm --cached tracked.txt        # یک فایل
git rm -r --cached node_modules    # یک پوشه
git commit -m "chore: stop tracking node_modules"
```

> **خیلی مهم:** اگر یک رمز، کلید API یا فایل `.env` را Commit و Push کردی، فقط حذفش از Commit بعدی کافی نیست؛ در **تاریخچه** می‌ماند و هر کس Repository را ببیند می‌تواند پیدایش کند. اگر Push هم شده باشد، آن رمز را **فوراً عوض (Rotate)** کن و آن را «سوخته» حساب کن. بهترین راه پیشگیری: `.gitignore` را **قبل از اولین Commit** بنویس.

نکته: برای پروژه‌های Node.js و React معمولاً از قالب‌های آماده‌ی `.gitignore` (در GitHub هنگام ساخت Repository یا سایت `gitignore.io`) استفاده می‌شود.

---

# 9. برگرداندن تغییرات

اشتباه کردن در Git طبیعی است و تقریباً همه‌چیز قابل برگشت است. باید بدانی **چه چیزی را** برمی‌گردانی:

## ۹.۱ تغییر Stage‌نشده را دور بریز

```bash
git restore index.html
```

فایل به آخرین Commit برمی‌گردد. ⚠️ این تغییرات **برای همیشه از دست می‌روند** (Commit نشده‌اند).

## ۹.۲ فایل را از Stage بیرون بیاور

```bash
git restore --staged style.css
```

تغییرات سر جایشان در فایل می‌مانند، فقط از Staging Area خارج می‌شوند.

## ۹.۳ آخرین Commit را اصلاح کن (`--amend`)

اگر پیام Commit غلط بود یا فایلی را فراموش کردی:

```bash
git add forgotten.js
git commit --amend --no-edit          # فقط فایل را اضافه کن
git commit --amend -m "better message" # یا پیام را عوض کن
```

> `--amend` Commit را **بازنویسی** می‌کند (Hash جدید). فقط برای Commitهایی که هنوز Push نکرده‌ای استفاده کن.

## ۹.۴ `git reset`: برگشت Branch به Commit قبلی

سه حالت دارد:

| دستور | HEAD و Branch | Staging Area | Working Directory |
|-------|----------------|---------------|--------------------|
| `git reset --soft HEAD~1` | یک Commit برمی‌گردد | تغییرات Stage می‌ماند | دست‌نخورده |
| `git reset --mixed HEAD~1` (پیش‌فرض) | یک Commit برمی‌گردد | خالی می‌شود | تغییرات می‌ماند |
| `git reset --hard HEAD~1` | یک Commit برمی‌گردد | خالی می‌شود | **تغییرات پاک می‌شود** ⚠️ |

`HEAD~1` یعنی «یک Commit قبل از Commit فعلی».

```bash
git reset --soft HEAD~1
git status -s
```

```text
M  r.txt        ← تغییر Commit قبلی حالا فقط Stage شده است
```

```bash
git reset --hard HEAD~1
```

```text
HEAD is now at bb8e8b8 r1
```

> `reset` تاریخچه را «عقب می‌برد». روی Commitهایی که **Push کرده‌ای و دیگران گرفته‌اند** از آن استفاده نکن؛ برای آن‌ها `revert` درست است.

## ۹.۵ `git revert`: برگرداندن امن با Commit جدید

به‌جای پاک کردن تاریخچه، یک Commit **جدید** می‌سازد که تغییرات یک Commit قبلی را معکوس می‌کند:

```bash
git revert HEAD            # آخرین Commit را معکوس کن
git revert d7f97f3         # یک Commit مشخص
```

```text
b0c3deb Revert "r2 again2"
e18cdea r2 again2
```

چون تاریخچه دست‌نخورده می‌ماند، برای Commitهایی که روی GitHub هستند **روش درست** همین است.

## ۹.۶ `git reflog`: شبکه‌ی ایمنی

Git حتی بعد از `reset --hard` هم Commitهای «گم‌شده» را مدتی نگه می‌دارد. `reflog` همه‌ی حرکات `HEAD` را نشان می‌دهد:

```bash
git reflog
```

```text
bb8e8b8 HEAD@{0}: reset: moving to HEAD~1
e18cdea HEAD@{1}: commit: r2 again2
```

برگشت به نقطه‌ی قبل از اشتباه:

```bash
git reset --hard HEAD@{1}
```

```text
HEAD is now at e18cdea r2 again2
```

**خلاصه: کدام را بزنم؟**

```text
تغییر Commit‌نشده را دور بریزم             → git restore <file>
فایل را از Stage بیرون بیاورم               → git restore --staged <file>
آخرین Commit را (هنوز Push نکرده‌ام) درست کنم → git commit --amend
چند Commit محلی را عقب ببرم                  → git reset (soft / mixed / hard)
Commit مشترک (Push شده) را برگردانم          → git revert
چیزی «گم» شد                                 → git reflog
```

---

# 10. Branch

**Branch** یک «خط توسعه‌ی مستقل» است. به‌جای اینکه همه‌ی کارها روی `main` انجام شود، برای هر قابلیت یک Branch می‌سازی، آنجا آزادانه کار می‌کنی و وقتی تمام شد، به `main` برمی‌گردانی.

```text
main:      A ── B ── C
                  \
feature/nav:       D ── E
```

مزیت: `main` همیشه سالم و قابل اجرا می‌ماند و کار نیمه‌تمام آن را خراب نمی‌کند.

**دستورات اصلی:**

```bash
git branch                   # لیست Branchها (ستاره = Branch فعلی)
git branch feature/nav       # ساخت Branch (بدون رفتن به آن)
git switch feature/nav       # رفتن به Branch
git switch -c feature/nav    # ساخت + رفتن (پرکاربردترین)
git branch -d feature/nav    # حذف Branch ادغام‌شده
git branch -D feature/nav    # حذف اجباری (حتی ادغام‌نشده) ⚠️
git branch -m new-name       # تغییر نام Branch فعلی
```

```text
  feature/nav
* main
```

**HEAD چیست؟** اشاره‌گری که می‌گوید «الان روی کدام Branch/Commit هستی». هنگام Commit، Branch فعلی به Commit جدید می‌رود.

```text
* 7a9146d (HEAD -> main, feature/nav) feat: nav
```

**نام‌گذاری Branch:** حروف کوچک انگلیسی با خط‌تیره و پیشوند نوع کار:

```text
feature/login-form
fix/double-submit
docs/readme
```

> `git switch` و `git restore` از Git نسخه‌ی ۲.۲۳ آمده‌اند. در آموزش‌های قدیمی‌تر `git checkout` را می‌بینی که هر دو کار را انجام می‌داد (`checkout feature/nav` معادل `switch` و `checkout -- file` معادل `restore`). هر دو کار می‌کنند؛ دستورهای جدید خواناترند.

**Detached HEAD:** اگر به‌جای Branch، مستقیم به یک Commit بروی (`git switch --detach <hash>` یا `git checkout <hash>`)، در حالت «Detached HEAD» هستی: می‌توانی نگاه کنی، ولی Commitهای جدید به هیچ Branchی تعلق ندارند و راحت گم می‌شوند. اگر خواستی کار را نگه داری، همان‌جا `git switch -c new-branch` بزن. برای خروج به `git switch main` برگرد.

---

# 11. Merge و حل Conflict

وقتی کار روی Branch تمام شد، آن را به `main` **ادغام** (Merge) می‌کنیم:

```bash
git switch main
git merge feature/nav
```

دو حالت دارد:

**۱) Fast-Forward:** اگر `main` بعد از ساخت Branch تغییری نکرده، Git فقط اشاره‌گر را جلو می‌برد:

```text
Updating f5c98cf..7a9146d
Fast-forward
 nav.html | 1 +
 1 file changed, 1 insertion(+)
```

```text
قبل:  main: A ── B        feature: A ── B ── C
بعد:  main: A ── B ── C
```

**۲) Merge Commit:** اگر هر دو Branch Commit جدید دارند، Git یک Commit ادغام می‌سازد:

```text
Merge made by the 'ort' strategy.
 a1.txt | 1 +
```

```text
*   a29cf88 Merge branch 'feature/a'
|\
| * d458c09 feat: a
* | bd7e86c feat: m
|/
```

## Conflict (تداخل)

اگر هر دو Branch **همان بخش از همان فایل** را متفاوت تغییر داده باشند، Git نمی‌داند کدام درست است و از تو می‌پرسد:

```text
Auto-merging index.html
CONFLICT (content): Merge conflict in index.html
Automatic merge failed; fix conflicts and then commit the result.
```

Conflict ترسناک نیست؛ یک اتفاق عادی است. فایل را باز کن؛ Git علامت‌گذاری کرده:

```text
<<<<<<< HEAD
<h1>Welcome</h1>
=======
<h1>Hello</h1>
>>>>>>> feature/title
```

| علامت | معنی |
|-------|------|
| `<<<<<<< HEAD` تا `=======` | نسخه‌ی Branch فعلی (مثلاً `main`) |
| `=======` تا `>>>>>>> feature/title` | نسخه‌ی Branch وارد‌شونده |

**مراحل حل:**

```text
۱) فایل را باز کن و تصمیم بگیر چه چیزی بماند (یکی از دو نسخه، یا ترکیب)
۲) هر سه علامت <<<<<<< ======= >>>>>>> را کامل پاک کن
۳) فایل را ذخیره کن
۴) git add index.html
۵) git commit      (یا git merge --continue)
```

مثلاً نتیجه‌ی نهایی:

```text
<h1>Welcome Hello</h1>
```

اگر وسط راه پشیمان شدی، Merge را لغو کن و همه‌چیز به قبل برمی‌گردد:

```bash
git merge --abort
```

VS Code روی بخش Conflict دکمه‌های «Accept Current / Incoming / Both» دارد. ولی همیشه بعدش فایل را بخوان و پروژه را اجرا کن تا مطمئن شوی درست است.

**کاهش Conflict:** Branchها را کوتاه‌مدت نگه دار، مرتب `main` را به Branch خودت بیاور، و روی فایل‌های مشترک هم‌زمان کار نکنید.

---

# 12. Remote: Push، Pull، Fetch و Clone

**Remote** یک نسخه‌ی دیگر از Repository روی سرور (مثلاً GitHub) است. نام پیش‌فرض آن **`origin`** است.

```bash
git remote add origin https://github.com/USERNAME/my-site.git
git remote -v
```

```text
origin	https://github.com/USERNAME/my-site.git (fetch)
origin	https://github.com/USERNAME/my-site.git (push)
```

**`git push`: فرستادن Commitها به Remote**

```bash
git push -u origin main
```

`-u` (یعنی `--set-upstream`) Branch محلی را به Branch Remote وصل می‌کند؛ از دفعه‌ی بعد فقط `git push` کافی است.

```text
To ../remote.git
 * [new branch]      main -> main
branch 'main' set up to track 'origin/main'.
```

**`git clone`: گرفتن یک کپی کامل**

```bash
git clone https://github.com/USERNAME/my-site.git
cd my-site
```

Clone تاریخچه‌ی کامل را می‌آورد و خودکار `origin` را تنظیم می‌کند.

**`git fetch` و `git pull`:**

```bash
git fetch            # تغییرات Remote را بگیر، ولی روی کارت اعمال نکن
git pull             # fetch + merge در یک مرحله
git pull --rebase    # fetch + rebase (تاریخچه‌ی خطی‌تر)
```

| | `fetch` | `pull` |
|---|---------|--------|
| تغییرات را می‌آورد | بله | بله |
| در Branch فعلی ادغام می‌کند | **نه** | بله |
| ایمنی | بدون ریسک | ممکن است Conflict بسازد |

بعد از `fetch` می‌توانی ببینی چه خبر است (`git log origin/main`، `git status`) و بعد تصمیم بگیری.

**Push رد شد؟**

اگر کسی قبل از تو روی همان Branch Push کرده باشد:

```text
 ! [rejected]        main -> main (fetch first)
error: failed to push some refs to '...'
hint: Updates were rejected because the remote contains work that you do not
hint: have locally.
```

یعنی Remote Commitهایی دارد که تو نداری. راه‌حل: اول بگیر، بعد Push کن:

```bash
git pull --rebase    # یا: git pull
git push
```

**هرگز** برای رد شدن Push از `git push --force` استفاده نکن؛ کار دیگران را پاک می‌کنی. (فقط روی Branch شخصی خودت و وقتی می‌دانی چه می‌کنی؛ ترجیحاً `--force-with-lease`.)

---

# 13. GitHub: ساخت Repository و اتصال

**مراحل:**

```text
۱) در github.com حساب بساز
۲) New repository → یک نام انتخاب کن (مثلاً my-site)
۳) Public (همه می‌بینند) یا Private (فقط خودت)
۴) اگر پروژه‌ی محلی داری، گزینه‌های README و .gitignore را تیک نزن (تا Repository خالی بماند)
۵) آدرسی را که GitHub نشان می‌دهد کپی کن
```

GitHub بعد از ساخت Repository خالی، دستورهای لازم را نشان می‌دهد. برای پروژه‌ی محلی معمولاً:

```bash
git remote add origin https://github.com/USERNAME/my-site.git
git branch -M main
git push -u origin main
```

## احراز هویت (Authentication)

GitHub دیگر با رمز عبور حساب برای Git کار نمی‌کند. دو راه معمول:

**۱) HTTPS (ساده‌تر برای شروع):** هنگام اولین `push`، در ویندوز **Git Credential Manager** (همراه Git for Windows) پنجره‌ی ورود مرورگر را باز می‌کند؛ وارد می‌شوی و ذخیره می‌شود. یا از **Personal Access Token (PAT)** استفاده کن که در GitHub از بخش Settings ← Developer settings ساخته می‌شود و به‌جای رمز استفاده می‌شود.

**۲) SSH (راحت‌تر برای استفاده‌ی روزانه):** یک جفت کلید می‌سازی؛ کلید **عمومی** را در GitHub ثبت می‌کنی و دیگر هر بار چیزی لازم نیست:

```bash
ssh-keygen -t ed25519 -C "you@example.com"
```

(Enter بزن تا مسیر پیش‌فرض را بپذیرد؛ برای Passphrase هم می‌توانی چیزی انتخاب کنی.) بعد کلید عمومی را نمایش بده و کامل در GitHub ← Settings ← SSH and GPG keys ← New SSH key بچسبان:

```bash
cat ~/.ssh/id_ed25519.pub          # Git Bash / Linux / macOS
```

```powershell
Get-Content $env:USERPROFILE\.ssh\id_ed25519.pub     # PowerShell
```

تست اتصال:

```bash
ssh -T git@github.com
```

و آدرس Remote به‌جای HTTPS به شکل SSH است:

```text
git@github.com:USERNAME/my-site.git
```

> **هرگز** کلید **خصوصی** (`id_ed25519` بدون `.pub`) را به کسی نده و جایی آپلود نکن.

**اگر Repository از قبل با آدرس HTTPS ساخته شده و می‌خواهی به SSH بروی:**

```bash
git remote set-url origin git@github.com:USERNAME/my-site.git
```

---

# 14. Pull Request و GitHub Flow

در کار تیمی (و حتی تمرین‌های شخصی) مستقیم روی `main` Commit نمی‌کنیم. جریان کار استاندارد **GitHub Flow** است:

```text
۱) از main یک Branch جدید بساز           git switch -c feature/contact-form
۲) آنجا کار کن و Commitهای کوچک بساز
۳) Branch را Push کن                      git push -u origin feature/contact-form
۴) در GitHub یک Pull Request (PR) باز کن
۵) هم‌تیمی‌ها کد را مرور (Review) و نظر می‌دهند
۶) اصلاحات لازم را Commit و Push کن (PR خودکار به‌روز می‌شود)
۷) PR را به main Merge کن
۸) Branch را حذف کن و main محلی را به‌روز کن    git switch main && git pull
```

(در PowerShell قدیمی `&&` کار نمی‌کند؛ دو دستور را جدا از هم بزن.)

**Pull Request** یعنی «پیشنهاد ادغام». در آن:

- تغییرات (Diff) را می‌بینی
- گفت‌وگو و Review انجام می‌شود
- تست‌های خودکار اجرا می‌شوند (CI، در فصل‌های بعد)
- بعد از تأیید، Merge می‌شود

**یک PR خوب:**

- کوچک و متمرکز بر یک کار
- عنوان گویا و توضیح «چه کاری، چرا، چطور تست شود»
- اسکرین‌شات برای تغییرات ظاهری
- پیوند به Issue مربوطه (`Closes #12` بسته شدن خودکار Issue را باعث می‌شود)

**روش‌های Merge در GitHub:**

| روش | نتیجه |
|-----|-------|
| Create a merge commit | همه‌ی Commitها + یک Commit ادغام |
| Squash and merge | همه‌ی Commitهای PR یک Commit می‌شوند (تاریخچه‌ی تمیز) |
| Rebase and merge | Commitها خطی روی main قرار می‌گیرند |

**Issue:** یک تیکت برای باگ، ایده یا کار. برای پروژه‌های شخصی هم برای نگه‌داشتن «کارهای باقی‌مانده» مفید است.

**محافظت از `main` (Branch Protection):** در تیم‌های واقعی تنظیم می‌شود که کسی نتواند مستقیم روی `main` Push کند و هر تغییر فقط با PR و Review وارد شود.

---

# 15. Fork و مشارکت در پروژه‌ی دیگران

وقتی به Repository دیگران اجازه‌ی نوشتن نداری (مثلاً یک پروژه‌ی متن‌باز)، از **Fork** استفاده می‌کنی:

```text
۱) Fork → یک کپی از پروژه در حساب خودت ساخته می‌شود
۲) Clone کپی خودت
۳) Branch بساز، تغییر بده، Push کن (به Fork خودت)
۴) از Fork خودت یک Pull Request به پروژه‌ی اصلی بفرست
```

برای دریافت به‌روزرسانی‌های پروژه‌ی اصلی، آن را به‌عنوان Remote دوم (معمولاً `upstream`) اضافه می‌کنند:

```bash
git remote add upstream https://github.com/ORIGINAL/project.git
git fetch upstream
```

| مفهوم | چیست |
|-------|------|
| **Clone** | کپی Repository روی کامپیوتر خودت |
| **Branch** | خط توسعه‌ی مستقل داخل همان Repository |
| **Fork** | کپی Repository در حساب GitHub خودت |

---

# 16. `git stash`

وسط یک کار نیمه‌تمام هستی و باید فوراً به Branch دیگری بروی (مثلاً رفع باگ فوری). Commit کردن کار ناقص خوب نیست؛ آن را **موقتاً کنار بگذار**:

```bash
git stash                # تغییرات Tracked را ذخیره و پوشه را تمیز کن
git stash list           # لیست
git stash pop            # آخرین را برگردان و از لیست حذف کن
git stash apply          # برگردان ولی در لیست نگه دار
git stash drop           # حذف آخرین
git stash -u             # فایل‌های Untracked را هم شامل کن
```

```text
Saved working directory and index state WIP on main: 49c0abe main conf
stash@{0}: WIP on main: 49c0abe main conf
```

`stash` موقتی است؛ برای نگه‌داری بلندمدت Commit روی یک Branch بهتر است.

---

# 17. Rebase `[پیشرفته/اختیاری]`

**Rebase** هم مثل Merge تغییرات یک Branch را وارد دیگری می‌کند، ولی به‌جای Commit ادغام، Commitهای تو را **روی نوک Branch مقصد دوباره پخش می‌کند** و تاریخچه‌ای خطی می‌سازد:

```bash
git switch feature/x
git rebase main
```

```text
قبل:   main:  A ── B ── M          بعد:  main:  A ── B ── M
                \                                          \
        feature:  C ── D                      feature:      C' ── D'
```

تاریخچه‌ی بعد از Rebase:

```text
* 6300d65 fr
* 68d7cbc mm
* 6746ae7 from proj
```

| | Merge | Rebase |
|---|-------|--------|
| تاریخچه | حفظ می‌کند (با Commit ادغام) | خطی و تمیز |
| Commitها | دست‌نخورده | بازنویسی می‌شوند (Hash جدید) |
| ایمنی | بسیار امن | باید با دقت استفاده شود |

> **قانون طلایی Rebase:** هرگز Commitهایی را که **Push کرده‌ای و دیگران ممکن است گرفته باشند** Rebase نکن؛ چون تاریخچه‌ی مشترک را بازنویسی می‌کنی و برای همه‌ی هم‌تیمی‌ها مشکل می‌سازد. Rebase برای Branch شخصی و محلی خودت و `git pull --rebase` بی‌خطر و مفید است.

---

# 18. Tag و Release

**Tag** یک برچسب ثابت روی یک Commit است؛ معمولاً برای نسخه‌های رسمی (`v1.0.0`):

```bash
git tag v1.0.0                              # Tag ساده
git tag -a v1.1.0 -m "Second release"       # Tag همراه با پیام (توصیه‌شده)
git tag                                     # لیست
git push origin v1.0.0                      # Push یک Tag
git push origin --tags                      # Push همه‌ی Tagها
```

در GitHub از بخش Releases می‌توانی بر پایه‌ی یک Tag یک Release (همراه با توضیحات و فایل‌ها) منتشر کنی.

**نسخه‌گذاری معنایی (SemVer):** `MAJOR.MINOR.PATCH`:

```text
v1.4.2
│ │ └── PATCH: رفع باگ (سازگار)
│ └──── MINOR: قابلیت جدید (سازگار)
└────── MAJOR: تغییر ناسازگار
```

---

# 19. README: ویترین پروژه‌ات

**README.md** اولین چیزی است که هر کس با دیدن Repository می‌بیند. برای پروژه‌های Portfolio تو، README خوب فرق بین «یک پوشه‌ی کد» و «یک پروژه‌ی حرفه‌ای» است. (فایل‌های `.md` با زبان **Markdown** نوشته می‌شوند؛ همان زبانی که این جزوه‌ها هم با آن نوشته شده‌اند.)

**قالب پیشنهادی:**

````markdown
# نام پروژه

یک جمله درباره‌ی اینکه پروژه چیست.

![Screenshot](docs/screenshot.png)

## Demo
لینک نسخه‌ی آنلاین (مثلاً GitHub Pages)

## قابلیت‌ها
- قابلیت ۱
- قابلیت ۲

## تکنولوژی‌ها
HTML, CSS, JavaScript

## اجرای پروژه
```bash
git clone https://github.com/USERNAME/my-site.git
cd my-site
npm install
npm run dev
```

## یادگیری‌ها / چالش‌ها
چه چیزی یاد گرفتی؟ با چه مشکلی روبه‌رو شدی؟
````

نکته‌ها:

- اسکرین‌شات یا GIF تأثیر زیادی دارد.
- دستور اجرا باید واقعاً کار کند (آن را روی یک پوشه‌ی تمیز تست کن).
- لینک نسخه‌ی آنلاین بگذار؛ در فصل Deployment می‌آموزی چطور پروژه را آنلاین کنی.
- GitHub به Repositoryای که `README.md` دارد در صفحه‌ی اصلی‌اش نمایش می‌دهد.

> **ترفند پروفایل:** اگر یک Repository **هم‌نام با نام کاربری‌ات** بسازی و در آن `README.md` بگذاری، آن متن در صفحه‌ی پروفایل GitHub نمایش داده می‌شود. جای خوبی برای معرفی خودت و پروژه‌هایت است.

---

# 20. نکات ویندوز و PowerShell

چون بیشتر یادگیرنده‌ها در ویندوز کار می‌کنند، چند نکته:

**۱) `&&` در PowerShell قدیمی:** در Windows PowerShell (نسخه‌ی ۵) نمی‌توان دستورها را با `&&` زنجیره کرد (خطای «The token '&&' is not a valid statement separator»). دستورها را در خطوط جدا بزن، یا بین‌شان `;` بگذار:

```powershell
git add .
git commit -m "feat: add navbar"
```

(در PowerShell نسخه‌ی ۷ و Git Bash، `&&` کار می‌کند.)

**۲) هشدار LF و CRLF:** ممکن است ببینی:

```text
warning: in the working copy of 'index.html', LF will be replaced by CRLF the next time Git touches it
```

ویندوز پایان خط را `CRLF` و لینوکس/مک `LF` می‌نویسد. این هشدار معمولاً **بی‌ضرر** است. برای یکدست کردن، می‌توانی در ریشه‌ی پروژه یک فایل `.gitattributes` با این محتوا بگذاری:

```text
* text=auto
```

**۳) مسیرها:** در Git Bash از `/` استفاده کن (`cd /d/projects`) ولی در PowerShell هر دو `\` و `/` کار می‌کنند. فاصله در مسیر را داخل `"..."` بگذار.

**۴) VS Code:** پنل **Source Control** (`Ctrl+Shift+G`) تغییرات، Stage، Commit و Conflict را به‌صورت گرافیکی نشان می‌دهد. برای شروع، هم Terminal و هم این پنل را استفاده کن؛ ولی دستورها را بلد باش.

---

# 21. عیب‌یابی خطاهای رایج

| پیام یا مشکل | علت و راه‌حل |
|--------------|--------------|
| `fatal: not a git repository` | داخل پوشه‌ی Repository نیستی (`cd` بزن) یا `git init` نزده‌ای |
| `Author identity unknown` | `user.name` و `user.email` را با `git config --global` تنظیم کن |
| `nothing to commit, working tree clean` | تغییری برای Commit نیست (فایل را ذخیره کرده‌ای؟) |
| `failed to push some refs ... (fetch first)` | Remote تغییر دارد؛ اول `git pull --rebase` (یا `pull`) بعد `push` |
| `CONFLICT ... Automatic merge failed` | Conflict را دستی حل کن (بخش ۱۱) یا `git merge --abort` |
| `You are in 'detached HEAD' state` | روی Commit مستقیم هستی؛ `git switch -c name` برای نگه‌داشتن کار یا `git switch main` برای خروج |
| `Your local changes would be overwritten by ...` | قبل از تغییر Branch/Pull، تغییرات را Commit یا `stash` کن |
| `node_modules` وارد Commit شد | `.gitignore` را اصلاح کن و `git rm -r --cached node_modules` بزن |
| رمز یا `.env` Push شد | رمز را فوراً عوض کن؛ حذف از Commit بعدی کافی نیست |
| `Permission denied (publickey)` | کلید SSH در GitHub ثبت نشده یا درست تنظیم نیست؛ `ssh -T git@github.com` را تست کن |
| `remote: Support for password authentication was removed` | به‌جای رمز از Token یا SSH/Credential Manager استفاده کن |
| پیام Commit اشتباه بود (Push نشده) | `git commit --amend -m "..."` |
| Commit اشتباه Push شده | `git revert <hash>` (نه reset) |
| «همه‌چیز را خراب کردم!» | آرام باش؛ `git reflog` تقریباً همیشه راه برگشت را نشان می‌دهد |

**قاعده‌ی کلی:** قبل از هر کار ریسکی (`reset --hard`، `rebase`، Merge بزرگ) یک Branch پشتیبان بساز: `git branch backup`.

---

# 22. جدول مرجع سریع دستورات

**شروع**

| دستور | کار |
|-------|-----|
| `git init` | ساخت Repository جدید |
| `git clone <url>` | گرفتن کپی کامل از Remote |
| `git config --global user.name "..."` | تنظیم نام |

**چرخه‌ی روزمره**

| دستور | کار |
|-------|-----|
| `git status` / `git status -s` | وضعیت فایل‌ها |
| `git add <file>` / `git add .` | Stage کردن |
| `git commit -m "..."` | ساخت Commit |
| `git diff` / `git diff --staged` | دیدن تغییرات |
| `git log --oneline --graph --decorate --all` | تاریخچه‌ی خلاصه |

**برگرداندن**

| دستور | کار |
|-------|-----|
| `git restore <file>` | دور ریختن تغییر Commit‌نشده |
| `git restore --staged <file>` | بیرون آوردن از Stage |
| `git commit --amend` | اصلاح آخرین Commit |
| `git reset --soft/--mixed/--hard HEAD~1` | عقب بردن Branch |
| `git revert <hash>` | Commit معکوس (امن برای Push شده‌ها) |
| `git reflog` | تاریخچه‌ی حرکات HEAD |

**Branch و Merge**

| دستور | کار |
|-------|-----|
| `git branch` | لیست Branchها |
| `git switch -c <name>` | ساخت و رفتن |
| `git switch <name>` | رفتن به Branch |
| `git merge <name>` | ادغام در Branch فعلی |
| `git merge --abort` | لغو Merge در حال Conflict |
| `git branch -d <name>` | حذف Branch ادغام‌شده |
| `git stash` / `git stash pop` | کنار گذاشتن موقت تغییرات |
| `git rebase <branch>` | بازچینی Commitها روی Branch دیگر |

**Remote**

| دستور | کار |
|-------|-----|
| `git remote add origin <url>` | اتصال به Remote |
| `git push -u origin <branch>` | اولین Push و تنظیم Upstream |
| `git push` | Push بعدی |
| `git fetch` | گرفتن بدون ادغام |
| `git pull` / `git pull --rebase` | گرفتن + ادغام |
| `git tag -a v1.0.0 -m "..."` | ساخت Tag |

---

# 23. نکات مهم فصل

### نکته ۱

Git و GitHub دو چیز متفاوت‌اند: Git ابزار محلی است و GitHub سرویس آنلاین.

---

### نکته ۲

قبل از `git commit` همیشه `git status` و `git diff` را بخوان.

---

### نکته ۳

Commitهای کوچک و پیام‌های گویا: هر Commit یک تغییر منطقی.

---

### نکته ۴

`.gitignore` را **قبل از اولین Commit** بنویس. هرگز رمز یا `.env` را Commit نکن.

---

### نکته ۵

روی `main` مستقیم کار نکن؛ برای هر کار یک Branch بساز.

---

### نکته ۶

برای Commitهای Push‌شده از `revert` استفاده کن، نه `reset`؛ و هرگز `push --force` را بی‌دلیل نزن.

---

### نکته ۷

قبل از شروع کار روزانه `git pull` بزن تا با آخرین نسخه کار کنی.

---

### نکته ۸

Conflict طبیعی است. بخوان، تصمیم بگیر، علامت‌ها را پاک کن، `add` و `commit` کن.

---

### نکته ۹

اگر چیزی گم شد، قبل از وحشت `git reflog` را ببین.

---

# 24. اشتباهات رایج

1. نوشتن پیام‌های بی‌معنی مثل `update`، `fix`، `asdf`.
2. Commit کردن یک روز کار کامل در یک Commit.
3. Commit کردن `node_modules`، `.env` یا فایل‌های ساخته‌شده.
4. نوشتن `.gitignore` بعد از Commit کردن فایل‌ها (و تعجب از اینکه اثر نمی‌کند).
5. استفاده از `git add .` بدون خواندن `git status`.
6. Commit مستقیم روی `main` و کار نیمه‌تمام در آن.
7. استفاده از `git reset --hard` بدون مطمئن بودن از اینکه چه چیزی پاک می‌شود.
8. `git push --force` برای دور زدن خطای Push.
9. Rebase کردن Commitهای Push‌شده‌ی مشترک.
10. نگه‌داشتن Branchهای بلندمدت و Merge نکردن مرتب، که منجر به Conflictهای بزرگ می‌شود.
11. پاک کردن پوشه‌ی `.git` برای «تمیز کردن».
12. ترسیدن از Conflict و کپی کردن دستی فایل‌ها به‌جای حل آن.
13. فراموش کردن `git pull` قبل از شروع کار و دچار شدن به Push رد‌شده.
14. بی‌توجهی به اینکه `git commit -am` فایل‌های جدید (Untracked) را اضافه نمی‌کند.
15. اشتراک‌گذاری کلید خصوصی SSH یا Token.
16. Repository بدون README.

---

# 25. تمرین‌ها

> همه‌ی تمرین‌ها را در یک پوشه‌ی آزمایشی (مثلاً `git-practice`) انجام بده، نه در پروژه‌ی اصلی‌ات.

## سطح ۱ — مبانی

### تمرین ۱

Git را نصب کن، با `git --version` مطمئن شو و نام و ایمیلت را تنظیم کن. با `git config --list` بررسی کن.

---

### تمرین ۲

یک پوشه بساز، `git init` بزن و سه فایل (`index.html`، `style.css`، `app.js`) بساز. با `git status` وضعیت را ببین. سپس `index.html` و `style.css` را در یک Commit و `app.js` را در Commit دیگری ثبت کن.

---

### تمرین ۳

در `index.html` یک تغییر بده. با `git diff` ببین، `git add` کن، با `git diff --staged` دوباره ببین و Commit کن. با `git log --oneline` تاریخچه را ببین.

---

### تمرین ۴

خروجی `git status -s` را پیش‌بینی کن:

```bash
echo "a" > a.txt
git add a.txt
echo "b" >> a.txt
git status -s
```

---

## سطح ۲ — `.gitignore` و برگرداندن

### تمرین ۵

یک پوشه‌ی `node_modules` (با یک فایل داخلش) و یک فایل `.env` بساز. `.gitignore` بنویس و با `git status` و `git check-ignore -v .env` مطمئن شو نادیده گرفته می‌شوند.

---

### تمرین ۶

یک فایل را ویرایش کن و با `git restore` برگردان. بعد ویرایش کن، `git add` بزن و با `git restore --staged` از Stage بیرون بیاور.

---

### تمرین ۷

سه Commit بساز. با `reset --soft`، `reset --mixed` و `reset --hard` هرکدام را جداگانه آزمایش کن (هر بار با `git reflog` به حالت اول برگرد) و تفاوت را در `git status` ببین.

---

### تمرین ۸

یک Commit بساز، بعد با `git revert` معکوسش کن. تاریخچه با `git log --oneline` چطور شد؟ چه فرقی با `reset` دارد؟

---

## سطح ۳ — Branch و Merge

### تمرین ۹

یک Branch به نام `feature/nav` بساز، دو Commit روی آن بزن، به `main` برگرد و Merge کن. آیا Fast-Forward بود؟ چرا؟

---

### تمرین ۱۰

یک Merge که Merge Commit بسازد ایجاد کن: روی `main` و روی یک Branch جدید جداگانه Commit بزن و بعد Merge کن. با `git log --oneline --graph` نمودار را ببین.

---

### تمرین ۱۱

عمداً یک Conflict بساز: در دو Branch یک خط از یک فایل را متفاوت تغییر بده و Merge کن. Conflict را حل کن. بار دوم همان را بساز و با `git merge --abort` لغو کن.

---

### تمرین ۱۲

وسط یک تغییر، `git stash` بزن، به Branch دیگر برو و برگرد و با `git stash pop` تغییرات را برگردان.

---

## سطح ۴ — GitHub و Remote

### تمرین ۱۳

در GitHub حساب بساز (اگر نداری) و یک Repository جدید بساز. پروژه‌ی تمرینی را با `remote add` و `push -u` به آن بفرست.

---

### تمرین ۱۴

Repository را در یک پوشه‌ی دیگر `clone` کن (شبیه‌سازی کامپیوتر دوم). در یکی تغییر بده و Push کن و در دیگری با `git fetch` و بعد `git pull` بگیر.

---

### تمرین ۱۵

عمداً Push رد شده بساز: از دو پوشه‌ی Clone دو Commit متفاوت Push کن (دومی رد می‌شود). با `git pull --rebase` رفعش کن.

---

### تمرین ۱۶

SSH Key بساز، در GitHub ثبت کن و با `ssh -T git@github.com` تست کن. Remote را به آدرس SSH ببر.

---

## سطح ۵ — گردش کار GitHub

### تمرین ۱۷

یک Branch به نام `feature/readme` بساز، یک `README.md` خوب برای پروژه بنویس، Push کن، در GitHub یک Pull Request باز کن (به `main` خودت) و Merge کن. بعد Branch را حذف و `main` محلی را به‌روز کن.

---

### تمرین ۱۸

یک Tag به نام `v1.0.0` بساز، Push کن و در GitHub یک Release بساز.

---

### تمرین ۱۹

سؤال تحلیلی: در هر وضعیت کدام دستور مناسب است؟

```text
الف) فایل را اشتباه ویرایش کرده‌ام و Commit نکرده‌ام
ب) پیام آخرین Commit (Push نشده) غلط است
ج) Commit اشتباهی روی GitHub Push شده و هم‌تیمی‌ها گرفته‌اند
د) Push رد شده چون کسی قبل از من Push کرده
ه) وسط کار نیمه‌تمام باید به Branch دیگری بروم
```

---

# 26. پاسخنامه‌ی مختصر (پس از تلاش خودت ببین)

**تمرین ۴:**

```text
AM a.txt
```

فایل جدید (`A`) Stage شده، ولی بعد از آن دوباره تغییر کرده (`M`)؛ تغییر دوم هنوز Stage نشده است.

**تمرین ۵:**

```text
# .gitignore
node_modules/
.env
```

**تمرین ۷:** `--soft`: Commit برمی‌گردد و تغییرات Stage می‌ماند. `--mixed`: تغییرات می‌ماند ولی Stage نیست. `--hard`: تغییرات هم پاک می‌شود. برگشت: `git reflog` سپس `git reset --hard <hash یا HEAD@{n}>`.

**تمرین ۸:** `revert` یک Commit جدید می‌سازد و تاریخچه حفظ می‌شود (برای Commit‌های Push‌شده امن است)؛ `reset` Commit را از تاریخچه‌ی Branch حذف می‌کند.

**تمرین ۹:** اگر `main` بعد از ساخت Branch تغییر نکرده باشد، Fast-Forward است و Merge Commit جدا ساخته نمی‌شود.

**تمرین ۱۰:** وقتی هر دو Branch Commit مخصوص خود دارند، Merge Commit ساخته می‌شود و در `--graph` دو خط جدا و یک نقطه‌ی ادغام می‌بینی.

**تمرین ۱۱:** مراحل حل Conflict: باز کردن فایل، حذف سه علامت، نگه‌داشتن محتوای درست، `git add`، `git commit`. (یا `git merge --abort`.)

**تمرین ۱۵:** پیام `failed to push some refs ... (fetch first)` یعنی Remote تغییراتی دارد که تو نداری. `git pull --rebase` تغییرات را می‌گیرد و Commit تو را بعد از آن‌ها می‌گذارد؛ سپس `git push`.

**تمرین ۱۹:**

```text
الف) git restore <file>
ب) git commit --amend -m "پیام درست"
ج) git revert <hash>   (نه reset و force push)
د) git pull --rebase  سپس  git push
ه) git stash  →  git switch <branch>  →  ...  →  git switch back  →  git stash pop
```

---

# 27. پروژه پایان فصل

## Repository حرفه‌ای برای پروژه‌ی HTML/CSS خودت

پروژه‌ای را که در فصل‌های HTML و CSS ساختی (مثلاً «صفحه‌ی معرفی شخصی» یا «Dashboard») با کار تمیز Git روی GitHub بگذار؛ همان‌طور که یک توسعه‌دهنده‌ی واقعی انجام می‌دهد.

**مراحل:**

```text
۱) یک پوشه‌ی تمیز از پروژه بساز و git init بزن
۲) قبل از هر چیز .gitignore بنویس
۳) اولین Commit: ساختار اولیه
۴) پروژه را در حداقل ۱۰ Commit کوچک و منطقی ثبت کن (نه یک Commit بزرگ)
۵) یک Repository روی GitHub بساز و Push کن
۶) یک Branch برای یک قابلیت جدید بساز (مثلاً dark mode یا فرم تماس)
۷) آن را Push کن، Pull Request باز کن و خودت Merge کن
۸) عمداً یک Conflict بساز و حل کن (در یک Branch جدا)
۹) یک README کامل بنویس
۱۰) Tag v1.0.0 بزن و Push کن
```

**الزامات:**

- پیام‌ها بر اساس الگوی Conventional Commits
- هیچ فایل `node_modules`، `.env` یا فایل ساخته‌شده در Repository نباشد
- `main` همیشه قابل اجرا باشد
- حداقل یک Pull Request Merge‌شده
- حداقل یک Branch حذف‌شده بعد از Merge
- `README.md` شامل: توضیح، اسکرین‌شات، قابلیت‌ها، تکنولوژی‌ها و طرز اجرا

**معیار قبولی:**

- `git log --oneline --graph --decorate --all` یک تاریخچه‌ی خوانا نشان می‌دهد.
- یک آدم دیگر با `git clone` و دستورهای README می‌تواند پروژه را اجرا کند.
- در تاریخچه هیچ رمز یا فایل محرمانه‌ای دیده نمی‌شود.
- آدرس Repository را می‌توانی با افتخار در رزومه‌ات بگذاری.

**گام اختیاری:** با **GitHub Pages** پروژه را آنلاین کن (در Settings ← Pages، Branch `main` را انتخاب کن) و لینکش را در README بگذار.

---

# 28. چک‌لیست خودارزیابی

- [ ] تفاوت Git و GitHub را توضیح می‌دهم
- [ ] Git را نصب و نام و ایمیل را تنظیم کرده‌ام
- [ ] سه ناحیه‌ی Git و وضعیت‌های فایل را می‌شناسم
- [ ] `init`، `status`، `add`، `commit`، `diff`، `log` را روان به‌کار می‌برم
- [ ] پیام Commit خوب می‌نویسم
- [ ] `.gitignore` می‌نویسم و می‌دانم چرا رمزها نباید Commit شوند
- [ ] `restore`، `amend`، `reset`، `revert` و `reflog` را تفکیک می‌کنم
- [ ] Branch می‌سازم، جابه‌جا می‌شوم و Merge می‌کنم
- [ ] تفاوت Fast-Forward و Merge Commit را می‌دانم
- [ ] Conflict را حل می‌کنم و `merge --abort` را می‌شناسم
- [ ] `remote`، `push`، `pull`، `fetch` و `clone` را می‌شناسم
- [ ] روی GitHub Repository می‌سازم و احراز هویت (HTTPS یا SSH) را تنظیم می‌کنم
- [ ] GitHub Flow و Pull Request را می‌شناسم
- [ ] `stash` را برای کار نیمه‌تمام به‌کار می‌برم
- [ ] Rebase را در حد مفهوم و قانون طلایی‌اش می‌دانم
- [ ] Tag و SemVer را می‌شناسم
- [ ] یک README حرفه‌ای می‌نویسم
- [ ] خطاهای رایج Git را تشخیص و رفع می‌کنم

---

# خلاصه فصل

```text
Git
↓
ابزار محلی کنترل نسخه؛ تاریخچه، بازگشت، کار موازی.

GitHub
↓
سرویس آنلاین میزبانی Repository و همکاری.

سه ناحیه
↓
Working Directory ← add ← Staging ← commit ← Repository

Commit
↓
عکس فوری با پیام؛ کوچک، منطقی، با پیام گویا.

.gitignore
↓
node_modules، .env و فایل‌های ساخته‌شده وارد Repository نمی‌شوند.

برگرداندن
↓
restore (Commit‌نشده)، amend، reset (محلی)، revert (Push‌شده)، reflog (نجات).

Branch و Merge
↓
برای هر کار یک Branch؛ Fast-Forward یا Merge Commit؛ Conflict را دستی حل کن.

Remote
↓
push، pull، fetch، clone؛ Push رد شد؟ اول pull.

Pull Request
↓
GitHub Flow: Branch ← Push ← PR ← Review ← Merge.

README
↓
ویترین پروژه‌ات.
```

---

# فصل بعد

با Git و GitHub پروژه‌هایت حالا نسخه‌بندی‌شده و آنلاین‌اند. مرحله‌ی بعدی مسیر:

```text
React
↓
Component، JSX، Props، State، Eventها، Conditional Rendering، Lists و Keys، Forms
useState، useEffect، دریافت داده از API (با fetch فصل ۶)، Router
```

از این به بعد هر پروژه‌ای که می‌سازی را از همان ابتدا با Git شروع کن.
