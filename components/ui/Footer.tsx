import Link from "next/link";
import { FaFacebookF, FaYoutube, FaTiktok, FaGlobe, FaMapMarkerAlt, FaPhoneAlt } from "react-icons/fa";
import { SiLine } from "react-icons/si";
import { MdEmail } from "react-icons/md";
import styles from "@/components/ui/Footer.module.css";
import Container from "@/components/ui/Container";

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className={styles.footer}>
            <Container>
                <div className={styles.footerInner}>
                    {/* Left Column: Contact info */}
                    <div className={styles.contactSection}>
                        <h1 className={styles.mainTitle}>ติดต่อสภาเภสัชกรรม</h1>
                        <div className={styles.contactInfo}>
                            <p className={styles.address}>
                                สำนักงานเลขาธิการสภาเภสัชกรรม อาคารมหิตลาธิเบศร ชั้น 8 กระทรวงสาธารณสุข <br />เลขที่ 88/19 หมู่ 4 ถนนติวานนท์ ตำบลตลาดขวัญ อำเภอเมือง จังหวัดนนทบุรี 11000
                            </p>

                            <div className={styles.contactRow}>
                                <span className={styles.contactLabel}>โทรศัพท์ : </span>
                                <a href="tel:025919992" className={styles.contactLink}>0 2591 9992</a> (คู่สายอัตโนมัติ)
                            </div>
                            <div className={styles.contactRow}>
                                <span className={styles.contactLabel}>โทรสาร : </span>
                                <a href="tel:025919996" className={styles.contactLink}>0 2591 9996</a>
                            </div>
                            <div className={styles.contactRow}>
                                <span className={styles.contactLabel}>Email : </span>
                                <a href="mailto:pharthai@pharmacycouncil.org" className={styles.contactLink}>pharthai@pharmacycouncil.org</a>
                            </div>

                            <div className={styles.socialChannels}>
                                <p className={styles.sectionTitle}>ช่องทางการติดต่อสภาเภสัชกรรม</p>
                                <div className={styles.socialIcons}>
                                    <a href="https://www.pharmacycouncil.org/" target="_blank" rel="noopener noreferrer" className={styles.socialIconCircle} title="เว็บไซต์สภาเภสัชกรรม"><FaGlobe /></a>
                                    <a href="https://www.facebook.com/thaipharmacycouncil" target="_blank" rel="noopener noreferrer" className={styles.socialIconCircle} title="Facebook สภาเภสัชกรรม"><FaFacebookF /></a>
                                    <div className={styles.socialIconCircle} title="Line สภาเภสัชกรรม"><SiLine /></div>
                                    <a href="mailto:pharthai@pharmacycouncil.org" className={styles.socialIconCircle} title="Email สภาเภสัชกรรม"><MdEmail /></a>
                                    <div className={styles.socialIconCircle} title="Tiktok สภาเภสัชกรรม"><FaTiktok /></div>
                                    <a href="https://www.youtube.com/@pharmacycouncilth" target="_blank" rel="noopener noreferrer" className={styles.socialIconCircle} title="YouTube สภาเภสัชกรรม"><FaYoutube /></a>
                                    <a href="https://www.google.com/maps/place/The+Pharmacy+Council+of+Thailand/@13.8473214,100.5276215,17z/data=!3m1!4b1!4m6!3m5!1s0x30e29b5cb4ca105b:0xb3aaa2c0ba72d485!8m2!3d13.8473162!4d100.5302018!16s%2Fg%2F1hc51mp0c?hl=en&entry=ttu&g_ep=EgoyMDI2MDYyMS4wIKXMDSoASAFQAw%3D%3D" target="_blank" rel="noopener noreferrer" className={styles.socialIconCircle} title="แผนที่สภาเภสัชกรรม"><FaMapMarkerAlt /></a>
                                    <a href="tel:025919992" className={styles.socialIconCircle} title="โทรศัพท์สภาเภสัชกรรม"><FaPhoneAlt /></a>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Content Wrapper */}
                    <div className={styles.rightContent}>

                        {/* Extensions Block */}
                        <div className={styles.extensionSection}>
                            <h3 className={styles.sectionTitle}>หมายเลขภายในหน่วยงานต่าง ๆ</h3>
                            <div className={styles.extensionGrid}>
                                <div className={styles.extensionItem}>
                                    <span className={styles.extKey}>กด 1</span>
                                    <span>ฝ่ายทะเบียนฯ</span>
                                </div>
                                <div className={styles.extensionItem}>
                                    <span className={styles.extKey}>กด 5</span>
                                    <span>ศูนย์สอบความรู้</span>
                                </div>
                                <div className={styles.extensionItem}>
                                    <span className={styles.extKey}>กด 2</span>
                                    <span>ฝ่ายการศึกษาฯ</span>
                                </div>
                                <div className={styles.extensionItem}>
                                    <span className={styles.extKey}>กด 6</span>
                                    <span>สำนักงานรับรองร้านยา</span>
                                </div>
                                <div className={styles.extensionItem}>
                                    <span className={styles.extKey}>กด 3</span>
                                    <span>ฝ่ายกฎหมาย</span>
                                </div>
                                <div className={styles.extensionItem}>
                                    <span className={styles.extKey}>กด 7</span>
                                    <span>ราชวิทยาลัยเภสัชกรรมฯ</span>
                                </div>
                                <div className={styles.extensionItem}>
                                    <span className={styles.extKey}>กด 4</span>
                                    <span>ศูนย์การศึกษาต่อเนื่องฯ</span>
                                </div>
                                <div className={styles.extensionItem}>
                                    <span className={styles.extKey}>กด 0</span>
                                    <span>ประชาสัมพันธ์</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Container>

            {/* Bottom Bar */}
            <div className={styles.bottomBar}>
                <div className={styles.privacyText}>
                    ท่านสามารถศึกษารายละเอียดการดำเนินการตาม พระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล{" "}
                    <Link href="#" className={styles.privacyLink}>
                        ได้ที่นี่
                    </Link>
                </div>
                <div className={styles.copyright}>© 2012-{currentYear}</div>
            </div>
        </footer>
    );
}
