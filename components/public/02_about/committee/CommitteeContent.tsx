"use client";

import { useEffect, useMemo, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectCoverflow, Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/navigation";

import styles from "./CommitteeContent.module.css";

type CouncilMember = {
    id: number;
    prefix: string;
    name: string;
    position: string;
    type: string;
    imageUrl: string;
    originalImageUrl?: string;
    order: number;
    background?: string;
};

const API_URL = "https://pharmacy-api-6w5d.onrender.com/council";

export default function CommitteeContent() {
    const [members, setMembers] = useState<CouncilMember[]>([]);
    const [selected, setSelected] = useState<CouncilMember | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function getCouncil() {
            try {
                const res = await fetch(API_URL, { cache: "no-store" });
                const data: CouncilMember[] = await res.json();

                setMembers(data);
            } catch (error) {
                console.error("Failed to fetch council:", error);
            } finally {
                setLoading(false);
            }
        }

        getCouncil();
    }, []);

    const { appointed, elected } = useMemo(() => {
        const raw = [...members];

        const appointedByType = raw
            .filter((item) => item.type?.trim().toLowerCase() === "appointed")
            .sort((a, b) => a.order - b.order);

        const electedByType = raw
            .filter((item) => item.type?.trim().toLowerCase() === "elected")
            .sort((a, b) => a.order - b.order);

        // ใช้ type เป็นหลัก
        if (appointedByType.length > 0 && electedByType.length > 0) {
            return {
                appointed: appointedByType.slice(0, 12),
                elected: electedByType.slice(0, 12),
            };
        }

        // fallback: ถ้า type ไม่ครบ ให้แยกตามลำดับข้อมูลจาก API
        return {
            appointed: raw.slice(0, 12),
            elected: raw.slice(12, 24),
        };
    }, [members]);

    if (loading) {
        return (
            <section className={styles.wrapper}>
                <div className={styles.loading}>กำลังโหลดข้อมูลกรรมการ...</div>
            </section>
        );
    }

    return (
        <section className={styles.wrapper}>
            <CommitteeCarousel
                title="กรรมการแต่งตั้งสภา"
                members={appointed}
                typeLabel="แต่งตั้ง"
                onSelect={setSelected}
            />

            <CommitteeCarousel
                title="กรรมการเลือกตั้งสภา"
                members={elected}
                typeLabel="เลือกตั้ง"
                onSelect={setSelected}
                reverse
            />

            {selected && (
                <div className={styles.modalOverlay} onClick={() => setSelected(null)}>
                    <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                        <button
                            className={styles.closeButton}
                            onClick={() => setSelected(null)}
                            aria-label="ปิด"
                        >
                            ×
                        </button>

                        <div className={styles.modalImageBox}>
                            <img
                                src={selected.originalImageUrl || selected.imageUrl}
                                alt={`${selected.prefix}${selected.name}`}
                            />
                        </div>

                        <div className={styles.modalContent}>
                            <span className={styles.modalBadge}>
                                {selected.type === "appointed" ? "แต่งตั้งสภา" : "เลือกตั้งสภา"}
                            </span>

                            <h3>
                                {selected.prefix}
                                {selected.name}
                            </h3>

                            <p className={styles.modalPosition}>{selected.position}</p>

                            <div className={styles.modalBio}>
                                <h4>ประวัติส่วนตัว</h4>
                                <p>
                                    {selected.background && selected.background !== "-"
                                        ? selected.background
                                        : "ยังไม่มีข้อมูลประวัติส่วนตัว"}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}

function CommitteeCarousel({
    title,
    members,
    typeLabel,
    onSelect,
    reverse = false,
}: {
    title: string;
    members: CouncilMember[];
    typeLabel: string;
    onSelect: (member: CouncilMember) => void;
    reverse?: boolean;
}) {
    if (members.length === 0) return null;

    return (
        <div className={styles.carouselSection}>
            <div className={styles.sectionHead}>
                <h3>{title}</h3>
                <span>{members.length} ท่าน</span>
            </div>

            <Swiper
                modules={[Autoplay, EffectCoverflow, Navigation]}
                effect="coverflow"
                centeredSlides
                loop={false}
                rewind
                grabCursor
                navigation
                speed={900}
                slidesPerView={5}
                spaceBetween={34}
                coverflowEffect={{
                    rotate: 0,
                    stretch: 0,
                    depth: 130,
                    modifier: 1.8,
                    slideShadows: false,
                }}
                autoplay={{
                    delay: 2800,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: true,
                    reverseDirection: reverse,
                }}
                breakpoints={{
                    0: { slidesPerView: 1.2, spaceBetween: 16 },
                    640: { slidesPerView: 2.3, spaceBetween: 20 },
                    1024: { slidesPerView: 3.5, spaceBetween: 26 },
                    1280: { slidesPerView: 5, spaceBetween: 34 },
                }}
                className={styles.swiper}
            >
                {members.map((member) => (
                    <SwiperSlide
                        key={`${typeLabel}-${member.id}`}
                        className={styles.slide}
                    >
                        <article className={styles.card}>
                            <span className={styles.order}>#{member.order}</span>

                            <div className={styles.imageBox}>
                                <img
                                    src={member.imageUrl}
                                    alt={`${member.prefix}${member.name}`}
                                />
                            </div>

                            <div className={styles.cardContent}>
                                <span className={styles.typeBadge}>{typeLabel}</span>

                                <h4>
                                    {member.prefix}
                                    {member.name}
                                </h4>

                                <p className={styles.position}>{member.position}</p>


                                <button
                                    type="button"
                                    className={styles.moreButton}
                                    onClick={() => onSelect(member)}
                                >
                                    ดูประวัติ
                                </button>
                            </div>
                        </article>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
}