# การใช้งานร่วมกันของ 3 โปรเจค

ไฟล์นี้อธิบายส่วนที่ทั้ง 3 โปรเจคใช้งานร่วมกัน หรือมีข้อตกลงร่วมกัน แม้จะอยู่คนละ codebase ได้แก่ `01_pharmacy-web`, `02_back-office` และ `03_backend-api`

## 1. ข้อตกลงของ API

`03_backend-api` เป็นเจ้าของ endpoint และรูปแบบข้อมูลที่ส่งกลับ ส่วน `01_pharmacy-web` และ `02_back-office` เป็นฝั่งเรียกใช้งาน

```text
03_backend-api route
        |
        +--> 01_pharmacy-web แสดงข้อมูลบนเว็บ public/member
        |
        +--> 02_back-office จัดการข้อมูลผ่าน CRUD ที่ต้อง login
```

ตัวอย่างการใช้งานร่วมกัน:

| กลุ่มข้อมูล | Endpoint ฝั่ง backend | หน้าจัดการใน back-office | หน้าที่อ่านข้อมูลในเว็บหน้า |
| --- | --- | --- | --- |
| ตั้งค่าเว็บไซต์ | `/web-settings` | `council-web/setting` | Navbar, หน้าแรก, footer, contact |
| หน้าแรกเว็บสภา | `/home-content` | `council-web/home` | banner หน้าแรก public/member |
| หน้าแรกเว็บเภสัชกร | `/pharmacist-home-content` | `pharmacist-web/home` | banner หน้า member |
| ข่าว | `/news` | `council-web/news` | หน้า news และ section ข่าวหน้าแรก |
| บริการ | `/services`, `/services/popular` | `council-web/service/e-service` | service section และ popular services |
| กฎหมาย | `/laws/:category` | `council-web/law` | หน้า laws |
| หน่วยงาน | `/agencies` | `council-web/agency` | หน้า department/agency |
| กรรมการสภา | `/council` | `about/council` | หน้า committee |
| ทำเนียบ/ประวัติ | `/history` | `about/history` | หน้า council directory |
| เกียรติประวัติ | `/honor-awards`, `/honor` | `about/honor` | หน้า hall of fame |
| นโยบาย | `/policy-categories`, `/policy-projects` | `about/policy` | หน้า policy |
| ความรู้เรื่องยา | `/medicine` | `council-web/service/medicine` | ยังไม่มีหน้าแสดงใน pharmacy-web (ข้อมูลพร้อม) |
| โครงการประชาชน | `/public-project` | `council-web/service/public-project` | ยังไม่มีหน้าแสดงใน pharmacy-web (ข้อมูลพร้อม) |
| เภสัชกร | `/pharmacists` | `register` | license search, stats, member-related pages |

## 2. การตั้งค่า environment ร่วมกัน

ทั้ง 2 โปรเจค Next.js ต้องรู้ว่า backend อยู่ที่ไหน โดยใช้ `NEXT_PUBLIC_API_URL`

| โปรเจค | ตัวแปร | ความหมาย |
| --- | --- | --- |
| `01_pharmacy-web` | `NEXT_PUBLIC_API_URL` | ชี้ API สำหรับเว็บหน้า ถ้าไม่ตั้งค่า มี fallback ไป production API หรือ `/api/proxy` |
| `02_back-office` | `NEXT_PUBLIC_API_URL` | ชี้ API สำหรับ login และ CRUD หลังบ้าน |
| `03_backend-api` | `PORT`, `JWT_SECRET`, `DATABASE_URL`, `FRONTEND_URL`, Supabase env | ใช้เปิด server, ต่อฐานข้อมูล, ตรวจ token และ upload |

ข้อควรระวัง:

- `NEXT_PUBLIC_API_URL` ถูกเปิดเผยใน browser ได้ เพราะเป็นตัวแปรฝั่ง frontend
- ค่า secret เช่น `JWT_SECRET`, database URL และ Supabase service key ควรอยู่เฉพาะฝั่ง `03_backend-api`
- ถ้าเปลี่ยน domain API ต้องตรวจทั้ง frontend, back-office, CORS และ proxy

## 3. ระบบ login และ auth

workspace นี้มี auth 2 แบบที่ไม่เหมือนกัน

### 3.1 Auth ของ back-office

ใช้ร่วมกันระหว่าง:

- `02_back-office`
- `03_backend-api`

ลำดับการทำงาน:

```text
02_back-office /login
        |
        | POST /auth/login
        v
03_backend-api
        |
        | ส่ง JWT และข้อมูลผู้ใช้กลับมา
        v
browser cookies: auth_token, user_role, user_display_name, user_id
        |
        | authFetch แนบ Authorization header
        v
เรียก protected backend routes
```

นี่คือ auth จริงของผู้ดูแลระบบ ใช้ JWT และ permission จาก backend

### 3.2 สถานะ member ของ pharmacy-web

ใช้ใน:

- `01_pharmacy-web`

ลำดับการทำงาน:

```text
AuthContext login()
        |
        v
localStorage isLoggedIn=true
cookie isLoggedIn=true
        |
        v
middleware rewrite /home, /service, /meeting ไปหน้า member
```

ส่วนนี้ไม่ใช่ JWT auth แบบ back-office และปัจจุบันมีข้อมูลผู้ใช้แบบ mock เช่น `userName`, `userId`

## 4. ระบบ permission

permission ถูก implement ร่วมกันระหว่าง UI หลังบ้านกับ backend guard

ไฟล์ที่เกี่ยวข้อง:

- `02_back-office/src/app/config/menu.tsx`
- `02_back-office/src/app/config/roles.ts`
- `02_back-office/src/app/utils/authFetch.ts`
- `03_backend-api/src/utils/authGuard.ts`
- `03_backend-api/src/routes/*`
- `03_backend-api/src/db/schema.ts`

หลักการทำงาน:

1. Backend เก็บ role-permission mapping ในตาราง `role_permissions`
2. Back office เรียก `/permissions/my`
3. Sidebar กรองเมนูจาก permission key
4. Backend route ฝั่งเขียนข้อมูลตรวจซ้ำด้วย `requirePermission()`

ตัวอย่าง permission key:

| Permission | ใช้กับงาน |
| --- | --- |
| `manage_home` | จัดการหน้าแรก |
| `manage_about` | ประวัติ กรรมการ นโยบาย เกียรติประวัติ |
| `manage_news` | ข่าว บทความ โครงการประชาชน |
| `manage_service` | งานบริการ |
| `manage_agency` | หน่วยงาน |
| `manage_law` | กฎหมาย |
| `manage_web_settings` | ตั้งค่าเว็บไซต์ |
| `manage_register` | ทะเบียน/คำขอ |
| `manage_users` | ผู้ใช้ |
| `manage_roles` | role และ permission |

ถ้าเพิ่ม module หลังบ้านใหม่ ต้องอัปเดตทั้งสองฝั่ง:

1. เพิ่ม menu item พร้อม `permission`
2. เพิ่มหรือ seed permission key
3. ป้องกัน backend write route ด้วย `requirePermission(permissionKey)`
4. เพิ่ม role-permission mapping ให้ role ที่ควรใช้งานได้

## 5. วงจรชีวิตของข้อมูล content

ข้อมูลที่จัดการผ่าน back-office ส่วนใหญ่ไหลแบบเดียวกัน:

```text
สร้าง/แก้ไขใน 02_back-office
        |
        | POST/PUT/DELETE ไป 03_backend-api
        v
บันทึกข้อมูลลง database หรือ JSON field
        |
        | GET จาก 01_pharmacy-web
        v
แสดงผลบน public/member website
```

pattern ที่ใช้ซ้ำ:

- `status` ใช้ควบคุมการเผยแพร่ เช่น draft/published หรือ online/offline
- `order` ใช้ควบคุมลำดับการแสดงผล
- endpoint `/reorder` ใช้บันทึกการเรียงลำดับจาก drag/drop หรือ manual order
- field ไฟล์เก็บเป็น URL string ไม่เก็บ binary ใน database
- หลาย entity เก็บทั้งรูปที่ crop แล้วและรูปต้นฉบับ เพื่อกลับมา crop ใหม่ได้

## 6. การอัปโหลดรูปและไฟล์

pattern การ upload ใช้ร่วมกันระหว่าง back-office, backend และเว็บหน้า

```text
ฟอร์มใน back-office
        |
        | ส่ง FormData แบบ multipart
        v
backend route ใช้ @fastify/multipart
        |
        | upload helper
        v
Supabase Storage
        |
        | เก็บ public URL ลง PostgreSQL
        v
01_pharmacy-web นำ URL ไปแสดงรูปหรือเอกสาร
```

field ที่พบซ้ำ:

| Field | ความหมาย |
| --- | --- |
| `thumbnailUrl` | รูป thumbnail ที่พร้อมแสดงผล |
| `originalThumbnailUrl` | รูปต้นฉบับของ thumbnail สำหรับ re-crop |
| `imageUrl` | รูปหลักของรายการ |
| `originalImageUrl` | รูปต้นฉบับของรูปหลัก |
| `logoUrl` | รูปโลโก้ |
| `iconUrl` | รูป icon ของ service/agency |
| `pdfUrl` | ไฟล์ PDF ของกฎหมายหรือเอกสาร |
| `summaryPdfUrl` | ไฟล์ PDF สรุปโครงการใน policy |

## 7. การเรียงลำดับข้อมูล

หลาย domain รองรับการจัดลำดับเอง

endpoint ที่เกี่ยวข้อง:

- `/agencies/reorder`
- `/council/reorder`
- `/honor-awards/reorder`
- `/honor/reorder`
- `/laws/reorder`
- `/services/reorder`
- `/policy-categories/reorder`
- `/policy-projects/reorder`

โดยทั่วไป back-office จะส่งรายการ `id` พร้อมค่า `order` ไป backend จากนั้นเว็บหน้าจะ sort ด้วย `order` หรือรับข้อมูลที่ backend เรียงมาแล้ว

## 8. Rich text content

ข่าว บทความความรู้เรื่องยา และโครงการประชาชนใช้ rich text pattern ร่วมกัน

ส่วนที่เกี่ยวข้อง:

- Back office ใช้ Quill editor
- มี endpoint upload image สำหรับ editor โดยเฉพาะ
- เนื้อหาถูกเก็บเป็น HTML string
- เว็บหน้า render เนื้อหาจาก API

ข้อควรระวังด้านความปลอดภัย:

เพราะ content เป็น HTML จึงควรกำหนดแนวทาง sanitize ให้ชัดเจน ฝั่ง back-office มี dependency `isomorphic-dompurify` แล้ว แต่ฝั่ง render ควรตรวจว่า HTML ถูก sanitize หรือมาจากแหล่งที่เชื่อถือได้ก่อนใช้ `dangerouslySetInnerHTML`

## 9. รูปแบบการตั้งชื่อ route

เว็บหน้าบ้านใช้ URL ที่อ่านง่าย:

- `/home`
- `/about`
- `/news`
- `/laws`

แต่ folder ภายในใช้เลขนำหน้าเพื่อจัดลำดับ:

- `01_home`
- `02_about`
- `06_news`
- `07_laws`

Back office ใช้ route ตาม domain การจัดการ:

- `/backoffice/module/council-web/news`
- `/backoffice/module/council-web/about/policy`
- `/backoffice/module/setting/permissions`

Backend ใช้ route ตาม resource:

- `/news`
- `/policy-categories`
- `/policy-projects`
- `/permissions/roles`

## 10. ขั้นตอนแนะนำเมื่อเพิ่ม feature ที่ใช้ร่วมกัน

ลำดับที่แนะนำ:

1. กำหนด data model ใน `03_backend-api/src/db/schema.ts`
2. เพิ่ม route backend หรือขยาย route เดิม
3. เพิ่ม permission key ถ้าเป็นงานที่ต้องจัดการผ่านหลังบ้าน
4. register route ใน `03_backend-api/src/server.ts`
5. เพิ่มหน้า/module ใน `02_back-office`
6. เพิ่ม menu item และ permission ใน `02_back-office/src/app/config/menu.tsx`
7. เพิ่ม API client function ใน `01_pharmacy-web/lib/api.ts`
8. เพิ่ม page หรือ component สำหรับแสดงผลในเว็บหน้า
9. ตรวจ env, CORS, image allowlist และ permission

## 11. จุดที่ควรพิจารณาปรับให้ใช้ร่วมกันมากขึ้น

| เรื่อง | สถานะปัจจุบัน | แนวทางปรับปรุง |
| --- | --- | --- |
| API types | frontend/back-office นิยาม type บางส่วนแยกกัน | สร้าง shared TypeScript types จาก OpenAPI หรือ backend schema |
| API client | เว็บหน้าใช้ `lib/api.ts`, back-office ใช้ `authFetch` และ API constants แยกตามหน้า | ทำ typed API client หรือ endpoint map กลาง |
| Auth | member web state และ back-office JWT auth แยกกัน | ตัดสินใจว่า member login ควรใช้ backend auth จริงหรือไม่ |
| Error handling | แต่ละหน้าจัดการ error เอง | กำหนด error response shape และ UI pattern กลาง |
| Sanitization | rich text HTML ถูกใช้หลายจุด | กำหนด sanitize/render rule กลาง |
| Upload fields | หลาย resource ใช้รูปแบบ image/original image คล้ายกัน | ทำ upload contract หรือ helper กลาง |
| Permissions | UI menu และ backend guard ใช้ string key ด้วยมือ | ทำ permission registry/types กลาง |
| medicine / public-project | backend CRUD พร้อมแล้ว แต่ `01_pharmacy-web` ยังไม่มีหน้าแสดง | ควรเพิ่ม API client function และ page สำหรับแสดงบทความความรู้เรื่องยาและโครงการประชาชน |
| member store (`08_store`) | มี UI components ครบ (`StoreBanner`, `ProductCard` ฯลฯ) แต่ยังเป็น mock data | ต้องออกแบบ backend schema และ endpoint ก่อน แล้วเชื่อม API |
| member tools (`07_tools`) | หน้า tools implement UI ตรงใน page file ไม่มี backend | ต้องออกแบบ tool catalog และ backend integration ถ้าต้องการข้อมูลจริง |

