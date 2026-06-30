"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { HonorRecipient } from "@/lib/api";
import styles from "./HalloffameContent.module.css";

// ─── helpers ────────────────────────────────────────────────
function getYouTubeId(url: string): string | null {
    try {
        const u = new URL(url);
        if (u.hostname.includes("youtube.com")) {
            return u.searchParams.get("v");
        }
        if (u.hostname === "youtu.be") {
            return u.pathname.slice(1).split("?")[0] || null;
        }
    } catch {
        // not a valid URL
    }
    return null;
}

function VideoEmbed({ url }: { url: string }) {
    const ytId = getYouTubeId(url);

    if (ytId) {
        return (
            <div className={styles.videoIframeWrapper}>
                <iframe
                    src={`https://www.youtube.com/embed/${ytId}`}
                    title="วิดีโอเกียรติประวัติ"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className={styles.videoIframe}
                />
            </div>
        );
    }

    // Direct video file (mp4, etc.)
    return (
        <video
            src={url}
            controls
            className={styles.modalVideo}
            preload="metadata"
        />
    );
}
// ────────────────────────────────────────────────────────────

interface Props {
    initialData?: HonorRecipient[];
}

export default function HalloffameContent({ initialData = [] }: Props) {
    const [honorMembers, setHonorMembers] = useState<HonorRecipient[]>(initialData);
    const [selectedAward, setSelectedAward] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");
    // Show loading only when SSR gave us nothing
    const [loading, setLoading] = useState(initialData.length === 0);
    const [error, setError] = useState<string | null>(null);

    // Modal state
    const [modalMember, setModalMember] = useState<HonorRecipient | null>(null);
    const modalRef = useRef<HTMLDivElement>(null);

    // Client-side fallback: fetch only when SSR didn't provide data
    useEffect(() => {
        if (initialData.length > 0) {
            setLoading(false);
            return;
        }

        async function loadHonorRecipients() {
            try {
                setLoading(true);
                setError(null);

                const res = await fetch("/api/proxy/honor", {
                    cache: "no-store",
                });

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
            } catch (err) {
                console.error("Failed to load honor recipients:", err);
                setError("ไม่สามารถโหลดข้อมูลเกียรติประวัติได้ในขณะนี้");
            } finally {
                setLoading(false);
            }
        }

        loadHonorRecipients();
    }, [initialData]);

    // Lock / unlock body scroll when modal is open
    useEffect(() => {
        if (modalMember) {
            document.body.style.overflow = "hidden";
            setTimeout(() => modalRef.current?.focus(), 50);
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [modalMember]);

    // Close modal on Escape key
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") setModalMember(null);
        };
        if (modalMember) {
            window.addEventListener("keydown", handleKeyDown);
        }
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [modalMember]);

    // ── Derived state ──
    const excludedTargets = useMemo(() => {
        const list = [
            "ภกสมรัก รักดี",
            "ดรสมหมาย หายดี",
        ];
        return new Set(list.map((s) => s.replace(/\s+/g, "").replace(/\./g, "").toLowerCase()));
    }, []);

    const sortedMembers = useMemo(() => {
        return [...honorMembers]
            .filter((item) => item?.id)
            .sort((a, b) => (a.order || 0) - (b.order || 0));
    }, [honorMembers]);

    const awardOptions = useMemo(() => {
        const awards = Array.from(new Set(sortedMembers.map((m) => m.awardName).filter(Boolean)));
        return ["all", ...awards];
    }, [sortedMembers]);

    const displayedMembers = useMemo(() => {
        const lowerQuery = searchTerm.trim().toLowerCase();
        return sortedMembers.filter((m) => {
            // Excluded list
            const full = `${m.prefix || ""} ${m.name || ""}`;
            const norm = full.replace(/\s+/g, "").replace(/\./g, "").toLowerCase();
            if (excludedTargets.has(norm)) return false;

            // Award filter
            if (selectedAward !== "all" && m.awardName !== selectedAward) return false;

            // Search
            if (lowerQuery) {
                return (
                    (m.name || "").toLowerCase().includes(lowerQuery) ||
                    (m.prefix || "").toLowerCase().includes(lowerQuery) ||
                    (m.workName || "").toLowerCase().includes(lowerQuery) ||
                    (m.awardName || "").toLowerCase().includes(lowerQuery) ||
                    (m.awardDetail || "").toLowerCase().includes(lowerQuery)
                );
            }
            return true;
        });
    }, [sortedMembers, selectedAward, searchTerm, excludedTargets]);

    const hasVideo = (m: HonorRecipient) => !!m.videoUrl?.trim();

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
                                    {member.prefix}{member.name}
                                </h3>
                                <p className={styles.cardSubtitle}>{member.workName}</p>
                                <p className={styles.cardMeta}>{member.awardDetail || "-"}</p>
                                <div className={styles.cardRole}></div>
                                <div className={styles.cardFooter}>
                                    <button
                                        type="button"
                                        className={styles.detailButton}
                                        onClick={() => setModalMember(member)}
                                        aria-label={`ดูรายละเอียด ${member.prefix}${member.name}`}
                                    >
                                        <span>ดูรายละเอียด</span>
                                        <span className={styles.arrow}>›</span>
                                    </button>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            )}

            {/* ─── DETAIL MODAL ─── */}
            {modalMember && (
                <div
                    className={styles.modalOverlay}
                    onClick={(e) => {
                        if (e.target === e.currentTarget) setModalMember(null);
                    }}
                    role="dialog"
                    aria-modal="true"
                    aria-label={`รายละเอียด ${modalMember.prefix}${modalMember.name}`}
                >
                    <div
                        className={styles.modalCard}
                        ref={modalRef}
                        tabIndex={-1}
                    >
                        {/* Close button */}
                        <button
                            type="button"
                            className={styles.modalClose}
                            onClick={() => setModalMember(null)}
                            aria-label="ปิด"
                        >
                            ✕
                        </button>

                        {/* ── Top section: photo + info ── */}
                        <div className={styles.modalGrid}>
                            {/* Left: Image */}
                            <div className={styles.modalImageBox}>
                                {modalMember.imageUrl ? (
                                    <img
                                        src={modalMember.imageUrl}
                                        alt={`${modalMember.prefix}${modalMember.name}`}
                                        className={styles.modalImage}
                                    />
                                ) : (
                                    <div className={styles.modalImagePlaceholder}>
                                        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.3">
                                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                            <circle cx="12" cy="7" r="4" />
                                        </svg>
                                    </div>
                                )}
                            </div>

                            {/* Right: Info */}
                            <div className={styles.modalContent}>
                                {modalMember.awardName && (
                                    <div className={styles.modalAward}>{modalMember.awardName}</div>
                                )}

                                <h2 className={styles.modalTitle}>
                                    {modalMember.prefix}{modalMember.name}
                                </h2>

                                {modalMember.workName && (
                                    <p className={styles.modalSubtitle}>{modalMember.workName}</p>
                                )}

                                {modalMember.awardDetail && (
                                    <>
                                        <div className={styles.modalInfoRow}>
                                            <span>ผลงาน / เหตุผลที่ได้รับรางวัล</span>
                                        </div>
                                        <p className={styles.modalDetail}>{modalMember.awardDetail}</p>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* ── Bottom section: Video (full-width) ── */}
                        {hasVideo(modalMember) && (
                            <div className={styles.modalVideoSection}>
                                <div className={styles.modalVideoHeader}>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <polygon points="23 7 16 12 23 17 23 7" />
                                        <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
                                    </svg>
                                    <span>วิดีโอเกียรติประวัติ</span>
                                </div>
                                <div className={styles.modalVideoWrapper}>
                                    <VideoEmbed url={modalMember.videoUrl} />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </section>
    );
}
