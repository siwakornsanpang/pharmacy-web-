"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Calendar, Users, ChevronLeft, ChevronRight } from "lucide-react";
import styles from "./RecommendedMeeting.module.css";
import { FaGraduationCap } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

interface RecommendedMeetingItem {
  id: number;
  title: string;
  location: string;
  date: string;
  count: string;
  image: string;
  cpe?: string;
}

const recommendedMeetings: RecommendedMeetingItem[] = [
  {
    id: 1,
    title: "สภาเภสัชกรรมเปิดอบรมหลักสูตรอบรมระยะสั้นการบริบาลทางเภสัชกรรม (สาขาปฐมภูมิ) รุ่นที่ 5",
    location: "ห้อง Sapphire 204-206 ศูนย์การประชุม อิมแพ็ค ฟอรั่ม เมืองทองธานี จังหวัดนนทบุรี",
    date: "02 พ.ค. 2569 - 13 ก.ย. 2569",
    count: "62/100 คน",
    image: "/images/public/meeting/meeting1.jpg",
    cpe: "10.0"
  },
  {
    id: 2,
    title: "Pharmacy Research and Innovation Summit 2025: (PRIS2025) Synergizing for the better future",
    location: "ห้อง Sapphire 204-206 ศูนย์การประชุม อิมแพ็ค ฟอรั่ม เมืองทองธานี จังหวัดนนทบุรี",
    date: "02 พ.ค. 2569 - 13 ก.ย. 2569",
    count: "45/100 คน",
    image: "/images/public/meeting/meeting2.jpg",
    cpe: "5.5"
  },
  {
    id: 3,
    title: "การฝึกอบรม ประกาศนียบัตรวิชาชีพเภสัชกรรม (สาขาบริหารจัดการผลิตภัณฑ์สมุนไพร) รุ่นที่ 3",
    location: "ห้อง Sapphire 204-206 ศูนย์การประชุม อิมแพ็ค ฟอรั่ม เมืองทองธานี จังหวัดนนทบุรี",
    date: "02 พ.ค. 2569 - 13 ก.ย. 2569",
    count: "100/100 (เต็ม)",
    image: "/images/public/meeting/meeting3.jpg",
    cpe: "3.0"
  }
];

export default function RecommendedMeeting() {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev === recommendedMeetings.length - 1 ? 0 : prev + 1));
    }, 5000); // auto slide every 5 seconds

    return () => clearInterval(timer);
  }, []);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? recommendedMeetings.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === recommendedMeetings.length - 1 ? 0 : prev + 1));
  };

  const current = recommendedMeetings[activeIndex];
  const isFull = current.count.includes("เต็ม");

  return (
    <section className={styles.recommendSection}>
      <div className={styles.sectionHeader}>
        <h2 className="ThaiFont">งานประชุมแนะนำ</h2>
        <div className={styles.sliderButtons}>
          <button className={styles.sliderBtn} onClick={handlePrev} aria-label="ก่อนหน้า">
            <ChevronLeft size={20} />
          </button>
          <button className={styles.sliderBtn} onClick={handleNext} aria-label="ถัดไป">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeIndex}
          initial={{ opacity: 0, x: 15 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -15 }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
          className={styles.recommendCard}
          onClick={() => router.push(`/meeting/${current.id}`)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && router.push(`/meeting/${current.id}`)}
          aria-label={`ดูรายละเอียด: ${current.title}`}
        >
          <img src={current.image} className={styles.recommendImage} alt={current.title} />
          <div className={styles.recommendContent}>
            <div className={styles.titleWrapper}>
              <h3 className="ThaiFont">{current.title}</h3>
              {current.cpe && (
                <div className={styles.cpeBadge}>
                  <FaGraduationCap className={styles.cpeIcon} />
                  <span>CPE {current.cpe} หน่วยกิต</span>
                </div>
              )}
            </div>

            <div className={styles.infoItem}>
              <MapPin size={20} className={styles.grayIcon} />
              <p className="ThaiFont">สถานที่ : {current.location}</p>
            </div>

            <div className={styles.infoItem}>
              <Calendar size={20} className={styles.grayIcon} />
              <p className="ThaiFont">วันที่จัดประชุม : {current.date}</p>
            </div>

            <div className={styles.recommendFooter}>
              <div className={styles.participantsInfo}>
                <div className={styles.infoItem}>
                  <Users size={20} className={styles.grayIcon} />
                  <span className="ThaiFont" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    รับสมัคร :
                    <span className={isFull ? styles.countFull : styles.countAvailable}>
                      {current.count}
                    </span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className={styles.sliderIndicators}>
        {recommendedMeetings.map((_, index) => (
          <span
            key={index}
            className={`${styles.dot} ${activeIndex === index ? styles.active : ""}`}
            onClick={() => setActiveIndex(index)}
            style={{ cursor: "pointer" }}
            role="button"
            aria-label={`ไปที่สไลด์ ${index + 1}`}
          ></span>
        ))}
      </div>
    </section>
  );
}
