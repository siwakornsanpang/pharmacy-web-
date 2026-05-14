"use client";

import { useEffect, useState } from "react";
import styles from "./HalloffameContent.module.css";
import { motion } from "framer-motion";
import { getHonorAwards, getHonorRecipients, HonorAward, HonorRecipient } from "@/lib/api";

export default function HalloffameContent() {
    const [awards, setAwards] = useState<HonorAward[]>([]);
    const [recipients, setRecipients] = useState<HonorRecipient[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedAward, setSelectedAward] = useState<HonorAward | null>(null);
    const [selectedRecipient, setSelectedRecipient] = useState<HonorRecipient | null>(null);

    useEffect(() => {
        async function fetchData() {
            try {
                setLoading(true);
                setError(null);
                const [awardsData, recipientsData] = await Promise.all([
                    getHonorAwards(),
                    getHonorRecipients(),
                ]);
                setAwards(awardsData);
                setRecipients(recipientsData);
            } catch (err: any) {
                console.error("Failed to fetch Hall of Fame data:", err);
                setError(err.message || "เกิดข้อผิดพลาดในการโหลดข้อมูล");
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    // Helper to match recipients to awards more robustly (fuzzy matching)
    const getFilteredRecipients = (awardId: number, awardName: string) => {
        return recipients.filter(r => {
            const rName = r.awardName || "";
            const aName = awardName || "";
            
            // Exact match by ID
            if (r.awardId === awardId) return true;
            
            // Exact match by Name
            if (rName === aName) return true;

            // Fuzzy match for common award types if data is inconsistent
            if (aName.includes("ยอดเยี่ยม") && (rName.includes("ยอดเยี่ยม") || rName.includes("ยอด") || rName.includes("เยี่ยม"))) {
                return true;
            }
            if (aName.includes("ดีเด่น") && rName.includes("ดีเด่น")) {
                return true;
            }

            return false;
        });
    };

    if (loading) {
        return (
            <div className={styles.loadingWrapper}>
                <div className={styles.loader}>กำลังโหลดข้อมูล...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.loadingWrapper}>
                <div className={styles.error} style={{ color: '#ff4444', textAlign: 'center', padding: '40px' }}>
                    <p>{error}</p>
                    <button 
                        onClick={() => window.location.reload()} 
                        style={{ marginTop: '20px', padding: '8px 16px', background: '#737300', color: 'white', borderRadius: '5px' }}
                    >
                        ลองใหม่อีกครั้ง
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.page}>
            {/* HERO */}
            <section className={styles.heroSection}>
                <div className={styles.heroGlow}></div>

                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className={styles.heroContent}
                >
                    <p className={styles.heroSubtitle}>
                        เชิดชูเกียรติบุคคลและองค์กรผู้สร้างคุณูปการ
                        ต่อวิชาชีพเภสัชกรรมไทย
                    </p>

                    <div className={styles.statsGrid}>
                        <div className={styles.statCard}>
                            <h3>{awards.length}</h3>
                            <p>รางวัลเกียรติประวัติ</p>
                        </div>

                        <div className={styles.statCard}>
                            <h3>{recipients.length}</h3>
                            <p>ผู้ได้รับรางวัล</p>
                        </div>
                    </div>
                </motion.div>
            </section>

            {/* AWARD GRID */}
            <section className={styles.awardGrid}>
                {awards.map((award, index) => {
                    const awardRecipients = getFilteredRecipients(award.id, award.name);
                    // Try to find an image from a recipient of this award
                    const awardImage = awardRecipients.length > 0 
                        ? awardRecipients[0].imageUrl 
                        : "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?q=80&w=1200&auto=format&fit=crop";

                    return (
                        <motion.div
                            key={award.id}
                            className={styles.awardCard}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            viewport={{ once: true }}
                        >
                            <div className={styles.cardImage}>
                                <img src={awardImage} alt={award.name} />
                            </div>

                            <div className={styles.cardGlow}></div>

                            <div className={styles.cardContent}>
                                <h3>{award.name}</h3>

                                <p>{award.description}</p>

                                <div className={styles.cardFooter}>
                                    <span>{awardRecipients.length} ผู้ได้รับรางวัล</span>

                                    <button onClick={() => setSelectedAward(award)}>ดูรายละเอียด</button>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </section>

            {/* AWARD DETAILS MODAL */}
            {selectedAward && (
                <div className={styles.modalOverlay} onClick={() => setSelectedAward(null)}>
                    <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                        <button className={styles.closeButton} onClick={() => setSelectedAward(null)}>×</button>

                        <h2 className={styles.modalTitle}>{selectedAward.name}</h2>
                        <p className={styles.modalDescription}>{selectedAward.description}</p>

                        <div className={styles.recipientList}>
                            {getFilteredRecipients(selectedAward.id, selectedAward.name)
                                .map(recipient => (
                                    <div
                                        key={recipient.id}
                                        className={styles.recipientCard}
                                        onClick={() => setSelectedRecipient(recipient)}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <img
                                            src={recipient.imageUrl}
                                            alt={recipient.name}
                                            className={styles.recipientImage}
                                        />
                                        <h4>{recipient.prefix} {recipient.name} {recipient.workName}</h4>
                                    </div>
                                ))}
                        </div>

                        {getFilteredRecipients(selectedAward.id, selectedAward.name).length === 0 && (
                            <p style={{ textAlign: 'center', padding: '40px', color: '#999' }}>ยังไม่มีรายชื่อผู้ได้รับรางวัลในหมวดนี้</p>
                        )}
                    </div>
                </div>
            )}



            {/* RECIPIENT DETAIL MODAL */}
            {selectedRecipient && (
                <div className={styles.modalOverlay} onClick={() => setSelectedRecipient(null)}>
                    <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                        <button className={styles.closeButton} onClick={() => setSelectedRecipient(null)}>×</button>

                        <div className={styles.modalBody}>
                            <div className={styles.modalImageBox}>
                                <img src={selectedRecipient.imageUrl} alt={selectedRecipient.name} />
                            </div>

                            <div className={styles.modalContent}>
                                <span style={{ color: '#737300', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>
                                    {selectedRecipient.awardName}
                                </span>
                                <h2 className={styles.modalTitle} style={{ marginTop: '10px' }}>
                                    {selectedRecipient.prefix} {selectedRecipient.name}
                                </h2>

                                <div className={styles.modalField}>
                                    <h4>ชื่อผลงาน</h4>
                                    <p>{selectedRecipient.workName}</p>
                                </div>

                                <div className={styles.modalBio}>
                                    <h4>รายละเอียดเกียรติคุณ</h4>
                                    <p>{selectedRecipient.awardDetail}</p>
                                </div>

                                {selectedRecipient.videoUrl && (
                                    <div className={styles.videoSection}>
                                        <h4>วิดีโอประกอบ</h4>
                                        <div className={styles.videoWrapper}>
                                            <video
                                                src={selectedRecipient.videoUrl}
                                                controls
                                                className={styles.modalVideo}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

