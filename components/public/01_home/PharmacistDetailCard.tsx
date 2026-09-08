"use client";

import { useState } from "react";
import Image from "next/image";
import {
  CheckCircle2,
  AlertTriangle,
  GraduationCap,
  Award,
  Building2,
  MapPin,
  Info,
  User,
} from "lucide-react";
import styles from "./LicenseSearch.module.css";
import {
  PharmacistData,
  getFormattedThaiDateTime,
} from "./licenseSearchShared";

function getLicenseStatusDisplay(item: PharmacistData) {
  if (item.statusType === "abnormal") {
    return {
      label: item.statusReason
        ? `ไม่ปกติ — ${item.statusReason}`
        : "ไม่ปกติ",
      className: styles.statusSuspended,
      iconClassName: styles.statusIconSuspended,
      Icon: AlertTriangle,
    };
  }
  return {
    label: "ปกติ",
    className: styles.statusNormal,
    iconClassName: styles.statusIcon,
    Icon: CheckCircle2,
  };
}

function getCpeStatusDisplay(item: PharmacistData) {
  if (item.cpeStatus === "incomplete") {
    return {
      label: "ไม่ครบตามเกณฑ์",
      className: styles.statusCpe,
      iconClassName: styles.statusIconCpe,
      Icon: AlertTriangle,
    };
  }
  return {
    label: "ครบตามเกณฑ์",
    className: styles.statusNormal,
    iconClassName: styles.statusIcon,
    Icon: CheckCircle2,
  };
}

export default function PharmacistDetailCard({
  item,
  searchTime = getFormattedThaiDateTime(),
}: {
  item: PharmacistData;
  searchTime?: string;
}) {
  const [imageError, setImageError] = useState(false);
  const licenseStatus = getLicenseStatusDisplay(item);
  const cpeStatus = getCpeStatusDisplay(item);
  const LicenseIcon = licenseStatus.Icon;
  const CpeIcon = cpeStatus.Icon;
  const recentCerts = (item.certificates || []).slice(0, 3);

  return (
    <div className={styles.resultItemBlock}>
      <div className={styles.profileCard}>
        <div className={styles.avatarWrapper}>
          {item.image && !imageError ? (
            <Image
              src={item.image}
              alt={item.name}
              fill
              sizes="140px"
              className={styles.avatarImage}
              unoptimized
              onError={() => setImageError(true)}
            />
          ) : (
            <div className={styles.avatarPlaceholder}>
              <User size={56} className={styles.avatarPlaceholderIcon} />
            </div>
          )}
        </div>

        <div className={styles.profileDetails}>
          <h4 className={styles.pharmacistName}>
            {item.title ? `${item.title} ` : ""}
            {item.name}
          </h4>

          <div className={styles.detailRows}>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>เลขที่ใบอนุญาต</span>
              <span className={styles.detailValue}>{item.licenseNo}</span>
            </div>

            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>สถานะ</span>
              <span className={`${styles.detailValue} ${licenseStatus.className}`}>
                <LicenseIcon size={16} className={licenseStatus.iconClassName} />
                {licenseStatus.label}
              </span>
            </div>

            {item.expiryDate && (
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>ใบอนุญาตหมดอายุ</span>
                <span className={styles.detailValue}>{item.expiryDate}</span>
              </div>
            )}

            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>สถานะการศึกษาต่อเนื่อง</span>
              <span className={`${styles.detailValue} ${cpeStatus.className}`}>
                <CpeIcon size={16} className={cpeStatus.iconClassName} />
                {cpeStatus.label}
              </span>
            </div>

            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>
                ใบอนุญาตเป็นผู้ประกอบวิชาชีพเภสัชกรรม
              </span>
              <span className={styles.detailValueMuted}>
                {item.replacementInfo || "(ไม่เคยขอใบแทน)"}
              </span>
            </div>

            <div className={styles.detailRowStacked}>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>ที่อยู่ที่ติดต่อได้</span>
                <span className={styles.detailValue}>
                  <MapPin size={15} className={styles.infoIcon} />
                  {item.contactProvince || "-"}
                </span>
              </div>
              <div className={styles.timestampUnderField}>
                <Info size={14} className={styles.infoIcon} />
                <span>ข้อมูล ณ วันที่ค้นหา {searchTime}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.qualificationCard}>
        <div className={styles.qualColumnMain}>
          <div className={styles.qualHeader}>
            <GraduationCap size={20} className={styles.qualIcon} />
            <span>คุณวุฒิและการอบรม</span>
          </div>
          <div className={styles.certList}>
            {recentCerts.length > 0 ? (
              recentCerts.map((cert, certIdx) => (
                <div key={certIdx} className={styles.qualContent}>
                  <Award size={18} className={styles.certIcon} />
                  <span className={styles.certText}>
                    <strong>ประกาศนียบัตร:</strong> {cert.name}
                    {cert.date ? ` (${cert.date})` : ""}
                  </span>
                </div>
              ))
            ) : (
              <div className={styles.qualContent}>
                <Award size={18} className={styles.certIcon} />
                <span className={styles.certText}>
                  <strong>ประกาศนียบัตร:</strong> -
                </span>
              </div>
            )}
          </div>
        </div>

        <div className={styles.qualDivider} />

        <div className={styles.qualColumnSub}>
          <div className={styles.qualHeader}>
            <Building2 size={18} className={styles.qualIcon} />
            <span>หน่วยงานที่จัด</span>
          </div>
          <div className={styles.qualSubValue}>
            {recentCerts[0]?.organization || "-"}
          </div>
        </div>
      </div>
    </div>
  );
}
