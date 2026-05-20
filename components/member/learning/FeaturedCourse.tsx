"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Check, Star } from 'lucide-react';
import styles from './FeaturedCourse.module.css';
import SectionHeader from '@/components/ui/SectionHeader';

const MOCK_FEATURED = [
    {
        id: 1,
        title: "Pharmacotherapy in Geriatric Hypertension",
        description: "เรียนรู้แนวทางการจัดการยาและข้อควรระวังในการรักษาโรคความดันโลหิตสูงในกลุ่มผู้ป่วยสูงอายุ ตามแนวทางเวชปฏิบัติสากลล่าสุด เพื่อผลการรักษาที่มีประสิทธิภาพและปลอดภัยที่สุด",
        outcomes: [
            "แนวทางการเลือกใช้ยาความดันในผู้สูงอายุ",
            "การจัดการผลข้างเคียงและ Drug Interaction",
            "กรณีศึกษาการปรับเปลี่ยนยาในผู้ป่วยซับซ้อน",
            "แนวทางเวชปฏิบัติสากล Update 2024"
        ],
        author: "ภก. ดร. สมชาย รักดี",
        students: "1,245",
        rating: 4.8,
        image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=2070&auto=format&fit=crop"
    },
    {
        id: 2,
        title: "Modern Clinical Pharmacy in CKD Patients",
        description: "เจาะลึกบทบาทเภสัชกรคลินิกในการดูแลผู้ป่วยโรคไตเรื้อรัง ตั้งแต่การปรับขนาดยา การติดตามค่าไต และการให้คำแนะนำด้านโภชนาการที่เหมาะสม",
        outcomes: [
            "การคำนวณ GFR และการปรับ Dosage",
            "การจัดการภาวะแทรกซ้อนในผู้ป่วยฟอกไต",
            "ยาที่ควรหลีกเลี่ยงในผู้ป่วยโรคไต",
            "การดูแลแบบสหสาขาวิชาชีพ"
        ],
        author: "ภญ. วิภาวดี เรียนรู้",
        students: "850",
        rating: 4.9,
        image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=2080&auto=format&fit=crop"
    }
];

export default function FeaturedCourse() {
    const [currentIndex, setCurrentIndex] = useState(0);

    const handlePrev = () => {
        setCurrentIndex((prev) => (prev === 0 ? MOCK_FEATURED.length - 1 : prev - 1));
    };

    const handleNext = () => {
        setCurrentIndex((prev) => (prev === MOCK_FEATURED.length - 1 ? 0 : prev + 1));
    };

    const course = MOCK_FEATURED[currentIndex];

    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <SectionHeader 
                    title="คอร์สเรียนแนะนำ" 
                    viewAllHref="/learning/courses" 
                    viewAllText="ดูทั้งหมด"
                />

                <div className={styles.cardWrapper}>
                    <div className={styles.card}>
                        {/* Navigation Buttons inside Card */}
                        <button onClick={handlePrev} className={`${styles.navBtn} ${styles.prevBtn}`}>
                            <ChevronLeft size={24} />
                        </button>
                        <button onClick={handleNext} className={`${styles.navBtn} ${styles.nextBtn}`}>
                            <ChevronRight size={24} />
                        </button>
                        <div className={styles.imageSide}>
                            <Image 
                                src={course.image} 
                                alt={course.title} 
                                fill 
                                className={styles.image} 
                                priority
                            />
                        </div>
                        
                        <div className={styles.contentSide}>
                            <div className={styles.topInfo}>
                                <h2 className={styles.title}>{course.title}</h2>
                                <p className={styles.description}>{course.description}</p>
                            </div>

                            <div className={styles.outcomesSection}>
                                <h4 className={styles.subTitle}>สิ่งที่จะได้เรียนรู้</h4>
                                <ul className={styles.outcomesList}>
                                    {course.outcomes.map((item, idx) => (
                                        <li key={idx} className={styles.outcomeItem}>
                                            <Check size={16} className={styles.checkIcon} />
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <button className={styles.enrollBtn}>เข้าสู่บทเรียน</button>

                            <div className={styles.footer}>
                                <div className={styles.footerItem}>
                                    <span className={styles.footerLabel}>ผู้สอน</span>
                                    <span className={styles.footerValue}>{course.author}</span>
                                </div>
                                <div className={styles.footerItem}>
                                    <span className={styles.footerLabel}>ผู้เข้าเรียน</span>
                                    <span className={styles.footerValue}>{course.students} คน</span>
                                </div>
                                <div className={styles.footerItem}>
                                    <span className={styles.footerLabel}>คะแนนรีวิว</span>
                                    <div className={styles.ratingBox}>
                                        <div className={styles.stars}>
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} size={14} fill={i < 4 ? "#f6c23e" : "transparent"} color="#f6c23e" />
                                            ))}
                                        </div>
                                        <span className={styles.footerValue}>{course.rating}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
