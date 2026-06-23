"use client";

import { useAuth } from "@/context/AuthContext";
import styles from "./PublicServices.module.css";

const publicServices = [
  { id: 4, img: "/images/public/service/service4.jpg", alt: "service4" },
  { id: 5, img: "/images/public/service/service5.jpg", alt: "service5" },
  { id: 6, img: "/images/public/service/service6.jpg", alt: "service6" },
];

export default function PublicServices() {
  const { isLoggedIn } = useAuth();

  if (isLoggedIn) return null;

  return (
    <section className={styles.section}>
      <h2 className={`${styles.title} ThaiFont`}>บริการประชาชน</h2>
      <div className={styles.cardGrid}>
        {publicServices.map((service) => (
          <div key={service.id} className={styles.card}>
            <img src={service.img} alt={service.alt} className={styles.serviceImage} />
          </div>
        ))}
      </div>
    </section>
  );
}
