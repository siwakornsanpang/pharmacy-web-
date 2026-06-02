"use client";

import { useRouter } from "next/navigation";
import { MapPin, Calendar, Users, ChevronLeft, ChevronRight } from "lucide-react";
import styles from "./RecommendedMeeting.module.css";
import { FaGraduationCap } from "react-icons/fa";

export default function RecommendedMeeting() {
  const router = useRouter();

  return (
    <section className={styles.recommendSection}>
      <div className={styles.sectionHeader}>
        <h2 className="ThaiFont">งานประชุมแนะนำ</h2>
        <div className={styles.sliderButtons}>
          <button className={styles.sliderBtn}>
            <ChevronLeft size={20} />
          </button>
          <button className={styles.sliderBtn}>
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div
        className={styles.recommendCard}
        onClick={() => router.push("/meeting/1")}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && router.push("/meeting/1")}
        aria-label="ดูรายละเอียดงานประชุมแนะนำ"
      >
        <img src="/images/public/meeting/meeting1.jpg" className={styles.recommendImage} alt="Meeting preview" />
        <div className={styles.recommendContent}>
          <div className={styles.titleWrapper}>
            <h3 className="ThaiFont">
              สภาเภสัชกรรมเปิดอบรมหลักสูตรอบรมระยะสั้นการบริบาลทาง เภสัชกรรม (สาขาปฐมภูมิ) รุ่นที่ 5
            </h3>
            <div className={styles.cpeBadge}>
              <FaGraduationCap className={styles.cpeIcon} />
              <span>CPE 10.0 หน่วยกิต</span>
            </div>
          </div>

          <div className={styles.infoItem}>
            <MapPin size={20} className={styles.grayIcon} />
            <p className="ThaiFont">
              สถานที่ : ห้อง Sapphire 204-206 ศูนย์การประชุม อิมแพ็ค ฟอรั่ม เมืองทองธานี จังหวัดนนทบุรี
            </p>
          </div>

          <div className={styles.infoItem}>
            <Calendar size={20} className={styles.grayIcon} />
            <p className="ThaiFont">วันที่จัดประชุม : 02 พ.ค. 2569 - 13 ก.ย. 2569</p>
          </div>

          <div className={styles.recommendFooter}>
            <div className={styles.participantsInfo}>
              <div className={styles.infoItem}>
                <Users size={20} className={styles.grayIcon} />
                <span className="ThaiFont" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  รับสมัคร :
                  <span className={styles.countAvailable}>62/100 คน</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.sliderIndicators}>
        <span className={`${styles.dot} ${styles.active}`}></span>
        <span className={styles.dot}></span>
        <span className={styles.dot}></span>
        <span className={styles.dot}></span>
        <span className={styles.dot}></span>
        <span className={styles.dot}></span>
      </div>
    </section>
  );
}
