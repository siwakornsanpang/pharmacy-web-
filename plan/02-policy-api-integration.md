# แผนการดำเนินงาน: การเชื่อมต่อ API สำหรับระบบนโยบาย

เอกสารฉบับนี้ระบุแนวทางในการเปลี่ยนข้อมูลนโยบายจากการเขียนโค้ดแบบ Hardcoded ในส่วน `about/policy` ไปสู่ระบบที่ดึงข้อมูลผ่าน API แบบไดนามิก

## 1. ภาพรวม

ปัจจุบันข้อมูลนโยบายถูกจัดเก็บเป็นค่าคงที่ (`POLICY_DATA`) ภายในคอมโพเนนต์ `PolicyContent.tsx` ในอนาคตข้อมูลนี้จะถูกดึงมาจาก API หลังบ้านเพื่อให้สามารถอัปเดตข้อมูลได้ง่ายโดยไม่ต้องแก้ไขโค้ด

## 2. การออกแบบฐานข้อมูล (ร่าง)

การใช้ Drizzle ORM (อ้างอิงตามรูปแบบเดิมของโปรเจกต์) โครงสร้างตารางอาจเป็นดังนี้:

```typescript
// lib/db/schema.ts

export const policyCategories = pgTable("policy_categories", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(), // เช่น "จัดตั้ง Young Pharmacist Council"
  order: integer("order").default(0), // ลำดับการแสดงผล
  createdAt: timestamp("created_at").defaultNow(),
});

export const policyProjects = pgTable("policy_projects", {
  id: uuid("id").primaryKey().defaultRandom(),
  categoryId: uuid("category_id").references(() => policyCategories.id),
  name: text("name").notNull(), // ชื่อโครงการ/รายละเอียด bullet
  summaryUrl: text("summary_url").default("#"),
  status: text("status", { enum: ["planned", "ongoing", "completed", "delayed", "terminated"] }).notNull(),
  order: integer("order").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});
```

## 3. การออกแบบ API Route

สร้าง API route ใหม่เพื่อส่งข้อมูล:

- **Path:** `app/api/policies/route.ts`
- **Method:** `GET`
- **รูปแบบการตอบกลับ (Response Format):**

```json
[
  {
    "id": "...",
    "title": "จัดตั้ง Young Pharmacist Council",
    "projects": [
      {
        "id": "...",
        "name": "สร้าง Platform การทำงานระหว่างคนรุ่นใหม่กับคนรุ่นใหญ่",
        "summaryUrl": "#",
        "status": "ongoing"
      }
    ]
  }
]
```

## 4. การเชื่อมต่อฝั่งหน้าบ้าน (Frontend)

### การดึงข้อมูล

ใช้ Next.js Server Components สำหรับการโหลดข้อมูลครั้งแรก (ดีต่อ SEO) หรือใช้ React Query หากต้องการการจัดการแบบโต้ตอบที่ซับซ้อนขึ้น

**ตัวอย่างการดึงข้อมูลใน `PolicyContent.tsx`:**

```typescript
// components/public/02_about/policy/PolicyContent.tsx

export default async function PolicyContent() {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/policies`, {
    next: { revalidate: 3600 } // แคชข้อมูลไว้ 1 ชั่วโมง
  });
  const data: PolicyCategory[] = await response.json();

  return (
    <div className="ThaiFont">
      {/* ส่งข้อมูลที่ดึงมาให้ตารางแสดงผล */}
      <PolicyTable data={data} />
    </div>
  );
}
```

## 5. ขั้นตอนการเปลี่ยนผ่าน

1. **ตั้งค่าฐานข้อมูล:** สร้างตารางและใส่ข้อมูลเริ่มต้น (Seed) ตามเนื้อหาปัจจุบัน
2. **สร้าง Backend API:** พัฒนา GET endpoint พร้อมระบบจัดลำดับตามฟิลด์ `order`
3. **ปรับปรุงคอมโพเนนต์:**
   - เปลี่ยน `PolicyContent` ให้เป็น Server Component (หรือใช้ `useEffect` หากยังเป็น Client Component)
   - สร้าง Loading Skeletons เพื่อป้องกันการกระตุกของหน้าจอ (Layout Shift)
   - เพิ่มระบบจัดการข้อผิดพลาด (Error Handling) เมื่อ API ขัดข้อง
4. **ระบบจัดการหลังบ้าน (Admin):** (ไม่บังคับ) สร้างหน้ากากจัดการข้อมูลสำหรับเจ้าหน้าที่สภาฯ เพื่ออัปเดตสถานะโครงการได้เอง

## 6. ข้อควรคำนึง

- **สถานะ (Status Enum):** ตรวจสอบให้แน่ใจว่า API ส่งค่าสถานะที่ตรงกับสไตล์ของหน้าบ้าน (`planned`, `ongoing`, ฯลฯ)
- **การจัดลำดับ:** ใช้ฟิลด์ `order` เพื่อรักษาลำดับของหมวดหมู่และโครงการให้ตรงตามที่ออกแบบไว้
- **ภาษาไทย:** ตรวจสอบการตั้งค่าฐานข้อมูลและ API ให้รองรับ UTF-8 อย่างสมบูรณ์
