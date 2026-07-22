# إعداد لوحة الحضور (Admin Dashboard)

اللوحة بتشتغل على 3 حاجات: قاعدة بيانات **Supabase** (مجانية) + دالتين **Serverless** على Vercel + صفحة `admin.html`.
كل الكود جاهز — إنت محتاج بس تعمل الخطوات دي **مرة واحدة**.

---

## 1) اعمل قاعدة بيانات على Supabase (مجاني)

1. روح [supabase.com](https://supabase.com) → **Sign up** (بجيميل) → **New Project**.
2. اختار اسم وباسورد للـ Database (أي حاجة) والمنطقة الأقرب.
3. استنى دقيقة لحد ما المشروع يجهز.
4. من القائمة الجانبية افتح **SQL Editor** → **New query** → الصق الكود ده واضغط **Run**:

```sql
create table if not exists rsvps (
  id          bigint generated always as identity primary key,
  created_at  timestamptz default now(),
  name        text not null,
  attend      text not null,
  guests      int  default 0,
  msg         text
);
-- نقفل الوصول العام تمامًا (بنستخدم مفتاح السيرفر بس)
alter table rsvps enable row level security;
```

---

## 2) هات المفاتيح من Supabase

من **Project Settings** (الترس تحت) → **API**:

- **Project URL** → ده `SUPABASE_URL`  (شكله `https://xxxx.supabase.co`)
- **service_role** key (تحت Project API keys — اضغط Reveal) → ده `SUPABASE_SERVICE_KEY`
  - ⚠️ ده مفتاح سرّي جدًا — بيفضل على السيرفر بس، متحطّهوش في أي مكان عام.

---

## 3) ضيف المتغيرات على Vercel

في مشروعك على Vercel → **Settings** → **Environment Variables** → ضيف التلاتة دول:

| الاسم | القيمة |
|---|---|
| `SUPABASE_URL` | رابط المشروع من الخطوة 2 |
| `SUPABASE_SERVICE_KEY` | مفتاح service_role من الخطوة 2 |
| `ADMIN_PASSWORD` | أي باسورد إنت تختاره لدخول اللوحة |

بعد ما تحفظهم، اعمل **Redeploy** للمشروع (أو ادفع أي commit جديد) عشان المتغيرات تشتغل.

---

## 4) خلاص!

- الفورم في الموقع دلوقتي بيبعت البيانات لقاعدة البيانات.
- افتح اللوحة على: **https://invetaion.vercel.app/admin.html**
- اكتب `ADMIN_PASSWORD` اللي اخترته → هتشوف كل الردود + ملخص + زر تصدير Excel/CSV.

> نسخة احتياطية: تقدر كمان تشوف نفس البيانات في Supabase نفسه → **Table Editor** → جدول `rsvps`.

---

## أمان
- مفتاح `service_role` والباسورد موجودين على السيرفر بس (Environment Variables) — مش ظاهرين في كود الموقع إطلاقًا.
- صفحة `admin.html` مبتعرضش أي بيانات غير بعد ما تكتب الباسورد الصح.
