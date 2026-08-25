"use client";

import { useEffect, useMemo, useState, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Search,
  ChevronDown,
  ChevronLeft,
  ListFilter,
  CheckCircle2,
  AlertTriangle,
  GraduationCap,
  Award,
  Building2,
  MapPin,
  Info,
  RotateCcw,
  User,
  Loader2,
} from "lucide-react";
import MeetingPagination from "@/components/public/05_meeting/MeetingPagination";
import styles from "./LicenseSearch.module.css";
import pageStyles from "./LicenseSearchResults.module.css";
import {
  PharmacistData,
  SearchType,
  searchOptions,
  mockPharmacistsList,
  getFormattedThaiDateTime,
  buildLicenseSearchPath,
  normalizeLicenseDigits,
  stripNameTitles,
} from "./licenseSearchShared";

const ITEMS_PER_PAGE = 10;

function isExactLicenseMatch(licenseValue: string, searchTerm: string) {
  const licenseDigits = normalizeLicenseDigits(licenseValue);
  const searchDigits = normalizeLicenseDigits(searchTerm);
  if (!searchDigits) return false;
  return licenseDigits === searchDigits;
}

/** Keyword match: every non-empty token must appear somewhere in the name. */
function matchesNameKeywords(itemName: string, searchTerm: string) {
  const searchWords = stripNameTitles(searchTerm)
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean);
  if (!searchWords.length) return false;
  const cleanName = stripNameTitles(itemName).toLowerCase();
  return searchWords.every((word) => cleanName.includes(word));
}

async function fetchPharmacistResults(
  searchType: SearchType,
  searchTerm: string
): Promise<PharmacistData[]> {
  if (searchType === "license") {
    return mockPharmacistsList.filter((item) =>
      isExactLicenseMatch(item.licenseNo, searchTerm)
    );
  }

  return mockPharmacistsList.filter((item) =>
    matchesNameKeywords(item.name, searchTerm)
  );
}

function LicenseSearchResultsInner() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialType = (searchParams.get("type") === "name" ? "name" : "license") as SearchType;
  const initialQuery =
    initialType === "license"
      ? normalizeLicenseDigits(searchParams.get("q") || "")
      : searchParams.get("q") || "";
  const initialFirst = stripNameTitles(searchParams.get("first") || "");
  const initialLast = stripNameTitles(searchParams.get("last") || "");

  const [searchType, setSearchType] = useState<SearchType>(initialType);
  const [query, setQuery] = useState(initialQuery);
  const [firstName, setFirstName] = useState(initialFirst);
  const [lastName, setLastName] = useState(initialLast);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [searchResults, setSearchResults] = useState<PharmacistData[]>([]);
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});
  const [searchTime, setSearchTime] = useState(getFormattedThaiDateTime());
  const [currentPage, setCurrentPage] = useState(1);

  const selectedOption = searchOptions.find((o) => o.value === searchType)!;

  const activeTerm = useMemo(() => {
    if (initialType === "license") return initialQuery.trim();
    return `${initialFirst.trim()} ${initialLast.trim()}`.trim();
  }, [initialType, initialQuery, initialFirst, initialLast]);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      if (!activeTerm) {
        setSearchResults([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setImageErrors({});
      setCurrentPage(1);
      setSearchTime(getFormattedThaiDateTime());

      const results = await fetchPharmacistResults(initialType, activeTerm);
      if (!cancelled) {
        setSearchResults(results);
        setIsLoading(false);
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [activeTerm, initialType]);

  const totalPages = Math.max(1, Math.ceil(searchResults.length / ITEMS_PER_PAGE));
  const pageItems = searchResults.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleSearch = () => {
    const path = buildLicenseSearchPath({
      type: searchType,
      query,
      firstName,
      lastName,
    });
    if (!path) return;
    router.push(path);
  };

  const handleResetSearch = () => {
    setQuery("");
    setFirstName("");
    setLastName("");
    router.push("/");
  };

  const getLicenseStatusDisplay = (item: PharmacistData) => {
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
  };

  const getCpeStatusDisplay = (item: PharmacistData) => {
    if (item.cpeStatus === "incomplete") {
      return {
        label: "CPE ไม่ครบ",
        className: styles.statusCpe,
        iconClassName: styles.statusIconCpe,
        Icon: AlertTriangle,
      };
    }
    return {
      label: "CPE ครบ",
      className: styles.statusNormal,
      iconClassName: styles.statusIcon,
      Icon: CheckCircle2,
    };
  };

  return (
    <div className={pageStyles.pageInner}>
      <Link href="/" className={pageStyles.backBtn}>
        <ChevronLeft size={18} />
        <span>ย้อนกลับหน้าแรก</span>
      </Link>

      <div className={`${styles.searchBoxCard} ${pageStyles.searchCard}`}>
        <div className={styles.header}>
          <h2 className={styles.title}>ค้นหารายชื่อ</h2>
          <span className={styles.subtitle}>ผู้ประกอบวิชาชีพเภสัชกรรม</span>
        </div>

        <div className={styles.searchRow}>
          <div className={styles.dropdown}>
            <button
              type="button"
              className={styles.dropdownButton}
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <ListFilter size={18} className={styles.dropdownIcon} />
              <span>{selectedOption.label}</span>
              <ChevronDown size={16} className={styles.chevron} />
            </button>
            {dropdownOpen && (
              <ul className={styles.dropdownMenu}>
                {searchOptions.map((opt) => (
                  <li key={opt.value}>
                    <button
                      type="button"
                      className={`${styles.dropdownItem} ${
                        opt.value === searchType ? styles.dropdownItemActive : ""
                      }`}
                      onClick={() => {
                        setSearchType(opt.value);
                        setDropdownOpen(false);
                        setQuery("");
                        setFirstName("");
                        setLastName("");
                      }}
                    >
                      {opt.label}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {searchType === "name" ? (
            <>
              <div className={styles.inputWrap}>
                <Search size={18} className={styles.inputIcon} />
                <input
                  type="text"
                  className={styles.input}
                  placeholder="ชื่อ (ไม่ต้องใส่คำนำหน้า ภก.)"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
              </div>
              <div className={styles.inputWrap}>
                <Search size={18} className={styles.inputIcon} />
                <input
                  type="text"
                  className={styles.input}
                  placeholder="นามสกุล"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
              </div>
            </>
          ) : (
            <div className={styles.inputWrap}>
              <Search size={18} className={styles.inputIcon} />
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                autoComplete="off"
                className={styles.input}
                placeholder="เลขที่ใบอนุญาต (ใส่เฉพาะตัวเลข)"
                value={query}
                onChange={(e) => setQuery(normalizeLicenseDigits(e.target.value))}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
          )}

          <button
            type="button"
            className={styles.searchButton}
            onClick={handleSearch}
            disabled={isLoading}
          >
            {isLoading ? <Loader2 size={18} className={styles.spinner} /> : "ค้นหา"}
          </button>
        </div>
      </div>

      <div className={styles.resultsContainer}>
        <h3 className={styles.resultTitle}>
          ผลการค้นหา{" "}
          {!isLoading && searchResults.length > 0 ? `${searchResults.length} รายการ` : ""}
        </h3>

        {isLoading ? (
          <div className={pageStyles.loadingBox}>
            <Loader2 size={28} className={styles.spinner} />
            <span>กำลังค้นหาข้อมูล...</span>
          </div>
        ) : searchResults.length > 0 ? (
          <div className={styles.resultsList}>
            {pageItems.map((item, index) => {
              const licenseStatus = getLicenseStatusDisplay(item);
              const cpeStatus = getCpeStatusDisplay(item);
              const LicenseIcon = licenseStatus.Icon;
              const CpeIcon = cpeStatus.Icon;
              const recentCerts = (item.certificates || []).slice(0, 3);

              return (
                <div key={item.id || index} className={styles.resultItemBlock}>
                  <div className={styles.profileCard}>
                    <div className={styles.avatarWrapper}>
                      {item.image && !imageErrors[index] ? (
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          sizes="140px"
                          className={styles.avatarImage}
                          unoptimized
                          onError={() =>
                            setImageErrors((prev) => ({ ...prev, [index]: true }))
                          }
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
                          <span
                            className={`${styles.detailValue} ${licenseStatus.className}`}
                          >
                            <LicenseIcon
                              size={16}
                              className={licenseStatus.iconClassName}
                            />
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
                          <span className={styles.detailLabel}>
                            สถานะการศึกษาต่อเนื่อง
                          </span>
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
                              {[item.contactProvince, item.contactPostalCode]
                                .filter(Boolean)
                                .join(" ") || "-"}
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
            })}

            {totalPages > 1 && (
              <div className={pageStyles.paginationWrap}>
                <MeetingPagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}
          </div>
        ) : (
          <div className={styles.emptyCard}>
            <h4 className={styles.emptyTitle}>ไม่พบข้อมูลที่ค้นหา</h4>
            <p className={styles.emptySubtitle}>
              ไม่พบข้อมูลผู้ประกอบวิชาชีพเภสัชกรรมที่ตรงกับคำค้นหา
            </p>
            <button type="button" className={styles.resetButton} onClick={handleResetSearch}>
              <RotateCcw size={16} />
              <span>กลับหน้าแรกเพื่อค้นหาใหม่</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function LicenseSearchResults() {
  return (
    <Suspense
      fallback={
        <div className={pageStyles.loadingBox}>
          <Loader2 size={28} className={styles.spinner} />
          <span>กำลังโหลด...</span>
        </div>
      }
    >
      <LicenseSearchResultsInner />
    </Suspense>
  );
}
