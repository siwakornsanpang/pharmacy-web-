"use client";

import React, { useState } from 'react';
import styles from './ProductCard.module.css';

export interface Product {
    id: number;
    name: string;
    imageUrl: string;
    category: string;
    description: string;
    price: string | number;
}

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <div className={styles.card}>
                <div 
                    className={styles.imageWrapper} 
                    onClick={() => setIsModalOpen(true)}
                    style={{ cursor: 'pointer' }}
                    title="คลิกเพื่อดูรูปเต็ม"
                >
                    <img
                        src={product.imageUrl}
                        alt={product.name}
                        className={styles.image}
                    />
                </div>

                <div className={styles.info}>
                    <div className={styles.categoryWrapper}>
                        <p className={`${styles.category} ThaiFont`}>{product.category}</p>
                    </div>
                    
                    <div className={styles.namePriceRow}>
                        <h3 className={`${styles.name} ThaiFont`}>{product.name}</h3>
                        <span className={styles.price}>
                            <span className={styles.currency}>฿</span>
                            {Number(product.price).toLocaleString()}
                        </span>
                    </div>
                    
                    {product.description && (
                        <p className={`${styles.description} ThaiFont`} style={{ fontSize: '0.875rem', color: '#6b7280', margin: '4px 0 0', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                            {product.description}
                        </p>
                    )}
                </div>
            </div>

            {isModalOpen && (
                <div className={styles.modalOverlay} onClick={() => setIsModalOpen(false)}>
                    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <button className={styles.closeBtn} onClick={() => setIsModalOpen(false)}>✕</button>
                        <img src={product.imageUrl} alt={product.name} className={styles.fullImage} />
                    </div>
                </div>
            )}
        </>
    );
}
