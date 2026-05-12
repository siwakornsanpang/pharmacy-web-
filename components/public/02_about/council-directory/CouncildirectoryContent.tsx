"use client";

import { useState, useEffect } from "react";
import styles from "./CouncildirectoryContent.module.css";

export interface CouncilTerm {
    id: number;
    term: string;
    start_year: string;
    end_year: string;
    president_name: string;
    president_image: string;
    secretary_name: string;
    secretary_image: string;
}

interface Props {
    initialData: CouncilTerm[];
}

export default function CouncildirectoryContent({
    initialData,
}: Props) {
    const sortedData = [...initialData].sort(
        (a, b) => Number(a.id) - Number(b.id)
    );


    const [selectedTerm, setSelectedTerm] =
        useState<CouncilTerm | null>(null);

    // Initialize with the latest term if available
    useEffect(() => {
        if (sortedData.length > 0 && !selectedTerm) {
            setSelectedTerm(sortedData[0]);
        }
    }, [sortedData]);

    return (
        <section className={styles.wrapper}>
            {/* EMPTY STATE */}
            {sortedData.length === 0 && (
                <div className={styles.emptyBox}>
                    ยังไม่มีข้อมูลทำเนียบสภา
                </div>
            )}

            {/* TIMELINE SCROLLER */}
            {sortedData.length > 0 && (
                <div className={styles.scrollSection}>
                    <h3 className={styles.scrollTitle}>วาระ:</h3>
                    <div className={styles.scrollContainer}>
                        <div className={styles.scrollContent}>
                            {/* Duplicated List for Infinite Loop (Need enough items to fill width) */}
                            {[...sortedData, ...sortedData, ...sortedData, ...sortedData].map((item, idx) => (
                                <button
                                    key={`${item.id}-${idx}`}
                                    className={`${styles.termItem} ${selectedTerm?.id === item.id ? styles.active : ""}`}
                                    onClick={() => setSelectedTerm(item)}
                                >
                                    {item.term}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* DETAIL CARD */}
            {selectedTerm && (
                <div key={selectedTerm.id} className={styles.detailCard}>
                    <div className={styles.cardHeader}>
                        <h2 className={styles.termTitle}>วาระที่ {selectedTerm.term}</h2>
                        <div className={styles.yearBadge}>
                            พ.ศ. {selectedTerm.start_year} - {selectedTerm.end_year}
                        </div>
                    </div>

                    <div className={styles.peopleGrid}>
                        {/* PRESIDENT */}
                        <div className={styles.personCard}>
                            <div className={styles.roleLabel}>นายกสภาเภสัชกรรม</div>
                            <div className={styles.imageBox}>
                                <img
                                    src={selectedTerm.president_image || "/images/placeholder-person.png"}
                                    alt={selectedTerm.president_name}
                                />
                            </div>
                            <h3 className={styles.personName}>{selectedTerm.president_name}</h3>
                        </div>

                        {/* SECRETARY */}
                        <div className={styles.personCard}>
                            <div className={styles.roleLabel}>เลขาธิการสภาเภสัชกรรม</div>
                            <div className={styles.imageBox}>
                                <img
                                    src={selectedTerm.secretary_image || "/images/placeholder-person.png"}
                                    alt={selectedTerm.secretary_name}
                                />
                            </div>
                            <h3 className={styles.personName}>{selectedTerm.secretary_name}</h3>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}