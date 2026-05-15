"use client";

import React, { useState } from 'react';
import { ShoppingCart, Heart, Star, Eye } from 'lucide-react';
import styles from './ProductCard.module.css';

export interface Product {
    id: number;
    name: string;
    category: string;
    price: number;
    originalPrice?: number;
    rating: number;
    reviewCount: number;
    image: string;
    badge?: string;
    inStock: boolean;
    soldCount: number;
}

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const discount = product.originalPrice 
        ? Math.round((1 - product.price / product.originalPrice) * 100) 
        : 0;

    return (
        <div
            className={styles.card}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className={styles.imageWrapper}>
                <img
                    src={product.image}
                    alt={product.name}
                    className={styles.image}
                />
                {product.badge && (
                    <span className={`${styles.badge} ThaiFont`}>{product.badge}</span>
                )}
                {discount > 0 && (
                    <span className={styles.discountBadge}>-{discount}%</span>
                )}
                <button
                    className={`${styles.wishlistBtn} ${isWishlisted ? styles.wishlisted : ''}`}
                    onClick={() => setIsWishlisted(!isWishlisted)}
                    aria-label="เพิ่มในรายการโปรด"
                >
                    <Heart size={18} fill={isWishlisted ? '#ef4444' : 'none'} />
                </button>
                <div className={`${styles.quickActions} ${isHovered ? styles.visible : ''}`}>
                    <button className={styles.quickBtn} aria-label="ดูรายละเอียด">
                        <Eye size={18} />
                    </button>
                    <button className={styles.quickCartBtn} aria-label="เพิ่มลงตะกร้า">
                        <ShoppingCart size={18} />
                        <span className="ThaiFont">เพิ่มลงตะกร้า</span>
                    </button>
                </div>
            </div>

            <div className={styles.info}>
                <p className={`${styles.category} ThaiFont`}>{product.category}</p>
                <h3 className={`${styles.name} ThaiFont`}>{product.name}</h3>

                <div className={styles.ratingRow}>
                    <div className={styles.stars}>
                        {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                                key={s}
                                size={14}
                                fill={s <= Math.round(product.rating) ? '#f59e0b' : 'none'}
                                stroke={s <= Math.round(product.rating) ? '#f59e0b' : '#d1d5db'}
                            />
                        ))}
                    </div>
                    <span className={styles.reviewCount}>({product.reviewCount})</span>
                    <span className={styles.soldCount}>ขายแล้ว {product.soldCount} ชิ้น</span>
                </div>

                <div className={styles.priceRow}>
                    <span className={`${styles.price} ThaiFont`}>฿{product.price.toLocaleString()}</span>
                    {product.originalPrice && (
                        <span className={styles.originalPrice}>฿{product.originalPrice.toLocaleString()}</span>
                    )}
                </div>

                {!product.inStock && (
                    <span className={`${styles.outOfStock} ThaiFont`}>สินค้าหมด</span>
                )}
            </div>
        </div>
    );
}
