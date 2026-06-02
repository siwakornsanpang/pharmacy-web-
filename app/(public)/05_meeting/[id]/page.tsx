"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import styles from "./meetingDetail.module.css";

export default function MeetingDetailPage() {
    const router = useRouter();

    const handleBack = () => {
        const isLoggedIn = typeof document !== "undefined" && document.cookie.includes("isLoggedIn=true");
        router.push(isLoggedIn ? "/member-meeting" : "/meeting");
    };

    return (
        <div className={styles.pageWrapper}>
            {/* Banner */}
            <div className={styles.banner}>
                <div className={styles.bannerOverlay}>
                    <button onClick={handleBack} className={styles.backBtn}>
                        <ChevronLeft size={20} />
                        <span>กลับสู่หน้าหลัก</span>
                    </button>
                    <div className={styles.bannerContent}>
                        <h1 className={`${styles.bannerTitle} ThaiFont`}>รายละเอียดงานประชุม</h1>
                        <p className={`${styles.bannerSubtitle} ThaiFont`}>
                            ข้อมูลงานประชุมและการลงทะเบียน
                        </p>
                    </div>
                </div>
            </div>

            {/* Content placeholder */}
            <div className={styles.container}>
                <div className={styles.placeholder}>
                    <p className="ThaiFont">เนื้อหาจะถูกเพิ่มในภายหลัง</p>
                </div>
            </div>
        </div>
    );
}
