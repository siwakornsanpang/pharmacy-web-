# Pharmacy Council System Documentation

เอกสารชุดนี้อธิบายโครงสร้างระบบของ 3 โปรเจคหลักใน workspace:

- `01_pharmacy-web` เว็บหน้าบ้านสำหรับประชาชนและสมาชิกเภสัชกร
- `02_back-office` ระบบหลังบ้านสำหรับจัดการข้อมูลและสิทธิ์
- `03_backend-api` API กลางและชั้นเชื่อมต่อฐานข้อมูล

เป้าหมายของเอกสารคือช่วยให้ developer, maintainer, หรือผู้รับช่วงงานเข้าใจว่าแต่ละโปรเจคทำหน้าที่อะไร ไฟล์สำคัญอยู่ตรงไหน และส่วนไหนถูก implement ร่วมกันระหว่างระบบ

## เอกสารในชุดนี้

- [01_pharmacy-web.md](./01_pharmacy-web.md) อธิบายเว็บหน้าบ้าน route, layout, component, auth, API client และ assets
- [02_back-office.md](./02_back-office.md) อธิบายระบบหลังบ้าน route, module, login, permission, editor และ CRUD pattern
- [03_backend-api.md](./03_backend-api.md) อธิบาย Fastify API, route, database schema, auth guard และ upload
- [shared-implementation.md](./shared-implementation.md) อธิบายส่วนที่ 3 โปรเจคใช้ร่วมกัน เช่น API contract, auth, permission, content model, upload และ env

## ภาพรวมสถาปัตยกรรม

```text
Public users / pharmacist members
        |
        v
01_pharmacy-web
        |
        | public fetch / member page data
        v
03_backend-api <---------------- 02_back-office
        |                         ^
        |                         |
        v                         | authenticated CRUD
PostgreSQL / Supabase Storage ----+
```

## บทบาทของแต่ละโปรเจค

| Project | Technology | Main responsibility |
| --- | --- | --- |
| `01_pharmacy-web` | Next.js App Router, React, CSS Modules, Tailwind | แสดงเว็บสภาเภสัชกรรมฝั่ง public และ member |
| `02_back-office` | Next.js App Router, React, Quill, dnd-kit | จัดการข้อมูลที่จะไปแสดงในเว็บ และจัดการผู้ใช้/สิทธิ์ |
| `03_backend-api` | Fastify, Drizzle ORM, PostgreSQL, Supabase | ให้ REST API, ตรวจ JWT/permission, อ่านเขียนฐานข้อมูล และจัดการไฟล์ |

## การไหลของข้อมูลหลัก

1. เจ้าหน้าที่ login ที่ `02_back-office`
2. Back office เรียก `03_backend-api` พร้อม `Authorization: Bearer <JWT>`
3. Backend ตรวจ token และ permission
4. Backend บันทึกข้อมูลลง PostgreSQL หรืออัปโหลดไฟล์ไป Supabase Storage
5. `01_pharmacy-web` ดึงข้อมูล public จาก backend เพื่อแสดงหน้าเว็บ

## เส้นแบ่งความรับผิดชอบ

`01_pharmacy-web` ไม่ควรเป็นเจ้าของ logic การจัดการข้อมูลเชิง admin เช่น create/update/delete ข่าวหรือกฎหมาย หน้าที่หลักคือ fetch และ render ข้อมูล

`02_back-office` ไม่ควรเก็บ business data เอง หน้าที่หลักคือ UI สำหรับจัดการข้อมูลผ่าน API

`03_backend-api` เป็น source of truth ของ route, permission, database schema และ upload behavior

## Convention สำคัญ

- ทั้ง `01_pharmacy-web` และ `02_back-office` ใช้ `NEXT_PUBLIC_API_URL` เพื่อชี้ backend
- `01_pharmacy-web` มี fallback API proxy ที่ `/api/proxy/:path*`
- `02_back-office` ใช้ cookie `auth_token` และ helper `authFetch`
- `03_backend-api` ใช้ JWT และ permission key เช่น `manage_news`, `manage_home`, `manage_law`
- การจัดลำดับรายการหลายจุดใช้ endpoint `/reorder`
- ไฟล์รูปมักเก็บทั้ง cropped URL และ original URL เพื่อให้แก้ crop ได้ภายหลัง

## สิ่งที่เอกสารนี้ไม่ครอบคลุมละเอียดทีละรายการ

เอกสารนี้อธิบายไฟล์ source, config, route, module และ shared pattern ที่มีผลต่อระบบโดยตรง แต่ไม่แจกแจง asset รูปภาพทุกไฟล์ใน `public/images` ทีละรายการ เพราะส่วนใหญ่เป็น static media สำหรับหน้าเว็บ
