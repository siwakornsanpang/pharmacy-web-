"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ChevronLeft, MapPin, Calendar, Users, Clock, BookOpen, AlertTriangle, ChevronDown, ChevronUp, Share2, Check, FileText, Download } from "lucide-react";
import styles from "./meetingDetail.module.css";
import { FaGraduationCap } from "react-icons/fa";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

interface DetailMeeting {
  id: number;
  title: string;
  location: string;
  date: string;
  cpe: string;
  count: string;
  registered: number;
  capacity: number;
  targetDate: string; // ISO format
  description: string;
  agenda: { time: string; activity: string }[];
  mapEmbedUrl: string;
  documents?: { name: string; size: string; url: string }[];
}

const detailMeetings: Record<number, DetailMeeting> = {
  1: {
    id: 1,
    title: "สภาเภสัชกรรมเปิดอบรมหลักสูตรอบรมระยะสั้นการบริบาลทางเภสัชกรรม (สาขาปฐมภูมิ) รุ่นที่ 5",
    location: "ห้อง Sapphire 204-206 ศูนย์การประชุม อิมแพ็ค ฟอรั่ม เมืองทองธานี จังหวัดนนทบุรี",
    date: "15 ตุลาคม 2569",
    cpe: "10.0",
    count: "62/100 คน",
    registered: 62,
    capacity: 100,
    targetDate: "2026-10-15T09:00:00",
    description: "การอบรมหลักสูตรอบรมระยะสั้นการบริบาลทางเภสัชกรรม (สาขาปฐมภูมิ) จัดขึ้นเพื่อยกระดับทักษะและการดูแลผู้ป่วยปฐมภูมิสำหรับเภสัชกรชุมชนและเภสัชกรร้านยา โดยมุ่งเน้นการใช้ยาอย่างปลอดภัย การคัดกรองโรคเบื้องต้น และการทำงานร่วมกับทีมสหวิชาชีพในระบบบริการสุขภาพปฐมภูมิอย่างมีประสิทธิภาพ",
    agenda: [
      { time: "08:30 - 09:00", activity: "ลงทะเบียนเข้าร่วมงานและรับเอกสาร" },
      { time: "09:00 - 09:30", activity: "พิธีเปิดงานและชี้แจงวัตถุประสงค์หลักสูตร โดย นายกสภาเภสัชกรรม" },
      { time: "09:30 - 12:00", activity: "การบรรยายหัวข้อ: บทบาทของเภสัชกรในการบริบาลทางเภสัชกรรมระดับปฐมภูมิ" },
      { time: "12:00 - 13:00", activity: "พักรับประทานอาหารกลางวัน" },
      { time: "13:00 - 15:00", activity: "Workshop: การคัดกรองและการจัดการโรคไม่ติดต่อเรื้อรัง (NCDs) เบื้องต้นในร้านยา" },
      { time: "15:00 - 16:30", activity: "อภิปรายกลุ่มและสรุปบทเรียน พร้อมประเมินผลการเรียนรู้" }
    ],
    mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3873.3444061803737!2d100.54877717590823!3d13.879948994503714!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30e2849cf247fcf7%3A0xe7dc280650993510!2z4LiB4Lij4Lix4LiZ4LiX4Lij4Liw4LiB4Liy4Lij4Lij4Lix4Lia4LmA4LiB4Liy4LiV4Lij4Lix4LiaIOC4reC4tOC4oeC4p-C4tOC4leC4seC4kyDguYDguKHguLfguK3guIfguJnguJnguJrguKPguYnguKHguYDguJnguJnguKvguJnguYnguLIZ!5e0!3m2!1sth!2sth!4v1717392000000",
    documents: [
      { name: "เอกสารประกอบการบรรยายหลักสูตรการบริบาล.pdf", size: "4.2 MB", url: "#" },
      { name: "กำหนดการและหัวข้อสัมมนา (ฉบับเต็ม).pdf", size: "1.8 MB", url: "#" },
      { name: "แบบฟอร์มประเมินผลการเรียนรู้ปฐมภูมิ.pdf", size: "850 KB", url: "#" }
    ]
  },
  2: {
    id: 2,
    title: "Pharmacy Research and Innovation Summit 2025: (PRIS2025) Synergizing for the better future",
    location: "ห้อง Sapphire 204-206 ศูนย์การประชุม อิมแพ็ค ฟอรั่ม เมืองทองธานี จังหวัดนนทบุรี",
    date: "12 พฤศจิกายน 2569",
    cpe: "5.5",
    count: "45/100 คน",
    registered: 45,
    capacity: 100,
    targetDate: "2026-11-12T09:00:00",
    description: "งานประชุมสุดยอดงานวิจัยและนวัตกรรมทางเภสัชศาสตร์ ประจำปี 2025 มุ่งเน้นการบูรณาการองค์ความรู้ งานวิจัย และเทคโนโลยีเภสัชกรรมสมัยใหม่ เพื่อการพัฒนายาและผลิตภัณฑ์สุขภาพสำหรับอนาคต",
    agenda: [
      { time: "08:30 - 09:00", activity: "ลงทะเบียน" },
      { time: "09:00 - 10:30", activity: "Keynote Lecture: Future Trends in Pharmacy Research & AI Integration" },
      { time: "10:45 - 12:00", activity: "Panel Discussion: Bridging Research from Bench to Bedside" },
      { time: "12:00 - 13:00", activity: "พักรับประทานอาหารกลางวัน" },
      { time: "13:00 - 15:30", activity: "Oral Presentations: นำเสนองานวิจัยดีเด่นในสาขาต่าง ๆ" },
      { time: "15:30 - 16:30", activity: "พิธีมอบรางวัลนวัตกรรมและพิธีปิดการประชุม" }
    ],
    mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3873.3444061803737!2d100.54877717590823!3d13.879948994503714!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30e2849cf247fcf7%3A0xe7dc280650993510!2z4LiB4Lij4Lix4LiZ4LiX4Lij4Liw4LiB4Liy4Lij4Lij4Lix4Lia4LmA4LiB4Liy4LiV4Lij4Lix4LiaIOC4reC4tOC4oeC4p-C4tOC4leC4seC4kyDguYDguKHguLfguK3guIfguJnguJnguJrguKPguYnguKHguYDguJnguJnguKvguJnguYnguLIZ!5e0!3m2!1sth!2sth!4v1717392000000",
    documents: [
      { name: "PRIS2025 Summit Brochure.pdf", size: "5.5 MB", url: "#" },
      { name: "Research Abstract Presentations Guide.pdf", size: "2.1 MB", url: "#" }
    ]
  },
  3: {
    id: 3,
    title: "การฝึกอบรม ประกาศนียบัตรวิชาชีพเภสัชกรรม (สาขาบริหารจัดการผลิตภัณฑ์สมุนไพร) รุ่นที่ 3",
    location: "ห้อง Sapphire 204-206 ศูนย์การประชุม อิมแพ็ค ฟอรั่ม เมืองทองธานี จังหวัดนนทบุรี",
    date: "18 ธันวาคม 2569",
    cpe: "3.0",
    count: "100/100 (เต็ม)",
    registered: 100,
    capacity: 100,
    targetDate: "2026-12-18T09:00:00",
    description: "หลักสูตรประกาศนียบัตรวิชาชีพที่เน้นให้เภสัชกรได้รับความรู้ ทักษะ และกรอบความคิดในเรื่องการจัดการและควบคุมมาตรฐานสมุนไพร ตั้งแต่การเพาะปลูก การสกัดสารสำคัญ การขึ้นทะเบียนตำรับ ไปจนถึงการทำการตลาดผลิตภัณฑ์สมุนไพรอย่างเหมาะสม",
    agenda: [
      { time: "08:30 - 09:00", activity: "ลงทะเบียน" },
      { time: "09:00 - 12:00", activity: "การบรรยาย: พระราชบัญญัติผลิตภัณฑ์สมุนไพร และมาตรฐานการควบคุมคุณภาพผลิตภัณฑ์" },
      { time: "12:00 - 13:00", activity: "พักรับประทานอาหารกลางวัน" },
      { time: "13:00 - 15:00", activity: "กรณีศึกษา: การสร้างความสำเร็จเชิงพาณิชย์ของผลิตภัณฑ์สมุนไพรไทยในเวทีโลก" },
      { time: "15:00 - 16:00", activity: "สรุปหลักสูตรและขั้นตอนการยื่นคำขอรับใบประกาศนียบัตร" }
    ],
    mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3873.3444061803737!2d100.54877717590823!3d13.879948994503714!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30e2849cf247fcf7%3A0xe7dc280650993510!2z4LiB4Lij4Lix4LiZ4LiX4Lij4Liw4LiB4Liy4Lij4Lij4Lix4Lia4LmA4LiB4Liy4LiV4Lij4Lix4LiaIOC4reC4tOC4oeC4p-C4tOC4leC4seC4kyDguYDguKHguLfguK3guIfguJnguJnguJrguKPguYnguKHguYDguJnguJnguKvguJnguYnguLIZ!5e0!3m2!1sth!2sth!4v1717392000000",
    documents: [
      { name: "คู่มือการควบคุมมาตรฐานสมุนไพรและการสกัดสาร.pdf", size: "3.8 MB", url: "#" },
      { name: "ระเบียบและพระราชบัญญัติผลิตภัณฑ์สมุนไพร 2568.pdf", size: "1.5 MB", url: "#" }
    ]
  }
};

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function MeetingDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { isLoggedIn } = useAuth();
  
  const idStr = params?.id;
  const id = typeof idStr === "string" ? parseInt(idStr) : 1;
  const current = detailMeetings[id] || detailMeetings[1];

  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isAgendaOpen, setIsAgendaOpen] = useState(true);
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  useEffect(() => {
    const calculateTime = () => {
      const difference = +new Date(current.targetDate) - +new Date();
      if (difference <= 0) {
        setTimeRemaining({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      
      setTimeRemaining({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [current.targetDate]);

  const handleBack = () => {
    const isLoggedIn = typeof document !== "undefined" && document.cookie.includes("isLoggedIn=true");
    router.push(isLoggedIn ? "/member-meeting" : "/meeting");
  };

  const isFull = current.count.includes("เต็ม");
  const percentFull = Math.min(100, Math.round((current.registered / current.capacity) * 100));

  return (
    <div className={styles.pageWrapper}>
      {/* Banner */}
      <div className={styles.banner}>
        <div className={styles.bannerOverlay}>
          <button onClick={handleBack} className={styles.backBtn}>
            <ChevronLeft size={20} />
            <span>กลับสู่หน้าหลัก</span>
          </button>
          <div className={styles.bannerContent}>
            <h1 className={`${styles.bannerTitle} ThaiFont`}>{current.title}</h1>
            <div className={styles.bannerMeta}>
              <div className={styles.metaItem}>
                <Calendar size={18} />
                <span className="ThaiFont">{current.date}</span>
              </div>
              <div className={styles.metaItem}>
                <MapPin size={18} />
                <span className="ThaiFont">{current.location}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className={styles.contentSection}>
        <div className={styles.container}>
          <div className={styles.mainGrid}>
            {/* Left Column: Details & Agenda */}
            <div className={styles.leftCol}>
              <div className={styles.sectionCard}>
                <h2 className="ThaiFont">รายละเอียด</h2>
                <div className={styles.divider}></div>
                <p className={`${styles.description} ThaiFont`}>{current.description}</p>
              </div>

              <div className={styles.sectionCard}>
                <div 
                  className={styles.collapsibleHeader} 
                  onClick={() => setIsAgendaOpen(!isAgendaOpen)}
                >
                  <h2 className="ThaiFont">กำหนดการ</h2>
                  {isAgendaOpen ? <ChevronUp size={24} className={styles.toggleIcon} /> : <ChevronDown size={24} className={styles.toggleIcon} />}
                </div>
                {isAgendaOpen && (
                  <>
                    <div className={styles.divider}></div>
                    <div className={styles.timeline}>
                      {current.agenda.map((item, idx) => (
                        <div key={idx} className={styles.timelineItem}>
                          <div className={styles.timelineTime}>
                            <Clock size={16} className={styles.timeIcon} />
                            <span className="ThaiFont">{item.time}</span>
                          </div>
                          <div className={styles.timelineMarker}>
                            <div className={styles.markerDot}></div>
                            {idx < current.agenda.length - 1 && <div className={styles.markerLine}></div>}
                          </div>
                          <div className={styles.timelineContent}>
                            <p className="ThaiFont">{item.activity}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Documents Card */}
              {current.documents && current.documents.length > 0 && (
                <div className={styles.sectionCard}>
                  <h2 className="ThaiFont">เอกสารประกอบการประชุม</h2>
                  <div className={styles.divider}></div>
                  <div className={styles.documentList}>
                    {current.documents.map((doc, idx) => (
                      <div key={idx} className={styles.documentItem}>
                        <div className={styles.documentInfo}>
                          <FileText size={24} className={styles.documentIcon} />
                          <div className={styles.documentMeta}>
                            <span className={`${styles.documentName} ThaiFont`}>{doc.name}</span>
                            <span className={`${styles.documentSize} ThaiFont`}>{doc.size}</span>
                          </div>
                        </div>
                        <a 
                          href={doc.url} 
                          className={`${styles.downloadBtn} ThaiFont`}
                          onClick={(e) => {
                            e.preventDefault();
                          }}
                        >
                          <Download size={18} />
                          <span>ดาวน์โหลด</span>
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Sidebar (CPE, Countdown & Location, Registration) */}
            <div className={styles.rightCol}>
              {/* CPE Card */}
              <div className={`${styles.sectionCard} ${styles.cpeCard}`}>
                <h3 className="ThaiFont">หน่วยกิตการศึกษาต่อเนื่อง (CPE)</h3>
                <div className={styles.cpeCardContent}>
                  <div className={styles.cpeCardIconWrapper}>
                    <FaGraduationCap className={styles.cpeCardIcon} />
                  </div>
                  <div className={styles.cpeCardTextWrapper}>
                    <span className={`${styles.cpeCardValue} ThaiFont`}>
                      <strong>{current.cpe}</strong> <span className={styles.cpeCardUnitLabel}>หน่วยกิต</span>
                    </span>
                    <span className={`${styles.cpeCardLabel} ThaiFont`}>หน่วยกิตที่ได้รับหลังสำเร็จการประชุม</span>
                  </div>
                </div>
              </div>

              {/* Countdown & Location Card */}
              <div className={`${styles.sectionCard} ${styles.countdownCard}`}>
                <h3 className="ThaiFont text-center">วันเวลาและนับถอยหลัง</h3>
                <div className={`${styles.countdownDateRow} ThaiFont`}>
                  <Calendar size={22} />
                  <span>{current.date}</span>
                </div>
                <div className={styles.countdownContainer}>
                  <div className={styles.countdownItem}>
                    <span className={styles.countdownNumber}>{timeRemaining.days}</span>
                    <span className={`${styles.countdownLabel} ThaiFont`}>วัน</span>
                  </div>
                  <div className={styles.countdownItem}>
                    <span className={styles.countdownNumber}>{timeRemaining.hours}</span>
                    <span className={`${styles.countdownLabel} ThaiFont`}>ชม.</span>
                  </div>
                  <div className={styles.countdownItem}>
                    <span className={styles.countdownNumber}>{timeRemaining.minutes}</span>
                    <span className={`${styles.countdownLabel} ThaiFont`}>นาที</span>
                  </div>
                  <div className={styles.countdownItem}>
                    <span className={styles.countdownNumber}>{timeRemaining.seconds}</span>
                    <span className={`${styles.countdownLabel} ThaiFont`}>วิ</span>
                  </div>
                </div>

                {/* สถานที่จัดงาน */}
                <div style={{ marginTop: "2rem", borderTop: "1px solid #eef2f6", paddingTop: "1.5rem" }}>
                  <h4 className="ThaiFont" style={{ fontSize: "1.1rem", fontWeight: "750", color: "#0f172a", marginBottom: "0.75rem" }}>สถานที่จัดงาน</h4>
                  <p className={`${styles.venueText} ThaiFont`} style={{ marginBottom: "1rem" }}>
                    <MapPin size={16} className={styles.inlineIcon} />
                    {current.location}
                  </p>
                  <div className={styles.mapContainer}>
                    <iframe
                      src={current.mapEmbedUrl}
                      width="100%"
                      height="200"
                      style={{ border: 0 }}
                      allowFullScreen={true}
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      className={styles.mapIframe}
                    ></iframe>
                  </div>
                </div>
              </div>

              {/* Registration Card */}
              <div className={`${styles.sectionCard} ${styles.registrationCard}`}>
                <h3 className="ThaiFont">จำนวนผู้ลงทะเบียน</h3>
                <div className={styles.registrationStats}>
                  <div className={styles.statsCountWrapper}>
                    <span className={`${styles.statsCountNumber} ${isFull ? styles.countFull : styles.countAvailable} ThaiFont`}>
                      {current.registered}
                    </span>
                    <span className={`${styles.statsCountSeparator} ThaiFont`}>/</span>
                    <span className={`${styles.statsCountTotal} ThaiFont`}>
                      {current.capacity}
                    </span>
                    <span className={`${styles.statsCountUnit} ThaiFont`}>คน</span>
                  </div>
                  <span className={`${styles.statsPercent} ThaiFont`}>
                    {isFull ? "ที่นั่งเต็มแล้ว" : `ว่างอีก ${current.capacity - current.registered} ที่นั่ง`}
                  </span>
                </div>
                <button 
                  className={`${styles.registerBtn} ${(!isLoggedIn || isFull) ? styles.btnDisabled : styles.btnActive} ThaiFont`}
                  disabled={!isLoggedIn || isFull}
                >
                  {isFull ? "ที่นั่งเต็มแล้ว" : "ลงทะเบียนเข้าร่วม"}
                </button>
                <button 
                  onClick={handleCopyLink} 
                  className={`${styles.shareLinkBtn} ThaiFont`}
                >
                  {copied ? <Check size={18} /> : <Share2 size={18} />}
                  <span>{copied ? "คัดลอกลิงก์สำเร็จ!" : "คัดลอกลิงก์"}</span>
                </button>
                {!isLoggedIn && (
                  <p className={`${styles.loginPrompt} ThaiFont`}>
                    *กรุณา <Link href="/login" className={styles.loginLink}>เข้าสู่ระบบ</Link> เพื่อลงทะเบียนเข้าร่วม
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
