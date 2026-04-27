"use client";

import { useEffect, useState, useRef } from "react";
import styles from "./HomeStats.module.css";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface AnimatedNumberProps {
  value: number;
  duration?: number;
}

function AnimatedNumber({ value, duration = 2000 }: AnimatedNumberProps) {
  const [count, setCount] = useState(0);
  const countRef = useRef(0);
  const startTimeRef = useRef<number | null>(null);
  const [hasStarted, setHasStarted] = useState(false);
  const elementRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasStarted(true);
        }
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!hasStarted) return;

    const animate = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const progress = Math.min((timestamp - startTimeRef.current) / duration, 1);
      
      // Easing function: easeOutExpo
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      
      const currentCount = Math.floor(easeProgress * value);
      
      if (currentCount !== countRef.current) {
        countRef.current = currentCount;
        setCount(currentCount);
      }

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [value, duration, hasStarted]);

  return (
    <span ref={elementRef}>
      {count.toLocaleString()}
    </span>
  );
}

export default function HomeStats() {
  const [pharmacistsCount, setPharmacistsCount] = useState(53099);
  const [qualityPharmacies] = useState(3601);
  const [faculties] = useState(25);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        if (API_URL) {
          const res = await fetch(`${API_URL}/pharmacists`);
          if (res.ok) {
            const data = await res.json();
            if (Array.isArray(data)) {
              setPharmacistsCount(data.length);
            }
          }
        }
      } catch (err) {
        console.error("Error fetching pharmacists count:", err);
      }
    };

    fetchStats();
  }, []);

  return (
    <section className={styles.statsSection}>
      {/* Decorative background elements */}
      <div className={styles.decorationBlur1} />
      <div className={styles.decorationBlur2} />
      
      <div className={styles.statsContainer}>
        <div className={styles.statsGrid}>
          {/* Stat Item 1 */}
          <div className={styles.statItem}>
            <div className={styles.statIconWrapper}>
              <div className={styles.statIconGlow} />
              <h3 className={styles.statNumber}>
                <AnimatedNumber value={pharmacistsCount} />
                <div className={styles.numberShine} />
              </h3>
            </div>
            <p className={styles.statLabel}>เภสัชกร</p>
            <div className={styles.statDecoration}>01</div>
          </div>

          {/* Stat Item 2 */}
          <div className={styles.statItem}>
            <div className={styles.statIconWrapper}>
              <div className={styles.statIconGlow} />
              <h3 className={styles.statNumber}>
                <AnimatedNumber value={qualityPharmacies} />
                <div className={styles.numberShine} />
              </h3>
            </div>
            <p className={styles.statLabel}>ร้านยาคุณภาพ</p>
            <div className={styles.statDecoration}>02</div>
          </div>

          {/* Stat Item 3 */}
          <div className={styles.statItem}>
            <div className={styles.statIconWrapper}>
              <div className={styles.statIconGlow} />
              <h3 className={styles.statNumber}>
                <AnimatedNumber value={faculties} />
                <div className={styles.numberShine} />
              </h3>
            </div>
            <p className={styles.statLabel}>คณะเภสัชศาสตร์ประเทศไทย</p>
            <div className={styles.statDecoration}>03</div>
          </div>
        </div>
      </div>
    </section>
  );
}
