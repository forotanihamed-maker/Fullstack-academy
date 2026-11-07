# Movie Explorer — اپلیکیشن جستجوی فیلم با API خارجی

> **سطح:** متوسط تا پیشرفته  
> **مرحله:** JavaScript / Async / API  
> **وضعیت:** در حال انجام (پروژه‌ی اصلی مرحله‌ی بعدی)  
> **API:** OMDb (راهنمای مخصوص آن در همین صفحه آمده است)  
> **زمان پیشنهادی:** ۷ تا ۱۲ روز  
> **پیش‌نیاز:** فصل ۵ (Async و Promise) و فصل ۶ (Fetch، HTTP و API)

## هدف

ساخت یک اپلیکیشن واقعی که با یک API خارجی کار می‌کند: جستجوی فیلم، نمایش نتایج و جزئیات، با مدیریت درست Loading، Empty و Error.

این پروژه مرز بین «JavaScript پایه و DOM» و «JavaScript مدرن به‌همراه کار با API» است. اگر این را درست بسازی، React برایت خیلی راحت‌تر می‌شود.

## مسیر ساخت (Milestoneها)

```text
API Connection → Fetch Movies → Parse JSON → Render Movies → Search → Debounce
→ AbortController → Movie Details → Loading / Empty / Error → Refactoring → Final Testing
```

| مرحله | کار | «تمام شد» یعنی |
|-------|-----|----------------|
| ۱ | **API Connection** | با یک درخواست دستی در Console جواب واقعی (۲۰۰) می‌گیری و ساختار JSON را می‌شناسی |
| ۲ | **Fetch Movies** | تابع `searchMovies(query)` داری که لیست خام برمی‌گرداند |
| ۳ | **Parse JSON** | پاسخ API را به مدل خودت (`Movie`) تبدیل می‌کنی (بخش «Adapter») |
| ۴ | **Render Movies** | کارت فیلم‌ها (پوستر، عنوان، سال، امتیاز) روی صفحه نمایش داده می‌شود |
| ۵ | **Search** | فرم جستجو نتیجه‌ی واقعی نشان می‌دهد |
| ۶ | **Debounce** | با تایپ سریع، فقط یک درخواست نهایی ارسال می‌شود |
| ۷ | **AbortController** | درخواست قبلی لغو می‌شود و جواب قدیمی روی جدید نمی‌نشیند |
| ۸ | **Movie Details** | با کلیک روی فیلم، جزئیات (`<dialog>` یا صفحه‌ی جدا) نمایش داده می‌شود |
| ۹ | **Loading / Empty / Error** | هر چهار حالت (`idle`، `loading`، `empty`، `error`) جدا مدیریت می‌شوند |
| ۱۰ | **Refactoring** | کد به Moduleهای مشخص تقسیم و تمیز می‌شود |
| ۱۱ | **Final Testing** | همه‌ی سناریوهای جدول تست پایین را گذرانده‌ای |

## ساختار پیشنهادی

```text
movie-explorer/
├── index.html
├── css/style.css
├── config.example.js     ← نمونه‌ی تنظیمات (در Git می‌ماند)
├── config.js             ← کلید واقعی (در .gitignore)
└── js/
    ├── api/
    │   ├── client.js     ← request / HttpError (فصل ۶)
    │   └── movies.js     ← searchMovies، getMovieDetails، adapter
    ├── ui/
    │   ├── render.js     ← renderMovies، renderDetails، renderStatus
    │   └── state.js      ← status و داده‌ی فعلی
    ├── utils/
    │   └── debounce.js
    └── main.js           ← اتصال Event ها
```

## مدیریت API Key

> **مهم:** هر چیزی که در JavaScript مرورگر باشد برای همه قابل‌دیدن است؛ پس کلید API در Front-End هیچ‌وقت «محرمانه» نیست. فقط می‌توانی از **Commit شدن آن در Git** جلوگیری کنی.

```js
// config.example.js  (این فایل Commit می‌شود)
export const API_KEY = "PUT_YOUR_KEY_HERE";
export const BASE_URL = "https://api.example.com";
```

```text
# .gitignore
config.js
```

```js
// config.js  (فقط روی کامپیوتر خودت؛ Commit نمی‌شود)
export const API_KEY = "کلید واقعی تو";
```

- اگر کلید به‌اشتباه Push شد، آن را **فوراً در پنل سرویس عوض (Rotate) کن**؛ حذف از Commit بعدی کافی نیست (فصل Git).
- از کلید رایگان و محدودشده استفاده کن و محدودیت سرویس (Rate Limit) را در مستندات بخوان.
- برای کلیدهای واقعاً محرمانه، درخواست باید از طریق Back-End تو عبور کند (در فصل‌های Backend می‌آموزی).

## Adapter: مدل داده‌ی خودت

پاسخ هر API شکل خودش را دارد و ممکن است عوض شود. بین API و UI یک تبدیل بگذار تا UI فقط مدل خودت را بشناسد:

```js
// api/movies.js
function toMovie(raw) {
  return {
    id: raw.id,
    title: raw.title ?? "بدون عنوان",
    year: raw.release_date?.slice(0, 4) ?? "—",
    rating: typeof raw.vote_average === "number" ? raw.vote_average.toFixed(1) : "—",
    posterUrl: raw.poster_path ? `${IMAGE_BASE}${raw.poster_path}` : null,
    overview: raw.overview ?? ""
  };
}
```

(نام فیلدها را مطابق مستندات **API خودت** تغییر بده؛ نکته، وجود یک لایه‌ی تبدیل و مدیریت مقدارهای خالی است. نسخه‌ی مخصوص OMDb در بخش بعد آمده است.)

اگر پوستر وجود ندارد، یک تصویر جایگزین (Placeholder) نشان بده؛ `null` نباید به `<img src="null">` تبدیل شود.

## راهنمای مخصوص OMDb

> این بخش بر اساس شناخت عمومی از OMDb نوشته شده است. قبل از استفاده، مستندات `omdbapi.com` را هم بخوان؛ ممکن است جزئیات عوض شده باشد.

**آدرس پایه:** `https://www.omdbapi.com/`

| پارامتر | معنی |
|---------|------|
| `apikey` | کلید تو (الزامی) |
| `s` | جستجو بر اساس عنوان (لیست نتایج) |
| `i` | جزئیات یک فیلم با شناسه‌ی IMDb (مثل `tt0096895`) |
| `t` | جزئیات با عنوان دقیق |
| `type` | `movie`، `series` یا `episode` |
| `y` | سال |
| `page` | شماره‌ی صفحه‌ی جستجو (هر صفحه ۱۰ نتیجه) |
| `plot` | `short` یا `full` (برای جزئیات) |

**شکل پاسخ جستجو** (`?s=batman`):

```json
{
  "Search": [
    { "Title": "Batman", "Year": "1989", "imdbID": "tt0096895", "Type": "movie", "Poster": "https://..." }
  ],
  "totalResults": "523",
  "Response": "True"
}
```

### نکته‌های غافلگیرکننده‌ی OMDb

| ویژگی | چه کار کنم؟ |
|-------|--------------|
| خطا را اغلب با **HTTP 200** و `"Response": "False"` برمی‌گرداند | `response.ok` کافی نیست؛ فیلد `Response` را هم بررسی کن |
| پیام خطا در فیلد `Error` است (مثل `Movie not found!`، `Too many results.`، `Incorrect IMDb ID.`، `Invalid API key!`) | بر اساس آن پیام مناسب نشان بده |
| `Movie not found!` یعنی «نتیجه‌ای نیست»، نه خطای واقعی | آن را به حالت **Empty** تبدیل کن |
| جستجوی خیلی کوتاه (۱ تا ۲ حرف) معمولاً `Too many results.` می‌دهد | حداقل ۳ حرف برای شروع جستجو |
| `totalResults` رشته است | `Number(...)` |
| مقدار نامعلوم به‌صورت رشته‌ی `"N/A"` می‌آید (نه `null`) | در Adapter به `null` تبدیل کن (مخصوصاً `Poster`، `Plot`، `imdbRating`) |
| نام فیلدها با حرف بزرگ (`Title`، `Year`) | Adapter برای مدل خودت |
| هر صفحه ۱۰ نتیجه | تعداد صفحه = `Math.ceil(total / 10)` |
| کلید در Query String است و در تب Network دیده می‌شود | هرگز Commit نکن (بخش «مدیریت API Key»)؛ نسخه‌ی رایگان محدودیت روزانه دارد (پیام `Request limit reached!`) |
| آدرس پوستر ممکن است باز نشود | `onerror` روی `<img>` و تصویر جایگزین |

### `api/omdb.js` (با `client.js` فصل ۶)

در `client.js` مقدار `BASE_URL` را `https://www.omdbapi.com` بگذار. بعد:

```js
// api/omdb.js
import { request } from "./client.js";
import { API_KEY } from "../config.js";

export class OmdbError extends Error {
  constructor(message) {
    super(message);
    this.name = "OmdbError";
  }
}

async function omdb(params, options) {
  const data = await request("/", {
    ...options,
    params: { apikey: API_KEY, ...params }
  });

  // OMDb خطا را اغلب با HTTP 200 برمی‌گرداند
  if (data.Response === "False") throw new OmdbError(data.Error);

  return data;
}

const na = (value) => (value && value !== "N/A" ? value : null);

function toMovie(raw) {
  return {
    id: raw.imdbID,
    title: raw.Title,
    year: raw.Year,
    type: raw.Type,
    posterUrl: na(raw.Poster)
  };
}

function toDetails(raw) {
  return {
    ...toMovie(raw),
    rating: na(raw.imdbRating),
    genre: na(raw.Genre),
    runtime: na(raw.Runtime),
    director: na(raw.Director),
    actors: na(raw.Actors),
    plot: na(raw.Plot)
  };
}

export async function searchMovies(query, { page = 1, signal } = {}) {
  try {
    const data = await omdb({ s: query, type: "movie", page }, { signal });
    return { movies: data.Search.map(toMovie), total: Number(data.totalResults) };
  } catch (error) {
    // «پیدا نشد» یک نتیجه‌ی خالی است، نه خطا
    if (error instanceof OmdbError && error.message === "Movie not found!") {
      return { movies: [], total: 0 };
    }
    throw error;
  }
}

export async function getMovieDetails(imdbId, { signal } = {}) {
  return toDetails(await omdb({ i: imdbId, plot: "full" }, { signal }));
}
```

(منطق این Adapter روی یک سرور ساختگی با پاسخ‌های مشابه OMDb آزمایش شده است: نتیجه‌ی موفق، `Movie not found!`، `Too many results.`، `N/A` و لغو درخواست.)

### نگاشت خطاها به UI

| خطا | نمایش |
|-----|-------|
| `Movie not found!` | حالت Empty: «فیلمی با این نام پیدا نشد» |
| `Too many results.` | راهنما: «عبارت را کامل‌تر بنویس» (بهتر است از ابتدا زیر ۳ حرف را جستجو نکنی) |
| `Invalid API key!` یا `401` | «کلید API نامعتبر است» (خطای تنظیمات؛ برای کاربر پیام عمومی) |
| `Request limit reached!` | «سقف درخواست امروز پر شده؛ بعداً دوباره امتحان کن» |
| خطای شبکه | «اتصال برقرار نشد» + دکمه‌ی تلاش دوباره |
| `Incorrect IMDb ID.` | یعنی باگ در برنامه (شناسه‌ی اشتباه) و باید در Console ببینی |

### موارد اضافه‌ی جدول تست برای OMDb

| سناریو | رفتار درست |
|--------|-------------|
| جستجوی `ba` (۲ حرف) | درخواست ارسال نمی‌شود یا پیام «کامل‌تر بنویس» |
| جستجوی `zzzzqqq` | Empty (نه خطا) با اینکه HTTP برابر ۲۰۰ است |
| فیلم با `Poster: "N/A"` | تصویر جایگزین |
| فیلم با `Plot: "N/A"` | «خلاصه‌ای موجود نیست» |
| `totalResults` برابر ۵۲۳ | ۵۳ صفحه (۱۰ تا در هر صفحه) |
| کلید اشتباه (موقتاً در `config.js` عوض کن) | پیام کلید نامعتبر |

## مدیریت وضعیت UI

```js
// status: "idle" | "loading" | "success" | "empty" | "error"
const state = { status: "idle", movies: [], error: null };
```

| وضعیت | چه نمایش داده شود |
|--------|-------------------|
| `idle` | راهنما: «نام یک فیلم را جستجو کن» |
| `loading` | Spinner یا Skeleton (و غیرفعال شدن دکمه‌ها در صورت نیاز) |
| `success` | لیست فیلم‌ها |
| `empty` | «فیلمی با این نام پیدا نشد» (با `textContent`، نه `innerHTML`) |
| `error` | پیام فارسی مناسب + دکمه‌ی «تلاش دوباره» |

پیام‌ها را بر اساس نوع خطا جدا کن: خطای شبکه، `401` (کلید نامعتبر)، `404`، `429` (درخواست زیاد) و `5xx`.

## جستجو با Debounce و AbortController

```js
let controller;

async function runSearch(query) {
  const q = query.trim();

  if (q.length < 2) {                         // حداقل طول معقول
    setState({ status: "idle", movies: [], error: null });
    return;
  }

  controller?.abort();                         // درخواست قبلی را لغو کن
  controller = new AbortController();

  setState({ status: "loading", movies: [], error: null });

  try {
    const movies = await searchMovies(q, { signal: controller.signal });
    setState({ status: movies.length ? "success" : "empty", movies, error: null });
  } catch (error) {
    if (error.name === "AbortError") return;   // لغو عمدی؛ خطا نیست
    setState({ status: "error", movies: [], error });
  }
}

input.addEventListener("input", debounce((e) => runSearch(e.target.value), 400));
```

## جدول تست نهایی

| سناریو | رفتار درست |
|--------|-------------|
| جستجوی فیلم معتبر | نتایج نمایش داده می‌شود |
| جستجوی بی‌معنی (`zzzzqqq`) | حالت Empty با پیام مناسب |
| تایپ سریع `batman` | در تب Network فقط یک درخواست نهایی کامل می‌شود و بقیه `canceled` هستند |
| حالت Offline در DevTools | پیام خطای شبکه و دکمه‌ی «تلاش دوباره» |
| کلید API اشتباه | پیام مربوط به `401`، نه «خطای نامشخص» |
| فیلم بدون پوستر | تصویر جایگزین، بدون خطا |
| فیلم بدون توضیح (Overview خالی) | متن «توضیحی موجود نیست» |
| کلیک روی فیلم و بستن جزئیات | بازگشت به لیست بدون ریست جستجو |
| ورودی خالی یا فقط فاصله | هیچ درخواستی ارسال نمی‌شود |
| ورودی حاوی `<script>` | به‌عنوان متن نمایش داده می‌شود، اجرا نمی‌شود |

## محدودیت‌ها

- بدون فریم‌ورک؛ فقط `fetch` و JavaScript
- همه‌ی درخواست‌ها از طریق `api/client.js` (با `response.ok` و `HttpError`)
- کلید API در Git نباشد
- `AbortError` به‌عنوان خطا به کاربر نشان داده نشود
- بدون Unhandled Rejection
- داده‌ی API با `textContent` یا `createElement` نمایش داده شود

## معیار قبولی

- همه‌ی مرحله‌های ۱ تا ۱۱ کامل است و همه‌ی سناریوهای جدول تست درست جواب می‌دهند
- در Console هیچ خطای قرمز یا Unhandled Rejection نیست
- فقط یک `catch` یا `try` در هر مسیر؛ بدون `catch` خالی
- کد به Moduleها تقسیم شده و هر Module یک مسئولیت دارد
- `README.md` شامل توضیح، اسکرین‌شات، طرز اجرا و نحوه‌ی ساخت `config.js` است
- پروژه روی GitHub با تاریخچه‌ی Commit مرتب (حداقل ۱۰ Commit) است

## چالش‌های اختیاری

- دکمه‌ی «بیشتر نشان بده» یا Pagination
- علاقه‌مندی‌ها (Favorites) در `localStorage`
- همگام‌سازی عبارت جستجو با آدرس (`URLSearchParams` و `history.replaceState`)
- کش ساده با `Map` برای جستجوهای تکراری
- Skeleton Loading
- `aria-live` برای اعلام وضعیت (Loading / نتیجه / خطا) به screen reader
- مرتب‌سازی یا فیلتر بر اساس سال و امتیاز

## اشتباهات رایج

- فراموش کردن `response.ok` و ادامه با داده‌ی خراب
- فرستادن درخواست در هر `input` بدون Debounce
- ننوشتن `AbortController` و دیدن نتیجه‌ی جستجوی قدیمی
- ریختن مستقیم داده‌ی API داخل `innerHTML`
- Commit کردن `config.js` با کلید واقعی
- وابستگی مستقیم UI به نام فیلدهای API (نبود Adapter)
- نداشتن حالت Empty و Error
