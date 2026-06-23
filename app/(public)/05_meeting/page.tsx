"use client";

import React, { useState, Suspense } from "react";
import MeetingBanner from "@/components/public/05_meeting/MeetingBanner";
import RecommendedMeeting from "@/components/public/05_meeting/RecommendedMeeting";
import MeetingList, { StaticMeeting } from "@/components/public/05_meeting/MeetingList";
import MeetingPagination from "@/components/public/05_meeting/MeetingPagination";
import styles from "./meeting.module.css";
import { Search, ListFilter, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
        day: "20",
        month: "ม.ค.",
        title: "งานประชุมวิชาการประจำปีทางเภสัชกรรมชุมชน ครั้งที่ 15",
        location: "ห้องคอนเวนชันฮอลล์ โรงแรมรามาการ์เด้นส์ กรุงเทพมหานคร",
        date: "20 ม.ค. 2569 - 22 ม.ค. 2569",
        tags: ["เภสัชกร"],
        count: "80/120 คน",
        image: "/images/public/meeting/meeting4.jpg",
        cpe: "4.0",
        category: "เภสัชกรรมชุมชน"
    },
    {
        id: 5,
        day: "15",
        month: "ธ.ค.",
        title: "การบรรยายพิเศษ: กฎหมายและจริยธรรมในการประกอบวิชาชีพเภสัชกรรมยุคดิจิทัล",
        location: "ผ่านระบบออนไลน์ Zoom Meeting สภาเภสัชกรรม",
        date: "15 ธ.ค. 2568",
        tags: ["บุคคลทั่วไป", "เภสัชกร"],
        count: "95/100 คน",
        image: "/images/public/meeting/meeting5.jpg",
        cpe: "2.0",
        category: "กฎหมายและจริยธรรม"
    },
    {
        id: 6,
        day: "8",
        month: "พ.ย.",
        title: "การอบรมเชิงปฏิบัติการ: การบริบาลทางเภสัชกรรมในผู้ป่วยโรคเรื้อรัง",
        location: "ห้องประชุมใหญ่ คณะเภสัชศาสตร์ มหาวิทยาลัยมหิดล",
        date: "08 พ.ย. 2568 - 10 พ.ย. 2568",
        tags: ["เภสัชกร"],
        count: "12/50 คน",
        image: "/images/public/meeting/meeting1.jpg",
        cpe: "6.0",
        category: "การบริบาลเภสัชกรรม"
    },
    {
        id: 7,
        day: "18",
        month: "ต.ค.",
        title: "การประชุมวิชาการร่วมสถาบัน: เภสัชศาสตร์ก้าวไกลเพื่อสุขภาวะชุมชนที่ดีขึ้น",
        location: "ศูนย์การแสดงสินค้าและการประชุม อิมแพ็ค เมืองทองธานี",
        date: "18 ต.ค. 2568 - 20 ต.ค. 2568",
        tags: ["บุคคลทั่วไป", "เภสัชกร"],
        count: "150/200 คน",
        image: "/images/public/meeting/meeting2.jpg",
        cpe: "8.0",
        category: "เภสัชศาสตร์"
    },
    {
        id: 8,
        day: "5",
        month: "ก.ย.",
        title: "การอบรมออนไลน์: หลักเกณฑ์และวิธีการที่ดีในการผลิตยา (GMP) รุ่นที่ 10",
        location: "ผ่านระบบออนไลน์ Zoom Meeting",
        date: "05 ก.ย. 2568",
        tags: ["เภสัชกร"],
        count: "100/100 (เต็ม)",
        image: "/images/public/meeting/meeting3.jpg",
        cpe: "5.0",
        category: "อุตสาหกรรมยา"
    },
    {
        id: 9,
        day: "22",
        month: "ส.ค.",
        title: "สัมมนาเชิงปฏิบัติการ: นวัตกรรมสมุนไพรและการพัฒนาผลิตภัณฑ์สุขภาพชุมชน",
        location: "โรงแรมเซ็นทารา แกรนด์ ลาดพร้าว กรุงเทพฯ",
        date: "22 ส.ค. 2568 - 24 ส.ค. 2568",
        tags: ["บุคคลทั่วไป"],
        count: "30/80 คน",
        image: "/images/public/meeting/meeting4.jpg",
        cpe: "3.5",
        category: "สมุนไพร"
    },
    {
        id: 10,
        day: "12",
        month: "ก.ค.",
        title: "การประชุมวิชาการประจำปีสมาคมเภสัชกรรมโรงพยาบาลแห่งประเทศไทย",
        location: "ศูนย์ประชุมแห่งชาติสิริกิติ์ กรุงเทพฯ",
        date: "12 ก.ค. 2568 - 15 ก.ค. 2568",
        tags: ["เภสัชกร"],
        count: "250/300 คน",
        image: "/images/public/meeting/meeting5.jpg",
        cpe: "12.0",
        category: "เภสัชกรรมโรงพยาบาล"
    },
    {
        id: 11,
        day: "1",
        month: "มิ.ย.",
        title: "การฝึกอบรมระยะสั้น: เภสัชเคมีและการควบคุมคุณภาพผลิตภัณฑ์ยา",
        location: "ห้องแล็บปฏิบัติการ คณะเภสัชศาสตร์ จุฬาลงกรณ์มหาวิทยาลัย",
        date: "01 มิ.ย. 2568 - 05 มิ.ย. 2568",
        tags: ["เภสัชกร"],
        count: "15/40 คน",
        image: "/images/public/meeting/meeting1.jpg",
        cpe: "4.5",
        category: "ควบคุมคุณภาพ"
    },
    {
        id: 12,
        day: "15",
        month: "พ.ค.",
        title: "บทบาทเภสัชกรในการให้คำปรึกษาเรื่องกัญชาทางการแพทย์อย่างปลอดภัย",
        location: "ผ่านระบบออนไลน์ Zoom Meeting",
        date: "15 พ.ค. 2568",
        tags: ["บุคคลทั่วไป", "เภสัชกร"],
        count: "80/80 (เต็ม)",
        image: "/images/public/meeting/meeting2.jpg",
        cpe: "2.0",
        category: "กัญชาทางการแพทย์"
    }
];

const ITEMS_PER_PAGE = 4;

function PublicMeetingContent() {
    const [searchTerm, setSearchTerm] = useState("");
    const [inputValue, setInputValue] = useState("");
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    const handleSearchChange = (val: string) => {
        setInputValue(val);
        setSearchTerm(val);
        setCurrentPage(1);
    };

    const handleSearchSubmit = () => {
        setSearchTerm(inputValue);
        setCurrentPage(1);
    };

    const filteredMeetings = meetings.filter((item) =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.ceil(filteredMeetings.length / ITEMS_PER_PAGE);

    const paginatedMeetings = filteredMeetings.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    return (
        <div className={styles.pageWrapper}>
            <MeetingBanner />

            <div className={styles.container}>
                {/* Search Section */}
                <div className={styles.searchSection}>
                    <div className={styles.searchHeader}>
                        <h2 className={styles.searchTitle}>ค้นหาการประชุม</h2>
                        <span className={styles.searchSubtitle}>งานประชุมและอบรมสัมมนา</span>
                    </div>

                    <div className={styles.searchRow}>
                        {/* Dropdown */}
                        <div className={styles.dropdown}>
                            <button
                                type="button"
                                className={`${styles.dropdownButton} ThaiFont`}
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                            >
                                <ListFilter size={16} className={styles.dropdownIcon} />
                                <span>ชื่องานประชุม</span>
                                <ChevronDown size={16} className={styles.chevron} />
                            </button>
                            {dropdownOpen && (
                                <ul className={styles.dropdownMenu}>
                                    <li>
                                        <button
                                            type="button"
                                            className={`${styles.dropdownItem} ${styles.dropdownItemActive} ThaiFont`}
                                            onClick={() => setDropdownOpen(false)}
                                        >
                                            ชื่องานประชุม
                                        </button>
                                    </li>
                                </ul>
                            )}
                        </div>

                        {/* Search input */}
                        <div className={styles.inputWrap}>
                            <Search size={18} className={styles.inputIcon} />
                            <input
                                type="text"
                                className={`${styles.input} ThaiFont`}
                                placeholder="ค้นหาชื่องานประชุม..."
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleSearchSubmit()}
                            />
                        </div>

                        {/* Search button */}
                        <button
                            type="button"
                            className={`${styles.searchButton} ThaiFont`}
                            onClick={handleSearchSubmit}
                        >
                            ค้นหา
                        </button>
                    </div>
                </div>

                {searchTerm.trim() === "" && <RecommendedMeeting />}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentPage}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -15 }}
                        transition={{ duration: 0.2, ease: "easeInOut" }}
                    >
                        <MeetingList 
                            meetings={paginatedMeetings} 
                            searchTerm={searchTerm} 
                            onSearchChange={handleSearchChange} 
                        />
                    </motion.div>
                </AnimatePresence>
                <MeetingPagination 
                    currentPage={currentPage} 
                    totalPages={totalPages} 
                    onPageChange={setCurrentPage} 
                />
            </div>
        </div>
    );
}

export default function PublicMeetingPage() {
    return (
        <Suspense fallback={<div>กำลังโหลด...</div>}>
            <PublicMeetingContent />
        </Suspense>
    );
}