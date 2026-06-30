"use client";

import React, { useState, useMemo, useEffect } from 'react';
import StoreBanner from '@/components/member/store/StoreBanner';
import StoreSearch from '@/components/member/store/StoreSearch';
import CategoryHighlights from '@/components/member/store/CategoryHighlights';
import ProductGrid from '@/components/member/store/ProductGrid';
import { Product } from '@/components/member/store/ProductCard';
import styles from './store.module.css';



export default function StorePage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [searchQuery, setSearchQuery] = useState(""); // Query actually applied upon submit
    const [selectedCategory, setSelectedCategory] = useState("ทั้งหมด");

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await fetch('https://pharmacy-api-6w5d.onrender.com/products');
                const data = await res.json();
                setProducts(data);
            } catch (err) {
                console.error("Failed to fetch products", err);
            }
        };
        fetchProducts();
    }, []);

    const filteredProducts = useMemo(() => {
        let result = products;

        // Filter by category
        if (selectedCategory !== "ทั้งหมด") {
            result = result.filter((p) => p.category === selectedCategory);
        }

        // Filter by search query
        if (searchQuery.trim()) {
            const lower = searchQuery.toLowerCase();
            result = result.filter((p) => p.name.toLowerCase().includes(lower));
        }

        return result;
    }, [products, selectedCategory, searchQuery]);

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
                {/* Search */}
                <div className={styles.searchSection}>
                    <StoreSearch
                        searchTerm={searchTerm}
                        onSearchChange={setSearchTerm}
                        onSearchSubmit={() => setSearchQuery(searchTerm)}
                    />
                </div>

                {/* Category Highlights */}
                <CategoryHighlights onCategorySelect={handleCategorySelect} />

                {/* Product Grid */}
                <div id="store-products">
                    <ProductGrid
                        products={filteredProducts}
                    />
                </div>
            </div>
        </div>
    );
}
