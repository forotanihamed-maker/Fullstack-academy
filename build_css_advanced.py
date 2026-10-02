from pathlib import Path
import json, yaml
root=Path('/tmp/cssstage')
css=root/'content/02-css'

def write_lesson(num, slug, title, desc, difficulty, mins, objectives, concepts, prereq, related, next_, body):
    fm={"title":title,"description":desc,"difficulty":difficulty,"estimatedMinutes":mins,"objectives":objectives,"concepts":concepts,"prerequisites":prereq,"relatedLessons":related,"relatedProjects":["css-advanced-dashboard"],"nextLesson":next_}
    text='---\n'+yaml.safe_dump(fm,allow_unicode=True,sort_keys=False,width=120)+'---\n\n'+body.strip()+'\n'
    (css/f'{num:02d}-{slug}.md').write_text(text,encoding='utf-8')

def write_json(stem, exercise, quiz, playground, challenge=None):
    (css/f'{stem}.exercise.json').write_text(json.dumps(exercise,ensure_ascii=False,indent=2),encoding='utf-8')
    (css/f'{stem}.quiz.json').write_text(json.dumps(quiz,ensure_ascii=False,indent=2),encoding='utf-8')
    (css/f'{stem}.playground.json').write_text(json.dumps(playground,ensure_ascii=False,indent=2),encoding='utf-8')
    if challenge:
        (css/f'{stem}.challenge.json').write_text(json.dumps(challenge,ensure_ascii=False,indent=2),encoding='utf-8')

lessons=[
(14,'variables','Custom Properties و Design Tokens','متغیرهای CSS را برای رنگ، فاصله، تایپوگرافی و تم‌پذیری به‌کار ببرید.','intermediate',24,
 ['ساخت Custom Property در :root','مصرف متغیر با var()','تعریف fallback با var()','ساخت پایه یک Design Token system'],
 ['custom properties','var()','fallback','tokens',':root','inheritance'],['02-css/13-animation'],['02-css/15-fluid-values'],'02-css/15-fluid-values',r'''
## چرا Custom Properties؟
Custom Property مقدار زنده‌ای است که در CSS نگهداری می‌شود و با `var()` مصرف می‌شود. برخلاف ثابت‌های ساده، این مقدار در Cascade و inheritance رفتار CSS را حفظ می‌کند.

```css
:root {
  --color-primary: #2563eb;
  --space-4: 1rem;
  --radius: 12px;
}

.button {
  padding: var(--space-4);
  background: var(--color-primary);
  border-radius: var(--radius);
}
```

## Fallback
اگر متغیر تعریف نشده باشد می‌توانید مقدار جایگزین بدهید:

```css
color: var(--color-text, #111827);
```

## Tokenها
رنگ، فاصله، اندازه متن، radius و shadow را به Token تبدیل کنید تا تغییر سیستم طراحی در یک نقطه انجام شود.

## نکته مهم
Custom Property فقط «متغیر محلی» نیست؛ در DOM و Cascade قابل override است. همین ویژگی برای theme بسیار مفید است.

```css
[data-theme="dark"] {
  --color-bg: #0f172a;
  --color-text: #f8fafc;
}
```

### اشتباهات رایج
- تعریف Tokenهای زیاد بدون نام‌گذاری منظم
- hard-code کردن رنگ و فاصله در همه کامپوننت‌ها
- فراموش کردن fallback برای Tokenهایی که ممکن است unset باشند
'''),
(15,'fluid-values','calc، min، max و clamp','اندازه‌های سیال و محدودشده را برای کانتینر و تایپوگرافی واکنشگرا بسازید.','intermediate',24,
 ['ترکیب واحدها با calc()','محدود کردن مقدار با min و max','ساخت typography سیال با clamp()','ترکیب rem و vw برای zoom بهتر'],
 ['calc()','min()','max()','clamp()','fluid typography'],['02-css/14-variables'],['02-css/16-cascade'],'02-css/16-cascade',r'''
## `calc()`
برای ترکیب واحدها و ساخت مقدار محاسبه‌شده استفاده می‌شود:

```css
.container {
  width: calc(100% - 2rem);
}
```

## `min()` و `max()`
برای تعیین سقف یا کف مقدار مناسب‌اند:

```css
.container {
  width: min(100% - 2rem, 1100px);
}
```

## `clamp()`
سه مقدار دارد: حداقل، مقدار ترجیحی و حداکثر:

```css
h1 {
  font-size: clamp(1.75rem, 1.2rem + 2.5vw, 3rem);
}
```

مقدار ترجیحی فقط `vw` نباشد؛ ترکیب `vw` و `rem` کمک می‌کند zoom مرورگر بهتر عمل کند.

### تمرین مفهومی
یک container بسازید که همیشه حداقل 16px از دو طرف فاصله داشته باشد و از 1100px پهن‌تر نشود.
'''),
(16,'cascade','Cascade، Specificity و Inheritance','تعارض قوانین CSS را با منشأ، Specificity، ترتیب و وراثت تحلیل کنید.','intermediate',28,
 ['محاسبه Specificity','توضیح ترتیب Cascade','تشخیص propertyهای inherited','استفاده آگاهانه از inherit، initial، revert و unset'],
 ['cascade','specificity','inheritance','!important','@layer','DevTools'],['02-css/15-fluid-values'],['02-css/17-advanced-selectors'],'02-css/17-advanced-selectors',r'''
## ترتیب ساده‌شده Cascade
وقتی چند قانون با هم تعارض دارند، به‌صورت آموزشی این ترتیب را دنبال کنید:

1. اهمیت و منشأ
2. Specificity
3. ترتیب نوشتن؛ اگر قبلی‌ها برابر باشند، قانون بعدی برنده می‌شود.

## Specificity
به شکل سه‌تایی `(ID, Class, Element)` فکر کنید:

```css
p { color: black; }          /* 0,0,1 */
.note { color: blue; }       /* 0,1,0 */
p.note { color: green; }     /* 0,1,1 */
#intro { color: red; }       /* 1,0,0 */
```

مقایسه از چپ به راست است؛ یک ID از هر تعداد Class در این مدل قوی‌تر است. همین موضوع دلیل خوبی برای پرهیز از ID در styling است.

## Inheritance
ویژگی‌هایی مثل `color`، خانواده فونت، `line-height` و `text-align` معمولاً از والد به فرزند منتقل می‌شوند؛ `margin`، `padding`، `border` و `background` معمولاً inherited نیستند.

```css
a { color: inherit; }
```

کلیدواژه‌های مفید: `inherit`، `initial`، `revert` و `unset`.

## `@layer`
در پروژه‌های بزرگ می‌توان Cascade را با Layerها سازمان داد:

```css
@layer reset, base, components, utilities;
```

Layer بعدی در Cascade می‌تواند بر قبلی غلبه کند؛ این ابزار برای هماهنگ کردن CSS خودتان با کتابخانه‌ها مفید است.
'''),
(17,'advanced-selectors','Selectorهای پیشرفته','Selectorهای مدرن را برای کاهش پیچیدگی و ساخت حالت‌های دقیق به‌کار ببرید.','advanced',28,
 ['استفاده از :is و :where','نوشتن استثنا با :not','انتخاب والد با :has','ساخت focus قابل دسترس','استفاده از nth-child و Attribute Selector'],
 [':is()',':where()',':not()',':has()',':focus-visible',':focus-within',':nth-child','attribute selectors'],['02-css/16-cascade'],['02-css/18-stacking'],'02-css/18-stacking',r'''
## `:is()` و `:where()`

```css
:is(h1, h2, h3) a { color: inherit; }
:where(ul, ol) { padding-inline-start: 1.25rem; }
```

`:is()` Specificity را از قوی‌ترین آرگومان می‌گیرد؛ `:where()` Specificity صفر دارد و برای Reset و پایه بسیار مناسب است.

## `:not()` و `:has()`

```css
button:not(:disabled):hover { background: #1d4ed8; }
.card:has(img) { grid-template-columns: 120px 1fr; }
```

`:has()` می‌تواند بر اساس وجود فرزند، والد را انتخاب کند.

## Focus
برای تجربه کیبورد از `:focus-visible` و برای حالت والد از `:focus-within` استفاده کنید:

```css
a:focus-visible {
  outline: 3px solid #2563eb;
  outline-offset: 2px;
}
.field:focus-within { border-color: #2563eb; }
```

## nth و Attribute

```css
li:nth-child(3n + 1) { /* ... */ }
a[href^="https://"]:not([href*="mysite.com"])::after { content: " ↗"; }
```

پشتیبانی ویژگی‌های جدید را پیش از استفاده در محصول واقعی بررسی کنید.
'''),
(18,'stacking','Stacking Context و z-index','دلیل بی‌اثر شدن z-index را با Stacking Context و isolation بفهمید.','advanced',24,
 ['تشخیص Stacking Context','شناخت اثر opacity و transform','مدیریت لایه‌های UI با Token','استفاده از isolation برای مرزبندی'],
 ['stacking context','z-index','opacity','transform','isolation','layer tokens'],['02-css/17-advanced-selectors'],['02-css/19-layout-advanced'],'02-css/19-layout-advanced',r'''
## چرا `z-index: 9999` همیشه برنده نیست؟
هر Stacking Context مثل یک جزیره مستقل است. فرزندان آن فقط در همان Context با هم مقایسه می‌شوند.

مواردی مانند `opacity < 1`، `transform`، `filter`، `perspective`، `position: fixed` و بعضی حالت‌های `z-index` می‌توانند Context جدید بسازند.

```css
:root {
  --z-dropdown: 100;
  --z-sticky: 200;
  --z-modal: 1000;
  --z-toast: 1100;
}
```

به‌جای عددهای تصادفی، یک scale برای لایه‌ها بسازید.

## `isolation`
برای اینکه Context داخلی یک کامپوننت روی بیرون اثر نگذارد:

```css
.card {
  isolation: isolate;
}
```

وقتی tooltip زیر کارت دیگری می‌رود، اول والدها و Contextهای آن را بررسی کنید، نه اینکه فقط `z-index` را بیشتر کنید.
'''),
(19,'layout-advanced','Flexbox و Grid پیشرفته','Flexbox و Grid را برای محتوای متغیر، auto-fit و auto-fill حرفه‌ای‌تر استفاده کنید.','advanced',30,
 ['حل overflow با min-width: 0','استفاده درست از flex basis/grow/shrink','ساخت Grid خودکار با minmax','تفاوت auto-fit و auto-fill','استفاده از aspect-ratio و place-items'],
 ['min-width: 0','flex-basis','flex-grow','flex-shrink','auto-fit','auto-fill','minmax()','aspect-ratio','subgrid'],['02-css/18-stacking'],['02-css/20-container-query'],'02-css/20-container-query',r'''
## Flex و `min-width: 0`
در Flex، مقدار پیش‌فرض `min-width: auto` می‌تواند باعث شود متن طولانی بیرون بزند:

```css
.row { display: flex; gap: 1rem; }
.row__content { min-width: 0; }
```

`flex-basis` اندازه اولیه است و `flex-grow` و `flex-shrink` فضای اضافی یا کمبود را تقسیم می‌کنند.

## Margin auto
یک آیتم می‌تواند فضای باقی‌مانده را بگیرد:

```css
.navbar__logout {
  margin-inline-start: auto;
}
```

## Grid خودکار

```css
.gallery {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 12px;
}
```

`auto-fit` ستون‌های خالی را جمع می‌کند و آیتم‌ها را می‌کشد؛ `auto-fill` جای ستون‌های ممکن را حفظ می‌کند.

## Aspect Ratio

```css
.thumb {
  aspect-ratio: 16 / 9;
  object-fit: cover;
  width: 100%;
}
```

`subgrid` برای هم‌ترازی داخلی کارت‌ها در مرورگرهای مدرن مفید است؛ پشتیبانی هدف را بررسی کنید.
'''),
(20,'container-query','Container Query','کامپوننت‌های مستقل را بر اساس عرض والد، نه viewport، واکنشگرا کنید.','advanced',24,
 ['تعریف query container','استفاده از @container','تفاوت Media Query و Container Query','طراحی کامپوننت مستقل'],
 ['container-type','container-name','@container','component responsiveness'],['02-css/19-layout-advanced'],['02-css/21-architecture'],'02-css/21-architecture',r'''
## Media Query در برابر Container Query
Media Query عرض viewport را می‌سنجد؛ Container Query اندازه container والد را.

```css
.card-wrapper {
  container-type: inline-size;
  container-name: card;
}

.card {
  display: grid;
  gap: 12px;
}

@container card (min-width: 480px) {
  .card {
    grid-template-columns: 160px 1fr;
  }
}
```

حالا همان Card می‌تواند در sidebar باریک ساده باشد و در ستون عریض دو ستونه شود.

`container-type: inline-size` والد را قابل پرس‌وجو می‌کند؛ شرط `@container` روی اندازه آن والد اعمال می‌شود.

این قابلیت برای کامپوننت‌های مستقل بسیار مناسب است، اما پشتیبانی مرورگرهای هدف را قبل از استفاده بررسی کنید.
'''),
(21,'architecture','معماری CSS، BEM، Reset و Nesting','CSS را کامپوننت‌محور و قابل نگهداری سازمان دهید و با Reset کوچک شروع کنید.','advanced',30,
 ['نام‌گذاری BEM','کاهش عمق Selector','ساخت ساختار فایل CSS','نوشتن Reset کوچک','شناخت CSS Nesting'],
 ['BEM','Block','Element','Modifier','CSS reset','Nesting','component architecture'],['02-css/20-container-query'],['02-css/22-accessibility-performance'],'02-css/22-accessibility-performance',r'''
## BEM
BEM قرارداد Block / Element / Modifier است:

```html
<article class="card card--featured">
  <img class="card__image" src="..." alt="" />
  <h3 class="card__title">عنوان</h3>
  <button class="card__button card__button--primary">خرید</button>
</article>
```

Selectorها کوتاه و کم‌عمق بمانند و به ساختار HTML وابستگی شدید نداشته باشند.

## ساختار فایل
یک ساختار قابل توسعه می‌تواند چنین باشد:

```text
css/
├── base/
│   ├── reset.css
│   ├── variables.css
│   └── typography.css
├── layout/
│   ├── container.css
│   └── grid.css
└── components/
    ├── button.css
    ├── card.css
    └── navbar.css
```

## Reset کوچک

```css
*, *::before, *::after { box-sizing: border-box; }
body { margin: 0; line-height: 1.6; }
img, picture, video, svg { display: block; max-width: 100%; height: auto; }
input, button, textarea, select { font: inherit; }
```

## CSS Nesting
در مرورگرهای مدرن می‌توان nesting بومی داشت:

```css
.card {
  padding: 1rem;
  & .title { font-size: 1.25rem; }
  &:hover { box-shadow: 0 4px 12px rgb(0 0 0 / .1); }
}
```

عمق nesting را زیاد نکنید و پشتیبانی مرورگر را بررسی کنید.
'''),
(22,'accessibility-performance','دسترس‌پذیری و عملکرد در CSS','Focus، reduced-motion، کنتراست، هدف لمسی و نکات عملکردی CSS را رعایت کنید.','advanced',28,
 ['ساخت visible focus','پشتیبانی prefers-reduced-motion','رعایت contrast','ساخت visually-hidden','شناخت نکات عملکردی مهم'],
 ['focus-visible','prefers-reduced-motion','contrast','visually-hidden','skip-link','font-display','CSS performance'],['02-css/21-architecture'],['02-css/23-modern-css'],'02-css/23-modern-css',r'''
## Focus قابل مشاهده
هرگز `outline: none` را بدون جایگزین استفاده نکنید:

```css
:focus-visible {
  outline: 3px solid var(--color-primary);
  outline-offset: 3px;
}
```

## Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  .card { transition: none; }
  * { scroll-behavior: auto !important; }
}
```

## نکات دسترس‌پذیری
- کنتراست متن معمولی حداقل حدود 4.5:1 باشد.
- هدف لمسی دکمه‌ها و لینک‌ها در موبایل حدود 44×44px باشد.
- رنگ تنها حامل معنا نباشد.
- اندازه متن را با `rem` بسازید.

## Visually Hidden

```css
.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  padding: 0;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
  border: 0;
}
```

## Skip Link
لینک skip می‌تواند هنگام فوکوس ظاهر شود تا کاربر کیبورد سریع به محتوای اصلی برسد.

## عملکرد
- انیمیشن‌های UI را ترجیحاً روی `transform` و `opacity` محدود کنید.
- وزن‌های غیرضروری فونت را بارگذاری نکنید.
- تصاویر background بزرگ را بهینه کنید.
- Selectorهای بی‌دلیل پیچیده را زیاد نکنید.
'''),
(23,'modern-css','ویژگی‌های مدرن CSS','ویژگی‌های مدرن مانند logical properties، gap، aspect-ratio و accent-color را در جای مناسب بشناسید.','advanced',24,
 ['شناخت gap و aspect-ratio','شناخت inset و logical properties','آشنایی با accent-color','شناخت scroll-snap و text-wrap','بررسی پشتیبانی قبل از استفاده'],
 ['gap','aspect-ratio','inset','accent-color','scroll-snap','svh','dvh','text-wrap: balance'],['02-css/22-accessibility-performance'],['02-css/24-logical-rtl'],'02-css/24-logical-rtl',r'''
## چند قابلیت کاربردی

```css
.card-grid { gap: 1rem; }
.thumb { aspect-ratio: 16 / 9; }
.badge { inset: 0 auto auto 0; }
```

`gap` فاصله Flex و Grid را ساده می‌کند و `aspect-ratio` نسبت تصویر را بدون hack حفظ می‌کند.

ویژگی‌های دیگری که در جزوه به‌عنوان مرور حرفه‌ای آمده‌اند:
- `accent-color` برای کنترل رنگ native checkbox/radio
- `scroll-snap` برای اسکرول مرحله‌ای
- `svh` و `dvh` برای ارتفاع viewport موبایل
- `text-wrap: balance` برای متعادل کردن خطوط عنوان
- CSS Nesting، `@layer` و Container Query

قبل از استفاده از ویژگی جدید، جدول پشتیبانی MDN یا Can I Use را بررسی کنید و برای مرورگرهای قدیمی fallback مناسب در نظر بگیرید.
'''),
(24,'logical-rtl','Logical Properties و RTL','CSS را برای رابط فارسی و دوطرفه با ویژگی‌های منطقی بنویسید.','intermediate',20,
 ['جایگزینی left/right با logical properties','استفاده از inline و block axis','ساخت spacing مناسب RTL/LTR','استفاده از text-align: start'],
 ['logical properties','margin-inline','padding-block','inset-inline-start','text-align: start','RTL','LTR'],['02-css/23-modern-css'],['02-css/25-real-ui'],'02-css/25-real-ui',r'''
## مشکل ویژگی‌های فیزیکی
در CSS سنتی ممکن است بنویسیم:

```css
.box {
  margin-left: 16px;
  padding-right: 8px;
  text-align: left;
}
```

برای UI فارسی و انگلیسی بهتر است از محورهای منطقی استفاده کنیم:

```css
.box {
  margin-inline-start: 16px;
  padding-inline-end: 8px;
  text-align: start;
}
```

همین الگو برای `padding-block`، `margin-block` و `inset-inline-start` نیز قابل استفاده است.

### مزیت
وقتی `dir` تغییر کند، CSS منطقی بدون نوشتن نسخه دوم برای جهت مخالف، رفتار مناسب‌تری دارد.
'''),
(25,'real-ui','ساخت UI واقعی با Design Tokens','یک سیستم طراحی کوچک با Tokenها، حالت‌های کامپوننت و layout واکنشگرا بسازید.','advanced',32,
 ['ساخت Tokenهای رنگ و فاصله','تعریف stateهای component','ساخت container و card grid','استفاده ترکیبی از Flex و Grid','ساخت UI قابل تغییر با یک Token'],
 ['design tokens','component states','container','card grid','BEM','responsive UI'],['02-css/24-logical-rtl'],['02-css/26-dashboard-project'],None,r'''
## ظاهر حرفه‌ای از سیستم می‌آید
چهار گام اصلی جزوه:

1. Design Tokens با Custom Properties
2. Reset و پایه‌های منظم
3. Componentها با stateهای عادی، hover، active، disabled و focus-visible
4. Layout واکنشگرا با container و Grid/Flex

نمونه Tokenها:

```css
:root {
  --primary-600: #2563eb;
  --gray-200: #e2e8f0;
  --gray-900: #0f172a;
  --space-2: .5rem;
  --space-6: 1.5rem;
  --radius: 12px;
}
```

نمونه Button:

```css
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-6);
  border: 0;
  border-radius: var(--radius);
  background: var(--primary-600);
  color: #fff;
  font: inherit;
}
```

برای layout:

```css
.container {
  width: min(100% - 2rem, 1100px);
  margin-inline: auto;
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: var(--space-6);
}
```

تمرکز این درس روی ترکیب اصول است، نه افکت‌های زیاد. فاصله منظم، سلسله‌مراتب، رنگ محدود، همسویی و stateهای کامل نتیجه بهتری می‌دهند.
'''),
]
for args in lessons:
    write_lesson(*args)

# fix previous next link
p=css/'13-animation.md'
t=p.read_text(encoding='utf-8').replace('relatedLessons:\n  - 02-css/14-variables','relatedLessons:\n  - 02-css/14-variables').replace('nextLesson: 02-css/14-variables','nextLesson: 02-css/14-variables')
p.write_text(t,encoding='utf-8')

# Add practice assets
assets={
14:(
 {"id":"css-ex-014","title":"ساخت Tokenها","desc":"سه رنگ و سه فاصله را به Custom Property تبدیل کنید.","start":"" ,"tests":[["primary token","getComputedStyle(document.documentElement).getPropertyValue('--color-primary').trim() !== ''"],["spacing token","getComputedStyle(document.documentElement).getPropertyValue('--space-4').trim() !== ''"]]},
 [{"q":"برای مصرف Custom Property از کدام تابع استفاده می‌شود؟","o":["token()","var()","use()","value()"],"a":1,"e":"مقدار با var(--name) مصرف می‌شود."},{"q":"کدام selector برای theme در نمونه درس استفاده شد؟","o":[":theme","[data-theme=\"dark\"]",".theme-dark-only","@theme"],"a":1,"e":"Attribute selector برای theme روی data-theme قرار گرفت."}],
 {"title":"Design Tokens","desc":"یک کارت با Tokenهای رنگ و فاصله بسازید.","html":"<article class='card'><h2>Card</h2><p>Token driven UI</p><button>عملیات</button></article>","css":":root{--primary:#2563eb;--space:1rem;--radius:12px}.card{padding:var(--space);border-radius:var(--radius);border:1px solid #ddd}.card button{background:var(--primary);color:white;padding:.5rem 1rem;border:0;border-radius:8px}","js":"","checks":[["Token exists","getComputedStyle(document.documentElement).getPropertyValue('--primary').trim() !== ''"]]}
),
15:({"id":"css-ex-015","title":"Typography سیال","desc":"برای h1 از clamp استفاده کنید.","start":"","tests":[["uses clamp","getComputedStyle(document.querySelector('h1')).fontSize !== ''"]]},
 [{"q":"ساختار clamp چیست؟","o":["max,min,value","min,preferred,max","start,end,step","low,high"],"a":1,"e":"clamp(min, preferred, max) سه مقدار دارد."}],
 {"title":"Fluid Heading","desc":"یک h1 با اندازه سیال بسازید.","html":"<h1>عنوان سیال</h1>","css":"h1{font-size:clamp(1.75rem,1.2rem + 2.5vw,3rem)}","js":"","checks":[]}),
16:({"id":"css-ex-016","title":"تحلیل Specificity","desc":"قوانین داده‌شده را از نظر Specificity مقایسه کنید.","start":"","tests":[["class rule exists","document.querySelector('.note') !== null"]]},
 [{"q":"کدام Specificity قوی‌تر است؟","o":["p",".note","p.note","#intro"],"a":3,"e":"در مدل آموزشی جزوه، ID بالاترین بخش Specificity را دارد."}],
 {"title":"Cascade Lab","desc":"چهار قانون متعارض را بررسی کنید.","html":"<p id='intro' class='note'>متن</p>","css":"p{color:black}.note{color:blue}p.note{color:green}#intro{color:red}","js":"","checks":[["element exists","document.querySelector('#intro') !== null"]]}),
17:({"id":"css-ex-017","title":"Selectorهای دقیق","desc":"focus-visible و :not را در یک دکمه به‌کار ببرید.","start":"","tests":[["button exists","document.querySelector('button') !== null"]]},
 [{"q":":where چه Specificity دارد؟","o":["صفر","بزرگ‌ترین آرگومان","یک ID","یک element"],"a":0,"e":":where Specificity صفر دارد."}],
 {"title":"Advanced Selectors","desc":"یک دکمه disabled و enabled بسازید.","html":"<button>فعال</button><button disabled>غیرفعال</button>","css":"button:not(:disabled):hover{background:#1d4ed8}button:focus-visible{outline:3px solid #2563eb}","js":"","checks":[]}),
18:({"id":"css-ex-018","title":"Stacking Context","desc":"یک سیستم z-index بسازید.","start":"","tests":[["modal token","getComputedStyle(document.documentElement).getPropertyValue('--z-modal').trim() !== ''"]]},
 [{"q":"چرا z-index:9999 ممکن است بی‌اثر باشد؟","o":["چون عدد کوچک است","چون font-size دخالت دارد","چون Stacking Context والد محدودکننده است","چون z-index فقط برای متن است"],"a":2,"e":"Stacking Contextها فرزندان را در یک جزیره مستقل مقایسه می‌کنند."}],
 {"title":"Layer Lab","desc":"دو لایه با scale مشخص بسازید.","html":"<div class='back'>Back</div><div class='front'>Front</div>","css":":root{--z-back:1;--z-front:10}.back,.front{position:absolute;padding:2rem}.back{z-index:var(--z-back)}.front{z-index:var(--z-front);margin:1rem}","js":"","checks":[]}),
19:({"id":"css-ex-019","title":"Grid خودکار","desc":"یک gallery با auto-fit و minmax بسازید.","start":"","tests":[["grid exists","getComputedStyle(document.querySelector('.gallery')).display === 'grid'"]]},
 [{"q":"برای جلوگیری از بیرون‌زدن متن از Flex item چه property مهمی است؟","o":["max-width:100%","min-width:0","display:block","overflow:visible"],"a":1,"e":"min-width:0 اجازه کوچک‌شدن محتوای Flex item را می‌دهد."}],
 {"title":"Auto Grid","desc":"شبکه کارت خودکار بسازید.","html":"<div class='gallery'><article>A</article><article>B</article><article>C</article></div>","css":".gallery{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:12px}.gallery article{padding:2rem;border:1px solid #ddd}","js":"","checks":[["grid","getComputedStyle(document.querySelector('.gallery')).display === 'grid'"]]}),
20:({"id":"css-ex-020","title":"Container Query","desc":"یک container قابل پرس‌وجو تعریف کنید.","start":"","tests":[["container type","getComputedStyle(document.querySelector('.wrapper')).containerType === 'inline-size'"]]},
 [{"q":"Container Query چه چیزی را می‌سنجد؟","o":["viewport","عرض والد container","font-size","ارتفاع body"],"a":1,"e":"Container Query اندازه container والد را بررسی می‌کند."}],
 {"title":"Container Card","desc":"Card را با عرض container تغییر دهید.","html":"<div class='wrapper'><article class='card'>Card</article></div>","css":".wrapper{container-type:inline-size}.card{padding:1rem}@container (min-width:480px){.card{display:grid;grid-template-columns:160px 1fr}}","js":"","checks":[]}),
21:({"id":"css-ex-021","title":"BEM","desc":"Card را با Block، Element و Modifier نام‌گذاری کنید.","start":"","tests":[["BEM title","document.querySelector('.card__title') !== null"]]},
 [{"q":"در BEM، card__title چیست؟","o":["Modifier","Element","Utility","Layer"],"a":1,"e":"دو underscore برای Element استفاده شد."}],
 {"title":"BEM Card","desc":"یک کارت BEM بسازید.","html":"<article class='card card--featured'><h2 class='card__title'>عنوان</h2></article>","css":".card{padding:1rem}.card__title{margin:0}.card--featured{border:2px solid #2563eb}","js":"","checks":[]}),
22:({"id":"css-ex-022","title":"Accessible Focus","desc":"focus-visible و reduced-motion را اضافه کنید.","start":"","tests":[["focus rule","document.querySelector('button') !== null"]]},
 [{"q":"کدام media query برای کاهش motion است؟","o":["prefers-motion","prefers-reduced-motion","reduce-animation","motion:none"],"a":1,"e":"@media (prefers-reduced-motion: reduce) استفاده می‌شود."}],
 {"title":"Focus Lab","desc":"حالت focus قابل مشاهده بسازید.","html":"<button>ذخیره</button>","css":"button:focus-visible{outline:3px solid #2563eb;outline-offset:3px}@media (prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important}}","js":"","checks":[]}),
23:({"id":"css-ex-023","title":"Modern CSS","desc":"از aspect-ratio و gap استفاده کنید.","start":"","tests":[["ratio","getComputedStyle(document.querySelector('.thumb')).aspectRatio !== 'auto'"]]},
 [{"q":"aspect-ratio چه کاری انجام می‌دهد؟","o":["رنگ را تغییر می‌دهد","نسبت ابعاد را حفظ می‌کند","فونت را بارگذاری می‌کند","z-index را کنترل می‌کند"],"a":1,"e":"برای نسبت ابعاد عنصر استفاده می‌شود."}],
 {"title":"Media Tile","desc":"یک tile با نسبت 16/9 بسازید.","html":"<div class='thumb'>تصویر</div>","css":".thumb{aspect-ratio:16/9;background:#e2e8f0;display:grid;place-items:center}","js":"","checks":[]}),
24:({"id":"css-ex-024","title":"RTL Logical Properties","desc":"margin و padding را منطقی کنید.","start":"","tests":[["logical margin","document.querySelector('.box') !== null"]]},
 [{"q":"کدام property با جهت inline سازگارتر است؟","o":["margin-left","margin-inline-start","padding-right","left"],"a":1,"e":"margin-inline-start با جهت نوشتار سازگار است."}],
 {"title":"RTL Lab","desc":"با logical properties یک box بسازید.","html":"<div class='box'>محتوا</div>","css":".box{margin-inline-start:1rem;padding-inline:1rem;text-align:start;border:1px solid #ddd}","js":"","checks":[]}),
25:({"id":"css-ex-025","title":"Token UI","desc":"یک card با tokenها و stateهای کامل بسازید.","start":"","tests":[["button","document.querySelector('.btn') !== null"],["token","getComputedStyle(document.documentElement).getPropertyValue('--primary-600').trim() !== ''"]]},
 [{"q":"کدام مورد بخشی از سیستم UI در جزوه است؟","o":["فقط hover","normal, hover, active, disabled و focus-visible","فقط animation","فقط رنگ"],"a":1,"e":"کامپوننت باید حالت‌های مختلف قابل مشاهده و قابل استفاده داشته باشد."}],
 {"title":"Mini Design System","desc":"یک دکمه و کارت با Token بسازید.","html":"<article class='card'><h2>محصول</h2><p>توضیح</p><button class='btn'>خرید</button></article>","css":":root{--primary-600:#2563eb;--space-4:1rem;--radius:12px}.card{padding:var(--space-4);border-radius:var(--radius);border:1px solid #e2e8f0}.btn{padding:.6rem 1rem;border:0;border-radius:var(--radius);background:var(--primary-600);color:white}.btn:focus-visible{outline:3px solid var(--primary-600);outline-offset:3px}","js":"","checks":[["token","getComputedStyle(document.documentElement).getPropertyValue('--primary-600').trim() !== ''"]]})
}
for n,data in assets.items():
    stem=f'{n:02d}-'+[x[1] for x in lessons if x[0]==n][0]
    if isinstance(data,tuple): write_json(stem,*data)
    else: write_json(stem,*data)

# Challenge for final integrated UI
challenge={"id":"css-ch-002","title":"Challenge: ساخت سیستم UI با CSS","brief":"یک صفحه Style Guide کوچک بسازید که یک Button، Card، Badge و Alert را با Tokens و حالت‌های دسترس‌پذیر نمایش دهد.","requirements":["رنگ‌ها و spacing فقط از Custom Properties بیایند","BEM برای componentها استفاده شود","Button حالت hover، active، disabled و focus-visible داشته باشد","Card با Grid/Flex و layout واکنشگرا ساخته شود","RTL با Logical Properties پشتیبانی شود","prefers-reduced-motion رعایت شود","هیچ ID برای styling استفاده نشود","بدون framework و بدون JavaScript"],"hints":["اول :root را برای Tokenها بساز","Selectorها را کوتاه نگه دار","برای focus از :focus-visible استفاده کن","برای جهت از margin-inline و padding-inline استفاده کن"],"acceptanceCriteria":["در 320، 768 و 1440 بدون اسکرول افقی باشد","کنتراست متن معمولی حداقل 4.5:1 باشد","همه عناصر تعاملی focus قابل مشاهده داشته باشند","با تغییر یک Token رنگ اصلی componentها تغییر کند","هیچ !important مگر reduced-motion وجود نداشته باشد"],"skills":["custom properties","clamp","BEM","logical properties","responsive layout","accessibility"]}
(css/'25-real-ui.challenge.json').write_text(json.dumps(challenge,ensure_ascii=False,indent=2),encoding='utf-8')

# Advanced dashboard project
project={"id":"css-advanced-dashboard","slug":"css-advanced-dashboard","title":"Advanced CSS Project: داشبورد مدیریتی","type":"skill","description":"یک داشبورد مدیریتی واکنشگرا با Design Tokens، تم روشن/تیره، Grid Areas، Flexbox، BEM و دسترس‌پذیری بسازید؛ بدون JavaScript.","difficulty":"advanced","prerequisites":[f"02-css/{i:02d}-{slug}" for i,slug,*_ in lessons],"technologies":["HTML","CSS"],"skills":["custom properties","clamp","media query","container query","grid areas","flexbox","BEM","logical properties","accessibility","performance"],"requirements":["Sidebar ناوبری","Top bar با جستجو و avatar","چهار کارت آماری","جدول داده","نمودار ساده با CSS","لیست فعالیت‌های اخیر","Badgeهای وضعیت","Alert","تم روشن و تیره با prefers-color-scheme","responsive layout در 320/768/1440","focus-visible و reduced-motion"],"milestones":[
 {"id":"m1-tokens","title":"Design Tokens و پایه","description":"Tokenها، Reset، تایپوگرافی و stateهای پایه را بسازید.","requiredLessons":["02-css/14-variables","02-css/15-fluid-values","02-css/21-architecture"],"requiredSkills":["tokens","reset","BEM"],"tasks":["color tokens","spacing tokens","typography tokens","BEM naming","small reset"],"checkpoint":"با تغییر یک Token، بخش‌های مرتبط UI تغییر کنند."},
 {"id":"m2-layout","title":"Layout و Component","description":"Grid Areas، Flexbox و Cardها را پیاده کنید.","requiredLessons":["02-css/19-layout-advanced","02-css/20-container-query","02-css/25-real-ui"],"requiredSkills":["grid","flexbox","container-query"],"tasks":["sidebar","topbar","stats grid","activity list","data table","CSS chart"],"checkpoint":"چیدمان در عرض‌های هدف بدون overflow باشد."},
 {"id":"m3-quality","title":"دسترس‌پذیری و کیفیت","description":"Focus، contrast، motion و RTL را کامل کنید.","requiredLessons":["02-css/22-accessibility-performance","02-css/23-modern-css","02-css/24-logical-rtl"],"requiredSkills":["accessibility","performance","RTL"],"tasks":["dark theme","focus-visible","reduced-motion","logical properties","responsive test"],"checkpoint":"UI در 320، 768 و 1440 قابل استفاده و بدون اسکرول افقی باشد."}
],"deliverables":["index.html","styles.css","README.md","responsive-test-notes.md"],"acceptanceCriteria":["بدون framework و JavaScript","رنگ و فاصله hard-coded خارج از Tokens نباشد","Selectorها حداکثر دو سطح باشند","هر دو theme کنتراست حداقل 4.5:1 داشته باشند","همه interactive elementها focus-visible داشته باشند","prefers-reduced-motion رعایت شود","هیچ ID برای styling استفاده نشود"],"extensionIdeas":["تبدیل dashboard به React","افزودن API داده‌ها در فصل HTTP/API","افزودن theme switcher با JavaScript در فصل Browser"]}
(root/'content/projects/css-advanced-dashboard.json').write_text(json.dumps(project,ensure_ascii=False,indent=2),encoding='utf-8')

# Update animation link, responsive project prerequisites later not necessary; update journey CSS milestone with advanced lessons
jp=root/'content/projects/journey-ecommerce.json'
d=json.loads(jp.read_text(encoding='utf-8'))
for m in d['milestones']:
    if m['id']=='m2-css':
        m['requiredLessons']=[f'02-css/{i:02d}-{slug}' for i,slug,*_ in lessons]
        m['requiredSkills'] += ['custom properties','clamp','specificity','advanced selectors','stacking context','container query','BEM','accessibility','logical properties']
        m['tasks'] += ['design tokens','cascade debugging','responsive component patterns','RTL-friendly spacing','accessibility states']
jp.write_text(json.dumps(d,ensure_ascii=False,indent=2),encoding='utf-8')
print('created',len(lessons),'lessons')
