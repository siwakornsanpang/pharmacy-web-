"use client";

import { useEffect, useMemo, useState } from "react";
import { API_BASE_URL, HonorRecipient } from "@/lib/api";
import styles from "./HalloffameContent.module.css";

const API_URL = API_BASE_URL;

export default function HalloffameContent() {
    const [honorMembers, setHonorMembers] = useState<HonorRecipient[]>([]);
    const [filteredMembers, setFilteredMembers] = useState<HonorRecipient[]>([]);
    const [selectedAward, setSelectedAward] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function loadHonorRecipients() {
            try {
                setLoading(true);
                setError(null);

                const cleanApiUrl = (API_URL || "").replace(/\/$/, "");
                const res = await fetch(`${cleanApiUrl}/honor`, { cache: "no-store" });

                if (!res.ok) throw new Error(`API error: ${res.status}`);

                const json = await res.json();
                const data: HonorRecipient[] = Array.isArray(json)
                    ? json
                    : Array.isArray(json.data)
                        ? json.data
                        : [];

                const cleaned = data
                    .filter((item) => item?.id)
                    .sort((a, b) => (a.order || 0) - (b.order || 0));

                setHonorMembers(cleaned);
                setFilteredMembers(cleaned);
            } catch (err) {
                console.error("Failed to load honor recipients:", err);
                setError("ไม่สามารถโหลดข้อมูลเกียรติประวัติได้ในขณะนี้");
            } finally {
                setLoading(false);
            }
        }

        loadHonorRecipients();
    }, []);

    useEffect(() => {
        const lowerQuery = searchTerm.trim().toLowerCase();

        const filtered = honorMembers.filter((member) => {
            const matchesAward = selectedAward === "all" || member.awardName === selectedAward;
            const matchesSearch =
                !lowerQuery ||
                (member.name || "").toLowerCase().includes(lowerQuery) ||
                (member.prefix || "").toLowerCase().includes(lowerQuery) ||
                (member.workName || "").toLowerCase().includes(lowerQuery) ||
                (member.awardName || "").toLowerCase().includes(lowerQuery) ||
                (member.awardDetail || "").toLowerCase().includes(lowerQuery);

            return matchesAward && matchesSearch;
        });

        setFilteredMembers(filtered);
    }, [honorMembers, searchTerm, selectedAward]);

    const awardOptions = useMemo(() => {
        const awards = Array.from(new Set(honorMembers.map((m) => m.awardName).filter(Boolean)));
        return ["all", ...awards];
    }, [honorMembers]);

    const excludedTargets = useMemo(() => {
        // Exact names to hide (normalized: remove spaces and dots, lowercase)
        const list = [
            "ภกสมรัก รักดี",
            "ดรสมหมาย หายดี",
        ];
        return new Set(list.map((s) => s.replace(/\s+/g, "").replace(/\./g, "").toLowerCase()));
    }, []);

    const displayedMembers = useMemo(() => {
        return filteredMembers.filter((m) => {
            const full = `${m.prefix || ""} ${m.name || ""}`;
            const norm = full.replace(/\s+/g, "").replace(/\./g, "").toLowerCase();
            return !excludedTargets.has(norm);
        });
    }, [filteredMembers, excludedTargets]);

    const normalizeAward = (name: string) => name.replace(/\s+/g, "").replace(/\./g, "").toLowerCase();

    return (
        <section className={styles.wrapper}>
            <div className={styles.headerSection}>
                <div className={styles.descriptionBox}>
                    <p className={styles.descriptionText}>
                        สภาเภสัชกรรมขอเชิดชูเกียรติบุคคลผู้ทรงคุณวุฒิ และนิคุณปการต่อวิชาชีพเภสัชกรรม
                    </p>
                    <p className={styles.descriptionText}>
                        การคุ้มครองผู้บริโภคด้านยาและสุขภาพของประเทศ
                    </p>
                </div>

                <div className={styles.toolbar}>
                    <div className={styles.filterBox}>
                        <select
                            id="awardFilter"
                            className={styles.filterSelect}
                            value={selectedAward}
                            onChange={(e) => setSelectedAward(e.target.value)}
                        >
                            <option value="all">ทั้งหมด</option>
                            {awardOptions.slice(1).map((awardName) => (
                                <option key={awardName} value={awardName}>
                                    {awardName}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className={styles.searchBox}>
                        <input
                            type="text"
                            className={styles.searchInput}
                            placeholder="ค้นหาชื่อบุคคล"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <svg className={styles.searchIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                    </div>
                </div>
            </div>

            {loading && <div className={styles.statusMessage}>กำลังโหลดข้อมูลเกียรติประวัติ...</div>}
            {error && <div className={styles.statusMessage}>{error}</div>}

            {!loading && !error && displayedMembers.length === 0 && (
                <div className={styles.statusMessage}>ไม่พบข้อมูลตามเงื่อนไขการค้นหา</div>
            )}

            {!loading && !error && displayedMembers.length > 0 && (
                <div className={styles.grid}>
                    {displayedMembers.map((member) => (
                        <article key={member.id} className={styles.card}>
                            <div className={styles.cardMedia}>
                                {member.imageUrl && (
                                    <img src={member.imageUrl} alt={`${member.prefix}${member.name}`} className={styles.cardImage} />
                                )}
                            </div>

                            <div className={styles.cardBody}>
                                <h3 className={styles.cardTitle}>
                                    {member.prefix}
                                    {member.name}
                                </h3>
                                <p className={styles.cardSubtitle}>{member.workName}</p>
                                <p className={styles.cardMeta}>{member.awardDetail || "-"}</p>
                                <div className={styles.cardRole}>
                                </div>
                                <div className={styles.cardFooter}>
                                  <button type="button" className={styles.detailButton}>
                                <span>ดูรายละเอียด</span>
                                <span className={styles.arrow}>›</span>
                                </button>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            )}
        </section>
    );
}
