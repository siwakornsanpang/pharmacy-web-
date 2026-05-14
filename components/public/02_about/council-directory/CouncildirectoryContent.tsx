"use client";

import { useState, useEffect } from "react";
import styles from "./CouncildirectoryContent.module.css";

export interface CouncilTerm {
    id: number;
    term: string;
    startYear: string;
    endYear: string;
    presidentName: string;
    presidentImage: string;
    secretaryName: string;
    secretaryImage: string;
}

interface Props {
    initialData: CouncilTerm[];
}

export default function CouncildirectoryContent({
    initialData = [],
}: Props) {
    const [data, setData] = useState<CouncilTerm[]>(initialData);
    const [loading, setLoading] = useState(initialData.length === 0);
    const [selectedTerm, setSelectedTerm] = useState<CouncilTerm | null>(null);

    const sortedData = [...data].sort(
        (a, b) => Number(a.id) - Number(b.id)
    );

    // Fetch on client if SSR data is missing
    useEffect(() => {
        if (initialData.length > 0) {
            setLoading(false);
            return;
        }

        async function fetchHistory() {
            try {
                setLoading(true);
                const res = await fetch("/api/proxy/history", {
                    cache: "no-store",
                });
                if (!res.ok) throw new Error("Failed to fetch");
                const json = await res.json();
                setData(Array.isArray(json) ? json : []);
            } catch (error) {
                console.error("Client fetch error:", error);
                setData([]);
            } finally {
                setLoading(false);
            }
        }
        fetchHistory();
    }, [initialData]);

    // Initialize with the latest term if available
    useEffect(() => {
        if (sortedData.length > 0 && !selectedTerm) {
            setSelectedTerm(sortedData[0]);
        }
    }, [sortedData, selectedTerm]);

    if (loading) {
        return (
            <section className={styles.wrapper}>
                <div className={styles.loading}>กำลังโหลดข้อมูล...</div>
            </section>
        );
    }

    return (
        <section className={styles.wrapper}>
            {/* EMPTY STATE */}
            {sortedData.length === 0 && (
                <div className={styles.emptyBox}>
                    ยังไม่มีข้อมูลทำเนียบสภา
                </div>
            )}

            {/* DROPDOWN SELECTOR */}
            {sortedData.length > 0 && (
                <div className={styles.dropdownSection}>
                    <h3 className={styles.scrollTitle}>วาระ:</h3>
                    <div className={styles.selectWrapper}>
                        <select
                            className={styles.termSelect}
                            value={selectedTerm?.id || ""}
                            onChange={(e) => {
                                const termId = Number(e.target.value);
                                const term = sortedData.find((t) => t.id === termId);
                                if (term) setSelectedTerm(term);
                            }}
                        >
                            {sortedData.map((item) => (
                                <option key={item.id} value={item.id}>
                                    วาระที่ {item.term} (พ.ศ. {item.startYear} - {item.endYear})
                                </option>
                            ))}
                        </select>
                        <div className={styles.selectArrow}>
                            <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
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
                            พ.ศ. {selectedTerm.startYear} - {selectedTerm.endYear}
                        </div>
                    </div>

                    <div className={styles.peopleGrid}>
                        {/* PRESIDENT */}
                        <div className={styles.personCard}>
                            <div className={styles.imageBox}>
                                <img
                                    src={selectedTerm.presidentImage || "/images/placeholder-person.png"}
                                    alt={selectedTerm.presidentName}
                                />
                            </div>
                            <div className={styles.roleLabel}>นายกสภาเภสัชกรรม</div>
                            <h3 className={styles.personName}>{selectedTerm.presidentName}</h3>
                        </div>

                        {/* SECRETARY */}
                        <div className={styles.personCard}>
                            <div className={styles.imageBox}>
                                <img
                                    src={selectedTerm.secretaryImage || "/images/placeholder-person.png"}
                                    alt={selectedTerm.secretaryName}
                                />
                            </div>
                            <div className={styles.roleLabel}>เลขาธิการสภาเภสัชกรรม</div>
                            <h3 className={styles.personName}>{selectedTerm.secretaryName}</h3>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}