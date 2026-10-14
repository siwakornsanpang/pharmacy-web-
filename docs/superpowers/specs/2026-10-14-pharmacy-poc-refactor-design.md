# Pharmacy POC refactor — design specification

วันที่: 14 ตุลาคม 2026

สถานะ: ผู้ใช้เห็นชอบขอบเขตล่าสุดแล้ว จัดทำชุด implementation plans สำหรับ review โดยเพิ่มรายละเอียด upload ticket ตามข้อจำกัด Vercel ยังไม่ได้เริ่ม product implementation, migration หรือ deployment

เอกสารอยู่ใน repository pharmacy-web เดิมเพื่อเก็บประวัติการออกแบบ เมื่อสร้าง monorepo ใหม่ ให้นำเอกสารนี้ไปอยู่ใน docs ของ repository ใหม่ด้วย

## 1. เป้าหมายและขอบเขต

ปรับ pharmacy-web, Back-office และ backend-api ให้เป็น POC ที่ developer เข้าใจและพัฒนาต่อได้ ส่งต่อ vendor พร้อมโค้ด เอกสาร และหลักฐานตรวจรับ โดยรักษาหน้าตา เส้นทางหน้า และ flow เดิมของทั้งสอง frontend

ผลที่ต้องได้:

- โครงสร้างโค้ดแยกหน้าที่และ domain ชัดเจน แต่ยังใช้ frontend สองแอปและ backend หนึ่งแอป
- Developer เพิ่ม tab/feature และรายการสิทธิ์จากโค้ดใน PR เดียวได้ เจ้าของงานไม่ต้องสร้าง permission key ใน DB หรือส่งชื่อ key ด้วยมือ
- Backend บังคับ authentication, authorization, ownership และ validation จริง
- API origins และ secrets มีเจ้าของและการตั้งค่าที่ชัดเจน แยกแต่ละแอปและ environment
- ข้อมูลที่กรอกผ่าน backoffice รูป และไฟล์เดิมถูกย้ายไป Supabase ใหม่ โดยไม่ต้องกรอกหรืออัปโหลดใหม่ด้วยมือ
- มีวิธี setup, build, ทดสอบ, deploy, migrate และกลับไปใช้ release ที่เข้ากันได้กับข้อมูล พร้อมระบุส่วนที่ยังเป็น mock

ระบบยังไม่มีเจ้าหน้าที่หรือผู้ใช้จริงใช้งาน ข้อกำหนดล่าสุดจึง **ไม่ย้ายบัญชี login เจ้าหน้าที่เดิม password hashes หรือ sessions/tokens เดิม** สร้างบัญชีเจ้าหน้าที่ใหม่ภายหลังผ่าน setup ที่ควบคุมได้ ส่วนข้อมูลธุรกิจ/เนื้อหา/ไฟล์ยังย้ายครบ

ผู้ใช้ระบุเป้าหมายปลายทางเป็น **microservices** และ vendor อาจแยก repositories ภายหลัง POC รอบนี้ต้องเตรียม module/data/API boundaries ให้แยกต่อได้ ไม่ถือว่าการมีสามแอปหรือแยก repo เท่ากับทำ microservices เสร็จแล้ว ขอบเขต POC ยังคง backend หนึ่งบริการและ frontends สองแอปตาม deployment ที่ตกลง

ภาพ Tech Stack ที่แนบเป็นแนวทาง การจัด production server ตามมาตรฐาน เช่น Ubuntu, Nginx และ PM2 เป็นหน้าที่ vendor ไม่ใช่งาน infrastructure ของ POC รอบนี้ การตรวจสิทธิ์ การป้องกันข้อมูลรั่ว และการรักษาข้อมูลระหว่างย้ายยังอยู่ในขอบเขตโค้ดรอบนี้

## 2. สิ่งที่คงเดิมและสิ่งที่เลื่อนออกไป

คง JSX/CSS, URLs, layouts, labels, navigation, responsive behavior, forms, modals, editor/crop/upload interactions และผลของ mock flows เดิม การแก้ security/logic defects ต้องบันทึกแยกจาก visual regressions เช่น การปิด draft ที่ public API เคยอ่านได้หรือการปฏิเสธผู้ไม่มีสิทธิ์

pharmacy-web ใช้ mock login/OTP ต่อไป:

- Numeric IDs: 11111, 22222, 33333, 44444, 55555, 66666, 77777, 88888, 99999, 00000
- Password ทดสอบ: 12345; mock OTP: 111222
- คง ph123 demo เดิมเพิ่มอีกบัญชี และ identity ของแต่ละบัญชีต้องแยกกัน
- Public license search/detail คง mock dataset และ matching/paging/detail flow เดิม
- Profile save, contact form, e-Service payment และส่วนอื่นที่เป็น mock คงเป็น mock
- Academy catalog/enrollment/progress ที่เชื่อม API อยู่แล้วคงการเชื่อมต่อ ส่วน payment/refund คง mock outcomes

เลื่อนออกไป: บัญชีสมาชิกจริง/onboarding/ช่องทาง OTP จริง, payment/refund จริง, การรวม Conference backoffice/staff SSO และ production infrastructure ของ vendor รายการ placeholder เดิมไม่กลายเป็นระบบธุรกิจใหม่จากการ refactor

## 3. Repository และขอบเขตโค้ด

ใช้ GitHub repository ใหม่หนึ่งแห่งสำหรับ POC แยก deploy สามแอปด้วย npm workspaces และ lockfile กลาง ใช้ Next.js/React, Fastify, TypeScript, Drizzle และ pg ที่มีอยู่ต่อไป Backend เป็น modular application เพื่อให้ vendor extract services ภายหลัง รอบนี้ไม่สร้าง distributed service infrastructure หรือ framework กลางสำหรับ CRUD ทุกโมดูล

โครงสร้างเป้าหมาย:

```text
apps/
  pharmacy-web/
  backoffice/
  backend-api/
packages/
  contracts/
docs/
  architecture/
  development/
  operations/
  verification/
```

packages/contracts เก็บเฉพาะ API DTOs/runtime schemas และ typed capability catalog ที่ใช้ร่วมกันจริง จัด public exports แยก domain มี package version และ build artifact ที่ consumer ใช้ได้โดยไม่อ้างไฟล์ภายใน monorepo ไม่ส่ง DB credentials, ORM connection, server-only auth, business logic หรือ Supabase server client ไป frontend bundle ภายหลังแยก repo สามารถใช้ released package version หรือ generated client จาก versioned API contract แทน source-path imports

Frontend route/layout เป็นตัวเชื่อมไป feature screens โดยย้าย JSX/CSS เดิมอย่างระมัดระวัง แต่ละ domain แยก API functions, mapping/types และ stateful screen/form logic เท่าที่ช่วยลดหน้าที่ที่ปะปนกัน Shared controls ใช้เมื่อมีการใช้ร่วมจริง

Backend แยก app construction ออกจาก process startup และจัด domain modules ได้แก่ auth/access, content, registry/requests, Academy และ media DB connection/migration runner ใช้ร่วมใน POC แต่ schema/repository ownership แยก domain ชัดเจน Domain service ใช้เมื่อมี business transition หรือหลาย writes ที่ต้องเป็น transaction ไม่สร้าง controller/repository layers ให้ CRUD ธรรมดาโดยไม่มีเหตุผล

ใช้ dependency directions ชัดเจน: route/screen เรียก domain logic/client; backend domain เรียก DB/media/auth helpers; shared contracts ไม่ import แอปใด แอป build และ deploy แยกได้

### 3.1. ขอบเขตเพื่อให้แยกบริการและ repo ภายหลัง

Repository เป็นการเก็บและ review โค้ด ส่วน service boundary เป็นเรื่อง runtime, deployment, data ownership และสัญญาการสื่อสาร แยกสองเรื่องนี้ในเอกสารและ CI ไม่ใช้ imports ข้าม apps ไปยัง source/private internals และไม่ให้ domain import repositories/schema ของ domain อื่น

กำหนดเจ้าของข้อมูลจาก source ปัจจุบัน:

- Access: users, roles ใหม่, permissions, role_permissions, staff sessions และ access audit ใหม่
- Website content: home_content, pharmacist_home_content, laws, council_members, news, medicine_articles, public_project_articles, council_history, agencies, web_settings, honor_awards, honors, services, policy_categories, policy_projects, products, other_service_categories และ other_service_items
- Registry: pharmacists; ส่ง read DTO ผ่าน registry interface เมื่อ domain อื่นต้องตรวจข้อมูลทะเบียน
- Requests: requests, request_shipping_details, request_payment_logs และ request_tax_invoices
- Academy: ทุก academy_* table รวม order/enrollment/refund/progress/certificate ซึ่งต้องรักษา transactional business invariants ด้วยกัน
- Media: asset metadata ใหม่และ storage operations ส่วนข้อมูลเนื้อหาเป็นเจ้าของ reference/visibility requirement ของไฟล์ ไม่ให้ทุกโมดูลลบ object paths ของกันและกันโดยตรง

นี่เป็น module ownership map สำหรับ POC ไม่ใช่รายการ microservices ที่ vendor ต้อง deploy ตามจำนวนโมดูล Vendor อาจรวม/แยกตาม business/transaction boundaries ที่ยืนยันภายหลัง

Cross-domain access ใช้ public interface และ DTO เช่น Requests อ่านทะเบียนผ่าน Registry interface แทน query/import pharmacist repository โดยตรง ใน POC เรียกใน process ปกติได้ ใช้ in-process adapter โดยยังไม่เพิ่ม network calls ภายหลัง vendor เปลี่ยน adapter เป็น API/event integration พร้อมกำหนด timeout/retry/failure semantics

Runtime transactions อยู่ภายใน owning business boundary ไม่ตั้งเงื่อนไขว่าบริการที่แยกแล้วต้องใช้ SQL transaction เดียวข้ามเจ้าของข้อมูล ถ้าจะแยก Academy order/enrollment/refund ออกจากกัน vendor ต้องออกแบบ consistency/compensation เพิ่ม ไม่ย้าย folder แล้วถือว่ายัง atomic เหมือนเดิม

POC ใช้ Supabase project/DB เดียวตามที่ตกลง แต่ service extraction ต้องกำหนด data store/schema/database-role permissions ตามเจ้าของข้อมูล ห้าม future services อ่าน/เขียน private tables ของกันโดยตรงเพียงเพราะอยู่ PostgreSQL เครื่องเดียว Storage bucket/prefix/credentials ต้องแบ่ง ownership และ access ด้วย รายละเอียด physical databases/projects และจำนวน services เป็น production design ของ vendor

Shared contracts เป็น dependency ที่มี version ไม่เป็นที่รวม business code ใช้ additive compatible changes และ contract tests เพื่อให้ consumer release แยกกันได้ Acceptance ของ POC ต้องแสดงว่า contracts build/pack ได้เอง และ consumer ใช้ public package exports โดยไม่ต้อง import backend DB model หรือ source-path ข้ามแอป การเผยแพร่ package registry จริงเป็นขั้น vendor extraction ไม่ใช่ external project ใหม่ในรอบออกแบบนี้

## 4. Staff JWT และ sessions

Backend เป็นผู้ตรวจรหัสผ่านและออก JWT ของเจ้าหน้าที่ Next server ของ backoffice ตั้ง cookie และเรียก backend ไม่แชร์ JWT signing secret ให้ browser หรือ pharmacy-web

- JWT ระบุ user ID, random session ID, issuer, audience, issued/expiry times ตรวจ algorithm/issuer/audience ตาม config
- เก็บ session metadata ใน DB ไม่เก็บ bearer token; POC ใช้อายุคงที่ 8 ชั่วโมงเป็น default และไม่มี refresh-token subsystem ใหม่
- Cookie เป็น HttpOnly, host-only, SameSite=Lax และ Secure เมื่อใช้ HTTPS อายุ cookie/JWT/session ต้องตรงกัน
- Login proxy ไม่ส่ง bearer token กลับให้ browser JavaScript และไม่เชื่อ user_role cookie เป็นหลักฐานสิทธิ์
- Protected API ตรวจ JWT, session และบัญชีปัจจุบันทุกครั้ง ปฏิเสธบัญชีที่ถูกลบ/ระงับ session ที่ถูก revoke/หมดอายุ และใช้ role/grants ปัจจุบันจาก DB
- Logout revoke session นั้นและล้าง cookie เปลี่ยน password/ระงับ/ลบบัญชี revoke ทุก session
- Protected layouts/handlers อ่าน verified identity จาก backend; การตรวจ cookie ใน middleware เป็นเพียงการช่วยนำทาง
- ไม่ cache staff/member responses ข้ามผู้ใช้
- Local UI bypass ของ backoffice ใช้ได้เฉพาะ isolated local development ไม่เปิดบน POC deployment ส่วน mock member login ของ pharmacy-web เป็นขอบเขตที่ตั้งใจคงไว้

Access module เป็นเจ้าของ identity/session state และมี authorization interface ให้ feature modules เรียก ใน microservices ปลายทาง vendor ต้องให้ services ตรวจ intended issuer/audience และรับ current authorization/session state จากเจ้าของที่มีอำนาจ ไม่แชร์ symmetric signing secret ให้ทุก service จนทุก service ออก token เองได้โดยปริยาย รูปแบบ distributed verification/introspection/revocation เป็นงาน extraction ที่ต้องออกแบบเพิ่ม ไม่อ้างว่าการตรวจ DB ใน backend เดียวครอบคลุมบริการใหม่อัตโนมัติ

ไม่ import users rows, usernames/password hashes หรือ users sequence เดิม สร้าง users/session schema ใหม่ด้วย migrations และสร้าง admin แรกด้วยคำสั่ง setup ที่ควบคุมได้เมื่อพร้อมทดสอบ รับ credentials ผ่านช่องทางที่ไม่ commit/log รหัสผ่าน ไม่มี public bootstrap endpoint หรือ password เริ่มต้นตายตัว

## 5. Capability catalog และ dynamic roles

โค้ดเป็นเจ้าของรายการ capabilities: stable key, label, group และ ordering พร้อม PermissionKey type ทั้งเมนูและ backend guard import catalog/constants ชุดเดียวกัน ฐานข้อมูลเป็นเจ้าของ role definitions และ role-to-capability assignments ที่ admin จัดการผ่านหน้าเดิม

รักษา permission keys และ grants เดิมไว้ก่อน รวม legacy entries ที่ยังไม่ถูกใช้ Guard ยอมรับเฉพาะ keys ที่ catalog รู้จัก New capabilities ไม่ให้ nonadmin roles อัตโนมัติ การ rename/delete ต้องมี reviewed migration และ mapping ที่ไม่ขยายสิทธิ์โดยเงียบ ๆ

Catalog sync เป็นคำสั่ง setup/release: transactional, idempotent upsert ของ metadata เพิ่ม definitions ที่ขาดได้ แต่ไม่ replace/delete role assignments ไม่ทำใน server startup หรือ public API Deploy definitions/compatible backend ก่อน frontend feature ที่ต้องใช้ capability ใหม่

Feature domains เป็นเจ้าของ capability declarations/business guards ส่วน Access เป็นเจ้าของ roles/assignments และ authoritative catalog registry แยก declarations ตาม domain ใน public contracts exports เมื่อแยก repo release pipeline ต้องส่ง reviewed versioned capability definitions/manifest ไป controlled registry sync ก่อนเปิด feature โดยไม่กลับไปให้เจ้าของงานเพิ่ม key ด้วย SQL วิธีเชื่อม pipelines เป็นงาน vendor extraction ไม่เปิด public endpoint รับ permission definitions ตามใจ caller

role admin คง full-access policy ตาม UI เดิมซึ่งระบุว่าได้ทุกสิทธิ์ และไม่ได้มี editor ของ admin grants สิทธิ์นี้ใช้เฉพาะ current verified active admin กับ capabilities ที่ catalog รู้จัก ไม่ยกเว้น input validation, ownership/business rules หรือ session/account checks API ไม่เปิดให้แก้ admin grants แล้วแสดงว่า checkbox มีผลทั้งที่ full-access policy ยังอยู่

เฉพาะ current verified admin แต่งตั้ง/ถอด admin หรือเปลี่ยนนโยบาย role สงวนได้ ไม่อ่านความเป็น admin จาก label ที่แก้ได้หรือ claim เก่า ผู้มี manage_users/manage_roles ทำงานกับบัญชี/role ทั่วไปตามขอบเขตที่ได้รับมอบ:

- Nonadmin มอบได้เฉพาะ capabilities ใน current grant set ของตนและไม่มอบ reserved administrator authority
- Nonadmin ไม่แก้ role ที่ตนใช้เพื่อยกระดับตัวเอง และไม่แก้ role/admin assignment สงวนผ่าน creation, update, rename, delete หรือ bulk operations
- การมอบ ordinary role ให้บัญชีต้องไม่ทำให้ผู้มอบสามารถให้สิทธิ์เกินขอบเขตตนผ่าน role ที่มี grants สูงกว่า
- ห้ามลบ/ระงับ/demote active admin คนสุดท้าย ตรวจใน transaction
- Role/assignment mutations ต้อง atomic, validate keys และบันทึก audit โดยไม่เก็บ secrets

หน้าสร้างผู้ใช้ที่มี manage_users ต้องอ่านเฉพาะ ordinary roles ที่ตนมอบได้ แม้ไม่มี manage_roles เมนู parent แสดงเมื่อมีสิทธิ์ของ child ที่เข้าถึงได้ เพื่อแก้การใช้ manage_home ครอบทุกหน้าโดยยังคง layout/menu labels เดิม

เก็บ role names เดิมจากทั้ง role_permissions และ users.role ก่อนข้าม users rows เพื่อไม่ให้ role ที่ไม่มี grants และเคยปรากฏเฉพาะในบัญชีหายไป นี่เป็น role configuration ไม่ใช่การย้ายบัญชี login

Developer workflow: เพิ่ม catalog → เพิ่มหน้า/เมนู/API guard → รัน setup/sync และ negative authorization tests → ส่ง PR → release sync → admin เลือกสิทธิ์ให้ ordinary roles ผ่านหน้าเดิม Permission key เป็น identifier ใน repo ไม่ใช่ secret การเข้าถึงโค้ดใน GitHub แยกจากสิทธิ์เจ้าหน้าที่ของแอป

## 6. API clients, proxy และ env

แต่ละแอปมี validated config และ tracked .env.example ที่เป็น names/placeholders แยก development, preview และ POC deployment ไม่มี secrets จริง ไม่มี silent production fallback ไป backend เก่าหรือ localhost

- pharmacy-web server: BACKEND_API_URL, CONFERENCE_API_URL, mock auth config, Conference assertion config/private key และ Pharmacy session secret
- backoffice server: BACKEND_API_URL และ cookie/session integration config ไม่ต้องมี DB/storage credentials หรือ Conference signing key
- backend-api: DB app/migration connection, storage server connection/key, JWT config, allowed application origins, upload limits และ server integration secrets
- NEXT_PUBLIC_* ใช้เฉพาะค่าที่ตั้งใจให้ browser อ่านได้ โดยคำนึงว่าค่าถูกฝังตอน build
- Session encryption secret ของ mock Pharmacy แยกจาก Conference assertion signing key เมื่อเปลี่ยน secret demo sessions เดิม login ใหม่ได้
- Credentials ที่เคย commit และ private signing key ที่เคยแชร์ต้องมีแผนเปลี่ยนก่อนนำไปใช้ deployment ใหม่ การเปลี่ยน Conference signing key ต้องประสาน public verification key/kid กับเพื่อน ไม่ใส่ค่า private key ในเอกสาร/repo/log

Browser client ใช้ same-origin /api ที่มี allowlist ของ method/path/query และ fixed upstream จาก env ไม่รับ destination URL, Authorization override หรือ identity จาก caller เป็นอำนาจ Server Components/server handlers ใช้ absolute upstream URL จาก server-only client โดยตรง ไม่สร้าง self-fetch ผ่าน browser proxy โดยไม่จำเป็น

การส่ง file bytes เป็นข้อยกเว้นที่กำหนดขอบเขตชัด: [Vercel Functions จำกัด request/response payload 4.5 MB](https://vercel.com/docs/functions/limitations) จึงขอ upload intent ผ่าน same-origin handler ที่ตรวจ session/capability/ownership/CSRF ก่อน แล้ว browser ส่ง raw file ตรง fixed Render endpoint ด้วย opaque ticket ใช้ครั้งเดียว อายุ 300 วินาที ผูก actor/session/owner/kind/size และเก็บเฉพาะ hash ฝั่ง backend ตอน consume ตรวจ current authorization ซ้ำ ไม่ส่ง staff JWT หรือ storage key ให้ browser; exact CORS origins และ `credentials:omit` สำหรับ receiver เพดานเดิม100MiBและ sniff64KiB อยู่ใน validated config ไฟล์ใหญ่ download ด้วย authorized short-lived signed URL/redirect ไม่ relay binary ผ่าน Next

Transport/interface ต้องไม่ผูกทุก domain กับ backend host เดียวถาวร POC กำหนด upstream ของ domain ทั้งหมดเป็น BACKEND_API_URL ได้ ภายหลัง vendor map routes ที่ระบุไว้ไปยัง service origins จาก server config โดยไม่เปลี่ยน frontend screens และไม่เปิด arbitrary URL proxy

Public routes ไม่ส่ง staff credentials Academy member bridge derive license identity จาก verified mock Pharmacy session Conference bridge ใช้ attendee session/CSRF ของบริการนั้น ไม่มีการแชร์ staff session

Cookie-based mutations ตรวจ same-origin และ CSRF token; backend ยังตรวจสิทธิ์ทุก request แม้เรียกข้าม proxy โดยตรง API input/output contracts validate ที่ trust boundaries Public และ admin DTOs แยกกัน

API client กลางยังมีได้ ใช้ native fetch และ domain adapters แยก server/client imports จัด timeout ร่วมกับ caller abort, status/network/invalid-body errors, empty response และ JSON metadata/direct ticket uploads/download redirects ตามชนิด คงข้อความไทย/error controls เดิม ไม่ auto-retry mutations หรือสร้าง idempotency key ใหม่แทนการ retry รายการเดิม; generic Next proxy มี bounded JSON body ต่ำกว่า platform capและไม่รับ file bodies

## 7. Content, privacy, files และ transactions

Public news/medicine/project reads คืนเฉพาะ published content ที่ถึงเวลาเผยแพร่: status published และ publishedAt ว่างหรือไม่เกินเวลาปัจจุบัน Draft/future publication อ่านได้เฉพาะ admin APIs ที่มีสิทธิ์ โมดูลที่ใช้ active/online flag ยึด flag และกฎเผยแพร่ของโมดูลนั้นก่อน query/serialize

Public registry projection เปิดชื่อ เลขใบอนุญาต จังหวัด สถานะ วันหมดอายุ และรูปเท่านั้น ที่อยู่เต็มเป็น staff-only เมื่อมีสิทธิ์ทะเบียน ข้อนี้ป้องกัน API จริง ส่วน public license-search UI ยังคง mock

Rich text sanitize ด้วย allowlist ที่รองรับรูปแบบ Quill เดิมทั้งขอบเขต write/render ข้อมูลธรรมดา render เป็น text ตรวจ URL/protocol ที่อนุญาต ไม่รัน active HTML จาก DB

Public storage: รูปเว็บไซต์/ข่าว และ PDF/docs ที่ตั้งใจเผยแพร่ Private storage: สลิป เอกสารคำขอ ไฟล์ส่วนบุคคล และเอกสารเรียนที่จำกัดผู้เรียน API ตรวจ capability/ownership/enrollment ตามประเภทก่อนออกลิงก์อายุจำกัด ไม่เปิด app tables/files ให้ anon โดยไม่ตั้งใจผ่าน Supabase APIs

Media ใช้ asset identity/object path และเจ้าของที่ตรวจได้ ไม่ลบตาม arbitrary URL ที่ client ส่งมา Validate size/type/signature ตามประเภท Stream หรือควบคุม memory ของ uploads แทน buffer ขนาดใหญ่โดยไม่มีขอบเขต Cleanup ลำดับ: upload สำเร็จ → commit DB reference → ลบไฟล์เก่าหลังสำเร็จ มี orphan/retry handling และ preview object URLs ถูก revoke เมื่อเลิกใช้

Requests/Academy order/enrollment/refund/course transitions ที่มีหลาย writes ใช้ transactions และ idempotency ตาม flow ไม่เปลี่ยน mock paid/refund outcomes Mutation errors ไม่แสดง success เมื่อ write ล้มเหลว optimistic state rollback/revalidate และยกเลิก/กัน response เก่าทับ state ใหม่

## 8. Conference boundary

Conference เป็นบริการของเพื่อนบน Railway ไม่มี source ในงานนี้ pharmacy-web คง public/member integration และ contract เดิม Backoffice ของทั้งสองระบบยังแยก ไม่มี Conference staff tab หรือ staff SSO ในรอบนี้

คง public list/detail, eligibility, orders, free registration, pending-order recovery, mock payment success/failure/retry/cancel, paid-only success และ QR behavior รวม CSRF/cookies/idempotency ที่มีอยู่ Proxy exchange ต้องผ่าน verified Pharmacy session และไม่เปิด arbitrary direct exchange จาก browser

ทดสอบด้วย recorded/local fixtures หรือ test environment ที่ตกลงกับเพื่อน ไม่ถือว่าการอ่าน public OpenAPI หรือ events HTTP 200 เป็นหลักฐานว่า authenticated/session flows ปลอดภัยครบ Public documentation ไม่มี response contracts ครบทั้งหมดจึงไม่สร้าง type จากการเดา

เมื่อพัฒนา Conference backoffice ภายหลัง จึงค่อยยืนยัน staff authentication/authorization กับบริการนั้นและเพิ่ม capabilities ผ่าน workflow catalog ใหม่ ไม่ให้ core JWT มีอำนาจกับบริการเพื่อนโดยอัตโนมัติ

## 9. Data และ storage migration

ย้าย application content/business/configuration ทั้งหมดจาก Neon รวมรูป/ไฟล์ใน Supabase เดิม ยกเว้น old staff users/login credentials/sessions ที่ผู้ใช้ยกเลิกการย้ายแล้ว จาก source พบ 38 tables; users เป็น staff account table ส่วน 37 tables อื่นยังอยู่ในขอบเขต ต้องใช้ live inventory ยืนยันเพิ่มเติมก่อน execution

ไม่พบ business FK/logical persisted staff user ID จาก source ที่ตรวจ Requests และ Academy identify ผู้เรียนด้วย pharmacist license ไม่ใช่ users.id แต่ live Neon อาจต่างจาก source ต้องตรวจ columns, views, triggers และ dependencies ก่อนตัด users rows

ลำดับ:

1. Inventory live schema/migration history, exact row counts, IDs/relations/enums/JSON/sequences, role configuration และทุก user bucket/object รวม originals/unreferenced files เก็บ source snapshot และ manifest นอก Git
2. Rehearse import ที่ Supabase ใหม่เฉพาะ app-owned schema/data/history ไม่ overwrite Supabase-managed auth/storage/system schemas และไม่ import old users rows/sequence หรือเจ้าของ/privileges ของ Postgres ที่ขัดกับ managed environment
3. Copy actual object bytes กับ metadata แยกจาก SQL restore จัด public/private ตามขอบเขต ตรวจ object counts/sizes/checksums ไม่ถือว่า copy storage catalog rows เท่ากับ copy ไฟล์
4. Map old project URLs/object refs ใน columns, JSON และ rich HTML ไปไฟล์ใหม่ โดยรักษา IDs/relationships ของข้อมูลธุรกิจ External Conference/YouTube URLs ไม่เปลี่ยน
5. Compare exact counts, ID sets, normalized row contents ตาม transformation ที่ประกาศไว้, role grants, sequence state และไฟล์จริง โดยแยก excluded users และ schema additions ของระบบใหม่ออกจาก counts
6. รายงาน orphan/duplicates/unknown legacy records ก่อนเพิ่ม constraints ไม่ drop/deduplicate/regenerate IDs หรือ reassign historical actor โดยเงียบ ๆ ถ้าพบ staff references ใน live DB ให้รักษาประวัติด้วย explicit mapping/non-login historical actor ที่ไม่ใช่บัญชี loginใหม่ ห้ามปล่อยข้อมูลธุรกิจหายหรืออ้างบัญชีใหม่ผิดคน
7. ก่อน final snapshot หยุด test writes/uploads/background writers ชั่วคราว ทำ final export/object inventory และ delta copy ตรวจซ้ำหลัง restore แล้วจึงสลับไป POC ใหม่

ใช้ connection สำหรับ long-running Render กับ migration อย่างตั้งใจ (direct หรือ session pooler ตาม connectivity/SSL/pool ที่ตรวจได้) แยก app/migration credentials ไม่เลือก transaction pooler โดยไม่ตรวจข้อจำกัด

Role/permission config เดิมยังเก็บเพราะผู้ใช้ยกเลิกเฉพาะ login accounts New users/session tables เริ่มใหม่ เมื่อพร้อมทดสอบ backoffice ใช้ controlled setup สร้าง admin ใหม่ ไม่ต้องนำเข้า old password hashes

## 10. Performance และเกณฑ์ตรวจรับ

เก็บภาพ/flow ก่อนย้ายโค้ด ใช้ fixtures, role, วันที่/carousel state และ fonts เดียวกัน Desktop 1440×900 และ mobile 390×844 เป็น viewports สำหรับตรวจหลัก ใช้หน้าหลักของทุก domain และ states ที่กระทบ เช่น forms/modals/empty/loading/error/retry

หลักฐานที่ต้องผ่าน:

- Route/layout/typography/spacing/assets/navigation และ mock outcomes ตาม scope ไม่เกิด visual/flow regression ที่ไม่ได้รับรอง
- Login 10 numeric IDs และ ph123 พร้อม wrong password/OTP/return URL/logout และ stale-cookie handling
- Staff CRUD/role assignment/editor/crop/upload และ failure cases ทำงานถูกต้อง ปฏิเสธ unknown/denied capability, revoked/disabled/deleted account, self-escalation, last-admin และ cross-user access แม้เรียก API ตรง
- Proxy ไม่รับ disallowed methods/paths/identity overrides; CSRF, publication rules, public field projection และ rich-text safety ผ่าน negative tests
- Public/private file access ตรง policy รวม expiry/ownership; failed upload/DB write ไม่ทำไฟล์เก่าสูญหาย; multi-write transitions ไม่เหลือ partial state
- Registry admin pagination/search/sort ครอบคลุมเกิน 50 แถว และ home statistics ใช้จำนวนจริง ไม่ใช้ length ของหน้าแรก
- Clean checkout setup, independent typecheck/build, focused functional/security tests และ reproducible catalog sync ผ่านบน isolated test DB
- ตรวจ dependency boundaries, domain-owned table access และ contract package public exports/build artifact เพื่อให้การแยก repo ภายหลังไม่ต้องแก้ business logic ที่ผูกกับ source-path imports
- Migration/data/file reconciliation ครบและ staff account exclusions ตรงขอบเขต
- Conference fixture/contract checks ผ่านโดยไม่อ้างว่าทดสอบ live mutations ที่ยังไม่มี test environment

วัดก่อน/หลังบนข้อมูลและสภาพแวดล้อมเดียวกัน: loading ของหน้าหลัก, request/payload/query counts, relevant API latency และ bundle output กำหนด numeric targets หลังได้ baseline ไม่รับประกันเปอร์เซ็นต์เร็วขึ้นก่อนวัด งานที่ต้องแก้จาก source ได้แก่ public auth ที่บล็อกทั้งหน้า, full payload lists, pagination/count, N+1, request races, upload memory และ indexes ที่เลือกจาก query evidence Cache public content มี invalidation หลัง publish/update; private data ใช้ no-store

ผลตรวจปัจจุบันเป็น baseline จาก source: TypeScript ทั้งสามแอปผ่านและ pharmacy-web tests 6 files/18 tests ผ่านในรอบ discovery ไม่ใช่ผลทดสอบของ implementation ใหม่ ยังไม่มี production builds, visual comparison, live migration reconciliation หรือ runtime performance measurement ที่ทำเสร็จแล้ว

## 11. Deployment, rollback และ vendor handoff

สร้าง GitHub monorepo ใหม่, Vercel projects ใหม่แยก pharmacy-web/backoffice, Render backend ใหม่ และ Supabase DB/Storage ใหม่ Conference คง Railway เดิม ชื่อบัญชี/project/domain และ credentials เป็น configuration ตอน setup ไม่ใช่ข้อกำหนดให้แก้ UI

Release ตรวจ build/typecheck/tests, schema migrations และ catalog sync ก่อนเปิด frontend feature ที่ต้องพึ่ง contracts/capabilities ใหม่ มี liveness health และ readiness ที่ตรวจ DB/required migration version, graceful shutdown และ sanitized request/error logs ที่ไม่แสดง tokens/password/private keys Backend ไม่ seed ตอน startup

เก็บระบบเดิมและ final snapshot ไว้เทียบ/ย้อนกลับ โดย old data เป็น read-only หลัง cutover ก่อนระบบใหม่มี writes กลับ source ได้ง่าย หลังมี writes ใหม่ source จะเก่าแล้ว ให้สำรองข้อมูล/ไฟล์ใหม่และเลือกแก้ระบบใหม่หรือกลับ compatible app release บน DB ใหม่ ถ้าต้องกลับ DB เดิมต้องมี reverse migration ที่ซ้อมและ reconcile ใหม่ ไม่ทิ้งข้อมูลทดสอบที่สร้างใหม่อัตโนมัติ

Vendor handoff มี:

- README/local setup และคำสั่ง dev/build/typecheck/test/migrate/catalog-sync ที่ตรงกับโค้ดจริง
- Per-app env templates/inventory และเจ้าของค่าใน development/preview/POC deployment โดยไม่มีค่า secrets
- Module/API/actor boundaries, table ownership, transaction boundaries, versioned contracts และตัวอย่าง workflow เพิ่ม tab/permissions ทั้งใน POC และเมื่อ vendor แยก repo
- Mock test IDs/fixtures, verification commands/results และก่อน–หลัง UI/performance evidence
- Migration/file mapping/manifests/reconciliation, deploy/restore/rollback instructions และ source/target ownership
- รายการ mock/placeholder/Conference constraints, known limitations และ production/server tasks ที่ vendor รับผิดชอบ

การแยก backend เป็น microservices ยังมีงานของ vendor ได้แก่เลือก bounded services, service-specific build/deploy/config, isolate data/credentials, service identity/authorization trust, network failure/consistency handling และ contract/release compatibility POC ส่งมอบ boundaries และหลักฐานที่ช่วยลดการผูกกัน ไม่รับประกันว่าการแยก service เป็นเพียงการ copy folder

Historical architecture/Conference merge documents และ README ที่ขัดกับแบบนี้ต้อง mark historical หรือแก้ระหว่าง implementation เพื่อไม่ให้ vendor ทำตาม scope เก่า เช่น การรวม Conference staff UI หรือการอ้างว่า client ใช้ Axios ทั้งที่ใช้ fetch

## 12. ขั้นตอนถัดไปและแหล่งอ้างอิง

ผู้ใช้เห็นชอบแบบตามขอบเขตล่าสุดแล้ว ขั้นต่อไปตรวจ [ชุด implementation plans](/Users/arm/a3/pharmacy-web/docs/superpowers/plans/2026-10-14-pharmacy-poc-00-rollout.md) รวมรายละเอียด upload ticket และเลือก execution method ก่อน product implementation การเห็นชอบแบบหรือ scope ไม่ใช่การยืนยันว่าปัญหาโครงสร้างถูกแก้แล้ว

ลำดับงานของแผนจะเริ่ม baseline → workspace/config → backend auth/catalog → refactor domains พร้อม consumers → performance evidence → rehearsed migration → POC deployment/handoff งานอิสระแบ่งได้แต่ไม่ข้าม dependencies ของ auth/contracts/data migration

แหล่งอ้างอิงหลัก:

- [Next.js authentication/session guidance](https://nextjs.org/docs/app/guides/authentication)
- [Next.js environment variables](https://nextjs.org/docs/app/guides/environment-variables)
- [OWASP authorization guidance](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html)
- [OWASP secrets management](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html)
- [Drizzle migrations](https://orm.drizzle.team/docs/migrations)
- [Supabase PostgreSQL migration](https://supabase.com/docs/guides/platform/migrating-to-supabase/postgres)
- [Supabase database connections](https://supabase.com/docs/guides/database/connecting-to-postgres)
- [Supabase storage buckets](https://supabase.com/docs/guides/storage/buckets/fundamentals)
- [Vercel monorepos](https://vercel.com/docs/monorepos)
- [Vercel Functions payload limits](https://vercel.com/docs/functions/limitations)
- [Render monorepo support](https://render.com/docs/monorepo-support)
- [Microsoft microservices data considerations](https://learn.microsoft.com/en-us/azure/architecture/microservices/design/data-considerations)
- [Conference public OpenAPI](https://confer-api-production.up.railway.app/openapi.json) — interface reference ของบริการภายนอก ไม่ใช่ security audit ของ implementation

Source evidence และผลตรวจแยกประเด็นอยู่ใน [ผลตรวจประกอบการออกแบบ](/Users/arm/.cursor/projects/Users-arm-a3/canvases/pharmacy-refactor-discovery.canvas.tsx) ซึ่งเป็น artifact ในเครื่องนี้ ต้องจัดผลตรวจที่เกี่ยวข้องไว้ในเอกสารของ monorepo เมื่อส่งต่อ vendor บริการจริง/env dashboards/live Neon/storage policies ยังไม่ถูกตรวจในขั้นเขียน spec นี้
