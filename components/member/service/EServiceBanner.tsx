"use client";

import React from "react";
import styles from "./EServiceBanner.module.css";

export default function EServiceBanner() {
  return (
    <div className={styles.banner}>
      <div className={styles.bannerOverlay}>
        <div className={styles.bannerContent}>
          <h1 className={`${styles.bannerTitle} ThaiFont`}>e-service</h1>
          <p className={`${styles.bannerSubtitle} ThaiFont`}>
            e-serviceสำหรับผู้ประกอบวิชาชีพ
          </p>
        </div>
      </div>
    </div>
  );
}
