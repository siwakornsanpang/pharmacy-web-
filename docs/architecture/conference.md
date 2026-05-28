# Conference System — Merge Plan

> **Scope ที่ชัดเจน (หลังการหารือ):**
> - **Frontend**: เพิ่ม conference features เข้าไปใน `01_pharmacy-web` ที่ `/meeting` และ `/member-meeting` โดยใช้ pharmacy design system ทั้งหมด (ออกแบบ UI ใหม่)
> - **Backoffice**: เพิ่ม conference management เข้าไปใน `02_back-office` ที่มีอยู่แล้ว
> - **Backend API**: ใช้ `03_backend-api` เป็นฐาน เพิ่ม conference routes จาก `conference-api` เข้าไป
> - **Database**: 1 PostgreSQL database เดียว รวม schema ทั้งสองระบบ
> - **Auth**: ใช้ pharmacy auth เดิม (cookie-based) — ไม่ต้องทำ auth ใหม่ตอนนี้
> - **File Upload**: Migrate ทุกอย่างไป **Supabase Storage** (ยกเลิก Google Drive)
> - **UI**: ออกแบบ UI ใหม่ทั้งหมดด้วย pharmacy design system (ไม่ reuse conference-web components)

---

## สารบัญ

1. [Feature หลักทั้งหมด](#1-feature-หลักทั้งหมด)
2. [โครงสร้าง Folder](#2-โครงสร้าง-folder)
3. [Routing และ Pages](#3-routing-และ-pages)
4. [Library](#4-library)
5. [Database & Services](#5-database--services)
6. [Potential Conflicts & วิธีแก้](#6-potential-conflicts--วิธีแก้)
7. [สิ่งที่ขาดหายไปและคำแนะนำเพิ่มเติม](#7-สิ่งที่ขาดหายไปและคำแนะนำเพิ่มเติม)
8. [แผนดำเนินการ (Revised)](#8-แผนดำเนินการ-revised)

---

## 1. Feature หลักทั้งหมด

### 1.1 Conference Features (เพิ่มเข้า pharmacy-web)

| # | Feature | Route | Status |
|---|---------|-------|--------|
| 1 | **Event Listing** | `/meeting` (public) | 🆕 ใหม่ |
| 2 | **Event Detail** | `/meeting/[id]` | 🆕 ใหม่ |
| 3 | **Ticket Selection & Checkout** | `/meeting/[id]/checkout` | 🆕 ใหม่ |
| 4 | **Payment** | `/meeting/[id]/payment` | 🆕 ใหม่ |
| 5 | **Registration Success / QR** | `/meeting/[id]/success` | 🆕 ใหม่ |
| 6 | **My Tickets (ตั๋วของฉัน)** | `/member-meeting` (logged-in) | 🔄 ปรับปรุง |
| 7 | **Abstract Submission** | `/member-meeting/abstract` | 🆕 ใหม่ |
| 8 | **Student Eligibility Request** | `/member-meeting/eligibility` | 🆕 ใหม่ |
| 9 | **Event Schedule / Agenda** | `/meeting/[id]/agenda` | 🆕 ใหม่ |
| 10 | **Contact / Feedback** | อยู่ใน `/contact` เดิม | 🔄 ขยาย |

### 1.2 Conference Backoffice Features (เพิ่มเข้า 02_back-office)

| Module | Path ใน Backoffice | หน้าที่ |
|--------|-------------------|--------|
| **Events Management** | `/backoffice/conference/events` | CRUD events, sessions, images, documents |
| **Registrations** | `/backoffice/conference/registrations` | ดูรายการลงทะเบียน, ยืนยัน, ยกเลิก |
| **Tickets** | `/backoffice/conference/tickets` | สร้าง/จัดการ ticket types, quota |
| **Check-In** | `/backoffice/conference/checkins` | QR scan check-in, รายงาน |
| **Speakers** | `/backoffice/conference/speakers` | CRUD speakers + ผูกกับ event/session |
| **Abstracts** | `/backoffice/conference/abstracts` | Review abstracts, revision requests |
| **Promo Codes** | `/backoffice/conference/promo-codes` | สร้าง/จัดการ promo codes |
| **User Verification** | `/backoffice/conference/verifications` | อนุมัติ/ปฏิเสธ account registration |
| **Email** | `/backoffice/conference/email` | manual send + retrosend |
| **Student Eligibility** | `/backoffice/conference/eligibility` | อนุมัติสิทธิ์นักศึกษา |
| **Members** | `/backoffice/conference/members` | ดูข้อมูลสมาชิก |
| **Abstract Categories** | `/backoffice/conference/abstract-categories` | จัดการหมวด abstract per event |
| **Sessions** | `/backoffice/conference/sessions` | CRUD sessions ของแต่ละ event |

### 1.3 Conference API Features (เพิ่มเข้า 03_backend-api)

| Feature Group | Routes | หมายเหตุ |
|---------------|--------|---------|
| **Conference Auth** | POST `/auth/conference/register`, `/login`, `/forgot-password`, `/reset-password` | แยก namespace จาก pharmacy auth |
| **Event (Public)** | GET `/api/events`, `/api/events/:id` | Public event listing |
| **Tickets (Public)** | GET `/api/tickets` | Ticket types per event |
| **Workshops** | GET `/api/workshops` | Workshop listing |
| **Registration** | POST `/api/registrations/free`, `/api/registrations/quick` | ลงทะเบียนฟรี + ด่วน |
| **Payments** | POST `/api/payments/*` | Stripe, Pay Solutions, KTB FastPay |
| **Abstracts** | POST/GET `/api/abstracts/*` | Submit + ดู abstract |
| **Student Eligibility** | GET/POST `/api/events/:id/student-eligibility` | ตรวจสิทธิ์นักศึกษา |
| **Upload** | POST `/api/upload` | → Supabase Storage |
| **Backoffice (Protected)** | `/api/backoffice/*` | 13+ modules ทั้งหมด |
| **Contact** | POST `/api/contact` | Contact form |

---

## 2. โครงสร้าง Folder

### 2.1 pharmacy-web — การเปลี่ยนแปลง

```
01_pharmacy-web/
├── app/
│   ├── (public)/
│   │   ├── 05_meeting/           # 🔄 ปรับปรุง — เพิ่ม conference features
│   │   │   ├── page.tsx          # Event listing (ปัจจุบัน: meeting stub)
│   │   │   ├── [id]/             # 🆕 Event detail
│   │   │   │   ├── page.tsx
│   │   │   │   ├── agenda/       # 🆕 Schedule/Agenda
│   │   │   │   ├── checkout/     # 🆕 Ticket selection + checkout
│   │   │   │   ├── payment/      # 🆕 Payment page
│   │   │   │   ├── success/      # 🆕 Registration success + QR
│   │   │   │   └── cancel/       # 🆕 Payment cancel
│   │   └── ... (ไม่เปลี่ยน)
│   │
│   ├── (member)/
│   │   ├── 04_member-meeting/    # 🔄 ปรับปรุง — My Tickets + conference features
│   │   │   ├── page.tsx          # My Tickets (ปัจจุบัน: stub)
│   │   │   ├── abstract/         # 🆕 Abstract submission
│   │   │   │   ├── page.tsx
│   │   │   │   └── [id]/         # 🆕 ดู/แก้ไข abstract
│   │   │   └── eligibility/      # 🆕 Student eligibility request
│   │   └── ... (ไม่เปลี่ยน)
│   │
│   └── ... (login, layout, globals ไม่เปลี่ยน)
│
├── components/
│   ├── public/          # เดิม
│   ├── member/          # เดิม
│   ├── ui/              # เดิม
│   └── conference/      # 🆕 Components เฉพาะ conference (ออกแบบด้วย pharmacy design system)
│       ├── EventCard.tsx
│       ├── EventList.tsx
│       ├── TicketSelector.tsx
│       ├── CheckoutForm.tsx
│       ├── OrderSummary.tsx
│       ├── PromoCodeInput.tsx
│       ├── TaxInvoiceSection.tsx
│       ├── PaymentMethodSelector.tsx
│       ├── QRCodeTicket.tsx
│       ├── AbstractForm.tsx
│       ├── AbstractList.tsx
│       ├── SessionCard.tsx
│       ├── SpeakerCard.tsx
│       ├── AgendaTable.tsx
│       └── EligibilityForm.tsx
│
├── lib/
│   ├── api.ts            # เดิม (pharmacy API)
│   └── conference/       # 🆕 Conference service layer
│       ├── api.ts         # axios client → 03_backend-api
│       ├── events.ts      # event services
│       ├── registrations.ts
│       ├── payments.ts
│       ├── abstracts.ts
│       └── types.ts       # TypeScript types สำหรับ conference
│
└── next.config.ts        # 🔄 เพิ่ม API proxy rules สำหรับ conference endpoints
```

### 2.2 02_back-office — การเปลี่ยนแปลง

```
02_back-office/src/app/
├── backoffice/
│   ├── module/
│   │   ├── council-web/   # เดิม (news, laws, home, ฯลฯ)
│   │   ├── pharmacist-web/ # เดิม
│   │   ├── register/      # เดิม
│   │   ├── setting/       # เดิม
│   │   └── conference/    # 🆕 Conference management module
│   │       ├── events/
│   │       │   ├── page.tsx              # รายการ events
│   │       │   ├── create/               # สร้าง event ใหม่
│   │       │   └── [id]/                 # แก้ไข event + sessions + tickets
│   │       ├── registrations/
│   │       │   ├── page.tsx              # รายการลงทะเบียน
│   │       │   └── [id]/                 # รายละเอียดการลงทะเบียน
│   │       ├── tickets/
│   │       │   └── page.tsx
│   │       ├── checkins/
│   │       │   └── page.tsx              # QR check-in dashboard
│   │       ├── speakers/
│   │       │   └── page.tsx
│   │       ├── abstracts/
│   │       │   ├── page.tsx              # รายการ abstracts
│   │       │   └── [id]/                 # Review abstract
│   │       ├── promo-codes/
│   │       │   └── page.tsx
│   │       ├── verifications/
│   │       │   └── page.tsx              # User account approval
│   │       ├── email/
│   │       │   └── page.tsx              # Manual / Retrosend email
│   │       ├── eligibility/
│   │       │   └── page.tsx              # Student eligibility requests
│   │       ├── members/
│   │       │   └── page.tsx
│   │       ├── abstract-categories/
│   │       │   └── page.tsx
│   │       └── sessions/
│   │           └── page.tsx
│   └── layout.tsx         # 🔄 เพิ่ม conference ใน sidebar navigation
```

### 2.3 03_backend-api — การเปลี่ยนแปลง (Base สำหรับ merge)

```
03_backend-api/src/
├── db/
│   ├── index.ts           # 🔄 migrate pg → postgres.js driver
│   └── schema/            # 🔄 แยก schema เป็น files (pharmacy + conference)
│       ├── index.ts        # export ทุก table
│       ├── pharmacy.schema.ts   # tables เดิมของ pharmacy
│       └── conference.schema.ts # 🆕 tables ของ conference (users, events, tickets, ฯลฯ)
│
├── routes/
│   ├── [ไฟล์เดิมทั้งหมด]   # pharmacy routes ไม่เปลี่ยน
│   └── conference/         # 🆕 Conference routes
│       ├── auth/            # register, login, forgot-password, reset-password
│       ├── events.ts
│       ├── tickets.ts
│       ├── workshops.ts
│       ├── registrations/   # free, quick
│       ├── payments/        # index.ts (Stripe + Pay Solutions + KTB)
│       ├── abstracts/       # submit, user
│       ├── contact.ts
│       ├── upload.ts        # → Supabase Storage
│       └── backoffice/      # protected conference backoffice routes
│           ├── events.ts, registrations.ts, tickets.ts, checkins.ts
│           ├── speakers.ts, abstracts.ts, promo-codes.ts, sessions.ts
│           ├── verifications.ts, users.ts, members.ts
│           ├── abstract-categories.ts, eligibility.ts
│           ├── email-manual.ts, email-retrosend.ts
│
├── utils/
│   ├── authGuard.ts        # เดิม
│   ├── supabase.ts         # เดิม → เพิ่ม upload bucket สำหรับ conference
│   ├── upload.ts           # เดิม (pharmacy)
│   └── conference/         # 🆕 Conference utilities
│       ├── promoEngine.ts
│       ├── ticketEligibility.ts
│       ├── studentEligibility.ts
│       ├── receiptToken.ts
│       └── fees.ts          # stripeFee + paySolutionsFee
│
├── services/               # 🆕 Conference services
│   ├── emailService.ts
│   ├── emailTemplates.ts
│   ├── stripe.ts
│   ├── paySolutions.ts
│   ├── ktbFastpay.ts
│   └── receiptPdf.ts
│
└── server.ts               # 🔄 เพิ่ม conference routes registration
```

---

## 3. Routing และ Pages

### 3.1 pharmacy-web — Conference Routes ที่เพิ่มใหม่

| URL | ไฟล์ (App Router) | Auth | หมายเหตุ |
|-----|------------------|------|---------|
| `/meeting` | `(public)/05_meeting/page.tsx` | ❌ Public | **แทนที่ page.tsx เดิม** — Event listing |
| `/meeting/[id]` | `(public)/05_meeting/[id]/page.tsx` | ❌ Public | Event detail + speakers + sessions |
| `/meeting/[id]/agenda` | `(public)/05_meeting/[id]/agenda/page.tsx` | ❌ Public | กำหนดการ |
| `/meeting/[id]/checkout` | `(public)/05_meeting/[id]/checkout/page.tsx` | ⚠️ ต้อง login | Ticket selection + promo + tax |
| `/meeting/[id]/payment` | `(public)/05_meeting/[id]/payment/page.tsx` | ⚠️ ต้อง login | Payment gateway |
| `/meeting/[id]/success` | `(public)/05_meeting/[id]/success/page.tsx` | ✅ Login | ยืนยัน + QR Code |
| `/meeting/[id]/cancel` | `(public)/05_meeting/[id]/cancel/page.tsx` | ❌ Public | ยกเลิกชำระเงิน |
| `/member-meeting` | `(member)/04_member-meeting/page.tsx` | ✅ Login | **แทนที่ page.tsx เดิม** — My Tickets |
| `/member-meeting/abstract` | `(member)/04_member-meeting/abstract/page.tsx` | ✅ Login | รายการ abstracts ของตัวเอง |
| `/member-meeting/abstract/submit` | `(member)/04_member-meeting/abstract/submit/page.tsx` | ✅ Login | ส่ง abstract ใหม่ |
| `/member-meeting/abstract/[id]` | `(member)/04_member-meeting/abstract/[id]/page.tsx` | ✅ Login | ดู/แก้ไข abstract |
| `/member-meeting/eligibility` | `(member)/04_member-meeting/eligibility/page.tsx` | ✅ Login | ขอสิทธิ์นักศึกษา |

### 3.2 02_back-office — Conference Backoffice Routes

| URL | Module | หมายเหตุ |
|-----|--------|---------|
| `/backoffice/conference` | Dashboard | สรุปภาพรวม conference |
| `/backoffice/conference/events` | Events | จัดการงานประชุม |
| `/backoffice/conference/events/create` | Events | สร้าง event ใหม่ |
| `/backoffice/conference/events/[id]` | Events | แก้ไข + จัดการ sessions/tickets |
| `/backoffice/conference/registrations` | Registrations | รายการลงทะเบียน |
| `/backoffice/conference/tickets` | Tickets | จัดการ ticket types |
| `/backoffice/conference/checkins` | Check-in | QR Check-in dashboard |
| `/backoffice/conference/speakers` | Speakers | จัดการวิทยากร |
| `/backoffice/conference/abstracts` | Abstracts | Review & manage |
| `/backoffice/conference/promo-codes` | Promo Codes | |
| `/backoffice/conference/verifications` | Verifications | อนุมัติ account |
| `/backoffice/conference/email` | Email | Manual/Retrosend |
| `/backoffice/conference/eligibility` | Eligibility | สิทธิ์นักศึกษา |
| `/backoffice/conference/members` | Members | ข้อมูลสมาชิก |
| `/backoffice/conference/sessions` | Sessions | จัดการ sessions |
| `/backoffice/conference/abstract-categories` | Abstract Cat. | หมวดหมู่ abstract |

### 3.3 03_backend-api — Conference API Routes ที่เพิ่ม

```
# Public (ไม่ต้อง auth)
GET  /api/conference/events
GET  /api/conference/events/:id
GET  /api/conference/events/:id/tickets
GET  /api/conference/workshops
POST /api/conference/contact
POST /api/conference/registrations/free
POST /api/conference/registrations/quick

# User Auth (conference login flow)
POST /auth/conference/register
POST /auth/conference/login
POST /auth/conference/forgot-password
POST /auth/conference/reset-password
POST /auth/conference/resubmit-document

# Authenticated (conference user)
GET  /api/conference/users/profile
POST /api/conference/abstracts
GET  /api/conference/abstracts/user/:id
GET  /api/conference/events/:id/student-eligibility
POST /api/conference/events/:id/student-eligibility
POST /api/upload/conference

# Payments
POST /api/conference/payments/create-checkout
POST /api/conference/payments/webhook
GET  /api/conference/payments/verify/:sessionId
POST /api/conference/payments/validate-promo
GET  /api/conference/payments/my-tickets

# Backoffice (JWT protected)
GET/POST/PUT/DELETE /api/backoffice/conference/events
GET/POST/PUT/DELETE /api/backoffice/conference/registrations
... (13 modules ทั้งหมด)
```

---

## 4. Library

### 4.1 สิ่งที่ต้อง Install เพิ่มใน pharmacy-web (01_pharmacy-web)

```bash
# Form validation
npm install react-hook-form @hookform/resolvers zod

# State management & data fetching
npm install @tanstack/react-query zustand

# HTTP client
npm install axios

# Payment
npm install @stripe/react-stripe-js @stripe/stripe-js

# UI utilities
npm install clsx tailwind-merge class-variance-authority
npm install @radix-ui/react-dialog @radix-ui/react-label @radix-ui/react-slot

# Date & QR
npm install date-fns qrcode.react
```

### 4.2 สิ่งที่ต้อง Install เพิ่มใน 02_back-office

```bash
# Form & validation (ถ้ายังไม่มี)
npm install react-hook-form @hookform/resolvers zod

# Data fetching
npm install @tanstack/react-query

# HTTP client
npm install axios

# Chart (สำหรับ dashboard summary)
npm install recharts
# หรือ
npm install chart.js react-chartjs-2

# QR Scanner (check-in)
npm install html5-qrcode
# หรือ
npm install @zxing/browser
```

### 4.3 สิ่งที่ต้อง Install เพิ่มใน 03_backend-api

```bash
# Migrate DB driver
npm uninstall pg @types/pg
npm install postgres

# Payment gateways
npm install stripe

# Email service
npm install nodemailer
# หรือ ใช้ NipaMail (HTTP API — ไม่ต้องติดตั้ง library เพิ่ม)

# PDF generation
npm install pdfkit @types/pdfkit

# QR Code
npm install qrcode @types/qrcode

# Supabase (มีอยู่แล้ว)
# @supabase/supabase-js ✅

# Form handling
npm install @fastify/formbody
```

### 4.4 Library Compatibility Table

| Library | pharmacy-web | 02_back-office | 03_backend-api | conference-api (ref) | หมายเหตุ |
|---------|:-:|:-:|:-:|:-:|---------|
| Next.js | 16.1.6 | 16.1.6 | — | 16.0.10 | ✅ ใช้ 16.1.6 |
| React | 19.2.3 | 19.2.3 | — | 19.2.1 | ✅ ใช้ 19.2.3 |
| Tailwind CSS | v4 | v4 | — | v4 | ✅ เหมือนกัน |
| Fastify | — | — | 5.7.4 | 5.2.0 | ✅ ใช้ 5.7.4 |
| drizzle-orm | — | — | 0.45.1 | 0.38.3 | ✅ ใช้ 0.45.1 (ใหม่กว่า) |
| Zod (frontend) | — | — | — | 4.2.1 | ★ ต้องใช้ v4 |
| Zod (backend) | — | — | — | 3.24.1 | ⚠️ conference-api schema ใช้ v3 — ต้อง migrate |
| @fastify/cors | — | — | 11.2.0 | 10.0.2 | ✅ ใช้ 11.2.0 |
| @fastify/jwt | — | — | 10.0.0 | 9.0.2 | ✅ ใช้ 10.0.0 |

---

## 5. Database & Services

### 5.1 Database Schema — Unified (1 Database)

**Strategy**: สร้าง `conference.schema.ts` แยกไฟล์ใน `03_backend-api/src/db/schema/` แล้ว import รวมกัน

```
03_backend-api/src/db/schema/
├── pharmacy.schema.ts     # tables เดิม (users → cms_users, pharmacists, news, ...)
├── conference.schema.ts   # tables conference (users → conf_users, events, tickets, ...)
└── index.ts               # export ทุก table รวมกัน
```

#### Pharmacy Tables (เดิม — rename `users` → `cms_users`)

| Table | หน้าที่ |
|-------|--------|
| `cms_users` | CMS admin/editor/viewer |
| `permissions` | สิทธิ์ระบบ |
| `role_permissions` | mapping role → permission |
| `home_content` | banners, popups |
| `pharmacist_home_content` | pharmacist banners |
| `laws` | กฎหมาย |
| `council_members` | กรรมการสภา |
| `pharmacists` | ข้อมูลเภสัชกร |
| `news` | ข่าวสาร |
| `medicine_articles` | ความรู้เรื่องยา |
| `public_project_articles` | โครงการประชาชน |
| `council_history` | ทำเนียบสภา |
| `agencies` | หน่วยงาน |
| `web_settings` | ตั้งค่าเว็บ |
| `honor_awards` | รางวัลเกียรติยศ |
| `honors` | ผู้ได้รับรางวัล |
| `services` | บริการ |
| `requests` | ระบบคำขอ |
| `request_shipping_details` | รายละเอียดการส่ง |
| `request_payment_logs` | บันทึกการชำระ |
| `request_tax_invoices` | ใบกำกับภาษี |
| `policy_categories` | หมวดนโยบาย |
| `policy_projects` | โครงการนโยบาย |

#### Conference Tables (ใหม่ — ทั้งหมดจาก conference-api)

| หมวด | Tables | จำนวน |
|------|--------|-------|
| Users | `conf_users`, `password_reset_tokens`, `sso_tokens`, `backoffice_users` | 4 |
| Events | `events`, `sessions`, `staff_event_assignments`, `event_student_eligibility_requests`, `event_images`, `event_attachments` | 6 |
| Tickets | `ticket_types`, `ticket_sessions`, `promo_codes`, `promo_code_rule_sets`, `promo_code_rule_items`, `promo_code_usages` | 6 |
| Orders | `orders`, `order_items`, `payments` | 3 |
| Registrations | `registrations`, `registration_sessions`, `registration_addons`, `check_ins` | 4 |
| Abstracts | `abstracts`, `abstract_files`, `abstract_co_authors`, `abstract_reviews`, `abstract_revision_requests`, `abstract_revision_request_files`, `abstract_categories` | 7 |
| Speakers | `speakers`, `event_speakers` | 2 |
| History | `verification_rejection_history` | 1 |
| **รวม** | | **33 tables** |

> ⚠️ **Important**: `users` ใน conference-api → rename เป็น `conf_users` เพื่อไม่ชนกับ `cms_users` ของ pharmacy

### 5.2 External Services

| Service | ใช้สำหรับ | Config |
|---------|---------|--------|
| **Supabase Storage** | ทุก file upload (conference + pharmacy) | `SUPABASE_URL`, `SUPABASE_SERVICE_KEY` |
| **Stripe** | payment (international/USD) | `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` |
| **Pay Solutions** | payment (THB QR/Card) | `PAY_SOLUTIONS_*` |
| **KTB FastPay** | payment (THB Bank) | `KTB_*` |
| **NipaMail** | Email service | `NIPAMAIL_CLIENT_ID`, `NIPAMAIL_CLIENT_SECRET` |
| **Cloudflare Turnstile** | CAPTCHA สำหรับ registration | `TURNSTILE_SECRET_KEY` |
| **PostgreSQL** | Database | `DATABASE_URL` |

> ❌ **ยกเลิก**: Google Drive API — ไม่ใช้แล้ว → migrate ไป Supabase Storage ทั้งหมด

### 5.3 Supabase Storage Buckets (รวมทั้งสองระบบ)

| Bucket | ใช้สำหรับ | Visibility |
|--------|---------|-----------|
| `pharmacy-public` | images, logos, icons (pharmacy) | Public |
| `pharmacy-private` | PDFs, documents (pharmacy) | Private |
| `conference-abstracts` | Abstract files + co-author docs | Private |
| `conference-speakers` | Speaker photos | Public |
| `conference-documents` | Verification documents, student docs | Private |
| `conference-receipts` | Receipt PDFs | Private |
| `conference-events` | Event images, venue photos | Public |

---

## 6. Potential Conflicts & วิธีแก้

### 6.1 🔴 Critical

#### `users` Table Name Collision
| ด้าน | ปัญหา | วิธีแก้ |
|-----|-------|--------|
| Database | pharmacy ใช้ `users` (cms users), conference ใช้ `users` (pharmacist/student) | **Rename**: pharmacy `users` → `cms_users`, conference `users` → `conf_users` |
| Code | ทุก route ใน 03_backend-api อ้างอิง `users` table | ต้อง find & replace ทั้ง codebase |
| Auth | middleware.ts ใช้ `cms_users`, conference JWT ใช้ `conf_users` | แยก JWT payload ให้ชัด: `{ type: 'cms' }` vs `{ type: 'conference' }` |

#### Database Driver Migration
| ปัจจุบัน | เป้าหมาย | งานที่ต้องทำ |
|---------|---------|------------|
| `pg` (node-postgres) Pool | `postgres` (postgres.js) | เปลี่ยน `db/index.ts`, update drizzle import path `drizzle-orm/postgres-js` |
| CommonJS (`"type": "commonjs"`) | ESM (`"type": "module"`) | เปลี่ยน package.json + แก้ imports ทุกไฟล์ |

### 6.2 🟡 Moderate

#### Zod Version Mismatch
| | Version | ปัญหา |
|--|---------|-------|
| conference-web | v4.2.1 | `z.string()` API เหมือนกัน แต่ error handling format เปลี่ยน |
| conference-api (reference) | v3.24.1 | Schema syntax บางส่วนต่างกัน |
| pharmacy-web (ใหม่) | v4.x (แนะนำ) | ต้อง migrate conference-api schemas จาก v3 → v4 |

**วิธีแก้**: ใช้ Zod v4 ทั้งหมด (frontend + backend) แล้ว migrate schema ที่ต่างออกไป

#### Auth Strategy ที่ต่างกัน (Frontend)
| System | Auth Method | Storage |
|--------|-------------|---------|
| pharmacy-web | Cookie (`isLoggedIn`, `auth_token`) | HTTP-only cookie |
| conference-web (เดิม) | localStorage JWT | `localStorage` |

**วิธีแก้**: conference pages ใน pharmacy-web → ใช้ cookie auth เดิม (`isLoggedIn`) แต่เพิ่มการ check `role` สำหรับ conference-specific features

#### CORS Origin
```typescript
// server.ts (รวม CORS origins)
const corsOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map(o => o.trim())
  : [
      'http://localhost:3000',  // pharmacy-web dev
      'http://localhost:3001',  // back-office dev
      // production จาก env
    ];
```

#### Rate Limiting
- pharmacy auth: ยังไม่มี rate limit → ต้องเพิ่ม
- conference auth: 30 req/min (email-based key)
- **วิธีแก้**: ใช้ rate limit ของ conference-api (600 global, 30 auth) สำหรับทั้ง server

### 6.3 🟢 Minor

| Issue | วิธีแก้ |
|-------|--------|
| Payment webhooks (Stripe) ต้องรับ raw body | เพิ่ม `content-type: application/json` bypass สำหรับ `/api/conference/payments/webhook` |
| SSO Token (`sso_tokens` table) — ถ้าไม่ใช้ SSO แล้ว | ยังคงเก็บ table ไว้ (backward compat) แต่ไม่ implement logic ใหม่ |
| pdfkit (Receipt PDF) ใช้ CommonJS | ต้อง dynamic import: `const PDFDocument = (await import('pdfkit')).default` |
| puppeteer (มีใน conference-api) | ตัดออกถ้าไม่ได้ใช้ — หนักมาก (~300MB) |
| `@fastify/formbody` — ต้อง register ก่อน payment form | เพิ่มใน server.ts |

---

## 7. สิ่งที่ขาดหายไปและคำแนะนำเพิ่มเติม

### 7.1 ❗ สิ่งที่ Plan เดิมขาดไป (และต้องเพิ่ม)

#### A. Email Service Configuration
- **ปัญหา**: conference-api ใช้ NipaMail แต่ไม่มีใน 03_backend-api
- **ต้องทำ**: Copy `services/emailService.ts` + `emailTemplates.ts` + ตั้งค่า env vars
- **Env ที่ต้องเพิ่ม**: `NIPAMAIL_CLIENT_ID`, `NIPAMAIL_CLIENT_SECRET`, `NIPAMAIL_SENDER_EMAIL`, `BASE_URL`

#### B. Receipt PDF Generation
- **ปัญหา**: ต้องใช้ `pdfkit` สำหรับ receipt download
- **ต้องทำ**: ตัด puppeteer ออก (ไม่จำเป็น), ใช้ pdfkit อย่างเดียว
- **ข้อควรระวัง**: pdfkit เป็น CommonJS → ต้อง dynamic import ใน ESM

#### C. Webhook Endpoint Security
- **ปัญหา**: Stripe webhook ต้องตรวจสอบ signature จาก raw body
- **ต้องทำ**: เพิ่ม `addContentTypeParser('application/json', ...)` เฉพาะ `/webhook` route
- **อย่าลืม**: ตั้งค่า `STRIPE_WEBHOOK_SECRET` ใน env

#### D. Conference User Registration Flow
- **ปัญหา**: conference-web มี registration flow พิเศษ (pending_approval → active/rejected) ต่างจาก pharmacy auth
- **ต้องตัดสินใจ**: ถ้าใช้ pharmacy auth เดิม (cookie) จะจัดการ `conf_users` อย่างไร?
  - **Option A**: pharmacist login (pharmacy) = สามารถเข้า conference ได้เลย (shared identity)
  - **Option B**: แยก conference login แต่ใช้ UI เดิมของ pharmacy
  - **แนะนำ Option A** ถ้า pharmacist login แล้วควรเข้า conference ได้ทันที — ลด friction

#### E. Promo Code Engine
- **ปัญหา**: `utils/promoEngine.ts` มี logic ซับซ้อน (rule sets, reservation pattern)
- **ต้องทำ**: Copy ทั้งไฟล์มา `03_backend-api/src/utils/conference/promoEngine.ts` โดยไม่เปลี่ยน logic

#### F. Check-In QR Scanner (Backoffice)
- **ปัญหา**: backoffice check-in ต้องการ camera/QR scanner ใน browser
- **ต้องทำ**: เพิ่ม library `html5-qrcode` หรือ `@zxing/browser` ใน 02_back-office
- **ข้อควรระวัง**: ต้องใช้ HTTPS ใน production สำหรับ camera access

#### G. File Migration (Google Drive → Supabase)
- **ปัญหา**: ถ้ามีไฟล์อยู่ใน Google Drive แล้ว ต้อง migrate
- **ต้องทำ**: เขียน migration script ดึงไฟล์จาก Drive → upload ขึ้น Supabase
- **ลำดับ**: 1) สร้าง Supabase buckets → 2) เขียน upload service ใหม่ → 3) migrate ไฟล์เก่า → 4) อัปเดต URLs ใน database

#### H. API Proxy ใน pharmacy-web
- **ต้องทำ**: เพิ่ม `next.config.ts` rewrites สำหรับ conference API
```typescript
// next.config.ts
async rewrites() {
  return {
    beforeFiles: [
      // เดิม: pharmacy routes
      { source: '/meeting', destination: '/05_meeting' },
      // เพิ่ม: conference API proxy
      {
        source: '/api/conference/:path*',
        destination: `${process.env.BACKEND_API_URL}/api/conference/:path*`,
      },
    ],
  };
}
```

#### I. Abstract Submission — Rich Text Editor
- **ปัญหา**: Abstract form ต้องการ rich text สำหรับ background, methods, results, conclusion
- **ข้อดี**: `02_back-office` มี `react-quill-new` อยู่แล้ว
- **สำหรับ pharmacy-web**: ต้องเพิ่ม `react-quill-new` หรือใช้ `@tiptap/react` (lighter)

#### J. Payment Redirect URLs
- **ปัญหา**: Pay Solutions ใช้ form-submit redirect — ต้องการ URL จริงที่ accessible
- **ต้องทำ**: ตั้งค่า `BASE_URL` ให้ถูกต้องทั้ง dev (ngrok?) และ production
- **KTB FastPay**: ต้องการ HTTPS production URL ด้วย

### 7.2 💡 คำแนะนำเพิ่มเติม

#### A. ลำดับความสำคัญของ Features
แนะนำทำตามลำดับ:
1. **Backend first**: Merge schemas + routes + ทดสอบ API ก่อน
2. **Event Listing + Detail**: สร้าง UI แสดงข้อมูลก่อน (read-only)
3. **Checkout + Payment**: ทดสอบ payment flow ด้วย Stripe test mode
4. **My Tickets + QR**: หลัง payment สำเร็จ
5. **Abstract submission**: หลัง core flow ทำงาน
6. **Backoffice**: ทำคู่กับ backend routes

#### B. Environment Variables ที่ต้องเพิ่มทั้งหมด (03_backend-api)

```env
# === Conference System ===
# JWT (Conference)
CONFERENCE_JWT_SECRET=your_conference_jwt_secret

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Pay Solutions
PAY_SOLUTIONS_API_KEY=...
PAY_SOLUTIONS_SECRET_KEY=...
PAY_SOLUTIONS_MERCHANT_ID=...
PAY_SOLUTIONS_BASE_URL=https://apis.paysolutions.asia

# KTB FastPay
KTB_MERCHANT_ID=...
KTB_SECURE_HASH_KEY=...
KTB_PAYMENT_FORM_URL=https://uatktbfastpay.ktb.co.th/...

# NipaMail
NIPAMAIL_CLIENT_ID=...
NIPAMAIL_CLIENT_SECRET=...
NIPAMAIL_SENDER_EMAIL=noreply@...
NIPAMAIL_SENDER_NAME=สภาเภสัชกรรม

# Cloudflare Turnstile
TURNSTILE_SECRET_KEY=...

# Conference URLs
BASE_URL=https://your-pharmacy-web.com
CONFERENCE_WEB_URL=https://your-pharmacy-web.com/meeting

# Abstract tracking prefix
TRACKING_ID_PREFIX=PCONF
TRACKING_ID_PAD_LENGTH=3

# === ยังคงมีอยู่เดิม ===
DATABASE_URL=postgresql://...
SUPABASE_URL=...
SUPABASE_SERVICE_KEY=...
JWT_SECRET=...  # CMS JWT
FRONTEND_URL=...
CORS_ORIGIN=http://localhost:3000,http://localhost:3001,...
```

#### C. Supabase RLS (Row Level Security) สำหรับ conference files
```sql
-- conference-abstracts bucket: เจ้าของเท่านั้นที่อ่านได้
CREATE POLICY "abstract_owner_access"
ON storage.objects FOR SELECT
USING (auth.uid()::text = (storage.foldername(name))[1]);
```

#### D. Database Migration Strategy
```bash
# ขั้นตอน migration ที่ปลอดภัย
1. สำรอง database เดิม (backup)
2. สร้าง conference.schema.ts
3. drizzle-kit generate → ได้ migration files
4. review migration files ก่อน push
5. drizzle-kit push (dev) → ทดสอบ
6. drizzle-kit migrate (production)
```

#### E. Backoffice Auth สำหรับ Conference
> **ปัจจุบัน**: 02_back-office ใช้ JWT (`auth_token` cookie) จาก 03_backend-api
> **เพิ่ม**: conference backoffice ใช้ JWT เดิม แต่ตรวจสอบ `role` ใน payload

```typescript
// authGuard.ts — เพิ่ม conference backoffice role check
const CONFERENCE_ALLOWED_ROLES = ['admin', 'organizer', 'reviewer', 'staff', 'verifier'];
```

---

## 8. แผนดำเนินการ (Revised)

### Phase 0: Preparation (ก่อนเริ่ม)
- [ ] Backup database ปัจจุบัน
- [ ] สร้าง Supabase buckets ทั้งหมด
- [ ] ตั้งค่า env variables ทั้งหมด
- [ ] ตั้ง Stripe webhook endpoint

### Phase 1: Backend (03_backend-api)
- [ ] Migrate module system: CommonJS → ESM
- [ ] Migrate DB driver: `pg` → `postgres.js`
- [ ] Rename `users` → `cms_users` (pharmacy tables)
- [ ] สร้าง `conference.schema.ts` (rename `users` → `conf_users`)
- [ ] Run drizzle migration
- [ ] Copy conference routes เข้า `/routes/conference/`
- [ ] Copy conference services (email, payment, PDF)
- [ ] Copy conference utils (promoEngine, fees, eligibility)
- [ ] Migrate file upload → Supabase Storage
- [ ] ตัด Google Drive + puppeteer ออก
- [ ] Update server.ts (register conference routes)
- [ ] Update CORS + rate limit
- [ ] ทดสอบ API ทุก endpoint

### Phase 2: Pharmacy Web (01_pharmacy-web)
- [ ] Install dependencies ที่ขาด
- [ ] สร้าง `components/conference/` (pharmacy design system)
- [ ] สร้าง `lib/conference/` (API client + services)
- [ ] ปรับ `/meeting` page.tsx → Event listing
- [ ] สร้าง `/meeting/[id]` routes ทั้งหมด
- [ ] ปรับ `/member-meeting` → My Tickets
- [ ] สร้าง `/member-meeting/abstract` routes
- [ ] สร้าง `/member-meeting/eligibility`
- [ ] Update next.config.ts (rewrites + remotePatterns)
- [ ] Update middleware.ts (conference checkout auth)
- [ ] ทดสอบ end-to-end flow

### Phase 3: Backoffice (02_back-office)
- [ ] Install dependencies (react-hook-form, zod, axios, qrscanner)
- [ ] สร้าง conference module structure
- [ ] สร้าง sidebar navigation entries
- [ ] Implement events management pages
- [ ] Implement registrations + check-in
- [ ] Implement abstracts review
- [ ] Implement promo codes
- [ ] Implement email management
- [ ] Implement user verification
- [ ] ทดสอบ backoffice ทุก module

### Phase 4: Testing & Polish
- [ ] End-to-end test: register → checkout → pay → QR
- [ ] Abstract submission flow
- [ ] Check-in QR scan
- [ ] Email delivery ทดสอบ
- [ ] Payment gateway ทดสอบ (Stripe test mode + Pay Solutions sandbox)
- [ ] Mobile responsive ทุกหน้า
- [ ] Error handling ครบถ้วน
