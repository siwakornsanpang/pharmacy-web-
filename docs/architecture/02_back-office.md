# 02_back-office

`02_back-office` คือระบบหลังบ้านสำหรับจัดการข้อมูลที่แสดงใน `01_pharmacy-web` และจัดการผู้ใช้/permission ของผู้ดูแลระบบ

## Technology stack

| Area | Implementation |
| --- | --- |
| Framework | Next.js 16 App Router |
| UI | React 19 |
| Auth storage | Browser cookies via `js-cookie` |
| Rich text editor | `react-quill-new` |
| Image crop/upload | `react-easy-crop`, custom uploader |
| Drag reorder | `@dnd-kit/core`, `@dnd-kit/sortable` |
| Alerts | `sweetalert2` |
| Icons | `lucide-react` |

## Root files

| File | Purpose |
| --- | --- |
| `package.json` | scripts, dependency, db helper commands |
| `next.config.ts` | remote image allowlist สำหรับ Supabase Storage |
| `src/middleware.ts` | ป้องกัน `/backoffice/*` ด้วย `auth_token` cookie |
| `src/app/layout.tsx` | root layout ของ Next app |
| `src/app/globals.css` | global style |
| `src/app/shared.module.css` | shared CSS class |
| `src/app/page.tsx` | landing/root behavior ของ back-office |

## Login and auth flow

ไฟล์หลัก:

- `src/app/login/page.tsx`
- `src/app/utils/authFetch.ts`
- `src/middleware.ts`

Flow:

1. User กรอก username/password ที่ `/login`
2. Login page เรียก `POST {NEXT_PUBLIC_API_URL}/auth/login`
3. Backend คืน JWT และ user info
4. Back office เก็บ cookie:
   - `auth_token`
   - `user_role`
   - `user_display_name`
   - `user_id`
5. User ถูกส่งไป default page ตาม role
6. ทุก request หลัง login ใช้ `authFetch`
7. `authFetch` แนบ `Authorization: Bearer <token>`
8. ถ้า API ตอบ `401` จะลบ cookie และ redirect ไป `/login`

## Middleware behavior

`src/middleware.ts` ทำงานกับ path:

- `/backoffice/:path*`
- `/login`

Rules:

| Condition | Behavior |
| --- | --- |
| เข้า `/backoffice/*` แต่ไม่มี `auth_token` | redirect `/login` |
| เข้า `/login` แต่มี `auth_token` | redirect `/backoffice` |
| เงื่อนไขอื่น | allow |

## Role and permission model

`src/app/config/roles.ts` กำหนด built-in role:

| Role | Default page |
| --- | --- |
| `admin` | `/backoffice` |
| `editor` | `/backoffice/module/council-web/home` |
| `web_editor` | `/backoffice/module/council-web/home` |
| `viewer` | `/backoffice/module/council-web/home` |

`src/app/config/menu.tsx` กำหนด sidebar menu และ permission key ที่ต้องมี เช่น:

| Permission | Used for |
| --- | --- |
| `manage_home` | จัดการหน้าแรก |
| `manage_about` | เกี่ยวกับองค์กร ประวัติ กรรมการ นโยบาย เกียรติประวัติ |
| `manage_news` | ข่าว ความรู้เรื่องยา โครงการประชาชน |
| `manage_service` | งานบริการ |
| `manage_agency` | หน่วยงาน |
| `manage_law` | กฎหมาย |
| `manage_web_settings` | ตั้งค่าเว็บ |
| `manage_register` | ทะเบียน/คำขอ |
| `manage_users` | ผู้ใช้ |
| `manage_roles` | role และ permission |

Sidebar จะเรียก `/permissions/my` แล้วใช้ `filterMenuByPermission()` เพื่อซ่อนเมนูที่ไม่มีสิทธิ์

## Backoffice shell

| File | Purpose |
| --- | --- |
| `src/app/backoffice/layout.tsx` | layout หลักหลัง login |
| `src/app/backoffice/page.tsx` | dashboard และ summary data |
| `src/app/backoffice/layout/Sidebar.tsx` | sidebar แบบ permission-aware |
| `src/app/backoffice/layout/Header.tsx` | header ของ backoffice |

## Shared UI components

| File | Purpose |
| --- | --- |
| `src/app/components/ui/PageHeader.tsx` | header ของหน้าจัดการข้อมูล |
| `src/app/components/ui/RoleBadge.tsx` | badge แสดง role |
| `src/app/components/ui/ImageUploader.tsx` | upload image UI |
| `src/app/components/ui/ImagePreviewModal.tsx` | modal preview image |
| `src/app/components/ui/CrudModal.tsx` | modal สำหรับ create/update form |
| `src/app/components/editor/editor.tsx` | rich text editor พร้อม upload image |
| `src/app/components/editor/cropImage.ts` | crop helper |
| `src/app/components/editor/quill-size.css` | override size ของ editor |

## Module structure

```text
src/app/backoffice/module/
  council-web/
  pharmacist-web/
  register/
  setting/
  royalcollege/
  e-service/
  bill/
```

### `council-web`

จัดการข้อมูลของเว็บสภาฝั่ง public

| Path | Purpose | Main API |
| --- | --- | --- |
| `council-web/home/page.tsx` | จัดการ banner/popup หน้าแรก | `/home-content` |
| `council-web/setting/page.tsx` | ตั้งค่าเว็บ ชื่อ โลโก้ ติดต่อ social | `/web-settings` |
| `council-web/news/page.tsx` | รายการข่าว | `/news` |
| `council-web/news/create/page.tsx` | สร้างข่าว | `/news` |
| `council-web/news/edit/[id]/page.tsx` | แก้ข่าว | `/news/:id` |
| `council-web/news/preview/page.tsx` | preview ข่าวรวม | `/news` |
| `council-web/news/preview/[id]/page.tsx` | preview ข่าวรายตัว | `/news/:id` |
| `council-web/agency/page.tsx` | จัดการหน่วยงาน | `/agencies` |
| `council-web/law/page.tsx` | จัดการกฎหมายแบบ tab/category | `/laws/:category` |
| `council-web/law/[category]/page.tsx` | จัดการกฎหมายเฉพาะหมวด | `/laws/:category` |

### `council-web/about`

| Path | Purpose | Main API |
| --- | --- | --- |
| `about/history/page.tsx` | ทำเนียบ/ประวัติสภา | `/history` |
| `about/council/page.tsx` | กรรมการสภา | `/council` |
| `about/honor/page.tsx` | จัดการรางวัลเกียรติประวัติ | `/honor-awards` |
| `about/honor/[awardId]/page.tsx` | จัดการผู้ได้รับรางวัลภายใต้ award | `/honor` |
| `about/policy/page.tsx` | หมวดนโยบาย | `/policy-categories` |
| `about/policy/[categoryId]/page.tsx` | โครงการภายใต้หมวดนโยบาย | `/policy-projects` |

### `council-web/service`

| Path | Purpose | Main API |
| --- | --- | --- |
| `service/e-service/page.tsx` | จัดการ service/e-service | `/services` |
| `service/medicine/page.tsx` | รายการความรู้เรื่องยา | `/medicine` |
| `service/medicine/create/page.tsx` | สร้างบทความความรู้เรื่องยา | `/medicine` |
| `service/medicine/edit/[id]/page.tsx` | แก้บทความความรู้เรื่องยา | `/medicine/:id` |
| `service/public-project/page.tsx` | รายการโครงการประชาชน | `/public-project` |
| `service/public-project/create/page.tsx` | สร้างโครงการประชาชน | `/public-project` |
| `service/public-project/edit/[id]/page.tsx` | แก้โครงการประชาชน | `/public-project/:id` |

### `pharmacist-web`

| Path | Purpose | Main API |
| --- | --- | --- |
| `pharmacist-web/page.tsx` | module landing/placeholder |
| `pharmacist-web/home/page.tsx` | จัดการ banner หน้า pharmacist/member | `/pharmacist-home-content` |

### `register`

| Path | Purpose | Main API |
| --- | --- | --- |
| `register/page.tsx` | รายการเภสัชกร |
| `register/list/page.tsx` | list view |
| `register/[id]/page.tsx` | รายละเอียดเภสัชกร |

ใช้ endpoint หลัก `/pharmacists`

### `setting`

| Path | Purpose | Main API |
| --- | --- | --- |
| `setting/page.tsx` | จัดการ user |
| `setting/permissions/page.tsx` | จัดการ permission และ role-permission |

ใช้ endpoint:

- `/auth/users`
- `/permissions`
- `/permissions/roles`
- `/permissions/roles/:role`
- `/permissions/my`

### Placeholder / additional modules

| Path | Purpose |
| --- | --- |
| `royalcollege/page.tsx` | module ราชวิทยาลัย |
| `e-service/page.tsx` | module E-Service รวม |
| `bill/page.tsx` | module การเงิน/ธุรกรรม |

## CRUD pattern

Pattern ทั่วไปใน back-office:

1. โหลดข้อมูลด้วย `authFetch(GET)`
2. แสดง list/table/card
3. สร้างหรือแก้ไขด้วย form
4. ส่ง `FormData` ถ้ามีไฟล์
5. ส่ง `POST` สำหรับ create, `PUT` สำหรับ update
6. ลบด้วย `DELETE`
7. จัดลำดับด้วย `PUT /reorder`

## Image and editor pattern

กลุ่มข่าว/บทความใช้ editor:

- `NewsForm.tsx`
- `MedicineForm.tsx`
- `PublicProjectForm.tsx`
- `components/editor/editor.tsx`

รูปประกอบมักมี endpoint upload เฉพาะ:

- `/news/upload-image`
- `/medicine/upload-image`
- `/public-project/upload-image`

## Integration notes

- Back office เป็น writer หลักของ content ที่เว็บหน้าอ่าน
- Permission ใน UI ต้องตรงกับ `requirePermission()` ใน backend
- ถ้าเพิ่มเมนูใหม่ ต้องเพิ่มทั้ง `menu.tsx`, backend permission seed/route guard และหน้า module
- ถ้าเพิ่ม upload ใหม่ ต้องเพิ่ม backend route, Supabase upload logic และ frontend form

