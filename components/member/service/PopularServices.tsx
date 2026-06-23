import Link from "next/link";
import styles from "./PopularServices.module.css";

import { ServiceItem } from "@/lib/api";

interface PopularServicesProps {
  services: ServiceItem[];
}

export default function PopularServices({ services }: PopularServicesProps) {
  if (!services || services.length === 0) return null;

  return (
    <section className={styles.section}>
      <div className={styles.sectionCon}>
        <h2 className={`${styles.title} ThaiFont`}>บริการเภสัชกร</h2>
        <div className={styles.popularGrid}>
          {services.map((service) => (
            <Link
              key={service.id}
              href={service.linkUrl || "/service"}
              className={styles.popularCard}
              target={service.linkUrl?.startsWith('http') ? "_blank" : "_self"}
              rel={service.linkUrl?.startsWith('http') ? "noopener noreferrer" : undefined}
            >
              <div className={styles.iconCircle}>
                {service.iconUrl ? (
                  <img src={service.iconUrl} alt={service.name} style={{ width: 40 }} />
                ) : (
                  <div style={{ width: '100%', height: '100%', backgroundColor: '#eee', borderRadius: '50%' }} />
                )}
              </div>
              <h3 className={`${styles.cardTitle} ThaiFont`}>
                {service.shortName || service.name}
              </h3>
              <p className={`${styles.cardDesc} ThaiFont`}>{service.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
