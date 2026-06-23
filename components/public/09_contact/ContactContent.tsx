import { getWebSettings } from "@/lib/api";
import styles from "./ContactContent.module.css";
import { FaPhoneAlt, FaEnvelope } from "react-icons/fa";
import { SiLine } from "react-icons/si";
import { FiArrowUpRight } from "react-icons/fi";
import { User, Phone, Mail } from "lucide-react";
import Image from "next/image";

export default async function ContactContent() {
    const settings = await getWebSettings();

    const renderMap = () => {
        if (!settings.googleMapsEmbed) return null;
        if (settings.googleMapsEmbed.startsWith("<iframe")) {
            return (
                <div
                    className={styles.mapWrapper}
                    dangerouslySetInnerHTML={{ __html: settings.googleMapsEmbed }}
                />
            );
        }
        return (
            <div className={styles.mapWrapper}>
                <iframe
                    src={settings.googleMapsEmbed}
                    width="100%"
                    height="450"
                    allowFullScreen={true}
                    loading="lazy"
                    title="Google Maps"
                ></iframe>
            </div>
        );
    };

    return (
        <div className={styles.pageWrapper}>
            {/* Banner Section */}
            <header className={styles.banner}>
                <div className={styles.bannerOverlay}>
                    <div className={styles.bannerContent}>
                        <h1 className={styles.bannerTitle}>ติดต่อ</h1>
                        <p className={styles.bannerSubtitle}>ช่องทางการติดต่อสภาเภสัชกรรม</p>
                    </div>
                </div>
            </header>

            <div className={styles.container}>
                {/* Contact Form Section */}
                <div className={styles.contactFormSection}>
                    <div className={styles.formImageWrapper}>
                        <Image
                            src="/images/public/contact/Image2.png"
                            alt="Contact Form"
                            fill
                            className={styles.formImage}
                        />
                    </div>
                    <div className={styles.formContainer}>
                        <h2 className={styles.formTitle}>แบบฟอร์มติดต่อสอบถาม</h2>
                        <form className={styles.contactForm}>
                            <div className={styles.inputGroup}>
                                <User className={styles.inputIcon} size={18} />
                                <input type="text" placeholder="ชื่อ - นามสกุล" className={styles.inputField} />
                            </div>
                            
                            <div className={styles.formRow}>
                                <div className={styles.inputGroup}>
                                    <Phone className={styles.inputIcon} size={18} />
                                    <input type="tel" placeholder="โทรศัพท์ติดต่อกลับ" className={styles.inputField} />
                                </div>
                                <div className={styles.inputGroup}>
                                    <Mail className={styles.inputIcon} size={18} />
                                    <input type="email" placeholder="อีเมลติดต่อกลับ" className={styles.inputField} />
                                </div>
                            </div>

                            <div className={styles.inputGroup}>
                                <input type="text" placeholder="หัวข้อที่ต้องการติดต่อ" className={styles.inputFieldNoIcon} />
                            </div>

                            <div className={styles.inputGroup}>
                                <textarea placeholder="ข้อความ" className={styles.textareaField} rows={5}></textarea>
                            </div>

                            <div className={styles.captchaSection}>
                                <div className={styles.captchaWrapper}>
                                    <div className={styles.captchaBox}>
                                        <span className={styles.captchaText}>W6 8HP</span>
                                    </div>
                                    <input type="text" placeholder="กรุณากรอกตัวอักษรตามรูปภาพ" className={styles.inputFieldNoIcon} />
                                </div>
                            </div>

                            <button type="button" className={styles.submitBtn}>
                                ส่งข้อความ
                            </button>
                        </form>
                    </div>
                </div>

                {/* Info Section */}
                <div className={styles.infoSection}>
                    <div className={styles.buildingImageWrapper}>
                        <Image
                            src="/images/public/contact/Image.png"
                            alt="Contact Section Image"
                            fill
                            className={styles.buildingImage}
                        />
                    </div>
                    <div className={styles.textDetails}>
                        <h2 className={`${styles.siteName} ThaiFont`}>{settings.siteNameTh || "สำนักงานเลขาธิการสภาเภสัชกรรม"}</h2>
                        <p className={`${styles.address} ThaiFont`}>
                            {settings.address || "สำนักงานเลขาธิการสภาเภสัชกรรม อาคารมหิตลาธิเบศร ชั้น 8 กระทรวงสาธารณสุข เลขที่ 88/19 หมู่ 4 ถนนติวานนท์ ตำบลตลาดขวัญ อำเภอเมือง จังหวัดนนทบุรี 11000"}
                        </p>

                        <div className={`${styles.contactDetails} ThaiFont`}>
                            {settings.phone && (
                                <p><strong>โทรศัพท์ :</strong> {settings.phone}</p>
                            )}
                            {settings.fax && (
                                <p><strong>โทรสาร :</strong> {settings.fax}</p>
                            )}
                            {settings.email && (
                                <p><strong>Email :</strong> {settings.email}</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Quick Contact Cards */}
                <div className={styles.cardsGrid}>
                    <div className={styles.card}>
                        <div className={styles.cardIconBox}>
                            <FaPhoneAlt className={styles.icon} />
                        </div>
                        <div className={styles.cardInfo}>
                            <h3>เบอร์โทรศัพท์</h3>
                            <p>{settings.phone || "0 2591 9992"}</p>
                        </div>
                        <FiArrowUpRight className={styles.cardArrow} size={20} />
                    </div>

                    <div className={styles.card}>
                        <div className={styles.cardIconBox}>
                            <FaEnvelope className={styles.icon} />
                        </div>
                        <div className={styles.cardInfo}>
                            <h3>อีเมล</h3>
                            <p>{settings.email || "pharthai@pharmacycouncil.org"}</p>
                        </div>
                        <FiArrowUpRight className={styles.cardArrow} size={20} />
                    </div>

                    <div className={styles.card}>
                        <div className={styles.cardIconBox}>
                            <SiLine className={styles.icon} />
                        </div>
                        <div className={styles.cardInfo}>
                            <h3>LINE : สภาเภสัชกรรม</h3>
                            <p>{settings.lineId || "@pharmacycouncil"}</p>
                        </div>
                        <FiArrowUpRight className={styles.cardArrow} size={20} />
                    </div>
                </div>

                {/* Map Section */}
                <div className={styles.mapSection}>
                    {renderMap()}
                </div>
            </div>
        </div>
    );
}
