"use client";

import React, { useState, Suspense } from "react";
import MeetingBanner from "@/components/public/05_meeting/MeetingBanner";
import RecommendedMeeting from "@/components/public/05_meeting/RecommendedMeeting";
import MeetingList, { StaticMeeting } from "@/components/public/05_meeting/MeetingList";
import MeetingPagination from "@/components/public/05_meeting/MeetingPagination";
import styles from "./meeting.module.css";
import { Search } from "lucide-react";

const meetings: StaticMeeting[] = [
    {
        id: 1,
        day: "2",
        month: "พ.ค.",
        title: "สภาเภสัชกรรมเปิดอบรมหลักสูตรอบรมระยะสั้นการบริบาลทางเภสัชกรรม (สาขาปฐมภูมิ) รุ่นที่ 5",
        location: "ห้อง Sapphire 204-206 ศูนย์การประชุม อิมแพ็ค ฟอรั่ม เมืองทองธานี จังหวัดนนทบุรี",
        date: "02 พ.ค. 2569 - 13 ก.ย. 2569",
        tags: ["บุคคลทั่วไป", "เภสัชกร"],
        count: "62/100 คน",
        image: "/images/public/meeting/meeting1.jpg",
        cpe: "10.0",
        category: "การบริบาลเภสัชกรรม"
    },
    {
        id: 2,
        day: "1",
        month: "มี.ค.",
        title: "Pharmacy Research and Innovation Summit 2025: (PRIS2025) Synergizing for the better future",
        location: "ห้อง Sapphire 204-206 ศูนย์การประชุม อิมแพ็ค ฟอรั่ม เมืองทองธานี จังหวัดนนทบุรี",
        date: "02 พ.ค. 2569 - 13 ก.ย. 2569",
        tags: ["เภสัชกร"],
        count: "45/100 คน",
        image: "/images/public/meeting/meeting2.jpg",
        cpe: "5.5",
        category: "วิจัยและนวัตกรรม"
    },
    {
        id: 3,
        day: "13",
        month: "ก.พ.",
        title: "การฝึกอบรม ประกาศนียบัตรวิชาชีพเภสัชกรรม (สาขาบริหารจัดการผลิตภัณฑ์สมุนไพร) รุ่นที่ 3",
        location: "ห้อง Sapphire 204-206 ศูนย์การประชุม อิมแพ็ค ฟอรั่ม เมืองทองธานี จังหวัดนนทบุรี",
        date: "02 พ.ค. 2569 - 13 ก.ย. 2569",
        tags: ["บุคคลทั่วไป"],
        count: "100/100 (เต็ม)",
        image: "/images/public/meeting/meeting3.jpg",
        cpe: "3.0",
        category: "สมุนไพร"
    },
    {
        id: 4,
        day: "1",
        month: "มี.ค.",
        title: "Pharmacy Research and Innovation Summit 2025: (PRIS2025) Synergizing for the better future",
        location: "ห้อง Sapphire 204-206 ศูนย์การประชุม อิมแพ็ค ฟอรั่ม เมืองทองธานี จังหวัดนนทบุรี",
        date: "02 พ.ค. 2569 - 13 ก.ย. 2569",
        tags: ["บุคคลทั่วไป", "เภสัชกร"],
        count: "80/100 คน",
        image: "/images/public/meeting/meeting4.jpg",
        status: "past",
        cpe: "2.0",
        category: "วิจัยและนวัตกรรม"
    },
    {
        id: 5,
        day: "13",
        month: "ก.พ.",
        title: "การฝึกอบรม ประกาศนียบัตรวิชาชีพเภสัชกรรม (สาขาบริหารจัดการผลิตภัณฑ์สมุนไพร) รุ่นที่ 3",
        location: "ห้อง Sapphire 204-206 ศูนย์การประชุม อิมแพ็ค ฟอรั่ม เมืองทองธานี จังหวัดนนทบุรี",
        date: "02 พ.ค. 2569 - 13 ก.ย. 2569",
        tags: ["บุคคลทั่วไป", "เภสัชกร"],
        count: "95/100 คน",
        image: "/images/public/meeting/meeting5.jpg",
        status: "past",
        cpe: "10.0",
        category: "สมุนไพร"
    },
];

function MemberMeetingContent() {
    const [searchTerm, setSearchTerm] = useState("");

    return (
        <div className={styles.pageWrapper}>
            <MeetingBanner />

            <div className={styles.container}>
                {/* Search box — above Recommended section */}
                <div className={styles.searchSection}>
                    <div className={styles.searchInputWrapper}>
                        <Search size={20} className={styles.searchIcon} />
                        <input
                            type="text"
                            placeholder="ค้นหาตามชื่อการประชุม..."
                            value={searchTerm}
                            className={`${styles.searchInput} ThaiFont`}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <RecommendedMeeting />
                <MeetingList meetings={meetings} searchTerm={searchTerm} onSearchChange={setSearchTerm} />
                <MeetingPagination />
            </div>
        </div>
    );
}

export default function MemberMeetingPage() {
    return (
        <Suspense fallback={<div>กำลังโหลด...</div>}>
            <MemberMeetingContent />
        </Suspense>
    );
}
