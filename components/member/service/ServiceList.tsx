import styles from "./ServiceList.module.css";

import Link from "next/link";
import { ServiceItem } from "@/lib/api";
import { resolveEServiceHref } from "@/components/public/04_service/e-service/eServiceConfig";

interface ServiceListProps {
  services: ServiceItem[];
}

export default function ServiceList({ services }: ServiceListProps) {
  if (!services || services.length === 0) return null;

  const regularServices = services.filter(item => !item.isPopular);

  if (regularServices.length === 0) return null;

  return (
    <section className={styles.section}>
      <div className={styles.sectionCon}>
      <h2 className={`${styles.title} ThaiFont`}>บริการเภสัชกร</h2>
      <div className={styles.serviceListGrid}>
        {regularServices.map((item) => {
          const localHref = resolveEServiceHref(item.name, item.shortName);
          const href = localHref || item.linkUrl || null;
          const content = (
            <>
              <div className={`${styles.serviceLabel} ThaiFont`}>
                {item.shortName}
              </div>
              <div className={`${styles.serviceDesc} ThaiFont`}>
                {item.description}
              </div>
            </>
          );

          if (href) {
            return (
              <Link 
                key={item.id} 
                href={href}
                className={styles.serviceListItem}
                target={!localHref && href.startsWith('http') ? "_blank" : "_self"}
                rel={!localHref && href.startsWith('http') ? "noopener noreferrer" : undefined}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                {content}
              </Link>
            );
          }

          return (
            <div key={item.id} className={styles.serviceListItem}>
              {content}
            </div>
          );
        })}
      </div>
      </div>
    </section>
  );
}
