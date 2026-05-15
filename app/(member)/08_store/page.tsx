"use client";

import React, { useState, useMemo } from 'react';
import StoreBanner from '@/components/member/store/StoreBanner';
import StoreSearch from '@/components/member/store/StoreSearch';
import CategoryHighlights from '@/components/member/store/CategoryHighlights';
import FeaturedProducts from '@/components/member/store/FeaturedProducts';
import ProductGrid from '@/components/member/store/ProductGrid';
import { Product } from '@/components/member/store/ProductCard';
import styles from './store.module.css';

const CATEGORIES = [
    "ทั้งหมด",
    "ตำราวิชาการ",
    "อุปกรณ์การแพทย์",
    "ผลิตภัณฑ์สุขภาพ",
    "อุปกรณ์ห้องปฏิบัติการ",
    "เครื่องแบบ",
    "สื่อการเรียนรู้",
];

const MOCK_PRODUCTS: Product[] = [
    {
        id: 1,
        name: "ตำราเภสัชวิทยา ฉบับสมบูรณ์ พิมพ์ครั้งที่ 12",
        category: "ตำราวิชาการ",
        price: 1250,
        originalPrice: 1590,
        rating: 4.8,
        reviewCount: 156,
        image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=600",
        badge: "ขายดี",
        inStock: true,
        soldCount: 189,
    },
    {
        id: 2,
        name: "เครื่องวัดความดันโลหิตดิจิทัล Omron HEM-7156",
        category: "อุปกรณ์การแพทย์",
        price: 2490,
        originalPrice: 2990,
        rating: 4.6,
        reviewCount: 89,
        image: "https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&q=80&w=600",
        badge: "แนะนำ",
        inStock: true,
        soldCount: 134,
    },
    {
        id: 3,
        name: "ชุดเครื่องแบบเภสัชกร (เสื้อกาวน์ + กางเกง)",
        category: "เครื่องแบบ",
        price: 1890,
        rating: 4.5,
        reviewCount: 67,
        image: "https://images.unsplash.com/photo-1584982751601-97dcc096659c?auto=format&fit=crop&q=80&w=600",
        inStock: true,
        soldCount: 78,
    },
    {
        id: 4,
        name: "วิตามินรวมสำหรับเภสัชกร Multi-Pharma Plus",
        category: "ผลิตภัณฑ์สุขภาพ",
        price: 590,
        originalPrice: 790,
        rating: 4.3,
        reviewCount: 203,
        image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&q=80&w=600",
        badge: "โปรโมชั่น",
        inStock: true,
        soldCount: 312,
    },
    {
        id: 5,
        name: "กล้องจุลทรรศน์ Olympus CX23 LED",
        category: "อุปกรณ์ห้องปฏิบัติการ",
        price: 45900,
        originalPrice: 52000,
        rating: 4.9,
        reviewCount: 28,
        image: "https://images.unsplash.com/photo-1516541196182-6bdb0516ed27?auto=format&fit=crop&q=80&w=600",
        badge: "พรีเมียม",
        inStock: true,
        soldCount: 15,
    },
    {
        id: 6,
        name: "คู่มือการจ่ายยาและให้คำปรึกษาผู้ป่วย",
        category: "ตำราวิชาการ",
        price: 850,
        rating: 4.7,
        reviewCount: 112,
        image: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=600",
        inStock: true,
        soldCount: 167,
    },
    {
        id: 7,
        name: "ชุดตรวจน้ำตาลในเลือด Accu-Chek Guide",
        category: "อุปกรณ์การแพทย์",
        price: 1690,
        originalPrice: 1990,
        rating: 4.4,
        reviewCount: 74,
        image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=600",
        inStock: true,
        soldCount: 95,
    },
    {
        id: 8,
        name: "อาหารเสริมโปรไบโอติก Lactobacillus Pro",
        category: "ผลิตภัณฑ์สุขภาพ",
        price: 490,
        rating: 4.2,
        reviewCount: 156,
        image: "https://images.unsplash.com/photo-1550572017-edd951b55104?auto=format&fit=crop&q=80&w=600",
        inStock: true,
        soldCount: 234,
    },
    {
        id: 9,
        name: "แว่นตากันแสงสีฟ้า สำหรับงานคอมพิวเตอร์",
        category: "ผลิตภัณฑ์สุขภาพ",
        price: 690,
        originalPrice: 890,
        rating: 4.1,
        reviewCount: 48,
        image: "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?auto=format&fit=crop&q=80&w=600",
        inStock: false,
        soldCount: 142,
    },
    {
        id: 10,
        name: "DVD สื่อการสอนเภสัชกรรมคลินิก",
        category: "สื่อการเรียนรู้",
        price: 350,
        rating: 4.0,
        reviewCount: 33,
        image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=600",
        inStock: true,
        soldCount: 56,
    },
    {
        id: 11,
        name: "เครื่องชั่งน้ำหนักดิจิทัล AND EK-300i",
        category: "อุปกรณ์ห้องปฏิบัติการ",
        price: 8900,
        originalPrice: 10500,
        rating: 4.7,
        reviewCount: 19,
        image: "https://images.unsplash.com/photo-1563770660941-20978e870e26?auto=format&fit=crop&q=80&w=600",
        badge: "ลดพิเศษ",
        inStock: true,
        soldCount: 28,
    },
    {
        id: 12,
        name: "ตำราพิษวิทยาและเภสัชจลนศาสตร์",
        category: "ตำราวิชาการ",
        price: 980,
        rating: 4.6,
        reviewCount: 87,
        image: "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80&w=600",
        inStock: true,
        soldCount: 121,
    },
];

export default function StorePage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("ทั้งหมด");
    const [sortBy, setSortBy] = useState("popular");

    const filteredProducts = useMemo(() => {
        let result = MOCK_PRODUCTS;

        // Filter by category
        if (selectedCategory !== "ทั้งหมด") {
            result = result.filter((p) => p.category === selectedCategory);
        }

        // Filter by search
        if (searchTerm.trim()) {
            const lower = searchTerm.toLowerCase();
            result = result.filter(
                (p) =>
                    p.name.toLowerCase().includes(lower) ||
                    p.category.toLowerCase().includes(lower)
            );
        }

        // Sort
        switch (sortBy) {
            case "newest":
                result = [...result].reverse();
                break;
            case "price-low":
                result = [...result].sort((a, b) => a.price - b.price);
                break;
            case "price-high":
                result = [...result].sort((a, b) => b.price - a.price);
                break;
            case "rating":
                result = [...result].sort((a, b) => b.rating - a.rating);
                break;
            case "popular":
            default:
                result = [...result].sort((a, b) => b.soldCount - a.soldCount);
                break;
        }

        return result;
    }, [searchTerm, selectedCategory, sortBy]);

    const featuredProducts = MOCK_PRODUCTS.filter((p) => p.badge);

    const handleCategorySelect = (name: string) => {
        setSelectedCategory(name);
        // Scroll to product grid
        const el = document.getElementById("store-products");
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    return (
        <div className={styles.page}>
            <StoreBanner />

            <div className={styles.container}>
                {/* Featured Products */}
                <FeaturedProducts products={featuredProducts} />

                {/* Search & Filters */}
                <div id="store-products" className={styles.searchSection}>
                    <StoreSearch
                        searchTerm={searchTerm}
                        onSearchChange={setSearchTerm}
                        selectedCategory={selectedCategory}
                        onCategoryChange={setSelectedCategory}
                        categories={CATEGORIES}
                    />
                </div>

                {/* Product Grid */}
                <ProductGrid
                    products={filteredProducts}
                    sortBy={sortBy}
                    onSortChange={setSortBy}
                    totalCount={filteredProducts.length}
                />

                {/* Category Highlights */}
                <CategoryHighlights onCategorySelect={handleCategorySelect} />
            </div>
        </div>
    );
}
