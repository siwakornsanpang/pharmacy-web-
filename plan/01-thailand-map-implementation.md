# Thailand Map Implementation Plan: Pharmacist Distribution

This document outlines the requirements and implementation steps for building an interactive Thailand map showing the number of pharmacists per province, inspired by the Greener Bangkok (BMA) dashboard style.

## 1. Context & Goal

- **Project**: Pharmacy Council Website
- **Target Page**: `app/(public)/02_about/members/page.tsx`
- **Objective**: Visualize pharmacist density across Thailand using a Choropleth map.

## 2. Technical Stack

- **Framework**: Next.js 14+ (App Router)
- **Styling**: Tailwind CSS
- **Visualization**: `react-simple-maps` (based on D3.js) or `D3.js` directly.
- **Icons**: `lucide-react`

## 3. ข้อมูลที่ต้องเตรียม (Required Data)

- [ ] **GeoJSON ประเทศไทย**: ไฟล์ `thailand-provinces.json` ที่บรรจุข้อมูลพิกัดของทั้ง 77 จังหวัด
- [ ] **สถิติเภสัชกร**: ข้อมูล JSON ที่แมตช์รหัสจังหวัด/ชื่อจังหวัด เข้ากับจำนวนเภสัชกร
  - *ตัวอย่าง*: `[ { "id": "TH-10", "name": "กรุงเทพมหานคร", "count": 12450 }, ... ]`
- [ ] **เกณฑ์การแบ่งสี (Color Palette)**: กำหนดระดับความหนาแน่น (เช่น น้อย < 500, ปานกลาง 500-2000, มาก > 2000)

## 4. โครงสร้างส่วนประกอบ UI (UI Components)

| ส่วนประกอบ | รายละเอียด |
| :--- | :--- |
| **Interactive Map** | แผนที่ SVG หลักของประเทศไทย มีการไฮไลท์จังหวัดเมื่อเอาเมาส์ไปชี้ |
| **Hover Tooltip** | แสดงชื่อจังหวัดและจำนวนคนเมื่อเมาส์ชี้ |
| **Side Detail Panel** | แสดงข้อมูลสถิติโดยละเอียดของจังหวัดที่ถูกเลือกหรือคลิก |
| **Ranking List** | รายการ "5 อันดับจังหวัด" ที่มีจำนวนเภสัชกรสูงที่สุด |
| **Map Legend** | คำอธิบายสัญลักษณ์สี (เช่น 0-100 คือสีเขียว, 101-500 คือสีแดง) |

## 5. ขั้นตอนดำเนินการทีละขั้นตอน (Task List)

- [ ] **เตรียมไฟล์ Assets**: เพิ่มไฟล์ GeoJSON และข้อมูล Mock Data เริ่มต้นไว้ที่ `/public/data/`
- [ ] **สร้างโครงวาดแผนที่**: สร้างตัวแผนที่ SVG พื้นฐานโดยใช้ `react-simple-maps`
- [ ] **เขียน Logic การลงสี**: สร้างฟังก์ชันเพื่อเปลี่ยนจำนวนคนให้เป็นสีตามเกณฑ์ที่กำหนด
- [ ] **ระบบโต้ตอบ (Interactivity)**: ใช้ `useState` ของ React เพื่อติดตามจังหวัดที่กำลัง "Active"
- [ ] **ปรับแต่งดีไซน์ (UI Polish)**: สร้างแผงข้อมูลด้านข้างและรายการอันดับโดยใช้ Tailwind CSS ให้ดูทันสมัย (สไตล์ Dashboard)
- [ ] **รองรับมือถือ (Responsive)**: ปรับแต่งให้แผนที่และข้อมูลแสดงผลได้ดีบนหน้าจอมือถือและแท็บเล็ต

---

## AI Prompt (สำหรับใช้สั่งงาน AI ให้เขียน Code)

*คุณสามารถก๊อปปี้ส่วนนี้ไปสั่งงาน AI เพื่อให้ช่วยเขียนโปรแกรมได้เลยครับ:*

> **Prompt**: ช่วยสร้าง Component แผนที่ประเทศไทยแบบ Interactive สำหรับโปรเจค Next.js (App Router)
>
> - **สไตล์การออกแบบ**: แนว Dashboard ทันสมัย, เส้นขอบคมชัด, ใช้โทนสีที่สื่อความหมายชัดเจน (เช่น เขียว/ส้ม/แดง) อ้างอิงสไตล์จาก greener.bangkok.go.th
> - **Library ที่ใช้**: `react-simple-maps`
> - **ฟีเจอร์ที่ต้องมี**:
>
>   1. แผนที่ไฮไลท์เมื่อเอาเมาส์ไปชี้ (Hover)
>   2. แผงด้านข้างแสดง "ข้อมูลจังหวัดที่เลือก" และ "5 อันดับจังหวัดที่มีคนเยอะที่สุด"
>   3. แถบคำอธิบายสี (Legend) บอกระดับความหนาแน่นของข้อมูล
>
> - **ข้อมูล**: ให้ Mock ข้อมูลจำนวนเภสัชกรของจังหวัดหลักๆ อย่างน้อย 15 จังหวัด
> - **ตำแหน่งไฟล์**: เขียน Code ทั้งหมดลงในไฟล์ `app/(public)/02_about/members/page.tsx`

---
