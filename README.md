# 🏥 Pharmacy Council Web Portal (ระบบเว็บหลักสภาเภสัชกรรม)

> This repository hosts the frontend application for the main **Pharmacy Council of Thailand Portal** (`01_pharmacy-web`).
>
> คลังข้อมูลนี้นำเสนอแอปพลิเคชันฝั่งหน้าบ้านของ **ระบบเว็บหลักสภาเภสัชกรรม** (`01_pharmacy-web`) ซึ่งทำหน้าที่เป็นศูนย์กลางข้อมูลและบริการออนไลน์สำหรับประชาชน เภสัชกร และสมาชิก

---

## 🗺️ Table of Contents (สารบัญ)
- [🇹🇭 ภาษาไทย (Thai Version)](#-ภาษาไทย-thai-version)
  - [ภาพรวมของโปรเจกต์ (Project Overview)](#ภาพรวมของโปรเจกต์-project-overview)
  - [โครงสร้างระบบงานและเมนูหลัก (Project Modules)](#โครงสร้างระบบงานและเมนูหลัก-project-modules)
  - [การติดตั้งและการรันระบบ (Getting Started)](#การติดตั้งและการรันระบบ-getting-started)
  - [เทคโนโลยีหลักที่ใช้ (Tech Stack)](#เทคโนโลยีหลักที่ใช้-tech-stack)
- [🇺🇸 English Version](#-english-version)
  - [Project Overview](#project-overview)
  - [Project Modules](#project-modules)
  - [Getting Started](#getting-started-1)
  - [Tech Stack](#tech-stack-1)

---

## 🇹🇭 ภาษาไทย (Thai Version)

### ภาพรวมของโปรเจกต์ (Project Overview)
โปรเจกต์ `01_pharmacy-web` พัฒนาด้วย Next.js (App Router) และ React 19 โดยมุ่งเน้นการมอบประสบการณ์การใช้งานที่รวดเร็ว ปลอดภัย และตอบโจทย์ผู้ใช้งานทุกกลุ่มผ่านการออกแบบหน้าจอที่สอดคล้องกับแนวทางสภาเภสัชกรรม (Pharmacy Design System) 

แอปพลิเคชันนี้ประกอบด้วยพื้นที่ใช้งานหลัก 2 ส่วนคือ **พื้นที่สาธารณะ (Public Area)** สำหรับบริการข้อมูลข่าวสาร ประชาสัมพันธ์องค์กร กฎหมาย รวมถึงการเข้าชมงานประชุมวิทยากร และ **พื้นที่เฉพาะสมาชิก (Member Area)** สำหรับเภสัชกรในการจัดการข้อมูลส่วนตัว ติดตามความรู้ และบริการคำขอ e-Service ต่าง ๆ

---

### โครงสร้างระบบงานและเมนูหลัก (Project Modules)

ระบบโครงสร้างหน้าของเว็บใน `01_pharmacy-web/app/` แบ่งตามสิทธิ์การเข้าถึงดังนี้:

#### 📢 1. พื้นที่สาธารณะ (Public Area) - `app/(public)/`
* **01_home**: หน้าแรกและภาพรวมบริการของสภาเภสัชกรรม (Home)
* **02_about**: ข้อมูลเกี่ยวกับองค์กร ประวัติ คณะกรรมการ และวิสัยทัศน์ (About Us)
* **03_department**: รายละเอียดหน่วยงานและสถาบันย่อยภายใต้สภา (Departments)
* **04_service**: ระบบบริการ e-Service หลักขององค์กร (e-Services)
* **05_meeting**: ข้อมูลการประชุมวิชาการ สัมมนา และกิจกรรมการอบรม (Meetings & Seminars)
* **06_news**: ศูนย์รวมข่าวประชาสัมพันธ์ ข่าวจัดซื้อจัดจ้าง และประกาศสำคัญ (News & Announcements)
* **07_laws**: คลังข้อมูลกฎหมาย พรบ. และข้อบังคับวิชาชีพ (Laws & Regulations)
* **08_other-service**: บริการเสริมและระบบอื่น ๆ ที่เกี่ยวข้อง (Other Services)
* **09_contact**: ช่องทางการติดต่อแผนกต่าง ๆ และแบบฟอร์มสอบถามข้อมูล (Contact Us)

#### 🔑 2. พื้นที่เฉพาะสมาชิก (Member Area) - `app/(member)/`
* **01_member-home**: แดชบอร์ดแรกหลังเข้าสู่ระบบของเภสัชกร (Member Dashboard)
* **02_profile**: จัดการข้อมูลสมาชิกและข้อมูลการศึกษา/วิชาชีพ (Profile Management)
* **03_member-service**: ระบบ e-Service และประวัติการยื่นคำขอเฉพาะของสมาชิก (Member e-Services)
* **04_member-meeting**: ระบบจัดเก็บตั๋วเข้าร่วมงานประชุม และประวัติการยื่นบทคัดย่อ (My Meetings)
* **05_learning**: แหล่งเรียนรู้ คอร์สการศึกษาต่อเนื่องทางการแพทย์/เภสัชกรรม (E-Learning)
* **06_careers**: แหล่งค้นหาและลงประกาศตำแหน่งงานว่างสำหรับเภสัชกร (Careers Board)
* **07_tools**: เครื่องมือช่วยคำนวณและอำนวยความสะดวกในการทำงาน (Pharmacist Tools)
* **08_store**: ร้านขายหนังสือ ตำราวิชาการ และของที่ระลึกของสภา (Bookstore)

---

### การติดตั้งและการรันระบบ (Getting Started)

1. ติดตั้ง dependencies ของโปรเจกต์:
   ```bash
   npm install
   ```

2. รันเซิร์ฟเวอร์สำหรับทดสอบในเครื่องคอมพิวเตอร์ (Local Development):
   ```bash
   npm run dev
   ```
   จากนั้นเปิดเว็บเบราว์เซอร์ไปที่ [http://localhost:3000](http://localhost:3000)

3. ทดสอบการ Build และรันในโหมด Production:
   ```bash
   npm run build
   npm run start
   ```

---

### เทคโนโลยีหลักที่ใช้ (Tech Stack)
* **Framework**: Next.js v16.1.6 (App Router)
* **Core Library**: React v19.2.3
* **Styling**: Tailwind CSS v4 + `@tailwindcss/postcss`
* **Animations & Micro-interactions**: Framer Motion v12.38.0
* **API Client**: Axios (ต่อสายตรงไปยัง API Server ผ่าน Next.js Proxy/Redirects)
* **Design Pattern**: Pharmacy Design System (Tailwind CSS v4 custom theme)

---

## 🇺🇸 English Version

### Project Overview
The `01_pharmacy-web` is a modern, high-performance web portal built with Next.js (App Router) and React 19, designed around the core **Pharmacy Design System**.

It serves as the main gateway for the Pharmacy Council of Thailand, delivering public information, legislation database, and administrative services to the public, while offering a comprehensive dashboard (Member Area) for registered pharmacists to access personal profiles, continuing education courses, careers board, and online academic applications.

---

### Project Modules

The directory layout and structure inside `01_pharmacy-web/app/` are categorized by user accessibility:

#### 📢 1. Public Area - `app/(public)/`
* **01_home**: Landing page, banners, and featured announcements (Home)
* **02_about**: Council history, vision, organizational chart, and board members (About Us)
* **03_department**: Lists sub-divisions, colleges, and academic committees (Departments)
* **04_service**: General public requests and service registration forms (e-Services)
* **05_meeting**: Conference descriptions, session outlines, and registration info (Meetings & Seminars)
* **06_news**: Integrated news portal, procurement info, and public relations (News & Announcements)
* **07_laws**: Digital database for pharmaceutical acts, regulations, and bylaws (Laws & Regulations)
* **08_other-service**: Auxiliary tools, public forms, and directories (Other Services)
* **09_contact**: Contact forms, social links, and physical maps (Contact Us)

#### 🔑 2. Member Area - `app/(member)/`
* **01_member-home**: Main greeting panel and alerts for logged-in pharmacists (Member Dashboard)
* **02_profile**: Academic credentials, license status, and contact details (Profile Management)
* **03_member-service**: Request history and professional application submissions (Member e-Services)
* **04_member-meeting**: Ticket repository, QR check-ins, and academic abstract submissions (My Meetings)
* **05_learning**: Continuing pharmacy education courses (CPE) and webinars (E-Learning)
* **06_careers**: Job listing database and internship posts (Careers Board)
* **07_tools**: Pharmacokinetics tools, calculators, and guidelines (Pharmacist Tools)
* **08_store**: Educational literature, pharmacy guidelines, and official merchandise (Bookstore)

---

### Getting Started

1. Install project dependencies:
   ```bash
   npm install
   ```

2. Spin up the local development server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) on your browser.

3. Compile and launch in production mode:
   ```bash
   npm run build
   npm run start
   ```

---

### Tech Stack
* **Framework**: Next.js v16.1.6 (App Router)
* **Core Library**: React v19.2.3
* **Styling**: Tailwind CSS v4 + `@tailwindcss/postcss`
* **Animations & Micro-interactions**: Framer Motion v12.38.0
* **API Client**: Axios (communicating with the backend API via proxy)
* **Design Pattern**: Pharmacy Design System (Tailwind CSS v4 custom theme)
