'use client';

import { useState, useEffect, useMemo } from 'react';
import DocumentSearch from "@/components/public/08_other-service/DocumentSearch";
import styles from "./other-service.module.css";
import { getOtherServiceCategories, getOtherServiceItems, OtherServiceCategory, OtherServiceItem } from '@/lib/api';
import { Loader2, Download, FileText } from 'lucide-react';

export default function OtherServicesPage() {
    const [categories, setCategories] = useState<OtherServiceCategory[]>([]);
    const [activeCategory, setActiveCategory] = useState<OtherServiceCategory | null>(null);
    const [items, setItems] = useState<OtherServiceItem[]>([]);
    const [isLoadingCategories, setIsLoadingCategories] = useState(true);
    const [isLoadingItems, setIsLoadingItems] = useState(false);

    // Search and filter states
    const [searchQuery, setSearchQuery] = useState("");
    const [filterType, setFilterType] = useState("all"); // all | forms | manuals

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Load categories
    useEffect(() => {
        async function loadCategories() {
            setIsLoadingCategories(true);
            try {
                const cats = await getOtherServiceCategories();
                // Sort categories by order
                const sortedCats = cats.sort((a, b) => a.order - b.order);
                setCategories(sortedCats);
                if (sortedCats.length > 0) {
                    setActiveCategory(sortedCats[0]);
                }
            } catch (e) {
                console.error("Failed to load categories:", e);
            } finally {
                setIsLoadingCategories(false);
            }
        }
        loadCategories();
    }, []);

    // Load items when active category changes
    useEffect(() => {
        if (!activeCategory) return;

        async function loadItems() {
            setIsLoadingItems(true);
            try {
                const resItems = await getOtherServiceItems(activeCategory!.id);
                // Filter only online items, sorted by order
                const onlineItems = resItems
                    .filter(item => item.status === 'online')
                    .sort((a, b) => a.order - b.order);
                setItems(onlineItems);
                setCurrentPage(1); // Reset pagination on category change
            } catch (e) {
                console.error("Failed to load items:", e);
            } finally {
                setIsLoadingItems(false);
            }
        }
        loadItems();
    }, [activeCategory]);

    // Filter items based on search query and category type filter
    const filteredItems = useMemo(() => {
        return items.filter(item => {
            // Search filter
            const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
            
            // Type filter
            let matchesType = true;
            if (filterType === 'forms') {
                // If it contains "แบบฟอร์ม", "ใบสมัคร", "คำขอ", "กศภ."
                matchesType = /แบบฟอร์ม|ใบสมัคร|คำขอ|กศภ\./i.test(item.name);
            } else if (filterType === 'manuals') {
                // If it contains "คู่มือ", "แนวทาง", "ขั้นตอน"
                matchesType = /คู่มือ|แนวทาง|ขั้นตอน|เกณฑ์/i.test(item.name);
            }

            return matchesSearch && matchesType;
        });
    }, [items, searchQuery, filterType]);

    // Pagination calculations
    const totalPages = Math.max(1, Math.ceil(filteredItems.length / itemsPerPage));
    const paginatedItems = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredItems.slice(start, start + itemsPerPage);
    }, [filteredItems, currentPage]);

    return (
        <div className={styles.pageWrapper}>
            {/* Banner Section */}
            <header className={styles.banner}>
                <div className={styles.bannerOverlay}>
                    <div className={styles.bannerContent}>
                        <h1 className={styles.bannerTitle}>ดาวน์โหลด</h1>
                        <p className={styles.bannerSubtitle}>
                            งานการศึกษา งานทะเบียนและใบอนุญาต หนังสือรับรองและอื่น ๆ
                        </p>
                    </div>
                </div>
            </header>

            {/* Search Section */}
            <section className={styles.searchSection}>
                <div className={styles.searchContainer}>
                    <DocumentSearch
                        query={searchQuery}
                        setQuery={setSearchQuery}
                        filterType={filterType}
                        setFilterType={setFilterType}
                    />
                </div>
            </section>

            {/* Main Content Layout */}
            <div className={styles.container}>
                <div className={styles.contentLayout}>
                    
                    {/* Sidebar */}
                    <aside className={styles.sidebar}>
                        <h2 className={`${styles.sidebarTitle} ThaiFont`}>ดาวน์โหลด</h2>
                        {isLoadingCategories ? (
                            <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem 0' }}>
                                <Loader2 className="animate-spin text-blue-600" size={24} />
                            </div>
                        ) : categories.length === 0 ? (
                            <div style={{ color: '#9ca3af', fontSize: '0.9rem', textAlign: 'center', padding: '1rem 0' }}>
                                ไม่มีหมวดหมู่
                            </div>
                        ) : (
                            <ul className={styles.categoryList}>
                                {categories.map((cat) => (
                                    <li key={cat.id}>
                                        <button 
                                            className={`${styles.categoryBtn} ${activeCategory?.id === cat.id ? styles.activeCategory : ''} ThaiFont`}
                                            onClick={() => setActiveCategory(cat)}
                                        >
                                            {cat.name}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </aside>

                    {/* Main Content Info */}
                    <main className={styles.mainContent}>
                        <h1 className={`${styles.contentTitle} ThaiFont`}>
                            {activeCategory ? activeCategory.name : 'ดาวน์โหลดเอกสาร'}
                        </h1>
                        
                        <div className={styles.docListContainer}>
                            <h3 className={`${styles.docListHeader} ThaiFont`}>รายการ</h3>
                            
                            {isLoadingItems ? (
                                <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem 0' }}>
                                    <Loader2 className="animate-spin text-blue-600" size={32} />
                                </div>
                            ) : paginatedItems.length === 0 ? (
                                <div style={{ color: '#6b7280', textAlign: 'center', padding: '3rem 0', background: '#f9fafb', borderRadius: '12px', border: '1px dashed #e5e7eb' }}>
                                    <FileText size={32} style={{ color: '#d1d5db', margin: '0 auto 0.5rem' }} />
                                    <p className="ThaiFont">ไม่พบเอกสารดาวน์โหลดในหมวดหมู่นี้</p>
                                </div>
                            ) : (
                                <ul className={styles.docList}>
                                    {paginatedItems.map((item) => (
                                        <li key={item.id} className={`${styles.docItem} ThaiFont`}>
                                            {item.pdfUrl ? (
                                                <a 
                                                    href={item.pdfUrl} 
                                                    target="_blank" 
                                                    rel="noreferrer" 
                                                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'inherit', textDecoration: 'none' }}
                                                >
                                                    <Download size={16} style={{ color: '#ef4444', flexShrink: 0 }} />
                                                    <span>{item.name}</span>
                                                </a>
                                            ) : (
                                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: 0.6 }}>
                                                    <FileText size={16} style={{ flexShrink: 0 }} />
                                                    <span>{item.name} (ไม่มีไฟล์แนบ)</span>
                                                </span>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className={styles.pagination}>
                                <button 
                                    className={styles.pageBtn}
                                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                    disabled={currentPage === 1}
                                    style={{ opacity: currentPage === 1 ? 0.4 : 1, cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}
                                >
                                    &lt;
                                </button>
                                {Array.from({ length: totalPages }).map((_, i) => {
                                    const pageNum = i + 1;
                                    return (
                                        <button 
                                            key={pageNum}
                                            className={`${styles.pageBtn} ${currentPage === pageNum ? styles.activePageBtn : ''}`}
                                            onClick={() => setCurrentPage(pageNum)}
                                        >
                                            {pageNum}
                                        </button>
                                    );
                                })}
                                <button 
                                    className={styles.pageBtn}
                                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                    disabled={currentPage === totalPages}
                                    style={{ opacity: currentPage === totalPages ? 0.4 : 1, cursor: currentPage === totalPages ? 'not-allowed' : 'pointer' }}
                                >
                                    &gt;
                                </button>
                            </div>
                        )}
                    </main>

                </div>
            </div>
        </div>
    );
}
