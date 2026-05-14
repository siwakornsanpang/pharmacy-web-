"use client";

import { useEffect, useMemo, useState } from "react";
import styles from "./CommitteeContent.module.css";

export type CouncilMember = {
    id: number;
    prefix: string;
    name: string;
    position: string;
    type?: string;
    imageUrl: string;
    originalImageUrl?: string;
    order: number;
    background?: string;
};

interface CommitteeContentProps {
    initialMembers?: CouncilMember[];
}

const API_URL = "/api/proxy";

export default function CommitteeContent({ initialMembers = [] }: CommitteeContentProps) {
    const [members, setMembers] = useState<CouncilMember[]>(initialMembers);
    const [selected, setSelected] = useState<CouncilMember | null>(null);
    const [loading, setLoading] = useState(initialMembers.length === 0);

    useEffect(() => {
        if (initialMembers.length > 0) {
            setLoading(false);
            return;
        }

        async function getCouncil() {
            try {
                setLoading(true);

                const cleanApiUrl = API_URL.replace(/\/$/, "");

                const res = await fetch(`${cleanApiUrl}/council`, {
                    cache: "no-store",
                });

                if (!res.ok) {
                    throw new Error(`API error: ${res.status}`);
                }

                const json = await res.json();

                const data: CouncilMember[] = Array.isArray(json)
                    ? json
                    : Array.isArray(json.data)
                        ? json.data
                        : [];

                const sortedData = data
                    .filter((item) => item?.id && item?.imageUrl)
                    .sort((a, b) => (a.order || 0) - (b.order || 0));

                setMembers(sortedData);
            } catch (error) {
                console.error("Failed to fetch council:", error);
                setMembers([]);
            } finally {
                setLoading(false);
            }
        }

        getCouncil();
    }, [initialMembers]);

    const { appointed, elected } = useMemo(() => {
        const raw = [...members];

        const appointedByType = raw.filter((item) => {
            const type = item.type?.trim().toLowerCase();
            return type === "appointed" || type === "appoint";
        });

        const electedByType = raw.filter((item) => {
            const type = item.type?.trim().toLowerCase();
            return type === "elected" || type === "election";
        });

        if (appointedByType.length > 0 || electedByType.length > 0) {
            return {
                appointed: appointedByType,
                elected: electedByType,
            };
        }

        // Fallback split if no types are provided
        return {
            appointed: raw.slice(0, Math.ceil(raw.length / 2)),
            elected: raw.slice(Math.ceil(raw.length / 2)),
        };
    }, [members]);

    if (loading) {
        return (
            <section className={styles.wrapper}>
                <div className={styles.loading}>กำลังโหลดข้อมูลกรรมการ...</div>
            </section>
        );
    }

    if (members.length === 0) {
        return null;
    }

    return (
        <section className={styles.wrapper}>
            <CommitteeCarousel
                title="กรรมการเลือกตั้งสภา"
                members={elected}
                typeLabel="เลือกตั้ง"
                onSelect={setSelected}
            />

            <CommitteeCarousel
                title="กรรมการแต่งตั้งสภา"
                members={appointed}
                typeLabel="แต่งตั้ง"
                onSelect={setSelected}
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
}: {
    title: string;
    members: CouncilMember[];
    typeLabel: string;
    onSelect: (member: CouncilMember) => void;
}) {
    if (members.length === 0) return null;

    return (
        <div className={styles.carouselSection}>
            <div className={styles.sectionHead}>
                <h3>{title}</h3>
                <span>{members.length} ท่าน</span>
            </div>

            <div className={styles.gridContainer}>
                {members.map((member) => (
                    <div
                        key={`${typeLabel}-${member.id}`}
                        className={styles.gridItem}
                    >
                        <article className={styles.card}>
                            <div className={styles.imageBox}>
                                <img
                                    src={member.imageUrl}
                                    alt={`${member.prefix}${member.name}`}
                                />
                            </div>

                            <div className={styles.cardContent}>
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
                    </div>
                ))}
            </div>
        </div>
    );
}