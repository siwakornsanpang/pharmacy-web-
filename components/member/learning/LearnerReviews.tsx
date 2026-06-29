"use client";

import React from 'react';
import Image from 'next/image';
import { Quote, Star } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import styles from './LearnerReviews.module.css';
import SectionHeader from '@/components/ui/SectionHeader';

const MOCK_REVIEWS = [
    {
        id: 1,
        name: "ภก. ธนภัทร ใจดี",
        role: "เภสัชกรโรงพยาบาล",
        image: "/images/public/learning/reviews/review1.png",
        comment: "คอร์สเรียนเนื้อหาดีมากครับ เข้าใจง่าย นำไปประยุกต์ใช้ในการปฏิบัติงานได้จริง ช่วยให้อัปเดตความรู้ใหม่ๆ ได้สะดวกมาก",
        rating: 5,
        courseName: "Pharmacotherapy in Elderly"
    },
    {
        id: 2,
        name: "ภญ. วิมล เรียนรู้",
        role: "เภสัชกรชุมชน",
        image: "/images/public/learning/reviews/review2.png",
        comment: "สะดวกมากค่ะ เรียนที่ไหนเมื่อไหร่ก็ได้ ระบบเสถียรและใช้งานง่ายมาก ช่วยให้เก็บหน่วยกิต CPE ได้ครบตามกำหนดโดยไม่ต้องเดินทาง",
        rating: 5,
        courseName: "Community Pharmacy Management"
    },
    {
        id: 3,
        name: "ภก. ดร. สิทธิชัย ก้าวหน้า",
        role: "อาจารย์เภสัชกร",
        image: "/images/public/learning/reviews/review3.png",
        comment: "ประทับใจวิทยากรทุกท่านเลยค่ะ อธิบายได้ละเอียดและชัดเจนมาก เป็นแพลตฟอร์มการเรียนรู้ที่มีคุณภาพสูงมากจริงๆ",
        rating: 4,
        courseName: "Advanced Pharmaceutical Care"
    },
    {
        id: 4,
        name: "ภญ. นภัสสร จิตรอารีย์",
        role: "เภสัชกรคลินิก",
        image: "/images/public/learning/reviews/review1.png",
        comment: "ระบบดีมากค่ะ คอร์สเรียนก็อัปเดตตลอดเวลา ทำให้ไม่ต้องกังวลเรื่องการตามเทรนด์ใหม่ๆ ไม่ทัน",
        rating: 5,
        courseName: "Clinical Pharmacy Updates"
    }
];

export default function LearnerReviews() {
    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <SectionHeader 
                    title="รีวิวจากผู้เรียน" 
                />

                <div className={styles.sliderContainer}>
                    <Swiper
                        modules={[Navigation, Pagination]}
                        spaceBetween={24}
                        slidesPerView={1}
                        navigation
                        pagination={{ clickable: true }}
                        breakpoints={{
                            768: { slidesPerView: 2 },
                            1024: { slidesPerView: 3 }
                        }}
                        className={styles.swiper}
                    >
                        {MOCK_REVIEWS.map((review) => (
                            <SwiperSlide key={review.id} style={{ height: 'auto' }}>
                                <div className={styles.card}>
                                    <div className={styles.quoteWatermark}>
                                        <Quote size={80} fill="var(--primary-olive)" />
                                    </div>
                                    <div className={styles.rating}>
                                        {[...Array(5)].map((_, i) => (
                                            <Star 
                                                key={i} 
                                                size={16} 
                                                fill={i < review.rating ? "#FFB800" : "none"} 
                                                color={i < review.rating ? "#FFB800" : "#E5E7EB"} 
                                            />
                                        ))}
                                    </div>
                                    <p className={styles.comment}>"{review.comment}"</p>
                                    <div className={styles.courseBadge}>
                                        <span className={styles.courseLabel}>คอร์สเรียน:</span>
                                        <span className={styles.courseName}>{review.courseName}</span>
                                    </div>
                                    <div className={styles.footer}>
                                        <div className={styles.avatarWrapper}>
                                            <Image 
                                                src={review.image} 
                                                alt={review.name} 
                                                width={50} 
                                                height={50} 
                                                className={styles.avatar}
                                            />
                                        </div>
                                        <div className={styles.info}>
                                            <h4 className={styles.name}>{review.name}</h4>
                                            <p className={styles.role}>{review.role}</p>
                                        </div>
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </div>
        </section>
    );
}
