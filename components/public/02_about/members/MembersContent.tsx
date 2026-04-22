"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from "react-simple-maps";
import { scaleLinear } from "d3-scale";

import styles from "./MembersContent.module.css";

const geoUrl = "/data/thailand.json";

// Mapping ชื่อจังหวัดภาษาอังกฤษ -> ภาษาไทย (ครบ 77 จังหวัด)
const provinceMapping: { [key: string]: string } = {
  "Bangkok Metropolis": "กรุงเทพมหานคร",
  "Amnat Charoen": "อำนาจเจริญ",
  "Ang Thong": "อ่างทอง",
  "Bueng Kan": "บึงกาฬ",
  "Buri Ram": "บุรีรัมย์",
  "Chachoengsao": "ฉะเชิงเทรา",
  "Chai Nat": "ชัยนาท",
  "Chaiyaphum": "ชัยภูมิ",
  "Chanthaburi": "จันทบุรี",
  "Chiang Mai": "เชียงใหม่",
  "Chiang Rai": "เชียงราย",
  "Chon Buri": "ชลบุรี",
  "Chumphon": "ชุมพร",
  "Kalasin": "กาฬสินธุ์",
  "Kamphaeng Phet": "กำแพงเพชร",
  "Kanchanaburi": "กาญจนบุรี",
  "Khon Kaen": "ขอนแก่น",
  "Krabi": "กระบี่",
  "Lampang": "ลำปาง",
  "Lamphun": "ลำพูน",
  "Loei": "เลย",
  "Lop Buri": "ลพบุรี",
  "Mae Hong Son": "แม่ฮ่องสอน",
  "Maha Sarakham": "มหาสารคาม",
  "Mukdahan": "มุกดาหาร",
  "Nakhon Nayok": "นครนายก",
  "Nakhon Pathom": "นครปฐม",
  "Nakhon Phanom": "นครพนม",
  "Nakhon Ratchasima": "นครราชสีมา",
  "Nakhon Sawan": "นครสวรรค์",
  "Nakhon Si Thammarat": "นครศรีธรรมราช",
  "Nan": "น่าน",
  "Narathiwat": "นราธิวาส",
  "Nong Bua Lam Phu": "หนองบัวลำภู",
  "Nong Khai": "หนองคาย",
  "Nonthaburi": "นนทบุรี",
  "Pathum Thani": "ปทุมธานี",
  "Pattani": "ปัตตานี",
  "Phangnga": "พังงา",
  "Phatthalung": "พัทลุง",
  "Phayao": "พะเยา",
  "Phetchabun": "เพชรบูรณ์",
  "Phetchaburi": "เพชรบุรี",
  "Phichit": "พิจิตร",
  "Phitsanulok": "พิษณุโลก",
  "Phra Nakhon Si Ayutthaya": "พระนครศรีอยุธยา",
  "Phrae": "แพร่",
  "Phuket": "ภูเก็ต",
  "Prachin Buri": "ปราจีนบุรี",
  "Prachuap Khiri Khan": "ประจวบคีรีขันธ์",
  "Ranong": "ระนอง",
  "Ratchaburi": "ราชบุรี",
  "Rayong": "ระยอง",
  "Roi Et": "ร้อยเอ็ด",
  "Sa Kaeo": "สระแก้ว",
  "Sakon Nakhon": "สกลนคร",
  "Samut Prakan": "สมุทรปราการ",
  "Samut Sakhon": "สมุทรสาคร",
  "Samut Songkhram": "สมุทรสงคราม",
  "Saraburi": "สระบุรี",
  "Satun": "สตูล",
  "Si Sa Ket": "ศรีสะเกษ",
  "Sing Buri": "สิงห์บุรี",
  "Songkhla": "สงขลา",
  "Sukhothai": "สุโขทัย",
  "Suphan Buri": "สุพรรณบุรี",
  "Surat Thani": "สุราษฎร์ธานี",
  "Surin": "สุรินทร์",
  "Tak": "ตาก",
  "Trang": "ตรัง",
  "Trat": "ตราด",
  "Ubon Ratchathani": "อุบลราชธานี",
  "Udon Thani": "อุดรธานี",
  "Uthai Thani": "อุทัยธานี",
  "Uttaradit": "อุตรดิตถ์",
  "Yala": "ยะลา",
  "Yasothon": "ยโสธร"
};

// ชุดสี ขาว -> เขียว (Light to Dark)
const colorScale = scaleLinear<string>()
  .domain([0, 1000, 3000, 7000, 15000])
  .range(["#ffffff", "#dcfce7", "#4ade80", "#166534", "#064e3b"]);

interface ProvinceData {
  id: string;
  name: string;
  count: number;
}

const MembersContent = () => {
  const [data, setData] = useState<ProvinceData[]>([]);
  const [selectedProvince, setSelectedProvince] = useState<ProvinceData | null>(null);
  const [hoveredData, setHoveredData] = useState<{ id: string; name: string; count: number; x: number; y: number } | null>(null);
  const [position, setPosition] = useState({ coordinates: [100.5, 13.2], zoom: 1 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/data/pharmacist-stats.json")
      .then((res) => res.json())
      .then((stats: ProvinceData[]) => {
        setData(stats);
        // Default selection to Bangkok if available
        const bkk = stats.find((s) => s.id === "Bangkok Metropolis");
        if (bkk) {
          setSelectedProvince({ ...bkk, name: provinceMapping[bkk.id] || bkk.name });
        }
      })
      .catch((err) => console.error("Error loading stats:", err));
  }, []);

  const getProvinceData = (name: string) => {
    return data.find((s) => s.id.trim().toLowerCase() === name.trim().toLowerCase());
  };

  const topProvinces = [...data]
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const handleMouseMove = (e: React.MouseEvent, id: string, name: string, count: number) => {
    if (containerRef.current) {
      const bounds = containerRef.current.getBoundingClientRect();
      setHoveredData({
        id,
        name: provinceMapping[id] || name,
        count,
        x: e.clientX - bounds.left,
        y: e.clientY - bounds.top - 10,
      });
    }
  };

  const handleZoomIn = () => {
    if (position.zoom >= 5) return;
    setPosition((pos) => ({ ...pos, zoom: pos.zoom * 1.5 }));
  };

  const handleZoomOut = () => {
    if (position.zoom <= 1) return;
    setPosition((pos) => ({ ...pos, zoom: pos.zoom / 1.5 }));
  };

  const handleMoveEnd = (newPosition: { coordinates: [number, number]; zoom: number }) => {
    setPosition(newPosition);
  };

  return (
    <div ref={containerRef} className={`${styles.container} ThaiFont`}>

      {/* Tooltip */}
      {hoveredData && (
        <div
          className={styles.tooltip}
          style={{ left: hoveredData.x, top: hoveredData.y, transform: "translate(-50%, -110%)" }}
        >
          <span className={styles.tooltipLabel}>จังหวัด</span>
          <span className={styles.tooltipValue}>{hoveredData.name}</span>
          <div className={styles.tooltipCount}>
            <span className={styles.tooltipNumber}>{hoveredData.count.toLocaleString()}</span>
            <span className={styles.tooltipUnit}>คน</span>
          </div>
        </div>
      )}

      {/* Map Section */}
      <div className={styles.mapWrapper}>
        {/* Zoom Controls Overlay */}
        <div className={styles.zoomControls}>
          <button onClick={handleZoomIn} className={styles.zoomButton} title="ซูมเข้า">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          </button>
          <button onClick={handleZoomOut} className={styles.zoomButton} title="ซูมออก">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          </button>
          <button onClick={() => setPosition({ coordinates: [100.5, 13.2], zoom: 1 })} className={styles.zoomButton} title="คืนค่าเริ่มต้น">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path><polyline points="3 3 3 8 8 8"></polyline></svg>
          </button>
        </div>

        <ComposableMap
          projection="geoMercator"
          projectionConfig={{
            scale: 3500,
            center: [100.5, 13.2],
          }}
          style={{ width: "100%", height: "100%" }}
        >
          <ZoomableGroup
            zoom={position.zoom}
            center={position.coordinates as [number, number]}
            onMoveEnd={handleMoveEnd}
          >
            <Geographies geography={geoUrl}>
              {({ geographies }: { geographies: any[] }) =>
                geographies.map((geo) => {
                  const provinceId = geo.properties.name || geo.properties.NAME || geo.properties.name_en || "";
                  const provinceStats = getProvinceData(provinceId);
                  const count = provinceStats?.count || 0;
                  const isSelected = selectedProvince?.id.trim().toLowerCase() === provinceId.trim().toLowerCase();
                  const isHovered = hoveredData?.id.trim().toLowerCase() === provinceId.trim().toLowerCase();

                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      onMouseMove={(e: React.MouseEvent) => handleMouseMove(e, provinceId, provinceId, count)}
                      onMouseLeave={() => setHoveredData(null)}
                      onClick={() => {
                        const thaiName = provinceMapping[provinceId] || provinceId;
                        if (provinceStats) setSelectedProvince({ ...provinceStats, name: thaiName });
                        else setSelectedProvince({ id: provinceId, name: thaiName, count: 0 });
                      }}
                      strokeLinejoin="round"
                      strokeLinecap="round"
                      style={{
                        default: {
                          fill: provinceStats ? colorScale(count) : "#ffffff",
                          outline: "none",
                          stroke: isHovered || isSelected ? "#facc15" : "#64748b",
                          strokeWidth: isSelected ? 2 : (isHovered ? 1.5 : 0.2),
                          transition: "all 300ms ease",
                          zIndex: isSelected ? 10 : 1
                        },
                        hover: {
                          fill: provinceStats ? colorScale(count) : "#f1f5f9",
                          filter: "brightness(0.9)",
                          outline: "none",
                          stroke: "#facc15",
                          strokeWidth: 1.5,
                          cursor: "pointer"
                        },
                        pressed: {
                          fill: "#166534",
                          outline: "none",
                          stroke: "#ffffff",
                          strokeWidth: 1,
                        },
                      }}
                    />
                  );
                })
              }
            </Geographies>
          </ZoomableGroup>
        </ComposableMap>

        {/* Legend */}
        <div className={styles.legend}>
          <p className={styles.legendTitle}>ความหนาแน่นของสมาชิก</p>
          <div className={styles.legendList}>
            {[
              { label: "0 - 1,000", color: "#ffffff", desc: "น้อย" },
              { label: "1,001 - 3,000", color: "#dcfce7", desc: "ปกติ" },
              { label: "3,001 - 7,000", color: "#4ade80", desc: "ปานกลาง" },
              { label: "7,001 - 15,000", color: "#166534", desc: "มาก" },
              { label: "15,001 ขึ้นไป", color: "#064e3b", desc: "หนาแน่นสูง" },
            ].map((item) => (
              <div key={item.label} className={styles.legendItem}>
                <div className={styles.legendColorBox} style={{ backgroundColor: item.color }} />
                <div className={styles.legendText}>
                  <span className={styles.legendLabel}>{item.label}</span>
                  <span className={styles.legendDesc}>{item.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className={styles.statsSection}>
        <div className={styles.statsCard}>
          <div className={styles.cardGlow} />

          <h4 className={styles.statsHeader}>ข้อมูลรายจังหวัด</h4>
          <h2 className={styles.statsTitle}>
            {selectedProvince?.name || "ประเทศไทย"}
          </h2>

          <div className={styles.statsMain}>
            <div className={styles.statsCountWrapper}>
              <span className={styles.statsNumber}>
                {selectedProvince?.count.toLocaleString() || 0}
              </span>
              <div className={styles.statsUnitWrapper}>
                <span className={styles.statsUnit}>คน</span>
              </div>
            </div>

            <div className={styles.statsProgressInfo}>
              <div className={styles.statsProgressHeader}>
                <span className={styles.statsProgressLabel}>จำนวนเภสัชกรในพื้นที่</span>
                <span className={styles.statsProgressStatus}>
                  {selectedProvince && selectedProvince.count > 5000 ? "หนาแน่นสูง" : "ปกติ"}
                </span>
              </div>
              <div className={styles.progressBar}>
                <div
                  className={styles.progressFill}
                  style={{
                    width: `${Math.min((selectedProvince?.count || 0) / 150, 100)}%`
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Top Ranking list */}
        <div className={styles.rankingCard}>
          <div className={styles.rankingHeader}>
            <div className={styles.rankingTitleWrapper}>
              <div className={styles.rankingIndicator} />
              <div className={styles.rankingTitleMain}>
                <div className={styles.rankingTitleBig}>5 อันดับ</div>
                <div className={styles.rankingTitleSub}>จังหวัดที่มีเภสัชกรมากที่สุด</div>
              </div>
            </div>
          </div>
          <div className={styles.rankingList}>
            {topProvinces.map((p, index) => (
              <div
                key={p.id}
                onClick={() => setSelectedProvince({ ...p, name: provinceMapping[p.id] || p.name })}
                className={`${styles.rankingItem} ${selectedProvince?.id === p.id
                  ? styles.rankingItemActive
                  : styles.rankingItemDefault
                  }`}
              >
                <div className={styles.rankingItemLeft}>
                  <span className={`${styles.rankingIndex} ${selectedProvince?.id === p.id ? styles.rankingIndexActive : styles.rankingIndexDefault
                    }`}>0{index + 1}</span>
                  <span className={`${styles.rankingName} ${selectedProvince?.id === p.id ? styles.rankingNameActive : styles.rankingNameDefault
                    }`}>{provinceMapping[p.id] || p.name}</span>
                </div>
                <div className={`${styles.rankingCountBox} ${selectedProvince?.id === p.id ? styles.rankingCountBoxActive : styles.rankingCountBoxDefault
                  }`}>
                  <span className={`${styles.rankingCount} ${selectedProvince?.id === p.id ? styles.rankingCountActive : styles.rankingCountDefault
                    }`}>
                    {p.count.toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MembersContent;
