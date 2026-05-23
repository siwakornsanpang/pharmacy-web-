# เอกสารโครงสร้างระบบและคู่มือการใช้งาน Docker - Pharmacy Academy

เอกสารชุดนี้เป็นคู่มือสรุปโครงสร้างโฟลเดอร์ หน้าที่การทำงานของคอมโพเนนต์หลัก รวมถึงวิธีติดตั้งและใช้งานด้วย Docker สำหรับโครงการ **pharmacy-academy (Front-Office)** และ **pharmacy-academy-backoffice (Back-Office)**

---

## 🏗️ 1. ภาพรวมระบบ (System Overview)

ระบบบริหารจัดการคอร์สเรียนออนไลน์ (LMS) นี้สร้างขึ้นสำหรับสภาเภสัชกรรมเพื่อรองรับการอบรมและสะสมหน่วยกิตการศึกษาต่อเนื่อง (CPE Credits) แบ่งเป็น 2 ส่วนหลักคือ:

1. **pharmacy-academy (Front-Office):**
   - เว็บไซต์หน้าบ้านสำหรับประชาชนและสมาชิกเภสัชกรทั่วไป พัฒนาด้วย Next.js 15, React 19 และ Tailwind CSS v4
   - รองรับการเข้าเรียนวิดีโอแบบ Interactive ตอบคำถามระหว่างชมวิดีโอ ทำแบบทดสอบท้ายบทเรียน ซื้อคอร์สเรียน และขอสะสมหน่วยกิต CPE
2. **pharmacy-academy-backoffice (Back-Office):**
   - ระบบจัดการหลังบ้านสำหรับผู้ดูแลระบบและเจ้าหน้าที่ พัฒนาด้วย Next.js 16, React 19 และ Tailwind CSS v4
   - จัดการเนื้อหาคอร์สเรียน แบบทดสอบ การอัปโหลดวิดีโอ อนุมัติสลิปชำระเงิน ตรวจสอบประวัติการส่งคะแนน CPE และประวัติการทำกิจกรรมของเจ้าหน้าที่ (Audit Logs)

---

## 📁 2. โครงสร้างโฟลเดอร์และไฟล์ (File & Folder Structure)

ทั้งสองระบบใช้สถาปัตยกรรมแบบ **Feature-based Architecture** ร่วมกับ **Next.js App Router** เพื่อแบ่งสัดส่วนการทำงาน (Separation of Concerns)

### 2.1 โครงสร้างของ `pharmacy-academy` (Front-Office)

```txt
pharmacy-academy/
├── src/
│   ├── app/                      # 🚀 Routing Layer (Next.js App Router)
│   │   ├── (auth)/               # กลุ่มเพจยืนยันตัวตน (sign-in, register, register-pharmacist)
│   │   ├── courses/              # หน้าแสดงรายการคอร์สเรียนทั้งหมด
│   │   ├── course-learning/      # หน้าเข้าเรียนหลัก (Interactive Video & Quiz)
│   │   ├── checkout/             # หน้ารายละเอียดการชำระเงินและคำสั่งซื้อ
│   │   ├── payment-*/            # หน้าเพจรับค่าและแสดงผลลัพธ์การจ่ายเงินประเภทต่างๆ
│   │   ├── profile/              # ประวัติการเข้าเรียนและหน่วยกิต CPE สะสม
│   │   └── shop-cart/            # หน้ารถเข็นของสมาชิก
│   ├── features/                 # 🧠 Business Logic Layer (แยกตามการทำงาน)
│   │   ├── auth/                 # ระบบ Login, Register และการยืนยันตัวตน
│   │   ├── cart/                 # ระบบการหยิบใส่ตะกร้าและนับจำนวน
│   │   ├── courses/              # การเรียกดูข้อมูลคอร์สและการดึงรูปภาพของคอร์ส
│   │   ├── learning/             # ระบบการเรียน (หัวใจของระบบตอบคำถามและ Vimeo SDK)
│   │   │   ├── components/       # CourseLearningArea, VimeoLessonPlayer, InteractivePromptModal
│   │   │   ├── services/         # learningApi.ts (เรียก API บันทึกความคืบหน้าและการตอบคำถาม)
│   │   │   └── interactive-runtime.ts # ระบบคำนวณ Progress แบบถ่วงน้ำหนัก
│   │   └── payment/              # Logic ระบบชำระเงิน (PromptPay, Credit Card)
│   ├── components/               # 🎨 Shared UI Components (Stateless Components)
│   │   ├── layout/               # Header, Footer, Wrapper
│   │   └── ui/                   # Button, Input, Modal, Tabs พื้นฐาน
│   ├── lib/                      # 🔌 API client endpoints และยูทิลิตี้เสริม
│   └── styles/                   # 💅 global styles
```

### 2.2 โครงสร้างของ `pharmacy-academy_backoffice` (Back-Office)

```txt
pharmacy-academy_backoffice/
├── src/
│   ├── app/                      # 🚀 Routing Layer (Next.js App Router)
│   │   ├── (auth)/login          # หน้าเข้าสู่ระบบของแอดมิน/เจ้าหน้าที่
│   │   └── (admin)/              # รวบรวมหน้าหลักสำหรับผู้ดูแลระบบ
│   │       ├── page.tsx          # หน้า Dashboard วิเคราะห์ข้อมูลสถิติ
│   │       ├── courses/          # บริหารจัดการคอร์ส บทเรียน และแบบทดสอบ
│   │       ├── cpe-credits/      # หน้าส่งหน่วยกิต CPE ไปยังระบบสภาเภสัชกรรม
│   │       ├── grading/          # ตรวจให้คะแนนข้อสอบผู้เข้าอบรม
│   │       ├── payments/         # หน้าสลิปโอนเงินและการอนุมัติธุรกรรม
│   │       ├── users/            # การจัดการข้อมูลสมาชิกและสิทธิ์ (Roles/Permissions)
│   │       ├── videos/           # ระบบฝากและจัดการวิดีโอบทเรียนบน Vimeo
│   │       └── audit-logs/       # หน้าบันทึกความโปร่งใสการทำงานของแอดมิน
│   ├── features/                 # 🧠 Core Feature Modules
│   │   ├── admin-auth/           # ตรวจสอบและดูแลความปลอดภัยการเข้าถึงเมนู
│   │   ├── courses/              # ฟังก์ชันสร้างคอร์สและแก้ไขคำถามแทรกเวลาวิดีโอ
│   │   ├── dashboard/            # สถิติตัวเลขและการวาด Chart ด้วย Recharts
│   │   ├── payments/             # ระบบจัดการสลิปและอนุมัติธุรกรรม
│   │   └── users/                # ระบบตรวจสอบ Role & Permissions
│   ├── components/               # 🎨 Shared Admin UI
│   │   ├── layout/               # Sidebar เมนู, Header
│   │   └── ui/                   # Table Filters, Search, CSV Import Modals
│   └── services/                 # 🔌 API clients
```

---

## 🖥️ 3. ฟังก์ชันการทำงานของแต่ละหน้า (Functions & Pages Detail)

### 3.1 ระบบฝั่งผู้เรียน (`pharmacy-academy`)

*   **หน้าเลือกซื้อคอร์สเรียน (`/courses` & `/courses-grid`):**
    - ระบบดึงข้อมูลจาก Endpoint `/public/courses`
    - รองรับการกรองหมวดหมู่ (Category), ความยากง่าย (Difficulty) และคอร์สที่มีหน่วยกิต CPE หรือไม่
*   **ระบบลงทะเบียนสำหรับเภสัชกร (`/register-pharmacist`):**
    - มีการรับค่าเลขที่ใบประกอบวิชาชีพและนำไปตรวจสอบกับฐานข้อมูลสภาเภสัชกรรมเพื่อซิงค์ข้อมูล CPE Credits ให้โดยอัตโนมัติ
*   **หน้าเรียนบทเรียนและเครื่องเล่นวิดีโอ (`/course-learning`):**
    - **`VimeoLessonPlayer.tsx`:** เชื่อมต่อกับระบบเล่นวิดีโอของ Vimeo โดยจับตาดูเวลาการเล่นของผู้เรียนอย่างละเอียด
    - **`InteractivePromptModal.tsx`:** เมื่อผู้เรียนเล่นวิดีโอไปถึงเวลาที่แอดมินระบุไว้ วิดีโอจะถูกหยุดเล่น (Pause) ทันที และบังคับให้ผู้เรียนเลือกตอบคำถามที่ปรากฏขึ้นมาบนหน้าจอก่อนจะอนุญาตให้คลิกเพื่อดูวิดีโอต่อ
    - **ระบบประมวลความคืบหน้าถ่วงน้ำหนัก (`interactive-runtime.ts`):** 
      ระบบแบ่งคะแนนความคืบหน้าของแต่ละบทเรียนออกเป็น 3 ส่วน:
      1. **สัดส่วนเวลาการดูวิดีโอ (70%):** เวลาที่ดูจริงเทียบกับความยาวทั้งหมดของวิดีโอ
      2. **การตอบคำถามระหว่างวิดีโอ (10%):** จำนวนคำถามแบบตอบโต้ที่ตอบแล้วเทียบกับทั้งหมด
      3. **ข้อสอบย่อยท้ายบทเรียน (20%):** จะได้คะแนนส่วนนี้ทันทีที่สถานะเป็นผ่านการทดสอบ (`isPassed`)

---

### 3.2 ระบบหลังบ้านแอดมิน (`pharmacy-academy_backoffice`)

*   **แดชบอร์ดสรุปผล (`/`):**
    - แสดงจำนวนเงินสะสม ยอดผู้สมัครเรียน คอร์สเรียนที่เปิดใช้งาน และกราฟความคืบหน้าโดยรวม
*   **จัดการวิดีโอบทเรียนและแทรกคำถาม (`/courses` -> `CourseForm`):**
    - **`InteractiveQuestionSection.tsx`:** แอดมินสามารถลากเวลาบนวิดีโอหรือกรอกจุดวินาที เพื่อระบุเวลาในการแสดงคำถามขัดจังหวะในเครื่องเล่นวิดีโอของผู้เรียนได้
    - **`CSVImportModal.tsx`:** อัปโหลดไฟล์เพื่อนำเข้าชุดคำถามเชิงโต้ตอบจำนวนมากเข้าสู่ระบบในคราวเดียว
*   **ตรวจสอบการจ่ายเงินและการคืนเงิน (`/payments`):**
    - แอดมินสามารถตรวจสอบความถูกต้องของรูปภาพสลิปที่แนบมา (PromptPay/Bank Transfer) และกดอนุมัติการสั่งซื้อเพื่อให้บทเรียนแก่ผู้ใช้ได้ทันที
*   **บันทึกการทำงานของแอดมิน (`/audit-logs`):**
    - ทุกความเคลื่อนไหวที่สำคัญของแอดมิน (สร้างคอร์ส, แก้ไขคะแนน, สั่งลบคอร์ส, เปลี่ยนสิทธิ์สมาชิก) จะถูกจดบันทึกเก็บไว้ตรวจสอบความปลอดภัย

---

## 📦 4. การใช้งานด้วย Docker (How to use Docker)

### 4.1 วิธีเปิดโหมด Standalone ใน Next.js สำหรับ Front-Office

เนื่องจาก Next.js ต้องทำงานร่วมกับ Docker ให้มีประสิทธิภาพและขนาดไฟล์เล็กที่สุด เราจำเป็นต้องตั้งค่า Standalone Output

1. เปิดไฟล์ `pharmacy-academy/next.config.mjs`
2. แก้ไขโดยเพิ่ม `output: 'standalone'` เข้าไปในโครงสร้าง `nextConfig`:

```javascript
const nextConfig = {
  allowedDevOrigins: ['localhost', '127.0.0.1'],
  images: {
    remotePatterns,
  },
  output: 'standalone', // <-- เพิ่มตรงนี้
};
```

---

### 4.2 การสร้างไฟล์ Dockerfile ให้กับฝั่ง Front-Office

นำข้อความด้านล่างไปสร้างไฟล์ชื่อ `Dockerfile` ในโฟลเดอร์รอยต่อของโครงการ `pharmacy-academy/`:

```dockerfile
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci

FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED 1
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

RUN mkdir .next
RUN chown nextjs:nodejs .next

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

USER nextjs
EXPOSE 3000
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

---

### 4.3 วิธีสั่งรันด้วยคำสั่ง Docker (Manual Command)

#### ฝั่งผู้เรียน (Front-Office - พอร์ต 3000):
```bash
# 1. Build Image
docker build -t pharmacy-academy-front:latest ./pharmacy-academy

# 2. Run Container
docker run -d -p 3000:3000 --name academy-front -e NEXT_PUBLIC_API_URL="http://localhost:3001" pharmacy-academy-front:latest
```

#### ฝั่งแอดมิน (Back-Office - พอร์ต 3002):
```bash
# 1. Build Image
docker build -t pharmacy-academy-backoffice:latest ./pharmacy-academy_backoffice

# 2. Run Container
docker run -d -p 3002:3002 --name academy-backoffice -e NEXT_PUBLIC_API_URL="http://localhost:3001" pharmacy-academy-backoffice:latest
```

---

### 4.4 การรันร่วมกันแบบ Docker Compose (แนะนำ)

สร้างไฟล์ `docker-compose.yml` ในโฟลเดอร์ด้านนอกสุดเพื่อสั่งเปิดทั้งสองส่วนพร้อมกัน:

```yaml
version: '3.8'

services:
  front-office:
    image: pharmacy-academy-front:latest
    build:
      context: ./pharmacy-academy
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - PORT=3000
      - NEXT_PUBLIC_API_URL=http://localhost:3001  # URL ของฝั่ง Backend API จริง
    restart: always

  back-office:
    image: pharmacy-academy-backoffice:latest
    build:
      context: ./pharmacy-academy_backoffice
      dockerfile: Dockerfile
    ports:
      - "3002:3002"
    environment:
      - PORT=3002
      - NEXT_PUBLIC_API_URL=http://localhost:3001  # URL ของฝั่ง Backend API จริง
    restart: always
```

**คำสั่งที่ใช้ควบคุม:**
- **สั่งรันขึ้นทำงานในระบบหลังบ้าน:** `docker compose up -d --build`
- **สั่งลบและหยุดการทำงานทั้งหมด:** `docker compose down`



---

# 5. แผนการ Merge เข้าระบบหลัก (Integration Plan)

เอกสารส่วนนี้บันทึกแผนการนำฟีเจอร์จาก `pharmacy-academy` และ `pharmacy-academy_backoffice` เข้ารวมกับโปรเจกต์หลัก 3 ระบบ ได้แก่:

- **`01_pharmacy-web`** รับ Frontend ฝั่งผู้เรียน (Learning Section ภายใต้ member path)
- **`02_back-office`** รับ Frontend ฝั่งแอดมินจัดการ Learning ภายใต้ `/backoffice/module/learning/`
- **`03_backend-api`** รับ API routes และ Database Schema ของระบบ Learning ใหม่

---

## 5.1 การวิเคราะห์ความแตกต่างปัจจุบัน (Gap Analysis)

### ฝั่ง Frontend (01_pharmacy-web vs pharmacy-academy)

| หัวข้อ | 01_pharmacy-web (ปัจจุบัน) | pharmacy-academy (ต้นทาง) |
|---|---|---|
| Framework | Next.js 16 (App Router) | Next.js 15 (App Router) |
| Styling | Tailwind CSS v4 + CSS Modules | Tailwind CSS v4 + Bootstrap 5 + Sass |
| State Management | ไม่มี (Static/SSR) | Zustand + React Context |
| Auth | ยังทำไม่เสร็จ (อยู่ระหว่างพัฒนา) | JWT + HttpOnly Cookie + OTP Reset + Captcha |
| Dependency หลักที่ต่าง | Swiper v12, Framer Motion, d3-scale | Vimeo Player SDK, react-hook-form, zustand, zod |
| API Client | lib/api.ts (plain fetch functions) | lib/api.ts (class ที่มี api.get/post/patch) |
| i18n | ไม่มี (อยู่ระหว่างวางแผน) | next-intl (ภาษาไทย/อังกฤษ) |
| ส่วน /learning | หน้า Listing Static (ข้อมูล Hardcode) | ระบบ Learning เต็มรูปแบบ (Video Player + Quiz + Progress) |

### ฝั่ง Back-Office (02_back-office vs pharmacy-academy_backoffice)

| หัวข้อ | 02_back-office (ปัจจุบัน) | pharmacy-academy_backoffice (ต้นทาง) |
|---|---|---|
| โมดูลที่มี | council-web, e-service, setting, bill, register | courses, videos, payments, users, cpe-credits, grading, support, audit-logs |
| Auth | Cookie auth_token + middleware redirect (server-side) | sessionStorage.backoffice_token (client-side only) |
| Permission System | Role-based ด้วย permission_key จาก API (server-side check) | RBAC ฝั่ง Frontend (constants.ts) ไม่ตรวจ server-side |
| API Client | authFetch helper (ส่ง cookie อัตโนมัติ) | apiClient class (ส่ง Bearer token จาก sessionStorage) |
| Layout | Sidebar permission-aware + Header | Sidebar + Header (ไม่มี permission guard บน server) |

### ฝั่ง Backend (03_backend-api)

| หัวข้อ | 03_backend-api (ปัจจุบัน) | ต้องการเพิ่ม (จาก pharmacy-academy) |
|---|---|---|
| Routes ที่มี | home, news, laws, agencies, auth, permissions, requests, policy ฯลฯ | courses, lessons, videos, enrollments, payments (learning), cpe-credits, quiz, interactive-questions |
| Auth System | JWT + role (admin/editor/viewer) | เพิ่ม role: pharmacist (member = pharmacist ในระบบนี้) |
| auth.ts route | มี login/register/me สำหรับ admin/staff แล้ว | รองรับ pharmacist registration + OTP + captcha เพิ่มเติมในไฟล์เดิม |
| File Upload | Supabase Storage (รูปภาพ + PDF) | Supabase Storage + Vimeo API (วิดีโอบทเรียน) |

---

## 5.2 สิ่งที่ต้อง Merge เข้า 01_pharmacy-web (Front-Office)

### เป้าหมาย

แทนที่หน้า /learning และ /learning/courses ที่ปัจจุบันเป็นข้อมูล Hardcode ด้วยระบบ Learning แบบ Dynamic ที่เชื่อม API จริง โดยทุก route อยู่ภายใต้ (member) group ตาม pattern ปัจจุบัน

### Route Mapping ที่ต้องเพิ่มใน app/(member)/05_learning/

| ไฟล์ต้นทาง (pharmacy-academy) | ปลายทาง (pharmacy-web) | หมายเหตุ |
|---|---|---|
| app/courses/page.tsx | app/(member)/05_learning/courses/page.tsx | แทนที่หน้า Static เดิม (Hardcode) |
| app/courses/[id]/page.tsx | app/(member)/05_learning/courses/[id]/page.tsx | หน้าละเอียดคอร์ส (ใหม่ทั้งหมด) |
| app/course-learning/[courseId]/page.tsx | app/(member)/05_learning/course-learning/[courseId]/page.tsx | หน้าเรียนบทเรียน + Vimeo Player |
| app/checkout/page.tsx | app/(member)/05_learning/checkout/page.tsx | ชำระเงินค่าคอร์ส (ใหม่) |
| app/payment-promptpay/page.tsx | app/(member)/05_learning/payment-promptpay/page.tsx | PromptPay QR (ใหม่) |
| app/payment-card/page.tsx | app/(member)/05_learning/payment-card/page.tsx | บัตรเครดิต (ใหม่) |
| app/payment-success/page.tsx | app/(member)/05_learning/payment-success/page.tsx | ชำระสำเร็จ (ใหม่) |
| app/payment-fail/page.tsx | app/(member)/05_learning/payment-fail/page.tsx | ชำระล้มเหลว (ใหม่) |
| app/shop-cart/page.tsx | app/(member)/05_learning/shop-cart/page.tsx | รถเข็น (ใหม่) |
| app/profile/page.tsx | ⏸️ ยังไม่ merge — ดูหมายเหตุด้านล่าง | Deferred |

> **URL จริงที่ผู้ใช้เข้าถึง:** /learning/courses, /learning/courses/[id], /learning/course-learning/[courseId] ฯลฯ
> (route group (member) และ prefix 05_learning ไม่ปรากฏใน URL)

> **หมายเหตุ Profile Page:** app/profile/page.tsx ของ pharmacy-academy แสดงประวัติการเรียนและ CPE สะสมของ pharmacist
> ยังไม่รวมเข้ากับ app/(member)/02_profile/ ของ pharmacy-web ในรอบนี้
> **TODO (Phase ถัดไป):** นำ section ประวัติการเรียนและ CPE ไปเพิ่มเป็น tab หรือ section ในหน้า Profile กลาง

### Components ที่ต้องย้ายเข้า components/member/learning/

เนื่องจาก pharmacy-web ยังไม่มี folder `features/` จึงใส่ทุกอย่างใน `components/member/learning/` ก่อน
เมื่อ codebase เติบโตขึ้นให้วางแผนแยกออกมาตามตารางด้านล่าง

| ที่มา (pharmacy-academy) | ปลายทาง pharmacy-web | ประเภท (แนะนำในอนาคต) |
|---|---|---|
| features/learning/components/ | components/member/learning/ | Component |
| features/learning/services/learningApi.ts | components/member/learning/services/ | ควรแยกเป็น feature (มี API logic) |
| features/learning/interactive-runtime.ts | components/member/learning/ | ควรแยกเป็น feature (core business logic) |
| features/courses/components/ | components/member/learning/courses/ | Component |
| features/courses/services/ | components/member/learning/courses/ | ควรแยกเป็น feature |
| features/cart/ | components/member/learning/cart/ | ควรแยกเป็น feature (มี global state ผ่าน Zustand) |
| features/payment/components/ | components/member/learning/payment/ | Component |
| features/payment/hooks.ts | components/member/learning/payment/ | ควรแยกเป็น feature (มี side effects) |
| features/auth/ | components/member/auth/ | ควรแยกเป็น feature (ดูหัวข้อ 5.5) |
| features/profile/ | components/member/learning/profile/ | Component (แสดงประวัติเรียน/CPE เท่านั้น) |

### Dependencies ที่ต้องเพิ่มใน package.json ของ 01_pharmacy-web

ใช้ version ล่าสุดเสมอ ณ เวลา install:

```bash
npm install @vimeo/player zustand react-hook-form @hookform/resolvers zod react-circular-progressbar
```

> **หมายเหตุ Swiper:** pharmacy-web ใช้ swiper v12 อยู่แล้ว ส่วน pharmacy-academy ใช้ v11
> API ของ Swiper มีการเปลี่ยน import path ระหว่าง v11 กับ v12
> วิธีแก้: อัปเกรด component ของ pharmacy-academy ที่ใช้ Swiper ให้ใช้ syntax ของ v12 ก่อน Merge ไม่ Downgrade pharmacy-web

---

## 5.3 สิ่งที่ต้อง Merge เข้า 02_back-office (Back-Office)

### เป้าหมาย

เพิ่มโมดูล Learning ใหม่ทั้งหมดใน path /backoffice/module/learning/ (ใช้ "learning" ไม่ใช่ "lms" เพื่อให้ตรงกับ frontend)

### Route Mapping ที่ต้องสร้างใน src/app/backoffice/module/learning/

| Route ปลายทาง (02_back-office) | ที่มา (pharmacy-academy_backoffice) | คำอธิบาย |
|---|---|---|
| /backoffice/module/learning/courses | app/(admin)/courses/ | จัดการคอร์สเรียนทั้งหมด |
| /backoffice/module/learning/courses/[id] | app/(admin)/courses/[id]/ | รายละเอียดและแก้ไขคอร์ส + แทรกคำถาม |
| /backoffice/module/learning/courses/add | app/(admin)/courses/add/ | สร้างคอร์สใหม่ |
| /backoffice/module/learning/videos | app/(admin)/videos/ | คลังวิดีโอบทเรียน (เชื่อม Vimeo) |
| /backoffice/module/learning/payments | app/(admin)/payments/ | อนุมัติสลิปชำระเงินและธุรกรรม |
| /backoffice/module/learning/users | app/(admin)/users/ | จัดการสมาชิก (pharmacist) ของ LMS |
| /backoffice/module/learning/cpe-credits | app/(admin)/cpe-credits/ | จัดการและส่งหน่วยกิต CPE |
| /backoffice/module/learning/grading | app/(admin)/grading/ | ตรวจและให้คะแนนข้อสอบ |
| /backoffice/module/learning/audit-logs | app/(admin)/audit-logs/ | บันทึกกิจกรรมแอดมิน |

### Features ที่ต้องคัดลอก (เปลี่ยน prefix จาก lms- เป็น learning-)

| Feature ต้นทาง | ปลายทาง | หมายเหตุ |
|---|---|---|
| features/courses/ | features/learning-courses/ | Components, hooks, services, types ทั้งหมด |
| features/videos/ | features/learning-videos/ | Video management + Vimeo integration |
| features/payments/ | features/learning-payments/ | Payment approval flow |
| features/users/ | features/learning-users/ | Member/pharmacist management |
| features/cpe-credits/ | features/learning-cpe/ | CPE submission workflow |
| features/grading/ | features/learning-grading/ | Exam grading |
| features/dashboard/ | รวมเข้า Dashboard เดิม | เพิ่ม Learning stats ใน Dashboard ที่มีอยู่ |

### Dependencies ที่ต้องเพิ่มใน package.json ของ 02_back-office

ใช้ version ล่าสุดเสมอ ณ เวลา install:

```bash
npm install recharts @headlessui/react date-fns papaparse clsx
```

### Auth Pattern ที่ต้องปรับ (สำคัญ)

pharmacy-academy_backoffice ใช้ sessionStorage.backoffice_token (client-side) ซึ่งไม่ตรงกับ 02_back-office ที่ใช้ Cookie auth_token + middleware server-side guard

สิ่งที่ต้องแก้ไขเมื่อ Merge:

1. เปลี่ยน apiClient ใน learning features ให้ใช้ authFetch (cookie-based) แทน Bearer token
2. middleware ใน 02_back-office จะครอบคลุม /backoffice/module/learning/* โดยอัตโนมัติเพราะ path ตรงกับ pattern เดิม
3. ลบ sessionStorage.getItem('backoffice_token') และ sessionStorage.setItem('backoffice_token') ออกจากทุกไฟล์ที่ migrate มา

---

## 5.4 สิ่งที่ต้อง Merge เข้า 03_backend-api (Backend API)

### เป้าหมาย

เพิ่ม API routes สำหรับระบบ Learning ใหม่ และ Database Tables ใน schema.ts โดยใช้ชื่อ /learning/ แทน /lms/ เพื่อให้ตรงกับ frontend

### Database Tables ที่ต้องสร้างใหม่ใน schema.ts

```typescript
// ตาราง Learning System ใหม่ -- เพิ่มต่อท้าย schema.ts
courses                // ข้อมูลคอร์สเรียน (title, description, price, cpeCredits, status)
course_categories      // หมวดหมู่คอร์ส
lessons                // บทเรียนย่อยในคอร์ส (title, order, videoId)
enrollments            // การลงทะเบียน pharmacist เข้าคอร์ส
lesson_progress        // ความคืบหน้ารายบทเรียน (lastWatchedSeconds, isCompleted)
videos                 // วิดีโอบทเรียน (resourceId, provider, duration, playbackUrl, status)
interactive_questions  // คำถามแทรกระหว่างวิดีโอ (displayAtSeconds, answerText)
lesson_quizzes         // ข้อสอบย่อยท้ายบทเรียน
quiz_questions         // คำถามในข้อสอบ (questionText, choices, correctAnswer)
quiz_attempts          // ประวัติการทำข้อสอบ (answers, score, isPassed)
learning_payments      // การสั่งซื้อและชำระเงินคอร์ส (amount, status, slipImageUrl)
cpe_submissions        // บันทึกการส่งหน่วยกิต CPE ไปยังสภา
learning_audit_logs    // บันทึกกิจกรรมแอดมิน LMS
```

### API Routes ที่ต้องสร้างใหม่ใน src/routes/

ชื่อไฟล์ใช้ prefix learning- เพื่อแยกจาก routes เดิม

| ไฟล์ Route ใหม่ | Method | Endpoint | คำอธิบาย | รวม route เดิมได้? |
|---|---|---|---|---|
| learning-courses.ts | GET | /public/courses | รายการคอร์สสาธารณะ (ไม่ต้อง login) | ไม่ได้ - แยก |
| learning-courses.ts | GET | /public/courses/:id | รายละเอียดคอร์สสาธารณะ | ไม่ได้ - แยก |
| learning-courses.ts | GET | /courses/:id/learning | ข้อมูลบทเรียน (ต้อง login pharmacist) | ไม่ได้ - แยก |
| learning-courses.ts | POST | /courses/:id/enroll | ลงทะเบียนคอร์ส | ไม่ได้ - แยก |
| learning-courses.ts | POST | /courses/:id/cancel | ยกเลิกการลงทะเบียน | ไม่ได้ - แยก |
| learning-courses.ts | GET | /courses/enrolled | คอร์สที่ pharmacist enrolled แล้ว | ไม่ได้ - แยก |
| learning-lessons.ts | PATCH | /lessons/:id/progress | อัปเดตเวลาดูวิดีโอ | ไม่ได้ - แยก |
| learning-lessons.ts | POST | /courses/:courseId/lessons/:lessonId/complete | ทำเครื่องหมายบทเรียนเสร็จ | ไม่ได้ - แยก |
| learning-lessons.ts | GET | /lessons/:id/quiz-runtime | ดึง Quiz สำหรับทำ | ไม่ได้ - แยก |
| learning-lessons.ts | POST | /lessons/:id/quiz-attempts | ส่งคำตอบ Quiz | ไม่ได้ - แยก |
| learning-interactive.ts | POST | /video-questions/:id/answer | ตอบคำถามระหว่างวิดีโอ | ไม่ได้ - แยก |
| learning-payments.ts | POST | /learning/payments | สร้างคำสั่งซื้อ | ไม่ได้ (ต่าง domain กับ requests.ts) |
| learning-payments.ts | PUT | /learning/payments/:id/approve | อนุมัติการชำระเงิน (admin) | ไม่ได้ - แยก |
| learning-admin.ts | POST | /courses | สร้างคอร์ส (admin) | ไม่ได้ - แยก |
| learning-admin.ts | PUT | /courses/:id | แก้ไขคอร์ส (admin) | ไม่ได้ - แยก |
| learning-admin.ts | DELETE | /courses/:id | ลบ/Archive คอร์ส (admin) | ไม่ได้ - แยก |
| learning-videos.ts | GET/POST | /videos | จัดการ Video records | ไม่ได้ - แยก |
| learning-cpe.ts | POST | /learning/cpe/submit | ส่งหน่วยกิต CPE ไปยังสภา | ไม่ได้ - แยก |

> หมายเหตุ Payment Routes: requests.ts ที่มีอยู่จัดการ payment สำหรับการต่อใบอนุญาต ซึ่งเป็นคนละ domain กับการซื้อคอร์สเรียน จึงแยกไฟล์ใหม่เป็น learning-payments.ts เพื่อป้องกัน logic ปะปนกัน

### การปรับ auth.ts (รวมเข้า route เดิมได้บางส่วน)

ตรวจสอบโครงสร้าง auth.ts ที่มีอยู่แล้วพบว่า:
- `POST /auth/login` — ใช้ `username` + `password` และส่งคืน JWT พร้อม permissions
- `GET /auth/me` — ดึงข้อมูลจาก users table ด้วย JWT
- `POST /auth/users` — สร้าง user ใหม่ (admin only, ใช้ permission guard)

**สิ่งที่รวมเข้า auth.ts เดิมได้โดยตรง:**
- `POST /auth/login` — รองรับ pharmacist ได้เลยโดยไม่ต้องแก้ไข (logic เดิมตรวจแค่ username/password ไม่ lock role)
- `GET /auth/me` — รองรับได้เลยโดยไม่ต้องแก้ไข

**สิ่งที่ต้องเพิ่มใหม่ใน auth.ts (เนื่องจากไม่มีในระบบเดิม):**
```typescript
// POST /auth/register-pharmacist  ลงทะเบียน pharmacist พร้อม professionalLicenseNumber
// POST /auth/verify-otp           ยืนยัน OTP สำหรับ reset password
// POST /auth/forgot-password      ขอ reset password ผ่าน email
// POST /auth/reset-password       reset ด้วย OTP + Captcha
// GET  /auth/captcha              ดึง Captcha SVG สำหรับกันการ brute force
```

### หมายเหตุ: role pharmacist ใน schema.ts (Deferred)

> ยังไม่เพิ่ม role pharmacist ใน users table และ schema.ts ในรอบนี้
> เนื่องจากปัจจุบันมีเพียง mock-up login สำหรับ pharmacist เท่านั้น ยังไม่มีระบบ auth จริง

เมื่อถึงเวลาให้เพิ่มดังนี้:
```typescript
// ใน schema.ts -- แก้ comment ของ users table (ไม่ต้องเพิ่ม column ใหม่)
role: text('role').notNull().default('viewer'),
// role ที่รองรับทั้งหมดหลัง merge:
// 'admin'       -- ผู้ดูแลระบบสูงสุด
// 'editor'      -- ผู้แก้ไขเนื้อหา council-web
// 'web_editor'  -- ผู้แก้ไขเนื้อหา (สิทธิ์จำกัด)
// 'viewer'      -- ดูข้อมูลได้อย่างเดียว
// 'pharmacist'  -- เภสัชกรสมาชิก (= ผู้เรียนใน LMS) ← เพิ่มเมื่อ auth พร้อม
```
> หมายเหตุ: ใน pharmacy-academy เดิม role ที่ใช้สำหรับผู้เรียนมีทั้ง member และ pharmacist
> ในระบบนี้จะใช้แค่ role เดียวคือ pharmacist ("member" = pharmacist)
> role member จะไม่ถูกใช้งาน

---

## 5.5 หมายเหตุระบบ Auth (Auth Integration Notes)

> Auth ของผู้เรียน LMS ใช้ Member Portal เดิมของ pharmacy-web กล่าวคือผู้เรียน = pharmacist สมาชิก
> ระบบ Login จะเป็นระบบกลางร่วมกัน ไม่ได้แยก Account ต่างหาก

### สถานะปัจจุบัน

ระบบ Login ของ pharmacy-web ยังอยู่ระหว่างพัฒนา มีหน้า /login แต่ยังไม่เชื่อม API จริง
ระหว่างนี้ให้ Merge features/auth/ จาก pharmacy-academy เข้าก่อนเพื่อใช้เป็นฐาน โดยบันทึกความแตกต่างดังนี้:

### ความแตกต่างระหว่าง Auth ของ pharmacy-academy กับสิ่งที่ pharmacy-web ต้องการ

| หัวข้อ | pharmacy-academy (ต้นทาง) | สิ่งที่ขาด / ต้องปรับ สำหรับ pharmacy-web |
|---|---|---|
| Token Storage | localStorage หรือ sessionStorage ตาม rememberMe | pharmacy-web อาจต้องการ HttpOnly Cookie เพื่อความปลอดภัยมากขึ้น (ยังไม่ตัดสินใจ) |
| Register (general) | มี /api/auth/register สำหรับ role: member | pharmacy-web ใช้เฉพาะ pharmacist ไม่มี general member |
| Register (pharmacist) | มี /api/auth/register ส่ง professionalLicenseNumber เพิ่มเติม | ใช้ได้ทันที |
| Login + Captcha | มีระบบ Captcha กันการ brute force | ควร Keep ไว้ |
| OTP Reset Password | มีระบบ verify-otp + reset-password ครบ | ใช้ได้ทันที |
| Auth Middleware | ตรวจ token ใน localStorage/sessionStorage ฝั่ง client | pharmacy-web อาจต้องการ server-side check ผ่าน middleware (ยังไม่ implement) |
| User role | รองรับ member, pharmacist | pharmacy-web ใช้แค่ pharmacist -- ต้องลบ logic ที่เกี่ยวกับ member role |
| AuthProvider | มี Context ครอบทั้งแอป | ต้องตรวจสอบว่าจะครอบเฉพาะ (member) group หรือทั้งแอป pharmacy-web |
| i18n Error Messages | Error messages ดึงจาก next-intl (getClientMessage) | เปลี่ยนเป็น hardcode ภาษาไทยโดยตรงก่อน รอ i18n integration ดู Section 5.6 |

### API Routes ที่ต้องเพิ่มใน pharmacy-web (app/api/auth/)

Route เหล่านี้คัดลอกจาก pharmacy-academy และ proxy ไปยัง 03_backend-api:

```
app/api/auth/
├── login/route.ts            Proxy: POST /auth/login -> backend
├── register/route.ts         Proxy: POST /auth/register-pharmacist -> backend
├── logout/route.ts           Clear token/cookie
├── me/route.ts               Proxy: GET /auth/me -> backend
├── captcha/route.ts          Proxy: GET /auth/captcha -> backend
├── verify-otp/route.ts       Proxy: POST /auth/verify-otp -> backend
├── forgot-password/route.ts  Proxy: POST /auth/forgot-password -> backend
└── reset-password/route.ts   Proxy: POST /auth/reset-password -> backend
```

### รายการสิ่งที่ต้องทำเพิ่มเติมหลัง Merge Auth

- [ ] ตรวจสอบว่า AuthProvider ควร wrap ที่ level ไหนใน pharmacy-web
- [ ] ตัดสินใจว่าจะใช้ localStorage/sessionStorage หรือ HttpOnly Cookie
- [ ] ลบ logic ที่รองรับ role member (เก็บแค่ pharmacist)
- [ ] เปลี่ยน error messages จาก getClientMessage() เป็นภาษาไทยตรงๆ (รอ i18n integration)
- [ ] ทดสอบ OTP flow ร่วมกับ backend email service

---

## 5.6 Deferred: ระบบ i18n (Internationalization)

> หัวข้อนี้ยังไม่ดำเนินการ บันทึกไว้เพื่อวางแผนในอนาคต

### แผนระยะยาว

ทั้งระบบ pharmacy-web ต้องการรองรับหลายภาษา (ภาษาไทย + อังกฤษ อย่างน้อย)
ระบบ pharmacy-academy ได้ implement next-intl ไว้แล้วและเป็นตัวอย่างที่ดีในการนำมาขยาย

### วิธีที่ pharmacy-academy ใช้ next-intl

```
pharmacy-academy/
├── next.config.mjs           -- import createNextIntlPlugin และครอบ config
├── src/i18n/request.ts       -- กำหนด locale จาก request
├── src/app/layout.tsx        -- ครอบด้วย NextIntlClientProvider
└── messages/
    ├── th.json               -- ข้อความภาษาไทยทั้งหมด
    └── en.json               -- ข้อความภาษาอังกฤษ
```

ภายใน component/hook ใช้ผ่าน:

```typescript
import { useTranslations } from 'next-intl';
const t = useTranslations('CourseLearningArea');
// หรือผ่าน getClientMessage() ใน services
```

เนื้อหาใน messages/th.json ครอบคลุม: auth errors, course labels, quiz messages, payment labels, profile labels

### สิ่งที่ต้องทำเมื่อถึงเวลา

1. ติดตั้ง next-intl เวอร์ชันล่าสุดใน pharmacy-web
2. ตั้งค่า locale routing ให้ครอบทุก route group
3. สร้างไฟล์ messages/th.json โดยรวม messages จาก pharmacy-academy และของ pharmacy-web เดิม
4. เปลี่ยน hardcode strings ที่เขียนทับระหว่าง Merge ครั้งแรกกลับเป็น i18n keys
5. ตั้งค่า middleware ให้รองรับ locale detection โดยไม่ขัดกับ middleware เดิม (static asset rewrite)

> สิ่งที่ต้องระวัง: next-intl มีผลต่อ routing และ middleware โดยตรง การเพิ่มในภายหลังจะต้องทดสอบ regression ทุก route

---

## 5.7 Deferred: Vimeo Integration

> หัวข้อนี้ยังไม่ดำเนินการ บันทึกไว้เพื่อวางแผนในอนาคต

### Vimeo ใช้ทำอะไรในระบบนี้

Vimeo เป็น Video Hosting Provider ที่ใช้เก็บและ Stream วิดีโอบทเรียน โดยมีฟีเจอร์สำคัญ:

1. **Video Upload:** แอดมินอัปโหลดวิดีโอผ่าน Backoffice แล้ว Backend ส่งไฟล์ไปยัง Vimeo API และ Vimeo ส่งคืน resourceId และ playbackUrl
2. **Video Playback:** ผู้เรียนดูวิดีโอผ่าน Vimeo Player SDK (@vimeo/player) ซึ่ง embed เป็น iframe ที่ควบคุมได้ด้วย JavaScript เช่น หยุดวิดีโอเมื่อถึงเวลาที่กำหนด
3. **Status Tracking:** Vimeo แปลงวิดีโอหลัง upload (PROCESSING -> READY) ซึ่ง backend ต้องตรวจสอบ status ก่อนอนุญาตให้ผู้เรียนดู

### Environment Variables ที่ต้องการ

```env
# สำหรับ 03_backend-api -- เพิ่มใน .env
VIMEO_ACCESS_TOKEN=     # Personal Access Token สำหรับ Upload API
VIMEO_CLIENT_ID=        # App Client ID
VIMEO_CLIENT_SECRET=    # App Client Secret
```

### สิ่งที่ต้องทำเมื่อถึงเวลา

- [ ] สร้าง/ยืนยัน Vimeo App ของโครงการ (ไม่ใช้ account ส่วนตัว)
- [ ] ขอ Vimeo Access Token ที่มีสิทธิ์ Upload + Read
- [ ] เพิ่ม VIMEO_ACCESS_TOKEN, VIMEO_CLIENT_ID, VIMEO_CLIENT_SECRET ใน .env ของ 03_backend-api
- [ ] Implement learning-videos.ts route handler ที่ต่อกับ Vimeo API
- [ ] ทดสอบ upload -> processing -> ready flow ก่อน deploy จริง

---

## 5.8 ลำดับการ Merge ที่แนะนำ (Recommended Merge Order)

```
Phase 1 -- Backend: Database Tables (03_backend-api)
|
|-- 1.1  สร้าง Database Tables ใหม่ใน schema.ts
|        (courses, course_categories, lessons, enrollments, lesson_progress,
|         videos, interactive_questions, lesson_quizzes, quiz_questions,
|         quiz_attempts, learning_payments, cpe_submissions, learning_audit_logs)
|-- 1.2  สร้าง Route files ใหม่ทั้งหมด
|        (learning-courses.ts, learning-lessons.ts, learning-interactive.ts,
|         learning-payments.ts, learning-admin.ts, learning-videos.ts, learning-cpe.ts)
|-- 1.3  Register routes ใหม่ทั้งหมดใน server.ts
+-- 1.4  Test API ด้วย Postman/curl (public routes ก่อน แล้วค่อย protected routes)

Phase 2 -- Backend: Auth Endpoints (03_backend-api)
|
|  ** ทำหลัง Phase 1 เพราะรอ mock-up login pharmacist ถูก implement จริงก่อน **
|
|-- 2.1  เพิ่ม endpoint pharmacist ใหม่ใน auth.ts เดิม
|        (register-pharmacist, verify-otp, forgot-password, reset-password, captcha)
|-- 2.2  เพิ่ม role 'pharmacist' ใน users table ของ schema.ts (ไม่เพิ่ม column ใหม่ แค่ comment)
+-- 2.3  Test auth flow: register -> login -> me -> forgot-password -> reset

Phase 3 -- Back-Office (02_back-office)
|
|-- 3.1  Migrate components จาก pharmacy-academy_backoffice
|        (copy features/* -> features/learning-*/, แก้ import paths, ลบ i18n dependency)
|-- 3.2  สร้าง route folder /backoffice/module/learning/ พร้อม pages ทั้งหมด
|-- 3.3  แก้ apiClient ในทุก learning feature ให้ใช้ authFetch (Cookie-based) แทน sessionStorage
|-- 3.4  เพิ่มเมนู "การเรียนรู้" (Learning) ใน Sidebar ของ 02_back-office
+-- 3.5  ทดสอบ: CRUD คอร์ส, อัปโหลดวิดีโอ, อนุมัติ payment, ส่ง CPE

Phase 4 -- Front-Office (01_pharmacy-web)
|
|-- 4.1  ติดตั้ง dependencies ใหม่ (latest version)
|        npm install @vimeo/player zustand react-hook-form @hookform/resolvers zod react-circular-progressbar
|-- 4.2  Copy auth components จาก pharmacy-academy ไปไว้ใน components/member/auth/
|        (ปรับ role: ลบ logic ที่เกี่ยวกับ 'member' role; เปลี่ยน getClientMessage() เป็นภาษาไทย)
|-- 4.3  เพิ่ม API Route handlers ใน app/api/auth/
|        (login, register, logout, me, captcha, verify-otp, forgot-password, reset-password)
|-- 4.4  Copy learning, courses, cart, payment จาก pharmacy-academy
|        ไปไว้ใน components/member/learning/ (ตามตารางใน Section 5.2)
|-- 4.5  สร้าง routes ใหม่ใน app/(member)/05_learning/
|        (แทนที่หน้า Static เดิม; อัปเกรด Swiper v11 -> v12 syntax)
+-- 4.6  Integration test ทั้งระบบ (login -> ดูคอร์ส -> เรียน -> quiz -> ชำระเงิน)

Phase 5 -- Deferred
|
|-- 5.1  Profile: รวม learning history + CPE section เข้ากับ app/(member)/02_profile/
|-- 5.2  i18n: ติดตั้ง next-intl ครอบทั้ง pharmacy-web (ดู Section 5.6)
+-- 5.3  Vimeo: ตั้งค่า Account และ implement video upload/stream (ดู Section 5.7)
```

---

## 5.9 สรุปการตัดสินใจ (Decision Log)

| # | ประเด็น | การตัดสินใจ | หมายเหตุ |
|---|---|---|---|
| 1 | Auth ของผู้เรียน LMS | รวมกับ Member Portal (pharmacist account เดียวกัน) | ไม่มี role member -- ใช้แค่ pharmacist |
| 2 | Path prefix ของ back-office | /learning/ (ไม่ใช่ /lms/) | ให้ตรงกับ frontend |
| 3 | Path prefix ของ backend-api routes | /learning/ เช่น /learning/payments | ชื่อ route files ใช้ prefix learning- |
| 4 | URL ของ Learning ใน pharmacy-web | ภายใต้ (member)/05_learning/ | URL จริงเป็น /learning/courses ฯลฯ |
| 5 | Swiper version | อัปเกรด component เป็น v12 | ไม่ Downgrade pharmacy-web |
| 6 | Package versions | ใช้ latest เสมอ | ไม่ lock เป็น version เก่าจาก pharmacy-academy |
| 7 | i18n | Deferred (Phase 5.2) -- ดู Section 5.6 | pharmacy-web ทั้งระบบต้องรองรับหลายภาษา |
| 8 | Vimeo integration | Deferred (Phase 5.3) -- ดู Section 5.7 | รอ Vimeo Account พร้อม |
| 9 | Back-office auth pattern | เปลี่ยนเป็น Cookie (authFetch) | apiClient ของ learning features ต้องแก้ไข |
| 10 | Profile page (app/profile/page.tsx) | Deferred (Phase 5.1) | ยังไม่รวมกับ 02_profile -- รอเพิ่ม tab ทีหลัง |
| 11 | features/ ใน pharmacy-web | ใส่ใน components/member/learning/ ก่อน | วางแผนแยก features ออกมาใน Phase ถัดไป |
| 12 | role pharmacist ใน schema.ts | Deferred (Phase 2) | รอจนกว่า auth pharmacist จะพร้อม |
| 13 | auth.ts endpoints ที่รวมได้ | POST /auth/login และ GET /auth/me รวมได้ทันที | ไม่ต้องแก้ logic เดิม เพิ่มแค่ pharmacist-specific endpoints |
