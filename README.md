# เว็บไซต์ SKG สหเจริญกิจ สตีล กรุ๊ป

เว็บไซต์ static 5 หน้า (`/`, `/products`, `/about`, `/contact`, `/privacy`) สร้างจากไฟล์ต้นแบบ `skg-website-prototype.html`
หน้าตาและการทำงานตรงกับต้นแบบ ทั้งบนคอม, iPad และมือถือ

## โครงสร้าง

```
site/                 ← ไฟล์เว็บที่ deploy จริง (Vercel ใช้โฟลเดอร์นี้)
  index.html, products.html, about.html, contact.html, privacy.html
  images/             ← รูป WebP (+ SVG แบบแปลนหน้าตัด) แยกออกจากต้นแบบ
  assets/             ← JS (ชื่อไฟล์มี hash, cache ได้ 1 ปี)
  sitemap.xml, robots.txt, og-image.jpg, favicon.ico, apple-touch-icon.png
src/                  ← ต้นฉบับสำหรับแก้ไข
  site.json           ← URL เว็บ, ปลายทางฟอร์ม, title/description แต่ละหน้า
  pages/<หน้า>.tpl.html / .js / .css
  runtime.js, global.css
tools/                ← สคริปต์ build
raw/                  ← รูปต้นฉบับจากไฟล์ต้นแบบ
vercel.json
```

## แก้ไขแล้ว build ใหม่

```bash
python3 tools/build.py      # ประกอบ src/ → site/
node tools/prerender.mjs    # เติม HTML ล่วงหน้า (SEO) — ต้องมี Playwright + Chromium
```

ทั้ง 2 คำสั่งรันบนเครื่องตัวเอง แล้ว commit โฟลเดอร์ `site/` ขึ้นไป — Vercel ไม่ต้อง build อะไร

## Deploy บน Vercel (เชื่อม GitHub)

1. push repo นี้ขึ้น GitHub
2. vercel.com → Add New → Project → เลือก repo → Framework Preset: **Other** → Deploy
   (`vercel.json` ตั้ง `outputDirectory: site` และ clean URLs ไว้แล้ว)
3. โดเมนปัจจุบัน: https://www.skgsteel.com (skgsteel.com เด้งไป www) — ถ้าเปลี่ยนโดเมน แก้ `siteUrl` ใน `src/site.json` แล้ว build ใหม่ (ใช้ใน canonical, Open Graph, sitemap)

## ฟอร์มขอใบเสนอราคา

ส่งเข้าอีเมล `skg.steelgroup1995@gmail.com` ผ่าน [FormSubmit](https://formsubmit.co) (ฟรี ไม่ต้องสมัคร)
**ครั้งแรก:** หลัง deploy ให้ลองส่งฟอร์ม 1 ครั้ง → FormSubmit จะส่งอีเมล "Activate Form" ไปที่กล่องอีเมลนี้ → กดยืนยัน
หลังจากนั้นทุกคำขอจะเข้าอีเมลทันที (ถ้าจะเปลี่ยนเป็น Formspree/Resend แก้ `formEndpoint` ใน `src/site.json` และ `send()` ใน `src/pages/contact.js`)

## แผนที่

ฝัง Google Maps ด้วยการค้นหาชื่อร้าน + ถนนนิมิตใหม่ ลำลูกกา
ถ้าต้องการให้หมุดตรงจุดเป๊ะ: เปิด Google Maps ของร้าน → แชร์ → ฝังแผนที่ → คัดลอกค่า `src` ของ iframe
ไปแทน `MAP_SRC` ใน `tools/edit_sources.py` หรือแก้ตรง `<iframe src=...>` ใน `src/pages/home.tpl.html` และ `contact.tpl.html`

## ยังไม่เปิดใช้

แกลเลอรี "ส่งเหล็กถึงหน้างานจริง" (class `wip` ในต้นแบบ) ถูกตัดออกจากหน้าเกี่ยวกับเรา — รูปต้นฉบับยังอยู่ใน `raw/`
