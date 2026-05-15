"use client";

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Star, ShoppingCart, Flame } from 'lucide-react';
import { Product } from './ProductCard';
import styles from './FeaturedProducts.module.css';

interface FeaturedProductsProps {
    products: Product[];
}

export default function FeaturedProducts({ products }: FeaturedProductsProps) {
    const [currentIndex, setCurrentIndex] = useState(0);

    const handlePrev = () => {
        setCurrentIndex((prev) => (prev === 0 ? products.length - 1 : prev - 1));
    };
    const handleNext = () => {
        setCurrentIndex((prev) => (prev === products.length - 1 ? 0 : prev + 1));
    };

    if (products.length === 0) return null;
    const product = products[currentIndex];

    return (
        <section className={styles.section}>
            <div className={styles.sectionHeader}>
                <div className={styles.headerLeft}>
                    <Flame size={24} className={styles.fireIcon} />
                    <h2 className={`${styles.sectionTitle} ThaiFont`}>สินค้าแนะนำ</h2>
                </div>
                <div className={styles.navBtns}>
                    <button onClick={handlePrev} className={styles.navBtn} aria-label="ก่อนหน้า">
                        <ChevronLeft size={20} />
                    </button>
                    <span className={styles.counter}>{currentIndex + 1} / {products.length}</span>
                    <button onClick={handleNext} className={styles.navBtn} aria-label="ถัดไป">
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>

            <div className={styles.featuredCard}>
                <div className={styles.featuredImageWrap}>
                    <img
                        src={product.image}
                        alt={product.name}
                        className={styles.featuredImage}
                    />
                    {product.badge && (
                        <span className={`${styles.featuredBadge} ThaiFont`}>{product.badge}</span>
                    )}
                </div>
                <div className={styles.featuredInfo}>
                    <span className={`${styles.featuredCategory} ThaiFont`}>{product.category}</span>
                    <h3 className={`${styles.featuredName} ThaiFont`}>{product.name}</h3>
                    <div className={styles.featuredRating}>
                        <div className={styles.stars}>
                            {[1, 2, 3, 4, 5].map((s) => (
                                <Star
                                    key={s}
                                    size={18}
                                    fill={s <= Math.round(product.rating) ? '#f59e0b' : 'none'}
                                    stroke={s <= Math.round(product.rating) ? '#f59e0b' : '#d1d5db'}
                                />
                            ))}
                        </div>
                        <span className={`${styles.ratingText} ThaiFont`}>
                            {product.rating.toFixed(1)} ({product.reviewCount} รีวิว)
                        </span>
                    </div>
                    <p className={`${styles.featuredDesc} ThaiFont`}>
                        สินค้ายอดนิยมสำหรับเภสัชกร ได้รับความนิยมสูง คุณภาพเป็นเลิศ พร้อมจัดส่งทั่วประเทศ
                    </p>
                    <div className={styles.featuredPriceRow}>
                        <span className={`${styles.featuredPrice} ThaiFont`}>฿{product.price.toLocaleString()}</span>
                        {product.originalPrice && (
                            <span className={styles.featuredOriginal}>฿{product.originalPrice.toLocaleString()}</span>
                        )}
                    </div>
                    <div className={styles.featuredActions}>
                        <button className={`${styles.addToCartBtn} ThaiFont`}>
                            <ShoppingCart size={18} />
                            เพิ่มลงตะกร้า
                        </button>
                        <button className={`${styles.buyNowBtn} ThaiFont`}>
                            ซื้อเลย
                        </button>
                    </div>
                    <div className={styles.soldInfo}>
                        <div className={styles.progressBar}>
                            <div
                                className={styles.progressFill}
                                style={{ width: `${Math.min((product.soldCount / 200) * 100, 100)}%` }}
                            />
                        </div>
                        <span className={`${styles.soldText} ThaiFont`}>ขายแล้ว {product.soldCount} ชิ้น</span>
                    </div>
                </div>
            </div>
        </section>
    );
}
