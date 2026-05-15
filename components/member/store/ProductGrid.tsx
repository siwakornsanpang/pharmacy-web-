"use client";

import React from 'react';
import ProductCard, { Product } from './ProductCard';
import { Package } from 'lucide-react';
import styles from './ProductGrid.module.css';

interface ProductGridProps {
    products: Product[];
    sortBy: string;
    onSortChange: (value: string) => void;
    totalCount: number;
}

export default function ProductGrid({ products, sortBy, onSortChange, totalCount }: ProductGridProps) {
    return (
        <div className={styles.wrapper}>
            <div className={styles.toolbar}>
                <p className={`${styles.resultCount} ThaiFont`}>
                    <Package size={16} />
                    พบ <strong>{totalCount}</strong> สินค้า
                </p>
                <div className={styles.sortSection}>
                    <label className={`${styles.sortLabel} ThaiFont`}>เรียงตาม:</label>
                    <select
                        value={sortBy}
                        onChange={(e) => onSortChange(e.target.value)}
                        className={`${styles.sortSelect} ThaiFont`}
                    >
                        <option value="popular">ยอดนิยม</option>
                        <option value="newest">ใหม่ล่าสุด</option>
                        <option value="price-low">ราคาต่ำ → สูง</option>
                        <option value="price-high">ราคาสูง → ต่ำ</option>
                        <option value="rating">คะแนนสูงสุด</option>
                    </select>
                </div>
            </div>

            {products.length > 0 ? (
                <div className={styles.grid}>
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            ) : (
                <div className={styles.emptyState}>
                    <Package size={56} className={styles.emptyIcon} />
                    <h3 className="ThaiFont">ไม่พบสินค้าที่ตรงกับการค้นหา</h3>
                    <p className="ThaiFont">ลองเปลี่ยนคำค้นหาหรือเลือกหมวดหมู่อื่น</p>
                </div>
            )}
        </div>
    );
}
