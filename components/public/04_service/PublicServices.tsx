"use client";

import { useAuth } from "@/context/AuthContext";
import styles from "./PublicServices.module.css";

const publicServices = [
  { id: 4, img: "/images/public/service/service4.jpg", alt: "service4", href: "/service/people-project" }, // ใส่ลิงก์ปลายทางที่ต้องการ (ตอนนี้ใส่ # แทนไว้ก่อน)
  { id: 5, img: "/images/public/service/service5.jpg", alt: "service5", href: "https://law.pharmacycouncil.org/" }, // 🛠️ แก้จาก herf เป็น href
  { id: 6, img: "/images/public/service/service6.jpg", alt: "service6", href: "#" }, // ใส่ลิงก์ปลายทางที่ต้องการ (ตอนนี้ใส่ # แทนไว้ก่อน)
];

export default function PublicServices() {
  const { isLoggedIn } = useAuth();

  if (isLoggedIn) return null;

  return (
    <section className={styles.section}>
      <div className={styles.sectionCon}>
      <h2 className={`${styles.title} ThaiFont`}>บริการประชาชน</h2>
      <div className={styles.cardGrid}>
        {publicServices.map((service) => (
          <a
            href={service.href}
            key={service.id}
            className={styles.card}
            // 💡 บรรทัดด้านล่างนี้: ถ้าลิงก์ไหนขึ้นต้นด้วย http จะให้เปิดแท็บใหม่ทันที ( target="_blank" )
            target={service.href?.startsWith("http") ? "_blank" : "_self"}
            rel="noopener noreferrer"
          >
            <img src={service.img} alt={service.alt} className={styles.serviceImage} />
          </a>
        ))}
      </div>
      </div>
    </section>
  );
}