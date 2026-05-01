"use client";

import React from "react";
import Link from "next/link";
import styles from "./PolicyContent.module.css";

interface Project {
    id: string;
    name: string;
    summaryUrl: string;
    status: "planned" | "ongoing" | "completed" | "delayed" | "terminated";
}

interface PolicyCategory {
    id: string;
    title: string;
    projects: Project[];
}

const POLICY_DATA: PolicyCategory[] = [
    // --- NEXT GENERATION ---
    {
        id: "p1",
        title: "จัดตั้ง Young Pharmacist Council",
        projects: [
            {
                id: "p1-1",
                name: "สร้าง Platform การทำงานระหว่างคนรุ่นใหม่กับคนรุ่นใหญ่",
                summaryUrl: "#",
                status: "ongoing",
            },
            {
                id: "p1-2",
                name: "จัดการเลือกตั้งสำหรับเภสัชกรรุ่นใหม่เพื่อเข้าร่วมทำงานกับสภาฯ",
                summaryUrl: "#",
                status: "delayed",
            },
            {
                id: "p1-3",
                name: "เป็นสภาฯของคนทุกรุ่น สร้างความเข้มแข็งให้สภาวันนี้ และเตรียมพร้อมสำหรับเภสัชกรรุ่นถัดไป",
                summaryUrl: "#",
                status: "ongoing",
            },
        ],
    },
    {
        id: "p2",
        title: "ยกระดับวิชาชีพชั้นนำและทัดเทียม",
        projects: [
            {
                id: "p2-1",
                name: "ตั้งทีมที่ปรึกษาและสนับสนุนการทำผลงานชำนาญการพิเศษเลื่อนไหลระดับเขต และระดับจังหวัด",
                summaryUrl: "#",
                status: "planned",
            },
            {
                id: "p2-2",
                name: "จัดหลักสูตรอบรมผู้บริหารให้กับเภสัชกรทุกสาขาทั้งภาครัฐและเอกชน เพื่อผลักดันเภสัชกรให้เข้าสู่ตำแหน่งผู้บริหารมากขึ้น",
                summaryUrl: "#",
                status: "terminated",
            },
            {
                id: "p2-3",
                name: "เพิ่มอัตรากำลังและค่าตอบแทนเทียบเท่าวิชาชีพที่เรียน 6 ปี ผ่านการประเมินด้วย Pharmacy Coding",
                summaryUrl: "#",
                status: "planned",
            },
        ],
    },
    {
        id: "p3",
        title: "สร้างความเชี่ยวชาญคู่ขนาน",
        projects: [
            {
                id: "p3-1",
                name: "สนับสนุนการจัดทำหลักสูตรคู่ขนาน (Phi Shape) 6 ปี เช่น ภ.บ. + MBA หรือ ภ.บ. + AI",
                summaryUrl: "#",
                status: "ongoing",
            },
            {
                id: "p3-2",
                name: "จัดทำหลักสูตรเพิ่มความเชี่ยวชาญผ่านวิทยาลัยต่างๆของสภาเภสัชกรรม",
                summaryUrl: "#",
                status: "delayed",
            },
            {
                id: "p3-3",
                name: "ปรับเปลี่ยนวิธีการเรียนในหลักสูตรผู้เชี่ยวชาญให้เข้าถึงได้ทุกที่ทุกเวลา ผ่านระบบ Learning Management System (LMS) ของสภาเภสัชกรรม",
                summaryUrl: "#",
                status: "completed",
            },
        ],
    },
    // --- NEXT INNOVATION ---
    {
        id: "p4",
        title: "ลดภาระงาน คืนเวลาให้เภสัชกร",
        projects: [
            {
                id: "p4-1",
                name: "สนับสนุนและผลักดันการนำเทคโนโลยี Robotic Processing Automation (RPA) หรือการนำเทคโนโลยีใหม่เข้ามาใช้ในวงการเภสัชกรรม",
                summaryUrl: "#",
                status: "ongoing",
            },
            {
                id: "p4-2",
                name: "พัฒนาแพลตฟอร์มเพื่อวิชาชีพและประชาชน เช่น Telepharmacy เชื่อมต่อกับหน่วยงานภาครัฐและเอกชน พร้อมวางโครงสร้าง IT Infrastructure เตรียมพร้อมสำหรับโครงการอื่นๆ",
                summaryUrl: "#",
                status: "ongoing",
            },
            {
                id: "p4-3",
                name: "สร้างและสนับสนุนเภสัชกรที่สนใจสาย Technology เปิดโอกาสให้มีส่วนร่วมในการพัฒนานวัตกรรมเพื่อวิชาชีพไปด้วยกัน",
                summaryUrl: "#",
                status: "planned",
            },
        ],
    },
    {
        id: "p5",
        title: "เพิ่มศักยภาพและความสามารถของร้านยา",
        projects: [
            {
                id: "p5-1",
                name: "Modern Drug Store เชื่อมต่อกับระบบ Telepharmacy สร้างงานบริการที่ทันสมัย รวดเร็ว และแจกชุดทดสอบ Self Test เช่น HIV หรือการตรวจยืนยันยา",
                summaryUrl: "#",
                status: "ongoing",
            },
            {
                id: "p5-2",
                name: "Telepharmacy เชื่อมต่อกับ Internet of Medical Thing (IoMT) เพื่อติดตามอาการของโรค คนไข้ได้รับการดูแลจากเภสัชกรอย่างต่อเนื่อง",
                summaryUrl: "#",
                status: "planned",
            },
            {
                id: "p5-3",
                name: "Specialty Drug Store ส่งเสริมการฝึกอบรม \"ร้านยาเชี่ยวชาญเฉพาะโรค\" เช่น ร้านยาเชี่ยวชาญโรคหืดหรือร้านยาเชี่ยวชาญพันธุศาสตร์",
                summaryUrl: "#",
                status: "planned",
            },
        ],
    },
    {
        id: "p6",
        title: "ส่งเสริมการเรียนรู้และนวัตกรรมเพื่อวิชาชีพ",
        projects: [
            {
                id: "p6-1",
                name: "พัฒนานวัตกรรมบริการสุขภาพและการแพทย์ก้าวหน้า เพิ่มขีดความสามารถของเภสัชกร เช่น การตรวจเภสัชพันธุศาสตร์ในร้านยา",
                summaryUrl: "#",
                status: "ongoing",
            },
            {
                id: "p6-2",
                name: "พัฒนาทักษะผ่านหลักสูตรการฝึกปฏิบัติการของสภาฯ และวิทยาลัยต่างๆ โดยสะสมหน่วยกิตด้วยระบบธนาคารเครดิต (Credit Bank)",
                summaryUrl: "#",
                status: "ongoing",
            },
            {
                id: "p6-3",
                name: "พัฒนาเทคโนโลยีหรือนวัตกรรมบริการสุขภาพของเภสัชกรในการดูแลสุขภาพของประชาชนด้วยระบบเครือข่ายสหวิชาชีพและเครือข่ายระหว่างภาครัฐและภาคเอกชน",
                summaryUrl: "#",
                status: "planned",
            },
        ],
    },
    // --- NEXT SOCIETY ---
    {
        id: "p7",
        title: "สร้างสภาโปร่งใส มีส่วนร่วมและเท่าเทียม",
        projects: [
            {
                id: "p7-1",
                name: "ถ่ายทอดการประชุมกรรมการสภา Live ให้สมาชิกมีส่วนร่วม",
                summaryUrl: "#",
                status: "completed",
            },
            {
                id: "p7-2",
                name: "ปฏิรูปแนวปฏิบัติเรื่องความหลากหลายทางด้านต่างๆ เช่น เพศวิถี วัย ศาสนา ความเชี่ยวชาญ ในการทำงานของสภา",
                summaryUrl: "#",
                status: "ongoing",
            },
            {
                id: "p7-3",
                name: "สมาชิกทุกคนมีเสรีภาพในการแสดงความคิดเห็น ทุกความแตกต่างได้รับการยอมรับ",
                summaryUrl: "#",
                status: "ongoing",
            },
        ],
    },
    {
        id: "p8",
        title: "จัดตั้ง Pharmacy Influencer Academy",
        projects: [
            {
                id: "p8-1",
                name: "สร้างนักสื่อสารข้อมูลด้านยาและสุขภาพสู่ประชาชนอย่างมีจรรยาบรรณ สร้างสรรค์ ไม่ผิดกฎหมายและส่งเสริมภาพลักษณ์ที่ดีของวิชาชีพ",
                summaryUrl: "#",
                status: "ongoing",
            },
            {
                id: "p8-2",
                name: "ส่งเสริมเภสัชกร Influencer ประจำภาค เช่น เภสัชกรว่าวลาว เภสัชอู้เมือง เภสัชแหลงใต้ กลุ่มเฉพาะ LGBTQIA2S+ เพื่อการเข้าถึงข้อมูลของประชาชนทุกกลุ่ม",
                summaryUrl: "#",
                status: "planned",
            },
            {
                id: "p8-3",
                name: "มีคณะของสภาฯ คอยสนับสนุน จัดอบรม และสร้างมาตรฐานปฏิบัติ",
                summaryUrl: "#",
                status: "planned",
            },
        ],
    },
    {
        id: "p9",
        title: "ส่งเสริม Pharmacy Anywhere",
        projects: [
            {
                id: "p9-1",
                name: "สนับสนุนให้เภสัชกรใช้ Telepharmacy เป็นช่องทางให้ข้อมูลยาที่ถูกต้อง พร้อมดูแลสุขภาพประชาชนได้จากทุกที่ ทุกเวลา",
                summaryUrl: "#",
                status: "ongoing",
            },
            {
                id: "p9-2",
                name: "ผลักดันให้ร้านยาทุกที่ต้องมีเภสัชกรให้คำปรึกษาและจ่ายยา เพื่อให้ประชาชนเข้าใจการใช้ยาที่ถูกต้องและปลอดภัย",
                summaryUrl: "#",
                status: "ongoing",
            },
            {
                id: "p9-3",
                name: "ส่งเสริมให้เภสัชกรทุกสาขามีบทบาทต่อสังคม เมื่อนึกถึงเรื่องยาต้องนึกถึงเภสัชกร",
                summaryUrl: "#",
                status: "ongoing",
            },
        ],
    },
];

export default function PolicyContent() {
    const renderStatus = (status: string, targetStatus: string) => {
        const isActive = status === targetStatus;
        
        let activeClass = styles.progressStepActiveGreen;
        if (targetStatus === "delayed") activeClass = styles.progressStepActiveYellow;
        if (targetStatus === "terminated") activeClass = styles.progressStepActiveRed;

        return (
            <td className={styles.statusCell}>
                <div className={styles.progressBarContainer}>
                    <div className={`${styles.progressStep} ${isActive ? activeClass : ""}`} />
                </div>
            </td>
        );
    };

    return (
        <div className="ThaiFont">
            <div className={styles.policyContainer}>
                <table className={styles.policyTable}>
                    <thead>
                        <tr>
                            <th>นโยบายสภาเภสัชกรรม</th>
                            <th>สรุป</th>
                            <th>เริ่มวางแผน</th>
                            <th>กำลังดำเนินการ</th>
                            <th>เสร็จโครงการ</th>
                            <th>ชะลอโครงการ</th>
                            <th>ยุติโครงการ</th>
                        </tr>
                    </thead>
                    <tbody>
                        {POLICY_DATA.map((category) => (
                            <React.Fragment key={category.id}>
                                <tr className={styles.categoryRow}>
                                    <td colSpan={7} className={styles.categoryTitle}>
                                        {category.title}
                                    </td>
                                </tr>
                                {category.projects.map((project) => (
                                    <tr key={project.id}>
                                        <td className={styles.projectName}>
                                            {project.name}
                                        </td>
                                        <td className={styles.summaryCell}>
                                            <Link href={project.summaryUrl} className={styles.downloadButton}>
                                                อ่านสรุป
                                            </Link>
                                        </td>
                                        {renderStatus(project.status, "planned")}
                                        {renderStatus(project.status, "ongoing")}
                                        {renderStatus(project.status, "completed")}
                                        {renderStatus(project.status, "delayed")}
                                        {renderStatus(project.status, "terminated")}
                                    </tr>
                                ))}
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
