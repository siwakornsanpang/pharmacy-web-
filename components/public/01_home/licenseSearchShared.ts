export interface PharmacistData {
  id?: string | number;
  title?: string;
  name: string;
  licenseNo: string;
  status: string;
  statusType: "normal" | "suspended" | "cpe_incomplete";
  /** Months of suspension — used when statusType is suspended */
  suspensionMonths?: number;
  expiryDate?: string;
  replacementInfo?: string;
  image?: string | null;
  qualification?: {
    type: string;
    courseName: string;
    organization: string;
  };
}

export const searchOptions = [
  { value: "license", label: "เลขที่ใบอนุญาต" },
  { value: "name", label: "ชื่อ-นามสกุล" },
] as const;

export type SearchType = "license" | "name";

/** Keep only digits for license-number search (e.g. "ภ. 13476" → "13476"). */
export function normalizeLicenseDigits(value: string): string {
  return value.replace(/[^0-9]/g, "");
}

/** Strip common pharmacist/person titles so users can search by name only. */
export function stripNameTitles(value: string): string {
  return value
    .replace(/(ภญ\.|ภก\.|ภ\.|ดร\.|นาย|นางสาว|นาง)\s*/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Mock examples covering all 3 license statuses. */
export const mockPharmacistsList: PharmacistData[] = [
  {
    id: "11111",
    title: "ภก.",
    name: "สมชาย ใจดีภักดี",
    licenseNo: "ภ. 11111",
    status: "ปกติ",
    statusType: "normal",
    expiryDate: "15 สิงหาคม 2569",
    replacementInfo: "(ไม่เคยขอใบแทน)",
    image: "/images/public/pharmacist-sample.png",
    qualification: {
      type: "ประกาศนียบัตร",
      courseName: 'การอบรมเชิงปฏิบัติการ "การสร้างเสริมภูมิคุ้มกันโรคโดยเภสัชกร"',
      organization: "สภาเภสัชกรรม",
    },
  },
  {
    id: "22222",
    title: "ภญ.",
    name: "วิราภรณ์ วงศ์ประเสริฐ",
    licenseNo: "ภ. 22222",
    status: "พักใช้ใบอนุญาต",
    statusType: "suspended",
    suspensionMonths: 3,
    expiryDate: "10 มีนาคม 2569",
    replacementInfo: "(ไม่เคยขอใบแทน)",
    image: null,
    qualification: {
      type: "ประกาศนียบัตร",
      courseName: "-",
      organization: "สภาเภสัชกรรม",
    },
  },
  {
    id: "33333",
    title: "ภญ.",
    name: "สุนิสา วงศ์สว่าง",
    licenseNo: "ภ. 33333",
    status: "CPE ไม่ครบ",
    statusType: "cpe_incomplete",
    expiryDate: "25 พฤษภาคม 2568",
    replacementInfo: "(ไม่เคยขอใบแทน)",
    image: null,
    qualification: {
      type: "ประกาศนียบัตร",
      courseName: "-",
      organization: "-",
    },
  },
];

export function getFormattedThaiDateTime(date: Date = new Date()): string {
  const thaiMonths = [
    "มกราคม",
    "กุมภาพันธ์",
    "มีนาคม",
    "เมษายน",
    "พฤษภาคม",
    "มิถุนายน",
    "กรกฎาคม",
    "สิงหาคม",
    "กันยายน",
    "ตุลาคม",
    "พฤศจิกายน",
    "ธันวาคม",
  ];
  const day = date.getDate();
  const month = thaiMonths[date.getMonth()];
  const year = date.getFullYear() + 543;
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${day} ${month} ${year} เวลา ${hours}:${minutes} น.`;
}

export function buildLicenseSearchPath(params: {
  type: SearchType;
  query?: string;
  firstName?: string;
  lastName?: string;
}): string | null {
  const searchParams = new URLSearchParams();
  searchParams.set("type", params.type);

  if (params.type === "license") {
    const q = normalizeLicenseDigits(params.query || "");
    if (!q) return null;
    searchParams.set("q", q);
  } else {
    const first = stripNameTitles(params.firstName || "");
    const last = stripNameTitles(params.lastName || "");
    if (!first && !last) return null;
    if (first) searchParams.set("first", first);
    if (last) searchParams.set("last", last);
  }

  return `/license-search?${searchParams.toString()}`;
}
