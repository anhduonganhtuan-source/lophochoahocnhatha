// @ts-nocheck
import React, { useState, useEffect } from "react";

// ============================================================================
// DÁN LINK FIREBASE REALTIME DATABASE CỦA BẠN VÀO GIỮA 2 DẤU NGOẶC KÉP DƯỚI ĐÂY:
// Ví dụ: const DEFAULT_FIREBASE_URL = "https://lophoaduonganhtuananh-default-rtdb.asia-southeast1.firebasedatabase.app";
// ============================================================================
const DEFAULT_FIREBASE_URL =
  "https://lophoaduonganhtuananh-37e47-default-rtdb.asia-southeast1.firebasedatabase.app/";

const TEACHER_INFO = {
  fullName: "Dương Anh Tuấn Anh",
  subNote: "Nhật Hạ",
  email: "anhduonganhtuan@gmail.com",
  defaultPass: "LeMinh02@Ughy",
  quote:
    "Mỗi phản ứng hóa học đều cần năng lượng hoạt hóa — Mỗi bước tiến của con đều khởi nguồn từ sự đồng hành bền bỉ giữa Gia đình và Nhà trường.",
};

// ============================================================================
// DANH SÁCH NĂM HỌC & PHÂN LOẠI TIN TỨC CHO PHỤ HUYNH DỄ THEO DÕI
// ============================================================================
const DEFAULT_ACADEMIC_YEARS = ["2024 - 2025", "2025 - 2026", "2026 - 2027"];

const NEWS_CATEGORIES = [
  {
    id: "ACADEMIC",
    label: "Học thuật",
    badge: "📘 Học thuật",
    desc: "Tài liệu mới tải lên, lộ trình chương, đề cương & hướng dẫn ôn tập",
    color: "bg-sky-100 text-sky-900 border-sky-300",
    activeBtn: "bg-[#1B3B48] text-white",
  },
  {
    id: "HOMEWORK_DEADLINE",
    label: "Bài tập & Hạn nộp Deadline",
    badge: "⏰ Bài tập & Deadline",
    desc: "Thông báo bài tập mới đăng, thời hạn hoàn thành (Deadline) & nhắc nộp bài",
    color: "bg-rose-100 text-rose-900 border-rose-300",
    activeBtn: "bg-rose-700 text-white",
  },
  {
    id: "TUITION",
    label: "Thông báo học phí",
    badge: "💳 Thông báo học phí",
    desc: "Lịch thu học phí theo tháng/kỳ, xác nhận hoàn thành học phí",
    color: "bg-amber-100 text-amber-900 border-amber-300",
    activeBtn: "bg-[#9C6644] text-white",
  },
  {
    id: "CLASS_NOTICE",
    label: "Thông báo lớp học",
    badge: "📢 Thông báo lớp học",
    desc: "Thay đổi lịch học, lịch nghỉ lễ, họp phụ huynh & tình hình chuyên cần",
    color: "bg-emerald-100 text-emerald-900 border-emerald-300",
    activeBtn: "bg-[#2C4A3E] text-white",
  },
];

const getNewsCategoryMeta = (catId) => {
  return (
    NEWS_CATEGORIES.find((c) => c.id === catId) ||
    NEWS_CATEGORIES.find((c) => c.id === "CLASS_NOTICE")
  );
};

// Danh sách Hình thức / Kỳ thi cho Ngân hàng Đề thi (Mục 06)
const EXAM_CATEGORIES = [
  { id: "GK1_10", label: "GKI Lớp 10 (Giữa kỳ I - Khối 10)", short: "GKI Lớp 10", grade: "10" },
  { id: "HK1_10", label: "HKI Lớp 10 (Học kỳ I - Khối 10)", short: "HKI Lớp 10", grade: "10" },
  { id: "GK2_10", label: "GKII Lớp 10 (Giữa kỳ II - Khối 10)", short: "GKII Lớp 10", grade: "10" },
  { id: "HK2_10", label: "HKII Lớp 10 (Học kỳ II - Khối 10)", short: "HKII Lớp 10", grade: "10" },
  { id: "GK1_11", label: "GKI Lớp 11 (Giữa kỳ I - Khối 11)", short: "GKI Lớp 11", grade: "11" },
  { id: "HK1_11", label: "HKI Lớp 11 (Học kỳ I - Khối 11)", short: "HKI Lớp 11", grade: "11" },
  { id: "GK2_11", label: "GKII Lớp 11 (Giữa kỳ II - Khối 11)", short: "GKII Lớp 11", grade: "11" },
  { id: "HK2_11", label: "HKII Lớp 11 (Học kỳ II - Khối 11)", short: "HKII Lớp 11", grade: "11" },
  { id: "GK1_12", label: "GKI Lớp 12 (Giữa kỳ I - Khối 12)", short: "GKI Lớp 12", grade: "12" },
  { id: "HK1_12", label: "HKI Lớp 12 (Học kỳ I - Khối 12)", short: "HKI Lớp 12", grade: "12" },
  { id: "GK2_12", label: "GKII Lớp 12 (Giữa kỳ II - Khối 12)", short: "GKII Lớp 12", grade: "12" },
  { id: "HK2_12", label: "HKII Lớp 12 (Học kỳ II - Khối 12)", short: "HKII Lớp 12", grade: "12" },
  { id: "THPT_QG", label: "THPT Quốc gia / Tốt nghiệp THPT & Đại học", short: "THPT Quốc gia", grade: "12" },
  { id: "HSG_DGNL", label: "Đề Học sinh giỏi / Đánh giá năng lực", short: "HSG / ĐGNL", grade: "ALL" },
];

const getExamCategoryMeta = (catId) => {
  return (
    EXAM_CATEGORIES.find((c) => c.id === catId) || {
      id: catId || "THPT_QG",
      label: catId || "Đề thi chung",
      short: catId || "Đề thi",
    }
  );
};

// Kiểm tra Bài tập đã quá hạn nộp theo thời gian thực hay chưa
const getHomeworkDeadlineStatus = (hw, nowObj) => {
  if (!hw || !hw.deadlineISO) {
    return { isExpired: false, label: hw?.dueDate || "Đang mở nộp bài", remainingText: "" };
  }
  const targetMs = new Date(hw.deadlineISO).getTime();
  if (isNaN(targetMs)) {
    return { isExpired: false, label: hw?.dueDate || "Đang mở nộp bài", remainingText: "" };
  }
  const nowMs = nowObj.getTime();
  const diffMs = targetMs - nowMs;
  const formattedDeadline = new Date(hw.deadlineISO).toLocaleString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  if (diffMs <= 0) {
    return {
      isExpired: true,
      formattedDeadline,
      label: `Đã khóa nộp (${formattedDeadline})`,
      remainingText: "⛔ Đã hết thời gian nộp bài",
    };
  }
  const totalMinutes = Math.floor(diffMs / 60000);
  const days = Math.floor(totalMinutes / (60 * 24));
  const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
  const mins = totalMinutes % 60;
  let rem = "";
  if (days > 0) rem = `Còn ${days} ngày ${hours} giờ`;
  else if (hours > 0) rem = `Còn ${hours} giờ ${mins} phút`;
  else rem = `Còn ${mins} phút`;
  return {
    isExpired: false,
    formattedDeadline,
    label: `Hạn chót: ${formattedDeadline}`,
    remainingText: `🟢 Đang mở (${rem})`,
  };
};

// ============================================================================
// 1. CHƯƠNG TRÌNH HÓA HỌC 10, 11, 12 (CTGDPT 2018 - DANH PHÁP IUPAC)
// ============================================================================
const DEFAULT_CURRICULUM = {
  "10": [
    {
      id: "10-c1",
      timeline: "Tháng 09 (Tuần 1 – Tuần 4)",
      targetDate: "Hoàn thành trước 30/09",
      title: "Chương 1: Cấu tạo nguyên tử",
      formulas: "p⁺, n, e⁻ • Z, A • Cấu hình electron (1s² 2s² 2p⁶...)",
      requirements: [
        "Trình bày được thành phần nguyên tử (hạt nhân và vỏ nguyên tử; kích thước, khối lượng, điện tích của proton, neutron, electron).",
        "Nêu được khái niệm nguyên tố hóa học, số hiệu nguyên tử (Z), số khối (A), đồng vị và tính được nguyên tử khối trung bình.",
        "Trình bày được mô hình hiện đại về sự chuyển động của electron; khái niệm orbital nguyên tử (AO s, p, d, f) và viết được cấu hình electron nguyên tử (Z ≤ 30).",
      ],
    },
    {
      id: "10-c2",
      timeline: "Tháng 10 (Tuần 1 – Tuần 4)",
      targetDate: "Hoàn thành trước 31/10",
      title: "Chương 2: Bảng tuần hoàn các nguyên tố hóa học",
      formulas: "Chu kì, Nhóm A/B • R₂Oₙ • R(OH)ₙ • Độ âm điện (χ)",
      requirements: [
        "Nêu được nguyên tắc sắp xếp các nguyên tố trong bảng tuần hoàn dựa trên cấu hình electron; cấu tạo bảng tuần hoàn (ô, chu kì, nhóm).",
        "Giải thích được xu hướng biến đổi bán kính nguyên tử, độ âm điện, tính kim loại và tính phi kim của các nguyên tố trong một chu kì và một nhóm A.",
        "Trình bày được xu hướng biến đổi thành phần và tính acid/base của các oxide và hydroxide theo chu kì; phát biểu được định luật tuần hoàn.",
      ],
    },
    {
      id: "10-c3",
      timeline: "Tháng 11 (Tuần 1 – Tuần 4)",
      targetDate: "Hoàn thành trước 30/11",
      title: "Chương 3: Liên kết hóa học",
      formulas: "NaCl, MgO, CO₂, NH₃, NH₄⁺ • Liên kết σ, π • Liên kết hydrogen",
      requirements: [
        "Vận dụng được quy tắc octet trong quá trình hình thành liên kết hóa học của các nguyên tố nhóm A.",
        "Trình bày được sự hình thành liên kết ion, liên kết cộng hóa trị (đơn, đôi, ba, cho – nhận), phân biệt liên kết σ và liên kết π.",
        "Nêu được bản chất và vai trò của liên kết hydrogen và tương tác van der Waals đối với nhiệt độ nóng chảy, nhiệt độ sôi của các chất.",
      ],
    },
    {
      id: "10-c4",
      timeline: "Tháng 12 (Tuần 1 – Tuần 4)",
      targetDate: "Hoàn thành trước 31/12",
      title: "Chương 4: Phản ứng oxi hóa – khử",
      formulas: "Fe²⁺ → Fe³⁺ + 1e • MnO₄⁻, Cr₂O₇²⁻, HNO₃, H₂SO₄ đặc",
      requirements: [
        "Xác định được số oxi hóa của nguyên tử các nguyên tố trong đơn chất, hợp chất và ion.",
        "Nêu được khái niệm chất oxi hóa, chất khử, sự oxi hóa, sự khử và lập được phương trình hóa học của phản ứng oxi hóa – khử bằng phương pháp thăng bằng electron.",
      ],
    },
    {
      id: "10-c5",
      timeline: "Tháng 01 – Tháng 02",
      targetDate: "Hoàn thành trước 28/02",
      title: "Chương 5: Năng lượng hóa học",
      formulas: "ΔrH°₂₉₈ • ΔfH°₂₉₈ • Năng lượng liên kết (E_b)",
      requirements: [
        "Phân biệt được phản ứng tỏa nhiệt (ΔrH°₂₉₈ < 0) và phản ứng thu nhiệt (ΔrH°₂₉₈ > 0); nêu được ý nghĩa của biến thiên enthalpy chuẩn.",
        "Tính được biến thiên enthalpy của phản ứng dựa vào nhiệt tạo thành chuẩn (ΔfH°₂₉₈) hoặc năng lượng liên kết (E_b).",
      ],
    },
    {
      id: "10-c6",
      timeline: "Tháng 03 (Tuần 1 – Tuần 4)",
      targetDate: "Hoàn thành trước 31/03",
      title: "Chương 6: Tốc độ phản ứng hóa học",
      formulas: "v = k·C_Aᵃ·C_Bᵇ • Hệ số nhiệt độ Van't Hoff (γ)",
      requirements: [
        "Trình bày được khái niệm tốc độ phản ứng, tốc độ trung bình và biểu thức định luật tác dụng khối lượng.",
        "Giải thích được các yếu tố ảnh hưởng đến tốc độ phản ứng (nồng độ, nhiệt độ, áp suất, diện tích bề mặt, chất xúc tác) và hệ số nhiệt độ Van't Hoff.",
      ],
    },
    {
      id: "10-c7",
      timeline: "Tháng 04 – Tháng 05",
      targetDate: "Hoàn thành trước 15/05",
      title: "Chương 7: Nguyên tố nhóm VIIA (Halogen)",
      formulas: "F₂, Cl₂, Br₂, I₂ • HF, HCl, HBr, HI • NaClO, CaOCl₂ • AgNO₃",
      requirements: [
        "Phát biểu được xu hướng biến đổi tính chất vật lí và tính chất hóa học (tính oxi hóa giảm dần từ fluorine đến iodine) của các đơn chất nhóm VIIA.",
        "Giải thích được xu hướng biến đổi tính acid của dãy hydrohalic acid (HF < HCl < HBr < HI), tính khử của các ion halide (F⁻, Cl⁻, Br⁻, I⁻) và nhận biết bằng dung dịch AgNO₃.",
      ],
    },
  ],
  "11": [
    {
      id: "11-c1",
      timeline: "Tháng 09 (Tuần 1 – Tuần 4)",
      targetDate: "Hoàn thành trước 30/09",
      title: "Chương 1: Cân bằng hóa học",
      formulas: "K_C = [C]ᶜ[D]ᵈ / ([A]ᵃ[B]ᵇ) • H⁺, OH⁻ • pH = -lg[H⁺]",
      requirements: [
        "Trình bày được khái niệm phản ứng thuận nghịch, trạng thái cân bằng hóa học, hằng số cân bằng (K_C) và vận dụng nguyên lí chuyển dịch cân bằng Le Chatelier.",
        "Nêu được khái niệm sự điện li, thuyết acid – base của Brønsted – Lowry, tính pH của dung dịch và nguyên tắc chuẩn độ acid – base.",
      ],
    },
    {
      id: "11-c2",
      timeline: "Tháng 10 (Tuần 1 – Tuần 4)",
      targetDate: "Hoàn thành trước 31/10",
      title: "Chương 2: Nitrogen và Sulfur",
      formulas: "N₂, NH₃, NH₄⁺, HNO₃ • S, SO₂, SO₃, H₂SO₄, SO₄²⁻",
      requirements: [
        "Giải thích được tính trơ của đơn chất nitrogen ở nhiệt độ thường, tính chất của ammonia (NH₃), muối ammonium (NH₄⁺), nitric acid (HNO₃) và hiện tượng phú dưỡng.",
        "Trình bày được tính chất của sulfur (S), sulfur dioxide (SO₂), sulfuric acid (H₂SO₄ loãng và đặc) và cách nhận biết ion sulfate (SO₄²⁻) bằng Ba²⁺.",
      ],
    },
    {
      id: "11-c3",
      timeline: "Tháng 11 (Tuần 1 – Tuần 4)",
      targetDate: "Hoàn thành trước 30/11",
      title: "Chương 3: Đại cương về Hóa học hữu cơ",
      formulas: "-OH, -CHO, -COOH, -NH₂ • Phổ IR & Phổ khối lượng MS",
      requirements: [
        "Nêu được khái niệm hợp chất hữu cơ, nhóm chức, đồng đẳng, đồng phân và sử dụng phổ hồng ngoại (IR) để xác định nhóm chức cơ bản.",
        "Trình bày được các phương pháp tách biệt và tinh chế hợp chất hữu cơ (chưng cất, chiết, kết tinh, sắc kí cột) và thiết lập công thức phân tử từ phổ khối lượng (MS).",
      ],
    },
    {
      id: "11-c4",
      timeline: "Tháng 12 – Tháng 01",
      targetDate: "Hoàn thành trước 25/01",
      title: "Chương 4: Hydrocarbon",
      formulas: "CₙH₂ₙ₊₂ • CₙH₂ₙ • CₙH₂ₙ₋₂ • C₆H₆, C₆H₅CH₃, C₆H₅CH=CH₂",
      requirements: [
        "Gọi được tên của alkane, alkene, alkyne, arene và viết được các đồng phân cấu tạo, đồng phân hình học (cis-trans).",
        "Trình bày được tính chất hóa học đặc trưng: phản ứng thế, cracking, reforming của alkane; phản ứng cộng (quy tắc Markovnikov), trùng hợp của alkene/alkyne; phản ứng của arene.",
      ],
    },
    {
      id: "11-c5",
      timeline: "Tháng 02 – Tháng 03",
      targetDate: "Hoàn thành trước 25/03",
      title: "Chương 5: Dẫn xuất Halogen – Alcohol – Phenol",
      formulas: "R-X • C₂H₅OH, C₂H₄(OH)₂, C₃H₅(OH)₃ • C₆H₅OH",
      requirements: [
        "Gọi được tên của dẫn xuất halogen, alcohol, phenol; giải thích được ảnh hưởng của liên kết hydrogen đến nhiệt độ sôi và độ tan của alcohol.",
        "Trình bày được phản ứng thế nguyên tử halogen, phản ứng tách HX (quy tắc Zaitsev); phản ứng của alcohol (tác dụng Na, Cu(OH)₂, tạo alkene/ether, oxi hóa) và phenol.",
      ],
    },
    {
      id: "11-c6",
      timeline: "Tháng 04 – Tháng 05",
      targetDate: "Hoàn thành trước 15/05",
      title: "Chương 6: Hợp chất Carbonyl (Aldehyde – Ketone) – Carboxylic acid",
      formulas: "HCHO, CH₃CHO, CH₃COCH₃ • [Ag(NH₃)₂]OH • RCOOH",
      requirements: [
        "Gọi tên của aldehyde, ketone, carboxylic acid; trình bày phản ứng khử, oxi hóa aldehyde (thuốc thử Tollens [Ag(NH₃)₂]⁺, Cu(OH)₂/OH⁻, phản ứng tạo iodoform CHI₃).",
        "Trình bày được tính acid và phản ứng ester hóa thuận nghịch của carboxylic acid; ứng dụng điều chế trong thực tiễn.",
      ],
    },
  ],
  "12": [
    {
      id: "12-c1",
      timeline: "Tháng 09 (Tuần 1 – Tuần 4)",
      targetDate: "Hoàn thành trước 30/09",
      title: "Chương 1: Ester – Lipid",
      formulas: "RCOOR' • CH₃COOC₂H₅ • (RCOO)₃C₃H₅ • RCOONa",
      requirements: [
        "Nêu được khái niệm, đặc điểm cấu tạo phân tử và gọi được tên các ester đơn giản.",
        "Trình bày được tính chất hóa học đặc trưng của ester (phản ứng thủy phân trong môi trường acid H⁺ và xà phòng hóa trong dung dịch kiềm OH⁻) và phương pháp điều chế.",
        "Trình bày được khái niệm lipid, chất béo, acid béo; phân biệt được xà phòng và chất giặt rửa tổng hợp.",
      ],
    },
    {
      id: "12-c2",
      timeline: "Tháng 10 (Tuần 1 – Tuần 4)",
      targetDate: "Hoàn thành trước 31/10",
      title: "Chương 2: Carbohydrate",
      formulas: "C₆H₁₂O₆ (Glucose, Fructose) • C₁₂H₂₂O₁₁ • (C₆H₁₀O₅)ₙ",
      requirements: [
        "Nêu được khái niệm, cách phân loại carbohydrate; trình bày được cấu tạo dạng mạch hở và mạch vòng của glucose và fructose.",
        "Trình bày được tính chất hóa học cơ bản của glucose, fructose (tính chất polyalcohol, aldehyde, phản ứng lên men) và của saccharose, maltose, tinh bột, cellulose.",
      ],
    },
    {
      id: "12-c3",
      timeline: "Tháng 11 (Tuần 1 – Tuần 4)",
      targetDate: "Hoàn thành trước 30/11",
      title: "Chương 3: Hợp chất chứa Nitrogen",
      formulas: "R-NH₂, C₆H₅NH₂ • H₂N-R-COOH • Liên kết -CO-NH-",
      requirements: [
        "Phân loại và gọi tên các amine; trình bày tính base và phản ứng đặc trưng của amine, aniline (tác dụng với nước bromine tạo kết tủa 2,4,6-tribromoaniline).",
        "Nêu được cấu tạo phân tử (dạng ion lưỡng cực), tính chất lưỡng tính, tính điện di của amino acid; phản ứng tạo peptide.",
        "Trình bày được cấu trúc, phản ứng thủy phân, phản ứng màu biuret với Cu(OH)₂/OH⁻ của peptide/protein và vai trò xúc tác sinh học của enzyme.",
      ],
    },
    {
      id: "12-c4",
      timeline: "Tháng 12 (Tuần 1 – Tuần 4)",
      targetDate: "Hoàn thành trước 31/12",
      title: "Chương 4: Polymer",
      formulas: "(-CH₂-CH₂-)ₙ (PE) • (-CH₂-CHCl-)ₙ (PVC) • Nylon-6,6",
      requirements: [
        "Viết được công thức cấu tạo và gọi tên của các polymer thông dụng (chất dẻo, tơ, cao su, keo dán tổng hợp).",
        "Trình bày được tính chất vật lí, tính chất hóa học (giữ nguyên mạch, cắt mạch, tăng mạch) và phương pháp điều chế polymer bằng phản ứng trùng hợp hoặc trùng ngưng.",
      ],
    },
    {
      id: "12-c5",
      timeline: "Tháng 01 (Tuần 1 – Tuần 4)",
      targetDate: "Hoàn thành trước 31/01",
      title: "Chương 5: Pin điện và Điện phân",
      formulas: "Mⁿ⁺/M • E°_pin = E°_(+) - E°_(-) • Định luật Faraday",
      requirements: [
        "Mô tả được cặp oxi hóa – khử của kim loại; sử dụng bảng thế điện cực chuẩn để so sánh tính oxi hóa/khử và dự đoán chiều phản ứng.",
        "Nêu được cấu tạo, nguyên tắc hoạt động của pin Galvani và tính được sức điện động chuẩn (E°_pin).",
        "Trình bày được nguyên tắc (thứ tự) điện phân dung dịch và điện phân nóng chảy; áp dụng trong sản xuất Al, Na, Cl₂ và mạ điện.",
      ],
    },
    {
      id: "12-c6",
      timeline: "Tháng 02 (Tuần 1 – Tuần 4)",
      targetDate: "Hoàn thành trước 28/02",
      title: "Chương 6: Đại cương về Kim loại",
      formulas: "Nhiệt luyện (CO, H₂, Al) • Thủy luyện • Điện phân • Ăn mòn điện hóa",
      requirements: [
        "Giải thích được tính chất vật lí chung và tính chất hóa học cơ bản của kim loại dựa trên cấu tạo nguyên tử và liên kết kim loại.",
        "Trình bày được các phương pháp tách kim loại (nhiệt luyện, thủy luyện, điện phân) và quá trình tái chế kim loại.",
        "Nêu được khái niệm hợp kim, hai dạng ăn mòn kim loại (hóa học và điện hóa) cùng các phương pháp chống ăn mòn.",
      ],
    },
    {
      id: "12-c7",
      timeline: "Tháng 03 (Tuần 1 – Tuần 4)",
      targetDate: "Hoàn thành trước 31/03",
      title: "Chương 7: Nguyên tố nhóm IA và nhóm IIA",
      formulas: "Na, K, Mg, Ca, Ba • NaHCO₃, Na₂CO₃, CaCO₃, CaSO₄·2H₂O • Ca²⁺, Mg²⁺",
      requirements: [
        "Trình bày được trạng thái tự nhiên, xu hướng biến đổi tính chất vật lí và tính khử của các kim loại nhóm IA và nhóm IIA.",
        "Giải thích được tính chất và ứng dụng của NaCl, NaHCO₃, Na₂CO₃, CaCO₃, CaSO₄.",
        "Nêu được khái niệm nước cứng (tạm thời, vĩnh cửu, toàn phần chứa nhiều ion Ca²⁺, Mg²⁺), tác hại và các phương pháp làm mềm nước cứng.",
      ],
    },
    {
      id: "12-c8",
      timeline: "Tháng 04 – Tháng 05",
      targetDate: "Hoàn thành trước 15/05",
      title: "Chương 8: Sơ lược về dãy Kim loại chuyển tiếp thứ nhất và Phức chất",
      formulas: "Cr, Mn, Fe, Cu • [Ag(NH₃)₂]⁺ • [Cu(NH₃)₄]²⁺ • [CoCl₄]²⁻",
      requirements: [
        "Nêu được đặc điểm cấu hình electron [Ar]3d¹⁻¹⁰4s¹⁻², các trạng thái oxi hóa phổ biến, màu sắc của các ion kim loại chuyển tiếp dãy thứ nhất (Fe²⁺, Fe³⁺, Cu²⁺, Cr³⁺, MnO₄⁻).",
        "Trình bày được nguyên tử trung tâm, phối tử (ligand), liên kết cho – nhận trong phức chất và dấu hiệu của phản ứng tạo phức trong dung dịch.",
      ],
    },
  ],
};

// ============================================================================
// 2. BỘ SỔ TAY BẢNG CÁC CHẤT CẦN NHỚ, CHỈ THỊ pH & DỤNG CỤ THÍ NGHIỆM
// ============================================================================
const FATTY_ACIDS_TABLE = [
  {
    name: "Palmitic acid",
    iupac: "Hexadecanoic acid",
    formula: "C₁₅H₃₁COOH (CH₃[CH₂]₁₄COOH)",
    triglyceride: "Tripalmitin: (C₁₅H₃₁COO)₃C₃H₅ (M = 806)",
    molarMass: "256 g/mol",
    property: "Acid béo no (0 liên kết π C=C) • Chất rắn màu trắng ở nhiệt độ thường",
  },
  {
    name: "Stearic acid",
    iupac: "Octadecanoic acid",
    formula: "C₁₇H₃₅COOH (CH₃[CH₂]₁₆COOH)",
    triglyceride: "Tristearin: (C₁₇H₃₅COO)₃C₃H₅ (M = 890)",
    molarMass: "284 g/mol",
    property: "Acid béo no (0 liên kết π C=C) • Chất rắn ở nhiệt độ thường (mỡ động vật)",
  },
  {
    name: "Oleic acid",
    iupac: "cis-Octadec-9-enoic acid",
    formula: "C₁₇H₃₃COOH",
    triglyceride: "Triolein: (C₁₇H₃₃COO)₃C₃H₅ (M = 884)",
    molarMass: "282 g/mol",
    property: "Acid béo không no (1 liên kết đôi C=C dạng cis, ω-9) • Chất lỏng (dầu thực vật)",
  },
  {
    name: "Linoleic acid",
    iupac: "(9Z,12Z)-Octadeca-9,12-dienoic acid",
    formula: "C₁₇H₃₁COOH",
    triglyceride: "Trilinolein: (C₁₇H₃₁COO)₃C₃H₅ (M = 878)",
    molarMass: "280 g/mol",
    property: "Acid béo không no (2 liên kết đôi C=C, thuộc nhóm omega-6) • Chất lỏng",
  },
];

const AMINO_ACIDS_TABLE = [
  {
    symbol: "Gly",
    commonName: "Glycine",
    iupacName: "Aminoethanoic acid",
    formula: "H₂N–CH₂–COOH",
    molarMass: "75",
    groups: "1 nhóm -NH₂ • 1 nhóm -COOH",
    litmus: "Không làm đổi màu quỳ tím (pH ≈ 6,0)",
  },
  {
    symbol: "Ala",
    commonName: "Alanine",
    iupacName: "2-Aminopropanoic acid",
    formula: "CH₃–CH(NH₂)–COOH",
    molarMass: "89",
    groups: "1 nhóm -NH₂ • 1 nhóm -COOH",
    litmus: "Không làm đổi màu quỳ tím (pH ≈ 6,0)",
  },
  {
    symbol: "Val",
    commonName: "Valine",
    iupacName: "2-Amino-3-methylbutanoic acid",
    formula: "(CH₃)₂CH–CH(NH₂)–COOH",
    molarMass: "117",
    groups: "1 nhóm -NH₂ • 1 nhóm -COOH",
    litmus: "Không làm đổi màu quỳ tím (pH ≈ 6,0)",
  },
  {
    symbol: "Glu",
    commonName: "Glutamic acid",
    iupacName: "2-Aminopentanedioic acid",
    formula: "HOOC–CH₂–CH₂–CH(NH₂)–COOH",
    molarMass: "147",
    groups: "1 nhóm -NH₂ • 2 nhóm -COOH",
    litmus: "Làm quỳ tím hóa ĐỎ/HỒNG (môi trường acid, pH ≈ 3,2) • Muối monosodium glutamate là bột ngọt",
  },
  {
    symbol: "Lys",
    commonName: "Lysine",
    iupacName: "2,6-Diaminohexanoic acid",
    formula: "H₂N–[CH₂]₄–CH(NH₂)–COOH",
    molarMass: "146",
    groups: "2 nhóm -NH₂ • 1 nhóm -COOH",
    litmus: "Làm quỳ tím hóa XANH (môi trường kiềm, pH ≈ 9,7)",
  },
];

const PH_INDICATORS_TABLE = [
  {
    indicator: "Quỳ tím (Litmus)",
    acidColor: "Đỏ / Hồng (pH < 5,0)",
    neutralColor: "Tím (5,0 ≤ pH ≤ 8,0)",
    baseColor: "Xanh lam (pH > 8,0)",
    application: "Nhận biết nhanh dung dịch acid (HCl, H₂SO₄, Glu) và base (NaOH, Ba(OH)₂, NH₃, alkylamine, Lys).",
  },
  {
    indicator: "Phenolphthalein",
    acidColor: "Không màu (pH < 8,2)",
    neutralColor: "Không màu (pH < 8,2)",
    baseColor: "Hồng / Đỏ tím (8,2 ≤ pH ≤ 10,0)",
    application: "Dùng phổ biến trong chuẩn độ acid mạnh – base mạnh (chuẩn độ HCl bằng dung dịch chuẩn NaOH).",
  },
  {
    indicator: "Methyl orange (Methyl da cam)",
    acidColor: "Đỏ (pH < 3,1)",
    neutralColor: "Vàng cam (3,1 ≤ pH ≤ 4,4)",
    baseColor: "Vàng (pH > 4,4)",
    application: "Chuẩn độ các base yếu hoặc phân biệt môi trường acid mạnh.",
  },
  {
    indicator: "Hồ tinh bột + Iodine (I₂)",
    acidColor: "Xanh tím đặc trưng ở nhiệt độ thường",
    neutralColor: "Mất màu khi đun nóng",
    baseColor: "Hiện lại màu xanh tím khi để nguội",
    application: "Nhận biết tinh bột (starch) hoặc nhận biết đơn chất iodine (I₂).",
  },
];

const LAB_EQUIPMENT_TABLE = [
  {
    name: "Burette (Buret chuẩn độ)",
    category: "Đo thể tích chính xác & Chuẩn độ",
    usage: "Dùng để nhỏ từ từ dung dịch chuẩn (biết trước nồng độ, VD: NaOH hoặc KMnO₄) xuống bình tam giác trong thí nghiệm chuẩn độ acid – base hoặc oxi hóa – khử.",
    note: "Tráng burette bằng chính dung dịch chuẩn sau khi rửa bằng nước cất; đọc vạch ở đáy mặt khum.",
  },
  {
    name: "Pipette (Pipet bầu / Pipet vạch)",
    category: "Lấy thể tích dung dịch chính xác",
    usage: "Hút chính xác một thể tích dung dịch xác định (VD: 10,0 mL dung dịch HCl hoặc FeSO₄) cho vào bình tam giác để đem đi chuẩn độ.",
    note: "Sử dụng quả bóp cao su để hút dung dịch, tuyệt đối không hút bằng miệng.",
  },
  {
    name: "Bình tam giác (Erlenmeyer flask)",
    category: "Dụng cụ chứa phản ứng chuẩn độ",
    usage: "Đựng dung dịch cần chuẩn độ và vài giọt chất chỉ thị (phenolphthalein). Thiết kế cổ hẹp giúp lắc đều dung dịch mà không bị văng ra ngoài.",
    note: "Chỉ tráng bình tam giác bằng nước cất, KHÔNG tráng bằng dung dịch cần chuẩn độ để tránh làm sai lệch số mol.",
  },
  {
    name: "Bình định mức (Volumetric flask)",
    category: "Pha chế dung dịch chuẩn",
    usage: "Dùng để pha chế dung dịch có nồng độ chính xác cao với thể tích cố định (50 mL, 100 mL, 250 mL...).",
    note: "Thêm nước cất đến gần vạch thì dùng ống hút nhỏ giọt thêm từng giọt cho đến khi đáy mặt khum chạm đúng vạch định mức.",
  },
  {
    name: "Phễu chiết (Separatory funnel)",
    category: "Tách chất lỏng không tan vào nhau",
    usage: "Dùng trong phương pháp chiết lỏng – lỏng để tách hai chất lỏng không hòa tan vào nhau (VD: tách tinh dầu và nước, hoặc tách ester nhẹ hơn nước).",
    note: "Chất lỏng có khối lượng riêng lớn hơn nằm ở lớp dưới được xả qua khóa trước.",
  },
  {
    name: "Ống sinh hàn (Condenser) & Bình cầu có nhánh",
    category: "Chưng cất tách chất",
    usage: "Dùng trong phương pháp chưng cất (dựa vào sự khác nhau về nhiệt độ sôi, VD: chưng cất ethanol – nước). Ống sinh hàn làm lạnh hơi thành chất lỏng.",
    note: "Nước làm lạnh trong ống sinh hàn luôn phải cho chảy NGƯỢC CHIỀU với chiều đi của hơi (vào đầu thấp, ra đầu cao).",
  },
];

const CHEM_REFERENCE_NOTES = [
  { formula: "AgCl↓", color: "Kết tủa trắng", note: "Không tan trong dung dịch HNO₃, tan trong dung dịch NH₃ tạo phức [Ag(NH₃)₂]⁺." },
  { formula: "AgBr↓", color: "Kết tủa vàng nhạt", note: "Không tan trong HNO₃, ít tan trong dung dịch NH₃ đậm đặc." },
  { formula: "AgI↓", color: "Kết tủa vàng đậm", note: "Không tan trong HNO₃ và không tan trong dung dịch NH₃." },
  { formula: "BaSO₄↓, CaSO₄↓", color: "Kết tủa trắng", note: "BaSO₄ bền, không tan trong các dung dịch acid mạnh." },
  { formula: "Cu(OH)₂↓", color: "Kết tủa xanh lam", note: "Tan trong NH₃ tạo phức [Cu(NH₃)₄](OH)₂ màu xanh thẫm; hòa tan polyalcohol (glucose, glycerol)." },
  { formula: "Fe(OH)₂↓ → Fe(OH)₃↓", color: "Trắng xanh → Nâu đỏ", note: "Fe(OH)₂ kết tủa trắng xanh dễ bị oxi hóa ngoài không khí thành Fe(OH)₃ màu nâu đỏ." },
  { formula: "Al(OH)₃↓, Zn(OH)₂↓", color: "Kết tủa keo trắng", note: "Hydroxide lưỡng tính, tan trong cả dung dịch acid mạnh (H⁺) và kiềm mạnh (OH⁻); Zn(OH)₂ tan thêm trong NH₃." },
  { formula: "C₆H₂Br₃OH↓ / C₆H₂Br₃NH₂↓", color: "Kết tủa trắng", note: "Phản ứng nhận biết phenol hoặc aniline bằng nước bromine (Br₂)." },
];

const FLASHCARDS_BANK = [
  { id: "sys-1", grade: "10", front: "Ở điều kiện chuẩn (25°C, 1 bar), 1 mol chất khí bất kì chiếm thể tích bao nhiêu lít?", back: "V = 24,79 L/mol (Công thức tính số mol khí ở đkc: n = V / 24,79)." },
  { id: "sys-2", grade: "10", front: "Trong một chu kì (từ trái sang phải), bán kính nguyên tử và độ âm điện biến đổi ra sao?", back: "Bán kính nguyên tử giảm dần; Độ âm điện tăng dần (do điện tích hạt nhân tăng)." },
  { id: "sys-3", grade: "11", front: "Theo thuyết Brønsted – Lowry, định nghĩa Acid và Base là gì?", back: "Acid là chất cho proton (H⁺); Base là chất nhận proton (H⁺)." },
  { id: "sys-4", grade: "11", front: "Thuốc thử nhận biết ion sulfate (SO₄²⁻) trong dung dịch là gì?", back: "Dung dịch muối barium (BaCl₂, Ba(NO₃)₂) trong môi trường acid tạo kết tủa trắng BaSO₄↓ không tan." },
  { id: "sys-5", grade: "12", front: "Công thức và phân tử khối (M) của 5 amino acid thường gặp: Gly, Ala, Val, Glu, Lys?", back: "Gly = 75 • Ala = 89 • Val = 117 • Lys = 146 (quỳ hóa xanh) • Glu = 147 (quỳ hóa đỏ)." },
  { id: "sys-6", grade: "12", front: "Công thức của 4 acid béo tiêu biểu và phân tử khối của chúng?", back: "Palmitic: C₁₅H₃₁COOH (M=256) • Stearic: C₁₇H₃₅COOH (M=284) • Oleic: C₁₇H₃₃COOH (M=282) • Linoleic: C₁₇H₃₁COOH (M=280)." },
];

const QUICK_QUIZ_BANK = [
  {
    q: "Amino acid nào sau đây làm quỳ tím chuyển sang màu xanh?",
    options: ["Glycine (Gly)", "Alanine (Ala)", "Lysine (Lys)", "Glutamic acid (Glu)"],
    ans: 2,
    explain: "Lysine có 2 nhóm -NH₂ và 1 nhóm -COOH nên dung dịch có môi trường base, làm quỳ tím hóa xanh.",
  },
  {
    q: "Chất béo lỏng (dầu thực vật) chứa chủ yếu gốc acid béo nào sau đây?",
    options: ["Palmitic acid & Stearic acid", "Oleic acid & Linoleic acid", "Formic acid & Acetic acid", "Glutamic acid"],
    ans: 1,
    explain: "Triolein và Trilinolein chứa gốc acid béo không no nên ở trạng thái lỏng ở điều kiện thường.",
  },
  {
    q: "Trong phương pháp chưng cất, nước làm lạnh trong ống sinh hàn được dẫn vào theo chiều nào?",
    options: ["Từ trên xuống dưới (cùng chiều hơi)", "Từ dưới lên trên (ngược chiều hơi)", "Chỉ cho vào một nửa ống", "Không cần dùng nước làm lạnh"],
    ans: 1,
    explain: "Nước lạnh đi từ đầu thấp lên đầu cao (ngược chiều hơi) để luôn điền đầy ống sinh hàn và làm lạnh hiệu quả nhất.",
  },
  {
    q: "Phân tử khối (M) của Tristearin (C₁₇H₃₅COO)₃C₃H₅ là bao nhiêu?",
    options: ["806 g/mol", "884 g/mol", "890 g/mol", "878 g/mol"],
    ans: 2,
    explain: "Tripalmitin = 806; Triolein = 884; Tristearin = 890; Trilinolein = 878.",
  },
  {
    q: "Khi chuẩn độ dung dịch HCl bằng dung dịch chuẩn NaOH với chỉ thị phenolphthalein, điểm tương đương nhận biết khi nào?",
    options: ["Dung dịch chuyển từ hồng sang không màu", "Dung dịch xuất hiện màu hồng nhạt bền trong 20–30 giây", "Xuất hiện kết tủa trắng", "Sủi bọt khí không màu"],
    ans: 1,
    explain: "Trong môi trường acid phenolphthalein không màu, khi vừa dư 1 giọt NaOH dung dịch sẽ chuyển sang màu hồng nhạt.",
  },
];

// ============================================================================
// 3. CẤU HÌNH THỜI KHÓA BIỂU LINH HOẠT & ĐỒNG BỘ LỊCH THỰC TẾ
// ============================================================================
const DAYS_OF_WEEK = [
  "Thứ Hai",
  "Thứ Ba",
  "Thứ Tư",
  "Thứ Năm",
  "Thứ Sáu",
  "Thứ Bảy",
  "Chủ Nhật",
];

const DEFAULT_TIME_SLOTS = [
  { id: "MORNING", label: "Ca Sáng (07:30 - 11:00)", startTime: "07:30", endTime: "11:00" },
  { id: "AFTERNOON", label: "Ca Chiều (14:00 - 17:30)", startTime: "14:00", endTime: "17:30" },
  { id: "EVENING_1", label: "Ca Tối 1 (18:00 - 19:30)", startTime: "18:00", endTime: "19:30" },
  { id: "EVENING_2", label: "Ca Tối 2 (19:45 - 21:15)", startTime: "19:45", endTime: "21:15" },
  { id: "EVENING_3", label: "Ca Tối Muộn (21:00 - 22:30)", startTime: "21:00", endTime: "22:30" },
];

const toDateKey = (dateObj) => {
  const y = dateObj.getFullYear();
  const m = String(dateObj.getMonth() + 1).padStart(2, "0");
  const d = String(dateObj.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

const getMondayOfDate = (dateObj) => {
  const d = new Date(dateObj);
  d.setHours(0, 0, 0, 0);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  return d;
};

const getWeekDaysInfo = (weekOffset = 0) => {
  const now = new Date();
  const currentMonday = getMondayOfDate(now);
  const targetMonday = new Date(currentMonday);
  targetMonday.setDate(currentMonday.getDate() + weekOffset * 7);

  const weekKey = toDateKey(targetMonday);
  const todayKey = toDateKey(now);

  const days = DAYS_OF_WEEK.map((dayLabel, idx) => {
    const dt = new Date(targetMonday);
    dt.setDate(targetMonday.getDate() + idx);
    const dateKey = toDateKey(dt);
    const shortDate = `${String(dt.getDate()).padStart(2, "0")}/${String(
      dt.getMonth() + 1
    ).padStart(2, "0")}`;
    const fullDate = `${shortDate}/${dt.getFullYear()}`;
    return {
      dayOfWeek: dayLabel,
      dateObj: dt,
      dateKey,
      shortDate,
      fullDate,
      isToday: dateKey === todayKey,
    };
  });

  const sunday = days[6];
  return {
    weekKey,
    weekLabel: `Tuần từ ${days[0].fullDate} đến ${sunday.fullDate}`,
    days,
  };
};

const getLiveSessionStatus = (dayDateKey, startTimeStr, endTimeStr, nowObj) => {
  const todayKey = toDateKey(nowObj);
  if (dayDateKey < todayKey) {
    return { code: "PAST", label: "Đã qua", color: "bg-black/25 text-gray-200" };
  }
  if (dayDateKey > todayKey) {
    return null;
  }
  const parseMin = (str) => {
    if (!str || !str.includes(":")) return null;
    const [h, m] = str.split(":").map((x) => parseInt(x, 10));
    if (isNaN(h) || isNaN(m)) return null;
    return h * 60 + m;
  };
  const startM = parseMin(startTimeStr);
  const endM = parseMin(endTimeStr);
  const nowM = nowObj.getHours() * 60 + nowObj.getMinutes();

  if (startM !== null && endM !== null) {
    if (nowM >= startM && nowM <= endM) {
      return {
        code: "LIVE",
        label: "🟢 Đang diễn ra",
        color: "bg-emerald-400 text-[#1B3B48] animate-pulse",
      };
    }
    if (nowM < startM) {
      const diff = startM - nowM;
      const hLeft = Math.floor(diff / 60);
      const mLeft = diff % 60;
      return {
        code: "UPCOMING",
        label:
          hLeft > 0
            ? `🟡 Sau ${hLeft}g${mLeft}p`
            : `🟡 Bắt đầu sau ${mLeft} phút`,
        color: "bg-[#E9C46A] text-[#1B3B48]",
      };
    }
    return {
      code: "FINISHED_TODAY",
      label: "✓ Đã học hôm nay",
      color: "bg-white/20 text-white",
    };
  }
  return {
    code: "TODAY",
    label: "Hôm nay",
    color: "bg-[#E9C46A] text-[#1B3B48]",
  };
};

const DEFAULT_ACHIEVEMENTS = [];

const INITIAL_STATE = {
  teacherPassword: TEACHER_INFO.defaultPass,
  academicYears: DEFAULT_ACADEMIC_YEARS,
  currentAcademicYear: "2026 - 2027",
  curriculum: DEFAULT_CURRICULUM,
  timeSlots: DEFAULT_TIME_SLOTS,
  classes: [],
  students: [],
  announcements: [],
  calendarEvents: [],
  documents: [],
  examPapers: [],
  examSubmissions: [],
  homeworks: [],
  homeworkSubmissions: [],
  customFlashcards: [],
  attendanceSessions: [],
  achievements: [],
  sosQuestions: [],
  chemFeedPosts: [],
  lastUpdated: "",
};

const safeGetStorage = (key, fallback = null) => {
  try {
    const val = localStorage.getItem(key);
    return val !== null ? val : fallback;
  } catch (e) {
    return fallback;
  }
};

const safeSetStorage = (key, val) => {
  try {
    localStorage.setItem(key, val);
  } catch (e) {
    // Ignore storage quota or sandbox errors
  }
};

export default function App() {
  useEffect(() => {
    if (!document.getElementById("tailwind-cdn-script")) {
      const script = document.createElement("script");
      script.id = "tailwind-cdn-script";
      script.src = "https://cdn.tailwindcss.com";
      document.head.appendChild(script);
    }
  }, []);

  // Thông báo Toast & Hộp thoại Xác nhận nội bộ (thay thế alert/confirm)
  const [toastMsg, setToastMsg] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState(null);

  // Chuông thông báo (Notification Bell)
  const [showBellDropdown, setShowBellDropdown] = useState(false);
  const [readNotifIds, setReadNotifIds] = useState(() => {
    const saved = safeGetStorage("data_nhatha_read_notifs", "[]");
    try {
      return JSON.parse(saved) || [];
    } catch (e) {
      return [];
    }
  });

  const markAllNotificationsRead = (idsList) => {
    const merged = Array.from(new Set([...readNotifIds, ...idsList]));
    setReadNotifIds(merged);
    safeSetStorage("data_nhatha_read_notifs", JSON.stringify(merged));
  };

  const markSingleNotificationRead = (id) => {
    if (!id || readNotifIds.includes(id)) return;
    const next = [...readNotifIds, id];
    setReadNotifIds(next);
    safeSetStorage("data_nhatha_read_notifs", JSON.stringify(next));
  };

  const notify = (text, type = "info") => {
    setToastMsg({ text, type, id: Date.now() });
  };

  useEffect(() => {
    if (!toastMsg) return;
    const t = setTimeout(() => setToastMsg(null), 4200);
    return () => clearTimeout(t);
  }, [toastMsg]);

  const askConfirm = (message, onConfirm) => {
    setConfirmDialog({ message, onConfirm });
  };

  // Đồng hồ thời gian thực chạy từng giây
  const [realTimeNow, setRealTimeNow] = useState(() => new Date());
  useEffect(() => {
    const timer = setInterval(() => {
      setRealTimeNow(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const [firebaseUrl, setFirebaseUrl] = useState(() => {
    const saved = safeGetStorage("data_nhatha_firebase_url", "");
    return DEFAULT_FIREBASE_URL || saved || "";
  });
  const [tempFirebaseInput, setTempFirebaseInput] = useState(firebaseUrl);
  const [syncStatus, setSyncStatus] = useState("idle");
  const [lastSyncTime, setLastSyncTime] = useState("");
  const [showCloudModal, setShowCloudModal] = useState(false);

  const [appData, setAppData] = useState(() => {
    const local = safeGetStorage("data_nhatha_classroom_v8", null);
    if (local) {
      try {
        const parsed = JSON.parse(local);
        return {
          ...INITIAL_STATE,
          ...parsed,
          academicYears:
            parsed.academicYears && parsed.academicYears.length > 0
              ? parsed.academicYears
              : DEFAULT_ACADEMIC_YEARS,
          currentAcademicYear:
            parsed.currentAcademicYear || INITIAL_STATE.currentAcademicYear,
          curriculum: parsed.curriculum || DEFAULT_CURRICULUM,
          timeSlots:
            parsed.timeSlots && parsed.timeSlots.length > 0
              ? parsed.timeSlots
              : DEFAULT_TIME_SLOTS,
          homeworks: parsed.homeworks || [],
          homeworkSubmissions: parsed.homeworkSubmissions || [],
          customFlashcards: parsed.customFlashcards || [],
          attendanceSessions: parsed.attendanceSessions || [],
          classes: parsed.classes || [],
          achievements: (parsed.achievements || []).filter(
            (a) => !String(a.id || "").startsWith("ACH_SAMPLE_")
          ),
        };
      } catch (e) {
        return INITIAL_STATE;
      }
    }
    return INITIAL_STATE;
  });

  // Trạng thái Chọn Năm Học Toàn Cục ("ALL" hoặc cụ thể như "2026 - 2027")
  const [selectedAcademicYear, setSelectedAcademicYear] = useState(
    () => appData.currentAcademicYear || "2026 - 2027"
  );
  const [showYearManagerModal, setShowYearManagerModal] = useState(false);
  const [newYearInput, setNewYearInput] = useState("");

  // Bộ lọc Bảng vàng ngoài màn hình đăng nhập
  const [publicHonorFilter, setPublicHonorFilter] = useState("ALL");
  const [publicHonorYearFilter, setPublicHonorYearFilter] = useState("ALL");

  // Trạng thái Đăng nhập (Bảo mật tuyệt đối)
  const [currentUser, setCurrentUser] = useState(null);
  const [loginAccount, setLoginAccount] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  // Lịch sử điều hướng
  const [navStack, setNavStack] = useState(["home"]);
  const activeView = navStack[navStack.length - 1];

  const navigateTo = (view) => {
    if (!currentUser) return;
    if (view === "students_admin" && currentUser.role !== "teacher") {
      notify("Chỉ tài khoản Giáo viên mới có quyền truy cập khu vực này.", "error");
      return;
    }
    if (view === activeView) return;
    setNavStack((prev) => [...prev, view]);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goBack = () => {
    if (navStack.length > 1) {
      setNavStack((prev) => prev.slice(0, prev.length - 1));
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      setNavStack(["home"]);
    }
  };

  // Kiểm tra 1 bản ghi có thuộc Năm học đang chọn không
  const matchesSelectedYear = (itemYear) => {
    if (selectedAcademicYear === "ALL") return true;
    if (!itemYear) return true;
    return itemYear === selectedAcademicYear;
  };

  const isSameClass = (clsIdA, clsIdB) => {
    return (
      String(clsIdA || "").trim().toUpperCase() ===
      String(clsIdB || "").trim().toUpperCase()
    );
  };

  const getStudentsOfClass = (classId, studentsList = appData.students) => {
    return (studentsList || []).filter((s) => isSameClass(s.classId, classId));
  };

  // ============================================================================
  // ĐỒNG BỘ FIREBASE REALTIME DATABASE 2 CHIỀU
  // ============================================================================
  const cleanFirebaseEndpoint = (rawUrl) => {
    if (!rawUrl || !rawUrl.trim()) return "";
    let u = rawUrl.trim().replace(/\/+$/, "");
    if (!u.startsWith("http")) u = "https://" + u;
    return `${u}/classroom_nhatha_v8.json`;
  };

  const lastLocalSaveTsRef = React.useRef(0);

  const fetchFromFirebase = async (silent = false) => {
    const endpoint = cleanFirebaseEndpoint(firebaseUrl);
    if (!endpoint) return;
    // Không ghi đè nếu người dùng vừa thao tác lưu cục bộ trong vòng 15 giây qua
    if (silent && Date.now() - lastLocalSaveTsRef.current < 15000) return;
    if (!silent) setSyncStatus("syncing");
    try {
      const res = await fetch(endpoint);
      if (!res.ok) throw new Error("Network error");
      const remoteData = await res.json();
      if (remoteData && typeof remoteData === "object") {
        setAppData((prevLocal) => {
          const remoteTs = Number(remoteData.lastUpdatedTs || 0);
          const localTs = Number(prevLocal.lastUpdatedTs || 0);
          if (silent && localTs > remoteTs) {
            return prevLocal;
          }
          const merged = {
            ...INITIAL_STATE,
            ...remoteData,
            teacherPassword:
              remoteData.teacherPassword || TEACHER_INFO.defaultPass,
            academicYears:
              remoteData.academicYears && remoteData.academicYears.length > 0
                ? remoteData.academicYears
                : DEFAULT_ACADEMIC_YEARS,
            currentAcademicYear:
              remoteData.currentAcademicYear || INITIAL_STATE.currentAcademicYear,
            curriculum: remoteData.curriculum || DEFAULT_CURRICULUM,
            timeSlots:
              remoteData.timeSlots && remoteData.timeSlots.length > 0
                ? remoteData.timeSlots
                : DEFAULT_TIME_SLOTS,
            classes: remoteData.classes || [],
            students: remoteData.students || [],
            announcements: remoteData.announcements || [],
            calendarEvents: remoteData.calendarEvents || [],
            documents: remoteData.documents || [],
            examPapers: remoteData.examPapers || [],
            examSubmissions: remoteData.examSubmissions || [],
            homeworks: remoteData.homeworks || [],
            homeworkSubmissions: remoteData.homeworkSubmissions || [],
            customFlashcards: remoteData.customFlashcards || [],
            attendanceSessions: remoteData.attendanceSessions || [],
            achievements: (remoteData.achievements || []).filter(
              (a) => !String(a.id || "").startsWith("ACH_SAMPLE_")
            ),
            sosQuestions: remoteData.sosQuestions || [],
            chemFeedPosts: remoteData.chemFeedPosts || [],
          };
          safeSetStorage("data_nhatha_classroom_v8", JSON.stringify(merged));
          return merged;
        });
        setLastSyncTime(new Date().toLocaleTimeString("vi-VN"));
      }
      setSyncStatus("synced");
    } catch (err) {
      setSyncStatus("error");
    }
  };

  const saveToAll = async (nextData) => {
    const nowTs = Date.now();
    lastLocalSaveTsRef.current = nowTs;
    const payload = {
      ...nextData,
      lastUpdated: new Date().toLocaleString("vi-VN"),
      lastUpdatedTs: nowTs,
    };
    setAppData(payload);
    safeSetStorage("data_nhatha_classroom_v8", JSON.stringify(payload));

    const endpoint = cleanFirebaseEndpoint(firebaseUrl);
    if (!endpoint) return;

    setSyncStatus("syncing");
    try {
      const res = await fetch(endpoint, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to save");
      setSyncStatus("synced");
      setLastSyncTime(new Date().toLocaleTimeString("vi-VN"));
    } catch (e) {
      setSyncStatus("error");
    }
  };

  useEffect(() => {
    if (firebaseUrl) {
      fetchFromFirebase(false);
      const timer = setInterval(() => {
        fetchFromFirebase(true);
      }, 12000);
      return () => clearInterval(timer);
    }
  }, [firebaseUrl]);

  // ============================================================================
  // TẢI ẢNH & TÀI LIỆU LINH HOẠT
  // ============================================================================
  const handleFlexibleFileUpload = (e, callback) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const maxW = 900;
          const scale = img.width > maxW ? maxW / img.width : 1;
          canvas.width = img.width * scale;
          canvas.height = img.height * scale;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          const compressedDataUrl = canvas.toDataURL("image/jpeg", 0.72);
          callback({
            fileName: file.name,
            fileType: "image",
            dataUrl: compressedDataUrl,
          });
        };
        img.src = ev.target.result;
      };
      reader.readAsDataURL(file);
    } else {
      if (file.size > 2.5 * 1024 * 1024) {
        notify(
          "Tệp lớn hơn 2.5MB. Để tốc độ đồng bộ đám mây nhanh nhất, bạn nên dán kèm đường link Google Drive hoặc chọn tệp nhỏ hơn.",
          "warn"
        );
      }
      const reader = new FileReader();
      reader.onload = (ev) => {
        callback({
          fileName: file.name,
          fileType: "document",
          dataUrl: ev.target.result,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  // ============================================================================
  // XỬ LÝ ĐĂNG NHẬP BẢO MẬT (CHỈ 1 TÀI KHOẢN GV DUY NHẤT)
  // ============================================================================
  const handleLogin = (e) => {
    e.preventDefault();
    setLoginError("");
    const input = loginAccount.trim().toLowerCase();
    const pass = loginPassword.trim();

    if (input === TEACHER_INFO.email.toLowerCase()) {
      const validTeacherPass =
        appData.teacherPassword || TEACHER_INFO.defaultPass;
      if (pass === validTeacherPass) {
        setCurrentUser({
          role: "teacher",
          name: TEACHER_INFO.fullName,
          email: TEACHER_INFO.email,
        });
        setNavStack(["home"]);
        setLoginPassword("");
        return;
      } else {
        setLoginError("Mật khẩu tài khoản Giáo viên không chính xác.");
        return;
      }
    }

    const foundStudent = appData.students.find(
      (s) =>
        (s.email && s.email.toLowerCase() === input) ||
        (s.id && s.id.toLowerCase() === input) ||
        (s.name && s.name.toLowerCase() === input)
    );

    if (foundStudent && foundStudent.password === pass) {
      setCurrentUser({
        role: "student",
        studentId: foundStudent.id,
        name: foundStudent.name,
        classId: foundStudent.classId,
        grade: foundStudent.grade || "12",
        email: foundStudent.email,
      });
      setSelectedStudentId(foundStudent.id);
      if (foundStudent.academicYear) {
        setSelectedAcademicYear(foundStudent.academicYear);
      }
      setNavStack(["home"]);
      setLoginPassword("");
      return;
    }

    setLoginError(
      "Tài khoản hoặc mật khẩu không đúng. Vui lòng kiểm tra lại thông tin do Thầy Dương Anh Tuấn Anh cung cấp."
    );
  };

  // ============================================================================
  // TRẠNG THÁI QUẢN LÝ TRONG CÁC MỤC
  // ============================================================================
  const [selectedGradeTab, setSelectedGradeTab] = useState("12");
  const [selectedClassFilter, setSelectedClassFilter] = useState("ALL");
  const [selectedStudentId, setSelectedStudentId] = useState("");

  // Lọc danh sách Lớp và Học sinh theo Năm học đang chọn
  const yearFilteredClasses = (appData.classes || []).filter((c) =>
    matchesSelectedYear(c.academicYear)
  );
  const yearFilteredStudents = (appData.students || []).filter((s) =>
    matchesSelectedYear(s.academicYear)
  );

  useEffect(() => {
    if (currentUser?.role === "student") {
      setSelectedStudentId(currentUser.studentId);
    } else if (
      appData.students.length > 0 &&
      (!selectedStudentId ||
        !appData.students.some((s) => s.id === selectedStudentId))
    ) {
      setSelectedStudentId(appData.students[0].id);
    }
  }, [currentUser, appData.students, selectedStudentId]);

  // Tự động đồng bộ Mã lớp mặc định vào các Form khi Giáo viên tạo hoặc xóa lớp
  useEffect(() => {
    const firstClassId = appData.classes?.[0]?.id || "";
    const firstClassGrade = appData.classes?.[0]?.grade || "12";
    if (firstClassId) {
      setSingleStudent((prev) =>
        appData.classes.some((c) => isSameClass(c.id, prev.classId))
          ? prev
          : { ...prev, classId: firstClassId }
      );
      setCalForm((prev) =>
        prev.targetScope === "ALL" ||
        appData.classes.some((c) => isSameClass(c.id, prev.targetScope))
          ? prev
          : { ...prev, targetScope: firstClassId }
      );
      setDocForm((prev) =>
        prev.classId === "ALL" ||
        appData.classes.some((c) => isSameClass(c.id, prev.classId))
          ? prev
          : { ...prev, classId: firstClassId, grade: firstClassGrade }
      );
      setAchForm((prev) =>
        appData.classes.some((c) => isSameClass(c.id, prev.classId))
          ? prev
          : { ...prev, classId: firstClassId }
      );
    }
  }, [appData.classes]);

  const activeStudent =
    currentUser?.role === "student"
      ? appData.students.find((s) => s.id === currentUser.studentId)
      : appData.students.find((s) => s.id === selectedStudentId) ||
        yearFilteredStudents[0] ||
        appData.students[0] ||
        null;

  // Form Thông báo & Chế độ gửi Email + Phân loại 3 mục Tin tức (Mục 01)
  const [newsCategoryFilter, setNewsCategoryFilter] = useState("ALL");
  const [annForm, setAnnForm] = useState({
    title: "",
    category: "CLASS_NOTICE", // 'ACADEMIC' | 'TUITION' | 'CLASS_NOTICE'
    sendMode: "BULK",
    classId: "ALL",
    targetStudentId: "",
    content: "",
    attachmentName: "",
    attachmentType: "",
    attachmentDataUrl: "",
    sendEmailNow: true,
  });
  const [emailPreviewModal, setEmailPreviewModal] = useState(null);

  // ============================================================================
  // TRẠNG THÁI THỜI KHÓA BIỂU LINH HOẠT THEO TUẦN & ĐÍNH KÈM TÀI LIỆU BUỔI HỌC (MỤC 02)
  // ============================================================================
  const [selectedWeekOffset, setSelectedWeekOffset] = useState(0);
  const activeWeekInfo = getWeekDaysInfo(selectedWeekOffset);

  const [calendarFilterClass, setCalendarFilterClass] = useState("ALL");
  const [calForm, setCalForm] = useState({
    dayOfWeek: "Thứ Hai",
    slotMode: "EXISTING",
    slotId: "EVENING_1",
    newSlotLabel: "",
    startTime: "18:00",
    endTime: "19:30",
    repeatMode: "WEEK_ONLY",
    targetScope: "10A1",
    title: "",
    roomOrNote: "",
    attachedDocId: "",
    lessonDocTitle: "",
    lessonDocUrl: "",
    lessonDocFileName: "",
    lessonDocDataUrl: "",
  });

  const [showSlotManager, setShowSlotManager] = useState(false);
  const [newSlotForm, setNewSlotForm] = useState({
    label: "",
    startTime: "21:00",
    endTime: "22:00",
  });

  const [editingCalEvent, setEditingCalEvent] = useState(null);

  // Modal Đính kèm Tài liệu học hôm nay cho Lớp học (Trang chủ / Mục 09)
  const [editingClassDocsModal, setEditingClassDocsModal] = useState(null);

  // Form Chỉnh sửa Lộ trình Chương & YCCĐ + Tải tài liệu theo từng Lớp/Chương (Mục 03)
  const [editingChapter, setEditingChapter] = useState(null);
  const [newChapterForm, setNewChapterForm] = useState({
    grade: "12",
    timeline: "",
    targetDate: "",
    title: "",
    formulas: "",
    requirementsText: "",
  });
  const [curriculumClassFilter, setCurriculumClassFilter] = useState("ALL");
  const [activeChapterUploadId, setActiveChapterUploadId] = useState(null);
  const [chapterDocForm, setChapterDocForm] = useState({
    title: "",
    classId: "ALL",
    externalUrl: "",
    note: "",
    fileName: "",
    fileType: "",
    fileDataUrl: "",
  });

  // Form Bài kiểm tra trên lớp (Mục 04)
  const [classTestForm, setClassTestForm] = useState({
    testName: "",
    testType: "Kiểm tra định kỳ / 1 tiết",
    score: "",
    maxScore: "10",
    date: new Date().toLocaleDateString("vi-VN"),
    teacherNote: "",
    attachmentName: "",
    attachmentType: "",
    attachmentDataUrl: "",
  });

  // Form Tài liệu học tập & Giao Bài tập Trực tiếp qua Mail (Mục 05)
  const [docForm, setDocForm] = useState({
    title: "",
    grade: "12",
    classId: "12A1",
    chapterId: "12-c1",
    externalUrl: "",
    note: "",
    fileName: "",
    fileType: "",
    fileDataUrl: "",
  });
  const [docFilterClass, setDocFilterClass] = useState("ALL");
  const [docFilterChapter, setDocFilterChapter] = useState("ALL");

  const [hwForm, setHwForm] = useState({
    title: "",
    sendMode: "BULK",
    classId: "ALL",
    targetStudentId: "",
    dueDate: "",
    deadlineISO: "",
    description: "",
    fileUrl: "",
    submissionPortalLink:
      typeof window !== "undefined" ? window.location.href : "",
    fileName: "",
    fileType: "",
    fileDataUrl: "",
    sendEmailNow: true,
  });

  const [hwSubForm, setHwSubForm] = useState({
    homeworkId: "",
    studentId: "",
    studentNameCustom: "",
    studentClassCustom: "",
    studentNote: "",
    fileName: "",
    fileType: "",
    fileDataUrl: "",
  });
  const [previewSubmissionModal, setPreviewSubmissionModal] = useState(null);
  const [rosterFilterClass, setRosterFilterClass] = useState("ALL");
  const [rosterSearchQuery, setRosterSearchQuery] = useState("");

  // Trạng thái Ô kiểm tra HS nộp bài hay chưa & Chấm điểm nhập thẳng vào Hồ sơ học tập (Mục 05)
  const [selectedTrackerHwId, setSelectedTrackerHwId] = useState("ALL");
  const [trackerStatusFilter, setTrackerStatusFilter] = useState("ALL"); // 'ALL' | 'SUBMITTED' | 'NOT_SUBMITTED'
  const [gradingInputs, setGradingInputs] = useState({});

  // Form Đề thi & App Thi thử (Mục 06) - Chia theo Năm học & Hình thức (GKI, HKI, THPT...) + Tải tệp hoặc Link
  const [examForm, setExamForm] = useState({
    title: "",
    academicYear: appData.currentAcademicYear || "2026 - 2027",
    examCategory: "HK1_10",
    classId: "ALL",
    duration: "50 phút",
    fileUrl: "",
    appLink: "",
    fileName: "",
    fileType: "",
    fileDataUrl: "",
  });
  const [examFilterYear, setExamFilterYear] = useState("ALL");
  const [examFilterCategory, setExamFilterCategory] = useState("ALL");
  const [subForm, setSubForm] = useState({
    examId: "",
    claimedScore: "",
    imageName: "",
    imageDataUrl: "",
  });

  // Form Thành tích cá nhân: HSG, Đậu Đại học (Mục 07)
  const [achForm, setAchForm] = useState({
    studentName: "",
    classId: "12A1",
    academicYear: appData.currentAcademicYear || "2026 - 2027",
    category: "Đậu Đại học",
    title: "",
    scoreDetail: "",
    imageName: "",
    imageDataUrl: "",
  });

  // Sổ tay Hóa học, Tạo Flashcard Cá nhân, Pomodoro & Mini-Quiz (Mục 08)
  const [refTab, setRefTab] = useState("FATTY_ACIDS");
  const [molCalc, setMolCalc] = useState({
    mass: "",
    molarMass: "",
    gasVolume: "",
    solutionVolume: "",
  });
  const [flashcardSource, setFlashcardSource] = useState("ALL");
  const [flashcardGrade, setFlashcardGrade] = useState("12");
  const [cardIndex, setCardIndex] = useState(0);
  const [isCardFlipped, setIsCardFlipped] = useState(false);
  const [newFlashcardForm, setNewFlashcardForm] = useState({
    grade: "12",
    topic: "",
    front: "",
    back: "",
  });

  const [pomoSeconds, setPomoSeconds] = useState(25 * 60);
  const [pomoRunning, setPomoRunning] = useState(false);
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizSelected, setQuizSelected] = useState(null);
  const [quizScore, setQuizScore] = useState(0);

  useEffect(() => {
    if (!pomoRunning) return;
    const t = setInterval(() => {
      setPomoSeconds((prev) => {
        if (prev <= 1) {
          setPomoRunning(false);
          notify("🎉 Hoàn thành 25 phút tập trung ôn tập Hóa học!", "success");
          return 25 * 60;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [pomoRunning]);

  const [sosInput, setSosInput] = useState("");
  const [replyTexts, setReplyTexts] = useState({});

  // Trạng thái Mục 10: Chuyện Hóa Học Hằng Ngày & Góc Hỏi Bài Khó (Kiểu Facebook Feed + Điểm tương tác)
  const [feedFilterType, setFeedFilterType] = useState("ALL"); // 'ALL' | 'DAILY_STORY' | 'QUIZ_CHALLENGE' | 'STUDENT_QA'
  const [feedFilterGrade, setFeedFilterGrade] = useState("ALL");
  const [newPostForm, setNewPostForm] = useState({
    postType: "DAILY_STORY", // 'DAILY_STORY' (Bài báo / Chuyện Hóa học hằng ngày) | 'QUIZ_CHALLENGE' (Đố vui gợi mở có thưởng điểm) | 'STUDENT_QA' (Học sinh hỏi câu hỏi khó)
    grade: "ALL",
    classId: "ALL",
    title: "",
    content: "",
    articleUrl: "",
    rewardPoints: 5,
    correctAnswerHint: "",
    imageName: "",
    imageType: "",
    imageDataUrl: "",
    authorStudentId: "",
  });
  const [commentDrafts, setCommentDrafts] = useState({});
  const [commentAttachments, setCommentAttachments] = useState({});

  // Form Quản lý Lớp, Điểm danh nhanh, Excel & Mật khẩu GV (Mục 09)
  const [newClassForm, setNewClassForm] = useState({
    id: "",
    name: "",
    grade: "10",
    academicYear: appData.currentAcademicYear || "2026 - 2027",
    scheduleSummary: "",
  });
  const [singleStudent, setSingleStudent] = useState({
    name: "",
    classId: "10A1",
    email: "",
    password: "",
    targetScore: "8.5+",
    universityGoal: "",
  });
  const [excelBulkText, setExcelBulkText] = useState("");
  const [newTeacherPass, setNewTeacherPass] = useState("");

  const [attendanceModalClass, setAttendanceModalClass] = useState(null);
  const [sessionTopic, setSessionTopic] = useState("");
  const [sessionRecords, setSessionRecords] = useState({});
  const [sessionDocId, setSessionDocId] = useState("");
  const [sessionCustomDocTitle, setSessionCustomDocTitle] = useState("");
  const [sessionCustomDocUrl, setSessionCustomDocUrl] = useState("");

  // ============================================================================
  // HÀM QUẢN LÝ NĂM HỌC (THÊM NĂM HỌC MỚI / ĐẶT NĂM HỌC MẶC ĐỊNH)
  // ============================================================================
  const handleAddAcademicYear = (e) => {
    e.preventDefault();
    const y = newYearInput.trim();
    if (!y) return;
    const list = appData.academicYears || DEFAULT_ACADEMIC_YEARS;
    if (list.includes(y)) {
      notify("Năm học này đã có trong danh sách!", "warn");
      return;
    }
    const nextYears = [...list, y];
    saveToAll({
      ...appData,
      academicYears: nextYears,
      currentAcademicYear: y,
    });
    setSelectedAcademicYear(y);
    setNewYearInput("");
    notify(`Đã thêm và chuyển sang Năm học ${y}!`, "success");
  };

  const handleSetDefaultAcademicYear = (y) => {
    saveToAll({
      ...appData,
      currentAcademicYear: y,
    });
    setSelectedAcademicYear(y);
    notify(`Đã đặt Năm học ${y} làm năm học chính thức hiện tại.`, "success");
  };

  // ============================================================================
  // HÀM TẢI TÀI LIỆU LÊN (TỪ LỘ TRÌNH CHƯƠNG MỤC 03 HOẶC MỤC TÀI LIỆU MỤC 05)
  // -> TỰ ĐỘNG CẬP NHẬT MỤC TIN TỨC (PHÂN MỤC HỌC THUẬT)
  // ============================================================================
  const createDocumentAndAutoNews = ({
    title,
    grade,
    classId,
    chapterId,
    chapterTitle,
    externalUrl,
    note,
    fileName,
    fileType,
    fileDataUrl,
  }) => {
    const activeYear =
      selectedAcademicYear === "ALL"
        ? appData.currentAcademicYear || "2026 - 2027"
        : selectedAcademicYear;

    const newDoc = {
      id: "DOC_" + Date.now(),
      title: title.trim(),
      grade: grade || "12",
      classId: classId || "ALL",
      chapterId: chapterId || "",
      chapterTitle: chapterTitle || "Tài liệu chung",
      externalUrl: (externalUrl || "").trim(),
      note: (note || "").trim(),
      fileName: fileName || "",
      fileType: fileType || "",
      fileDataUrl: fileDataUrl || "",
      academicYear: activeYear,
      createdAt: new Date().toLocaleString("vi-VN"),
    };

    const classLabel =
      newDoc.classId === "ALL"
        ? `Khối ${newDoc.grade} (Tất cả các lớp)`
        : `Lớp ${newDoc.classId}`;

    // Tự động tạo bản tin Học thuật trong mục Tin tức (Mục 01)
    const autoNews = {
      id: "ANN_DOC_" + Date.now(),
      title: `📚 [Tài liệu mới] ${newDoc.title} — ${classLabel}`,
      category: "ACADEMIC",
      academicYear: activeYear,
      sendMode: "BULK",
      classId: newDoc.classId,
      targetStudentId: "",
      targetLabel: classLabel,
      content: `Thầy ${TEACHER_INFO.fullName} vừa tải lên tài liệu học tập mới:\n• Tên tài liệu: ${newDoc.title}\n• Thuộc chương: ${newDoc.chapterTitle} (Khối ${newDoc.grade})\n• Áp dụng cho: ${classLabel} (Năm học ${activeYear})${
        newDoc.note ? `\n• Ghi chú hướng dẫn: ${newDoc.note}` : ""
      }\n👉 Phụ huynh và học sinh có thể tải trực tiếp bên dưới hoặc xem trong Lộ trình Chương (Mục 03) và Kho Tài liệu (Mục 05).`,
      externalUrl: newDoc.externalUrl,
      attachmentName: newDoc.fileName,
      attachmentType: newDoc.fileType,
      attachmentDataUrl: newDoc.fileDataUrl,
      linkedDocId: newDoc.id,
      date: new Date().toLocaleString("vi-VN"),
      recipientCount: appData.students.filter(
        (s) => newDoc.classId === "ALL" || s.classId === newDoc.classId
      ).length,
    };

    saveToAll({
      ...appData,
      documents: [newDoc, ...(appData.documents || [])],
      announcements: [autoNews, ...(appData.announcements || [])],
    });

    notify(
      `Đã tải tài liệu "${newDoc.title}" lên ${classLabel} và tự động cập nhật vào Bản tin Học thuật!`,
      "success"
    );
    return newDoc;
  };

  // Xử lý tải tài liệu trực tiếp tại từng Chương trong Mục 03
  const handleUploadChapterDocument = (e, chap) => {
    e.preventDefault();
    if (!chapterDocForm.title.trim()) return;

    createDocumentAndAutoNews({
      title: chapterDocForm.title,
      grade: selectedGradeTab,
      classId: chapterDocForm.classId,
      chapterId: chap.id,
      chapterTitle: chap.title,
      externalUrl: chapterDocForm.externalUrl,
      note: chapterDocForm.note,
      fileName: chapterDocForm.fileName,
      fileType: chapterDocForm.fileType,
      fileDataUrl: chapterDocForm.fileDataUrl,
    });

    setChapterDocForm({
      title: "",
      classId: chapterDocForm.classId,
      externalUrl: "",
      note: "",
      fileName: "",
      fileType: "",
      fileDataUrl: "",
    });
    setActiveChapterUploadId(null);
  };

  // Xử lý tải tài liệu tại Mục 05 (Kho Tài liệu)
  const handleUploadDocInModule05 = (e) => {
    e.preventDefault();
    if (!docForm.title.trim()) return;

    const chapList = appData.curriculum?.[docForm.grade] || [];
    const foundChap = chapList.find((c) => c.id === docForm.chapterId);

    createDocumentAndAutoNews({
      title: docForm.title,
      grade: docForm.grade,
      classId: docForm.classId,
      chapterId: docForm.chapterId,
      chapterTitle: foundChap ? foundChap.title : "Tài liệu chuyên đề",
      externalUrl: docForm.externalUrl,
      note: docForm.note,
      fileName: docForm.fileName,
      fileType: docForm.fileType,
      fileDataUrl: docForm.fileDataUrl,
    });

    setDocForm({
      ...docForm,
      title: "",
      externalUrl: "",
      note: "",
      fileName: "",
      fileType: "",
      fileDataUrl: "",
    });
  };

  // ============================================================================
  // CÁC HÀM XỬ LÝ THỜI KHÓA BIỂU LINH HOẠT THEO TUẦN & CA HỌC TỰ DO
  // ============================================================================
  const activeTimeSlots =
    appData.timeSlots && appData.timeSlots.length > 0
      ? appData.timeSlots
      : DEFAULT_TIME_SLOTS;

  const handleAddCustomTimeSlot = (e) => {
    e.preventDefault();
    const st = newSlotForm.startTime || "20:00";
    const et = newSlotForm.endTime || "21:30";
    const lbl = newSlotForm.label.trim() || `Ca học (${st} - ${et})`;
    const newSlot = {
      id: "SLOT_" + Date.now(),
      label: lbl.includes("(") ? lbl : `${lbl} (${st} - ${et})`,
      startTime: st,
      endTime: et,
    };
    const nextSlots = [...activeTimeSlots, newSlot].sort((a, b) =>
      (a.startTime || "").localeCompare(b.startTime || "")
    );
    saveToAll({
      ...appData,
      timeSlots: nextSlots,
    });
    setCalForm((prev) => ({
      ...prev,
      slotMode: "EXISTING",
      slotId: newSlot.id,
      startTime: st,
      endTime: et,
    }));
    setNewSlotForm({ label: "", startTime: "21:00", endTime: "22:00" });
    notify("Đã thêm hàng khung giờ mới vào bảng lịch!", "success");
  };

  const handleDeleteTimeSlot = (slotId) => {
    if (activeTimeSlots.length <= 1) {
      notify("Bảng lịch cần giữ lại ít nhất 1 khung giờ.", "warn");
      return;
    }
    askConfirm(
      "Bạn có chắc muốn xóa hàng Khung giờ này khỏi bảng lịch không?",
      () => {
        const nextSlots = activeTimeSlots.filter((s) => s.id !== slotId);
        saveToAll({
          ...appData,
          timeSlots: nextSlots,
        });
        notify("Đã xóa khung giờ khỏi bảng lịch.", "info");
      }
    );
  };

  // Thêm Ca học mới vào Bảng Lịch (Hỗ trợ Đính kèm tài liệu buổi học hôm đó)
  const handleAddCalendarEvent = (e) => {
    e.preventDefault();
    if (!calForm.title.trim()) return;

    const isStudent = currentUser?.role === "student";
    let targetSlotId = calForm.slotId;
    let nextSlots = [...activeTimeSlots];

    const timeRangeText = `${calForm.startTime} - ${calForm.endTime}`;

    if (calForm.slotMode === "AUTO_NEW") {
      const customTitle = calForm.newSlotLabel.trim() || "Ca linh hoạt";
      const createdSlot = {
        id: "SLOT_" + Date.now(),
        label: `${customTitle} (${timeRangeText})`,
        startTime: calForm.startTime,
        endTime: calForm.endTime,
      };
      nextSlots = [...nextSlots, createdSlot].sort((a, b) =>
        (a.startTime || "").localeCompare(b.startTime || "")
      );
      targetSlotId = createdSlot.id;
    }

    const dayObj = activeWeekInfo.days.find(
      (d) => d.dayOfWeek === calForm.dayOfWeek
    );

    const activeYear =
      selectedAcademicYear === "ALL"
        ? appData.currentAcademicYear || "2026 - 2027"
        : selectedAcademicYear;

    // Kiểm tra thông tin tài liệu đính kèm buổi học hôm đó
    const linkedDocObj = (appData.documents || []).find(
      (d) => d.id === calForm.attachedDocId
    );

    const newEv = {
      id: "CAL" + Date.now(),
      academicYear: activeYear,
      dayOfWeek: calForm.dayOfWeek,
      slotId: targetSlotId,
      startTime: calForm.startTime,
      endTime: calForm.endTime,
      customTime: timeRangeText,
      repeatMode: calForm.repeatMode,
      weekKey:
        calForm.repeatMode === "WEEK_ONLY" ? activeWeekInfo.weekKey : "ALL",
      exactDate: dayObj ? dayObj.fullDate : "",
      excludedWeeks: [],
      targetScope: isStudent
        ? `HS:${currentUser.studentId}`
        : calForm.targetScope,
      ownerName: isStudent
        ? `Lịch cá nhân: ${currentUser.name}`
        : calForm.targetScope === "ALL"
        ? "Toàn bộ các lớp"
        : `Lớp ${calForm.targetScope}`,
      title: calForm.title.trim(),
      roomOrNote: calForm.roomOrNote.trim(),
      attachedDocId: calForm.attachedDocId || "",
      lessonDocTitle:
        calForm.lessonDocTitle.trim() ||
        (linkedDocObj ? linkedDocObj.title : ""),
      lessonDocUrl:
        calForm.lessonDocUrl.trim() ||
        (linkedDocObj ? linkedDocObj.externalUrl : ""),
      lessonDocFileName:
        calForm.lessonDocFileName ||
        (linkedDocObj ? linkedDocObj.fileName : ""),
      lessonDocDataUrl:
        calForm.lessonDocDataUrl ||
        (linkedDocObj ? linkedDocObj.fileDataUrl : ""),
      createdByRole: currentUser?.role || "teacher",
    };

    saveToAll({
      ...appData,
      timeSlots: nextSlots,
      calendarEvents: [...appData.calendarEvents, newEv],
    });
    setCalForm({
      ...calForm,
      slotMode: "EXISTING",
      slotId: targetSlotId,
      newSlotLabel: "",
      title: "",
      roomOrNote: "",
      attachedDocId: "",
      lessonDocTitle: "",
      lessonDocUrl: "",
      lessonDocFileName: "",
      lessonDocDataUrl: "",
    });
    notify("Đã lưu ca học và tài liệu đính kèm vào Bảng lịch!", "success");
  };

  // Lưu chỉnh sửa Giờ học / Ngày học / Tuần học & Tài liệu đính kèm của 1 thẻ trên Bảng Lịch
  const handleSaveEditedCalEvent = (e) => {
    e.preventDefault();
    if (!editingCalEvent) return;

    const updatedTimeRange = `${editingCalEvent.startTime || "18:00"} - ${
      editingCalEvent.endTime || "19:30"
    }`;

    const linkedDocObj = (appData.documents || []).find(
      (d) => d.id === editingCalEvent.attachedDocId
    );
    const resolvedDocTitle =
      (editingCalEvent.lessonDocTitle || "").trim() ||
      (linkedDocObj ? linkedDocObj.title : "");
    const resolvedDocUrl =
      (editingCalEvent.lessonDocUrl || "").trim() ||
      (linkedDocObj ? linkedDocObj.externalUrl : "");
    const resolvedDocFileName =
      editingCalEvent.lessonDocFileName ||
      (linkedDocObj ? linkedDocObj.fileName : "");
    const resolvedDocDataUrl =
      editingCalEvent.lessonDocDataUrl ||
      (linkedDocObj ? linkedDocObj.fileDataUrl : "");

    if (
      editingCalEvent.editScope === "THIS_WEEK_ONLY" &&
      editingCalEvent.repeatMode === "RECURRING"
    ) {
      const nextEvents = appData.calendarEvents.map((ev) => {
        if (ev.id === editingCalEvent.id) {
          const prevEx = ev.excludedWeeks || [];
          return {
            ...ev,
            excludedWeeks: prevEx.includes(activeWeekInfo.weekKey)
              ? prevEx
              : [...prevEx, activeWeekInfo.weekKey],
          };
        }
        return ev;
      });

      const overrideEv = {
        ...editingCalEvent,
        id: "CAL_OVR_" + Date.now(),
        repeatMode: "WEEK_ONLY",
        weekKey: activeWeekInfo.weekKey,
        customTime: updatedTimeRange,
        lessonDocTitle: resolvedDocTitle,
        lessonDocUrl: resolvedDocUrl,
        lessonDocFileName: resolvedDocFileName,
        lessonDocDataUrl: resolvedDocDataUrl,
      };
      delete overrideEv.editScope;

      saveToAll({
        ...appData,
        calendarEvents: [...nextEvents, overrideEv],
      });
      setEditingCalEvent(null);
      notify("Đã cập nhật lịch và tài liệu buổi học riêng cho tuần này!", "success");
      return;
    }

    const nextEvents = appData.calendarEvents.map((ev) =>
      ev.id === editingCalEvent.id
        ? {
            ...ev,
            dayOfWeek: editingCalEvent.dayOfWeek,
            slotId: editingCalEvent.slotId,
            startTime: editingCalEvent.startTime,
            endTime: editingCalEvent.endTime,
            customTime: updatedTimeRange,
            title: editingCalEvent.title,
            roomOrNote: editingCalEvent.roomOrNote,
            attachedDocId: editingCalEvent.attachedDocId || "",
            lessonDocTitle: resolvedDocTitle,
            lessonDocUrl: resolvedDocUrl,
            lessonDocFileName: resolvedDocFileName,
            lessonDocDataUrl: resolvedDocDataUrl,
            repeatMode: editingCalEvent.repeatMode,
            weekKey:
              editingCalEvent.repeatMode === "WEEK_ONLY"
                ? activeWeekInfo.weekKey
                : "ALL",
          }
        : ev
    );

    saveToAll({
      ...appData,
      calendarEvents: nextEvents,
    });
    setEditingCalEvent(null);
    notify("Đã lưu thay đổi ca học và tài liệu buổi học!", "success");
  };

  const handleCopyWeekToNextWeek = () => {
    const nextWeekInfo = getWeekDaysInfo(selectedWeekOffset + 1);
    const currentWeekOnlyEvents = appData.calendarEvents.filter(
      (ev) =>
        ev.repeatMode === "WEEK_ONLY" && ev.weekKey === activeWeekInfo.weekKey
    );
    if (currentWeekOnlyEvents.length === 0) {
      notify(
        "Các lịch cố định hàng tuần đã tự động hiển thị ở tuần sau. Đang chuyển sang tuần kế tiếp.",
        "info"
      );
      setSelectedWeekOffset((prev) => prev + 1);
      return;
    }
    const cloned = currentWeekOnlyEvents.map((ev, i) => ({
      ...ev,
      id: `CAL_CLONE_${Date.now()}_${i}`,
      weekKey: nextWeekInfo.weekKey,
    }));
    saveToAll({
      ...appData,
      calendarEvents: [...appData.calendarEvents, ...cloned],
    });
    setSelectedWeekOffset((prev) => prev + 1);
    notify(
      `Đã sao chép ${cloned.length} ca học linh hoạt sang ${nextWeekInfo.weekLabel}!`,
      "success"
    );
  };

  // Lấy danh sách Tài liệu học hôm nay của 1 Lớp (Kết hợp tài liệu đính kèm trên Lớp + tài liệu ca học hôm nay của Lớp)
  const getTodayMaterialsForClass = (cls) => {
    const todayInfo = activeWeekInfo.days.find((d) => d.isToday);
    const items = [];

    // 1. Tài liệu đính kèm trực tiếp vào Lớp học hôm nay
    if (cls.todayDocIds && cls.todayDocIds.length > 0) {
      cls.todayDocIds.forEach((docId) => {
        const d = (appData.documents || []).find((x) => x.id === docId);
        if (d) {
          items.push({
            id: d.id,
            source: "Lớp học",
            title: d.title,
            url: d.externalUrl,
            fileName: d.fileName,
            dataUrl: d.fileDataUrl,
          });
        }
      });
    }
    if (cls.todayCustomDocTitle) {
      items.push({
        id: `CLS_CUSTOM_${cls.id}`,
        source: "Bài học hôm nay",
        title: cls.todayCustomDocTitle,
        url: cls.todayCustomDocUrl || "",
        fileName: cls.todayCustomDocFileName || "",
        dataUrl: cls.todayCustomDocDataUrl || "",
      });
    }

    // 2. Tài liệu đính kèm trong Lịch học hôm nay của lớp đó
    if (todayInfo) {
      const todayClassEvents = (appData.calendarEvents || []).filter((ev) => {
        if (ev.dayOfWeek !== todayInfo.dayOfWeek) return false;
        if (ev.targetScope !== cls.id && ev.targetScope !== "ALL") return false;
        const isRec = !ev.repeatMode || ev.repeatMode === "RECURRING";
        if (isRec) {
          return !(ev.excludedWeeks || []).includes(activeWeekInfo.weekKey);
        }
        return ev.weekKey === activeWeekInfo.weekKey;
      });

      todayClassEvents.forEach((ev) => {
        if (ev.lessonDocTitle || ev.attachedDocId) {
          const linked = (appData.documents || []).find(
            (d) => d.id === ev.attachedDocId
          );
          items.push({
            id: `EV_DOC_${ev.id}`,
            source: `Ca ${ev.customTime || ""}`,
            title: ev.lessonDocTitle || linked?.title || "Tài liệu buổi học",
            url: ev.lessonDocUrl || linked?.externalUrl || "",
            fileName: ev.lessonDocFileName || linked?.fileName || "",
            dataUrl: ev.lessonDocDataUrl || linked?.fileDataUrl || "",
          });
        }
      });
    }

    return items;
  };

  const handleSaveClassTodayMaterials = (e) => {
    e.preventDefault();
    if (!editingClassDocsModal) return;

    const nextClasses = appData.classes.map((c) =>
      c.id === editingClassDocsModal.id
        ? {
            ...c,
            todayDocIds: editingClassDocsModal.todayDocIds || [],
            todayCustomDocTitle: (
              editingClassDocsModal.todayCustomDocTitle || ""
            ).trim(),
            todayCustomDocUrl: (
              editingClassDocsModal.todayCustomDocUrl || ""
            ).trim(),
            todayCustomDocFileName:
              editingClassDocsModal.todayCustomDocFileName || "",
            todayCustomDocDataUrl:
              editingClassDocsModal.todayCustomDocDataUrl || "",
          }
        : c
    );

    saveToAll({
      ...appData,
      classes: nextClasses,
    });
    setEditingClassDocsModal(null);
    notify(
      `Đã cập nhật tài liệu học hôm nay cho Lớp ${editingClassDocsModal.id}!`,
      "success"
    );
  };

  // ============================================================================
  // HÀM NGHIỆP VỤ QUẢN LÝ LỚP, ĐIỂM DANH, GIAO BÀI TẬP QUA MAIL & FLASHCARD CÁ NHÂN
  // ============================================================================
  // ============================================================================
  // HÀM XỬ LÝ MỤC 10: CHUYỆN HÓA HỌC HẰNG NGÀY, BÀI BÁO GỢI MỞ & HỎI ĐÁP KIỂU FACEBOOK
  // ============================================================================
  const adjustStudentEngagementPoints = (studentId, deltaPoints, reasonText = "") => {
    if (!studentId || studentId === "TEACHER") return;
    setAppData((prev) => {
      const nextStudents = (prev.students || []).map((st) => {
        if (st.id !== studentId) return st;
        const currentPts = Number(st.engagementPoints || 0);
        const nextPts = Math.max(0, currentPts + Number(deltaPoints || 0));
        return {
          ...st,
          engagementPoints: nextPts,
        };
      });
      const payload = {
        ...prev,
        students: nextStudents,
        lastUpdated: new Date().toLocaleString("vi-VN"),
        lastUpdatedTs: Date.now(),
      };
      safeSetStorage("data_nhatha_classroom_v8", JSON.stringify(payload));
      return payload;
    });
  };

  const handleCreateChemFeedPost = (e) => {
    e.preventDefault();
    if (!newPostForm.content.trim() && !newPostForm.title.trim()) {
      notify("Vui lòng nhập tiêu đề hoặc nội dung bài viết / câu hỏi!", "warn");
      return;
    }

    const activeYear =
      selectedAcademicYear === "ALL"
        ? appData.currentAcademicYear || "2026 - 2027"
        : selectedAcademicYear;

    let authorRole = currentUser?.role || "teacher";
    let authorId = "TEACHER";
    let authorName = `Thầy ${TEACHER_INFO.fullName}`;
    let authorClassId = newPostForm.classId || "ALL";

    if (currentUser?.role === "student") {
      authorRole = "student";
      authorId = currentUser.studentId;
      authorName = currentUser.name;
      authorClassId = currentUser.classId;
    } else if (
      newPostForm.postType === "STUDENT_QA" &&
      newPostForm.authorStudentId
    ) {
      const foundSt = (appData.students || []).find(
        (s) => s.id === newPostForm.authorStudentId
      );
      if (foundSt) {
        authorRole = "student";
        authorId = foundSt.id;
        authorName = foundSt.name;
        authorClassId = foundSt.classId;
      }
    }

    const effectiveType =
      currentUser?.role === "student" ? "STUDENT_QA" : newPostForm.postType;

    const newPost = {
      id: "POST_" + Date.now(),
      academicYear: activeYear,
      postType: effectiveType, // 'DAILY_STORY' | 'QUIZ_CHALLENGE' | 'STUDENT_QA'
      grade: newPostForm.grade || "ALL",
      classId: authorClassId,
      authorId,
      authorName,
      authorRole,
      title: newPostForm.title.trim(),
      content: newPostForm.content.trim(),
      articleUrl: newPostForm.articleUrl.trim(),
      rewardPoints:
        effectiveType === "STUDENT_QA"
          ? 3
          : Number(newPostForm.rewardPoints) || 5,
      correctAnswerHint: newPostForm.correctAnswerHint.trim(),
      imageName: newPostForm.imageName,
      imageType: newPostForm.imageType,
      imageDataUrl: newPostForm.imageDataUrl,
      likes: [],
      loves: [],
      ideas: [],
      comments: [],
      isResolved: false,
      createdAt: new Date().toLocaleString("vi-VN"),
    };

    // Nếu học sinh đăng câu hỏi khó, thưởng +2 điểm tương tác chủ động học tập
    let nextStudents = [...(appData.students || [])];
    if (authorRole === "student" && authorId !== "TEACHER") {
      nextStudents = nextStudents.map((st) =>
        st.id === authorId
          ? { ...st, engagementPoints: Number(st.engagementPoints || 0) + 2 }
          : st
      );
    }

    saveToAll({
      ...appData,
      students: nextStudents,
      chemFeedPosts: [newPost, ...(appData.chemFeedPosts || [])],
    });

    setNewPostForm({
      ...newPostForm,
      title: "",
      content: "",
      articleUrl: "",
      correctAnswerHint: "",
      imageName: "",
      imageType: "",
      imageDataUrl: "",
    });

    notify(
      effectiveType === "STUDENT_QA"
        ? "🙋‍♂️ Đã đăng câu hỏi lên Bảng tin Hóa học! Thầy và các bạn sẽ sớm vào giải đáp."
        : "📰 Đã đăng bài viết mới lên Chuyện Hóa Học Hằng Ngày!",
      "success"
    );
  };

  const handleTogglePostReaction = (postId, reactionKey) => {
    const actorId =
      currentUser?.role === "student" ? currentUser.studentId : "TEACHER";
    const nextPosts = (appData.chemFeedPosts || []).map((post) => {
      if (post.id !== postId) return post;
      const list = post[reactionKey] || [];
      const exists = list.includes(actorId);
      const nextList = exists
        ? list.filter((x) => x !== actorId)
        : [...list, actorId];
      return {
        ...post,
        [reactionKey]: nextList,
      };
    });
    saveToAll({
      ...appData,
      chemFeedPosts: nextPosts,
    });
  };

  const handleAddPostComment = (e, post) => {
    e.preventDefault();
    const draftObj = commentDrafts[post.id] || {};
    const text = (draftObj.text || "").trim();
    const attach = commentAttachments[post.id] || null;
    if (!text && !attach) return;

    let commenterId =
      currentUser?.role === "student" ? currentUser.studentId : "TEACHER";
    let commenterName =
      currentUser?.role === "student"
        ? currentUser.name
        : `Thầy ${TEACHER_INFO.fullName}`;
    let commenterRole = currentUser?.role || "teacher";
    let commenterClass =
      currentUser?.role === "student" ? currentUser.classId : "Giáo viên";

    // Cho phép Giáo viên chọn đóng vai hoặc chọn tên Học sinh khi test bình luận
    if (currentUser?.role === "teacher" && draftObj.asStudentId) {
      const st = (appData.students || []).find(
        (s) => s.id === draftObj.asStudentId
      );
      if (st) {
        commenterId = st.id;
        commenterName = st.name;
        commenterRole = "student";
        commenterClass = st.classId;
      }
    }

    // Khi Học sinh bình luận trả lời đáp án hoặc giải bài giúp bạn -> Tự động +1 điểm tương tác tham gia
    const participationBonus = commenterRole === "student" ? 1 : 0;

    const newComment = {
      id: "CMT_" + Date.now(),
      authorId: commenterId,
      authorName: commenterName,
      authorRole: commenterRole,
      authorClass: commenterClass,
      text,
      attachmentName: attach?.fileName || "",
      attachmentType: attach?.fileType || "",
      attachmentDataUrl: attach?.dataUrl || "",
      isApprovedCorrect: false,
      awardedPoints: participationBonus,
      createdAt: new Date().toLocaleString("vi-VN"),
    };

    const nextPosts = (appData.chemFeedPosts || []).map((p) =>
      p.id === post.id
        ? { ...p, comments: [...(p.comments || []), newComment] }
        : p
    );

    let nextStudents = [...(appData.students || [])];
    if (commenterRole === "student" && commenterId !== "TEACHER") {
      nextStudents = nextStudents.map((st) =>
        st.id === commenterId
          ? {
              ...st,
              engagementPoints:
                Number(st.engagementPoints || 0) + participationBonus,
            }
          : st
      );
    }

    saveToAll({
      ...appData,
      students: nextStudents,
      chemFeedPosts: nextPosts,
    });

    setCommentDrafts((prev) => ({
      ...prev,
      [post.id]: { ...draftObj, text: "" },
    }));
    setCommentAttachments((prev) => ({
      ...prev,
      [post.id]: null,
    }));

    if (commenterRole === "student") {
      notify(
        `💬 Đã gửi bình luận! ${commenterName} nhận +1 điểm tương tác tích cực.`,
        "success"
      );
    }
  };

  // Giáo viên duyệt Bình luận Đáp án đúng / Lời giải hay -> Cộng điểm thưởng tương tác cho Học sinh
  const handleApproveCommentAnswer = (post, comment) => {
    const bonusPts = Number(post.rewardPoints || 5);
    const alreadyApproved = Boolean(comment.isApprovedCorrect);
    const delta = alreadyApproved ? -bonusPts : bonusPts;

    const nextPosts = (appData.chemFeedPosts || []).map((p) => {
      if (p.id !== post.id) return p;
      const updatedComments = (p.comments || []).map((c) =>
        c.id === comment.id
          ? {
              ...c,
              isApprovedCorrect: !alreadyApproved,
              awardedPoints: Math.max(0, Number(c.awardedPoints || 0) + delta),
            }
          : c
      );
      return {
        ...p,
        isResolved:
          !alreadyApproved ||
          updatedComments.some((c) => c.isApprovedCorrect),
        comments: updatedComments,
      };
    });

    let nextStudents = [...(appData.students || [])];
    if (comment.authorId && comment.authorId !== "TEACHER") {
      nextStudents = nextStudents.map((st) =>
        st.id === comment.authorId
          ? {
              ...st,
              engagementPoints: Math.max(
                0,
                Number(st.engagementPoints || 0) + delta
              ),
            }
          : st
      );
    }

    saveToAll({
      ...appData,
      students: nextStudents,
      chemFeedPosts: nextPosts,
    });

    notify(
      !alreadyApproved
        ? `🌟 Đã xác nhận Đáp án đúng / Lời giải hay! Thưởng +${bonusPts} điểm tương tác cho ${comment.authorName}.`
        : `Đã hủy xác nhận điểm thưởng của bình luận này.`,
      "success"
    );
  };

  // Quy đổi / Cộng điểm thưởng tương tác vào Hồ sơ học tập (Mục 04) của Học sinh
  const handleConvertEngagementToProfileScore = (student) => {
    const pts = Number(student.engagementPoints || 0);
    if (pts <= 0) {
      notify("Học sinh này chưa có điểm tương tác tích lũy để quy đổi!", "warn");
      return;
    }
    // Quy đổi: Điểm thưởng chuyên đề tương tác Hóa học (tối đa 10 điểm)
    const convertedScore = Math.min(10, Number((8 + Math.min(2, pts * 0.1)).toFixed(2)));
    const recordId = `ENGAGEMENT_BONUS_${student.id}`;
    const nowStr = new Date().toLocaleDateString("vi-VN");

    const nextStudents = (appData.students || []).map((st) => {
      if (st.id !== student.id) return st;
      const prevTests = st.inClassTests || [];
      const bonusTest = {
        id: recordId,
        testName: `Điểm thưởng Tương tác Hóa học (${pts} điểm tương tác)`,
        testType: "Điểm thưởng Tương tác & Giải đáp Hóa học",
        score: convertedScore,
        maxScore: 10,
        date: nowStr,
        teacherNote: `Tích cực bình luận đáp án đúng và giải đáp câu hỏi khó trên Bảng tin Hóa học (${pts} điểm tương tác).`,
      };
      const exists = prevTests.some((t) => t.id === recordId);
      const updatedTests = exists
        ? prevTests.map((t) => (t.id === recordId ? bonusTest : t))
        : [bonusTest, ...prevTests];

      const allScores = [
        ...updatedTests.map((t) => Number(t.score)),
        ...(st.scoreHistory || []).map((h) => Number(h.score)),
      ];
      const newAvg =
        allScores.length > 0
          ? Number(
              (
                allScores.reduce((a, b) => a + b, 0) / allScores.length
              ).toFixed(2)
            )
          : convertedScore;

      return {
        ...st,
        inClassTests: updatedTests,
        score: newAvg,
      };
    });

    saveToAll({
      ...appData,
      students: nextStudents,
    });

    notify(
      `🏆 Đã cập nhật Điểm thưởng Tương tác (${convertedScore}/10) vào Hồ sơ học tập (Mục 04) của HS ${student.name}!`,
      "success"
    );
  };

  const createDefaultRoadmap = (gradeStr) => {
    const chaps =
      appData.curriculum?.[gradeStr] || DEFAULT_CURRICULUM[gradeStr] || [];
    const map = {};
    chaps.forEach((c) => {
      map[c.id] = 0;
    });
    return map;
  };

  const updateStudentField = (studentId, updates) => {
    const nextStudents = appData.students.map((s) =>
      s.id === studentId ? { ...s, ...updates } : s
    );
    saveToAll({ ...appData, students: nextStudents });
  };

  const handleCreatePersonalFlashcard = (e) => {
    e.preventDefault();
    if (!newFlashcardForm.front.trim() || !newFlashcardForm.back.trim()) return;

    const ownerId =
      currentUser.role === "student" ? currentUser.studentId : "TEACHER";
    const ownerName = currentUser.name;

    const newCard = {
      id: "FC" + Date.now(),
      ownerId,
      ownerName,
      grade: newFlashcardForm.grade,
      topic: newFlashcardForm.topic.trim() || "Ghi nhớ cá nhân",
      front: newFlashcardForm.front.trim(),
      back: newFlashcardForm.back.trim(),
      createdAt: new Date().toLocaleDateString("vi-VN"),
    };

    saveToAll({
      ...appData,
      customFlashcards: [newCard, ...(appData.customFlashcards || [])],
    });

    setNewFlashcardForm({
      ...newFlashcardForm,
      topic: "",
      front: "",
      back: "",
    });
    setFlashcardSource("PERSONAL");
    setCardIndex(0);
    setIsCardFlipped(false);
    notify("Đã lưu thẻ vào Bộ Flashcard cá nhân!", "success");
  };

  const handleAssignHomeworkAndEmail = (e) => {
    e.preventDefault();
    if (!hwForm.title.trim()) return;

    let recipients = [];
    let targetLabel = "";

    if (hwForm.sendMode === "INDIVIDUAL") {
      const targetSt =
        appData.students.find((s) => s.id === hwForm.targetStudentId) ||
        activeStudent;
      if (!targetSt) {
        notify("Vui lòng chọn 1 Học sinh cụ thể để gửi bài tập!", "warn");
        return;
      }
      recipients = [targetSt];
      targetLabel = `HS ${targetSt.name} (Lớp ${targetSt.classId})`;
    } else {
      recipients =
        hwForm.classId === "ALL"
          ? appData.students
          : appData.students.filter((s) => s.classId === hwForm.classId);
      targetLabel =
        hwForm.classId === "ALL"
          ? "Toàn bộ các lớp"
          : `Lớp ${hwForm.classId}`;
    }

    const portalUrl =
      hwForm.submissionPortalLink.trim() ||
      (typeof window !== "undefined" ? window.location.href : "");

    const activeYear =
      selectedAcademicYear === "ALL"
        ? appData.currentAcademicYear || "2026 - 2027"
        : selectedAcademicYear;

    const formattedDeadlineLabel = hwForm.deadlineISO
      ? new Date(hwForm.deadlineISO).toLocaleString("vi-VN", {
          hour: "2-digit",
          minute: "2-digit",
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })
      : "";

    const newHw = {
      id: "HW" + Date.now(),
      academicYear: activeYear,
      title: hwForm.title.trim(),
      sendMode: hwForm.sendMode,
      classId: hwForm.classId,
      targetStudentId:
        hwForm.sendMode === "INDIVIDUAL"
          ? hwForm.targetStudentId || activeStudent?.id
          : "",
      targetLabel,
      dueDate:
        hwForm.dueDate.trim() ||
        formattedDeadlineLabel ||
        "Trước buổi học tiếp theo",
      deadlineISO: hwForm.deadlineISO || "",
      description: hwForm.description.trim(),
      fileUrl: hwForm.fileUrl.trim(),
      submissionPortalLink: portalUrl,
      fileName: hwForm.fileName,
      fileType: hwForm.fileType,
      fileDataUrl: hwForm.fileDataUrl,
      completedBy: [],
      createdAt: new Date().toLocaleString("vi-VN"),
    };

    const autoHomeworkNews = {
      id: "ANN_HW_" + Date.now(),
      title: `⏰ [Bài tập mới & Hạn nộp] ${newHw.title} — ${targetLabel}`,
      category: "HOMEWORK_DEADLINE",
      academicYear: activeYear,
      sendMode: hwForm.sendMode,
      classId: hwForm.classId,
      targetStudentId: newHw.targetStudentId,
      targetLabel,
      content: `Thầy ${TEACHER_INFO.fullName} vừa đăng bài tập mới:
• Bài tập: ${newHw.title}
• Đối tượng: ${targetLabel}
• ⏰ Hạn chót hoàn thành (Deadline): ${newHw.dueDate}${
        newHw.deadlineISO
          ? " (Tới giờ hạn chót, hệ thống sẽ tự động khóa link nộp bài)"
          : ""
      }
• Hướng dẫn / Yêu cầu: ${
        newHw.description || "Hoàn thành đầy đủ và nộp đúng thời hạn tại Mục 05."
      }`,
      externalUrl: newHw.fileUrl,
      attachmentName: newHw.fileName,
      attachmentType: newHw.fileType,
      attachmentDataUrl: newHw.fileDataUrl,
      linkedHomeworkId: newHw.id,
      date: new Date().toLocaleString("vi-VN"),
      recipientCount: recipients.length,
    };

    saveToAll({
      ...appData,
      homeworks: [newHw, ...(appData.homeworks || [])],
      announcements: [autoHomeworkNews, ...(appData.announcements || [])],
    });

    if (hwForm.sendEmailNow) {
      const emailList = recipients.map((r) => r.email).filter(Boolean);
      const subject = `[Bài tập Hóa học - ${targetLabel}] ${newHw.title} (Hạn nộp: ${newHw.dueDate})`;
      const greeting =
        hwForm.sendMode === "INDIVIDUAL" && recipients[0]
          ? `Kính gửi Quý Phụ huynh và Học sinh ${recipients[0].name} (Lớp ${recipients[0].classId}),`
          : `Kính gửi Quý Phụ huynh và các em Học sinh (${targetLabel}),`;

      const body = `${greeting}

Thầy Dương Anh Tuấn Anh (${TEACHER_INFO.subNote}) giao nhiệm vụ Bài tập về nhà mới như sau:

1. THÔNG TIN BÀI TẬP:
- Tên bài tập: ${newHw.title}
- Đối tượng: ${targetLabel}
- Năm học: ${activeYear}
- Hạn chót hoàn thành (Deadline): ${newHw.dueDate}
- Yêu cầu / Hướng dẫn chi tiết: ${
        newHw.description || "Hoàn thành đầy đủ vào vở hoặc phiếu bài tập."
      }

2. FILE BÀI TẬP ĐÍNH KÈM:
${
  newHw.fileUrl
    ? `- Đường link tải trực tiếp File Bài tập: ${newHw.fileUrl}`
    : newHw.fileName
    ? `- File bài tập "${newHw.fileName}" đã được đăng tải sẵn tại Mục 05 trên Website lớp học.`
    : "- Đề bài chi tiết đã được cập nhật tại Mục 05 trên Website lớp học."
}

3. ĐƯỜNG LINK TRUY CẬP NƠI NỘP BÀI TẬP:
- Sau khi làm bài xong, Học sinh truy cập vào đường link dưới đây (vào Mục 05 -> Khu vực Nộp Bài Tập) để gửi ảnh chụp bài làm hoặc file bài nộp lên hệ thống:
👉 Link nơi nộp bài: ${portalUrl}

Trân trọng,
Thầy Dương Anh Tuấn Anh (${TEACHER_INFO.subNote})
Email: ${TEACHER_INFO.email}`;

      if (hwForm.sendMode === "INDIVIDUAL" && emailList.length > 0) {
        setEmailPreviewModal({
          modeBadge: "Gửi cá nhân từng HS/PH",
          to: emailList[0],
          subject,
          body,
          mailtoUrl: `mailto:${encodeURIComponent(
            emailList[0]
          )}?cc=${encodeURIComponent(
            TEACHER_INFO.email
          )}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(
            body
          )}`,
        });
      } else {
        const bcc = emailList.join(",");
        setEmailPreviewModal({
          modeBadge: `Gửi hàng loạt (${emailList.length} PH/HS)`,
          to: bcc || TEACHER_INFO.email,
          subject,
          body,
          mailtoUrl: `mailto:${encodeURIComponent(
            TEACHER_INFO.email
          )}?bcc=${encodeURIComponent(bcc)}&subject=${encodeURIComponent(
            subject
          )}&body=${encodeURIComponent(body)}`,
        });
      }
    }

    setHwForm({
      ...hwForm,
      title: "",
      dueDate: "",
      deadlineISO: "",
      description: "",
      fileUrl: "",
      fileName: "",
      fileType: "",
      fileDataUrl: "",
    });
    notify("Đã giao bài tập mới thành công!", "success");
  };

  // Chấm điểm bài tập của Học sinh & Tự động nhập vào Hồ sơ học tập (Mục 04)
  const handleGradeHomeworkAndSyncProfile = (hw, student, existingSub = null) => {
    const key = existingSub ? existingSub.id : `${hw.id}_${student.id}`;
    const inputObj = gradingInputs[key] || {};
    const rawScore =
      inputObj.score !== undefined
        ? inputObj.score
        : existingSub?.gradeScore ?? "";
    const feedback =
      inputObj.feedback !== undefined
        ? inputObj.feedback
        : existingSub?.teacherFeedback ?? "";

    const parsedScore = parseFloat(rawScore);
    if (isNaN(parsedScore) || parsedScore < 0 || parsedScore > 10) {
      notify("Vui lòng nhập điểm số hợp lệ (từ 0 đến 10) để chấm và lưu vào hồ sơ!", "warn");
      return;
    }

    const nowStr = new Date().toLocaleDateString("vi-VN");
    const subId = existingSub ? existingSub.id : `HWSUB_TEACHER_${hw.id}_${student.id}`;

    let nextSubmissions = [...(appData.homeworkSubmissions || [])];
    if (existingSub) {
      nextSubmissions = nextSubmissions.map((sub) =>
        sub.id === existingSub.id
          ? {
              ...sub,
              gradeScore: parsedScore,
              teacherFeedback: feedback.trim(),
              gradedAt: new Date().toLocaleString("vi-VN"),
              isSyncedToProfile: true,
            }
          : sub
      );
    } else {
      nextSubmissions = [
        {
          id: subId,
          homeworkId: hw.id,
          homeworkTitle: hw.title,
          studentId: student.id,
          studentName: student.name,
          classId: student.classId,
          studentNote: "Giáo viên chấm trực tiếp",
          fileName: "",
          fileType: "",
          fileDataUrl: "",
          gradeScore: parsedScore,
          teacherFeedback: feedback.trim(),
          submittedAt: new Date().toLocaleString("vi-VN"),
          gradedAt: new Date().toLocaleString("vi-VN"),
          isSyncedToProfile: true,
        },
        ...nextSubmissions,
      ];
    }

    // Đảm bảo học sinh được đánh dấu đã hoàn thành trong bài tập đó
    const nextHomeworks = (appData.homeworks || []).map((item) => {
      if (item.id === hw.id) {
        const done = item.completedBy || [];
        return {
          ...item,
          completedBy: done.includes(student.id) ? done : [...done, student.id],
        };
      }
      return item;
    });

    // Cập nhật điểm vào Hồ sơ học tập (inClassTests & tính lại Điểm TB score) của Học sinh
    const profileTestId = `HW_PROFILE_${hw.id}_${student.id}`;
    const nextStudents = (appData.students || []).map((st) => {
      if (st.id !== student.id) return st;

      const prevTests = st.inClassTests || [];
      const testRecord = {
        id: profileTestId,
        testName: `[Bài tập] ${hw.title}`,
        testType: "Bài tập về nhà / Đánh giá thường xuyên",
        score: parsedScore,
        maxScore: 10,
        date: nowStr,
        teacherNote:
          feedback.trim() || "Đã chấm bài tập và đồng bộ vào hồ sơ học tập.",
      };

      const existsInProfile = prevTests.some((t) => t.id === profileTestId);
      const updatedTests = existsInProfile
        ? prevTests.map((t) => (t.id === profileTestId ? testRecord : t))
        : [testRecord, ...prevTests];

      const allScores = [
        ...updatedTests.map((t) => Number(t.score)),
        ...(st.scoreHistory || []).map((h) => Number(h.score)),
      ];
      const newAvg =
        allScores.length > 0
          ? Number(
              (
                allScores.reduce((a, b) => a + b, 0) / allScores.length
              ).toFixed(2)
            )
          : parsedScore;

      return {
        ...st,
        inClassTests: updatedTests,
        score: newAvg,
      };
    });

    saveToAll({
      ...appData,
      homeworks: nextHomeworks,
      homeworkSubmissions: nextSubmissions,
      students: nextStudents,
    });

    notify(
      `💯 Đã chấm ${parsedScore}/10 điểm bài "${hw.title}" cho HS ${student.name} và tự động nhập vào Hồ sơ học tập (Mục 04)!`,
      "success"
    );
  };

  const handleDeleteHomework = (hw) => {
    askConfirm(
      `Bạn có chắc chắn muốn xóa bài tập "${hw.title}" khỏi danh sách đã giao không?`,
      () => {
        const nextHomeworks = (appData.homeworks || []).filter(
          (item) => item.id !== hw.id
        );
        const nextSubmissions = (appData.homeworkSubmissions || []).filter(
          (sub) => sub.homeworkId !== hw.id
        );
        saveToAll({
          ...appData,
          homeworks: nextHomeworks,
          homeworkSubmissions: nextSubmissions,
        });
        if (hwSubForm.homeworkId === hw.id) {
          setHwSubForm((prev) => ({ ...prev, homeworkId: "" }));
        }
        notify(`Đã xóa bài tập "${hw.title}".`, "info");
      }
    );
  };

  const handleSubmitHomeworkWork = (e) => {
    e.preventDefault();
    if (!hwSubForm.homeworkId) {
      notify("Vui lòng chọn bài tập cần nộp!", "warn");
      return;
    }
    const hwObj = (appData.homeworks || []).find(
      (h) => h.id === hwSubForm.homeworkId
    );
    const deadlineCheck = getHomeworkDeadlineStatus(hwObj, realTimeNow);
    if (deadlineCheck.isExpired) {
      notify(
        "⛔ Đã quá thời gian hoàn thành bài tập! Link nộp bài tập này đã tự động khóa.",
        "error"
      );
      return;
    }

    // Xác định học sinh nộp bài (Nếu là HS đăng nhập -> lấy currentUser; Nếu là GV nộp thử hoặc chọn HS -> lấy từ dropdown hoặc tên nhập vào)
    let submitterStudent = null;
    if (currentUser?.role === "student") {
      submitterStudent =
        appData.students.find((s) => s.id === currentUser.studentId) || {
          id: currentUser.studentId,
          name: currentUser.name,
          classId: currentUser.classId,
        };
    } else {
      const pickedId = hwSubForm.studentId || activeStudent?.id || "";
      submitterStudent = appData.students.find((s) => s.id === pickedId);
      if (!submitterStudent && hwSubForm.studentNameCustom.trim()) {
        submitterStudent = {
          id: "HS_CUSTOM_" + Date.now(),
          name: hwSubForm.studentNameCustom.trim(),
          classId:
            hwSubForm.studentClassCustom.trim().toUpperCase() ||
            (hwObj && hwObj.classId !== "ALL" ? hwObj.classId : "") ||
            appData.classes[0]?.id ||
            "CHUNG",
        };
      }
    }

    if (!submitterStudent) {
      notify(
        "Vui lòng chọn Học sinh nộp bài (hoặc nhập Họ tên Học sinh) trước khi bấm Nộp bài!",
        "warn"
      );
      return;
    }

    const newSub = {
      id: "HWSUB" + Date.now(),
      homeworkId: hwSubForm.homeworkId,
      homeworkTitle: hwObj ? hwObj.title : "Bài tập về nhà",
      studentId: submitterStudent.id,
      studentName: submitterStudent.name,
      classId: submitterStudent.classId,
      studentNote: hwSubForm.studentNote.trim(),
      fileName: hwSubForm.fileName,
      fileType: hwSubForm.fileType,
      fileDataUrl: hwSubForm.fileDataUrl,
      teacherFeedback: "",
      gradeScore: "",
      submittedAt: new Date().toLocaleString("vi-VN"),
    };

    const nextHomeworks = (appData.homeworks || []).map((h) => {
      if (h.id === hwSubForm.homeworkId) {
        const prevDone = h.completedBy || [];
        return {
          ...h,
          completedBy: prevDone.includes(submitterStudent.id)
            ? prevDone
            : [...prevDone, submitterStudent.id],
        };
      }
      return h;
    });

    saveToAll({
      ...appData,
      homeworks: nextHomeworks,
      homeworkSubmissions: [newSub, ...(appData.homeworkSubmissions || [])],
    });

    setHwSubForm({
      homeworkId: hwSubForm.homeworkId,
      studentId: hwSubForm.studentId,
      studentNameCustom: "",
      studentClassCustom: "",
      studentNote: "",
      fileName: "",
      fileType: "",
      fileDataUrl: "",
    });
    notify(
      `✅ Đã nộp bài tập "${newSub.homeworkTitle}" của HS ${submitterStudent.name} lên hệ thống! Giáo viên có thể xem ngay bên dưới.`,
      "success"
    );
  };

  const handleDeleteClass = (cls) => {
    const count = appData.students.filter((s) => s.id && s.classId === cls.id)
      .length;
    const msg =
      count > 0
        ? `Lớp ${cls.id} (${cls.name}) hiện đang có ${count} học sinh. Bạn có chắc chắn muốn xóa lớp này không?`
        : `Bạn có chắc chắn muốn xóa Lớp ${cls.id} (${cls.name}) không?`;

    askConfirm(msg, () => {
      const nextClasses = appData.classes.filter((c) => c.id !== cls.id);
      const nextStudents =
        count > 0
          ? appData.students.filter((s) => s.classId !== cls.id)
          : appData.students;

      saveToAll({
        ...appData,
        classes: nextClasses,
        students: nextStudents,
      });
      if (selectedClassFilter === cls.id) {
        setSelectedClassFilter("ALL");
      }
      notify(`Đã xóa Lớp ${cls.id}.`, "info");
    });
  };

  const openQuickAttendance = (cls) => {
    const classStudents = getStudentsOfClass(cls.id);
    if (classStudents.length === 0) {
      notify(
        `Lớp ${cls.id} hiện chưa có học sinh nào. Vui lòng thêm học sinh vào lớp trước khi điểm danh.`,
        "warn"
      );
      return;
    }
    const initRec = {};
    classStudents.forEach((st) => {
      initRec[st.id] = {
        status: "PRESENT",
        attitude: "Chú ý nghe giảng, ghi chép bài đầy đủ",
      };
    });
    setSessionRecords(initRec);
    setSessionTopic(
      `Buổi học ngày ${new Date().toLocaleDateString("vi-VN")}`
    );
    setSessionDocId(cls.todayDocIds?.[0] || "");
    setSessionCustomDocTitle(cls.todayCustomDocTitle || "");
    setSessionCustomDocUrl(cls.todayCustomDocUrl || "");
    setAttendanceModalClass(cls);
  };

  const handleSaveAttendanceSession = (e) => {
    e.preventDefault();
    if (!attendanceModalClass) return;

    const dateStr = new Date().toLocaleString("vi-VN");
    const linkedDoc = (appData.documents || []).find(
      (d) => d.id === sessionDocId
    );
    const attachedDocLabel =
      sessionCustomDocTitle.trim() || (linkedDoc ? linkedDoc.title : "");

    const nextStudents = appData.students.map((st) => {
      if (st.classId !== attendanceModalClass.id) return st;
      const rec = sessionRecords[st.id];
      if (!rec) return st;

      const prevHistory = st.attendanceHistory || [];
      const scoreVal =
        rec.status === "PRESENT"
          ? 100
          : rec.status === "LATE"
          ? 85
          : rec.status === "EXCUSED"
          ? 70
          : 0;
      const statusLabel =
        rec.status === "PRESENT"
          ? "Đi học đầy đủ, đúng giờ"
          : rec.status === "LATE"
          ? "Đi học muộn"
          : rec.status === "EXCUSED"
          ? "Vắng có phép"
          : "Vắng không phép";

      const nextHistory = [
        {
          date: dateStr,
          topic: sessionTopic,
          attachedDocTitle: attachedDocLabel,
          status: statusLabel,
          scoreVal,
          attitude: rec.attitude,
        },
        ...prevHistory,
      ];

      const avgRate = Math.round(
        nextHistory.reduce((acc, cur) => acc + Number(cur.scoreVal), 0) /
          nextHistory.length
      );

      return {
        ...st,
        attendanceRate: avgRate,
        attendanceNote: `${statusLabel} (${new Date().toLocaleDateString(
          "vi-VN"
        )})`,
        attitude: rec.attitude,
        attendanceHistory: nextHistory,
      };
    });

    // Cập nhật luôn tài liệu học hôm đó vào lớp học
    const nextClasses = appData.classes.map((c) =>
      c.id === attendanceModalClass.id
        ? {
            ...c,
            todayDocIds: sessionDocId ? [sessionDocId] : c.todayDocIds || [],
            todayCustomDocTitle:
              sessionCustomDocTitle.trim() || c.todayCustomDocTitle || "",
            todayCustomDocUrl:
              sessionCustomDocUrl.trim() || c.todayCustomDocUrl || "",
          }
        : c
    );

    const newSessionLog = {
      id: "ATT" + Date.now(),
      classId: attendanceModalClass.id,
      academicYear:
        attendanceModalClass.academicYear ||
        appData.currentAcademicYear ||
        "2026 - 2027",
      date: dateStr,
      topic: sessionTopic,
      attachedDocTitle: attachedDocLabel,
      attachedDocUrl:
        sessionCustomDocUrl.trim() || (linkedDoc ? linkedDoc.externalUrl : ""),
      totalStudents: Object.keys(sessionRecords).length,
    };

    saveToAll({
      ...appData,
      classes: nextClasses,
      students: nextStudents,
      attendanceSessions: [
        newSessionLog,
        ...(appData.attendanceSessions || []),
      ],
    });
    setAttendanceModalClass(null);
    notify(
      `Đã lưu điểm danh & đính kèm tài liệu buổi học Lớp ${attendanceModalClass.id}!`,
      "success"
    );
  };

  const handleExportCSV = () => {
    if (appData.students.length === 0) {
      notify("Chưa có dữ liệu học sinh để xuất file.", "warn");
      return;
    }
    const headers = [
      "Mã HS",
      "Họ và tên",
      "Lớp",
      "Khối",
      "Năm học",
      "Email đăng nhập",
      "Mật khẩu",
      "Điểm TB",
      "Tỷ lệ chuyên cần (%)",
      "Ghi chú chuyên cần",
      "Thái độ học tập",
      "Định hướng Đại học",
      "Nhận xét của Giáo viên",
    ];
    const rows = appData.students.map((s) => [
      s.id,
      `"${s.name}"`,
      s.classId,
      s.grade || "",
      `"${s.academicYear || appData.currentAcademicYear || ""}"`,
      s.email,
      s.password,
      s.score,
      s.attendanceRate,
      `"${s.attendanceNote || ""}"`,
      `"${s.attitude || ""}"`,
      `"${s.universityGoal || ""}"`,
      `"${(s.teacherComment || "").replace(/"/g, '""')}"`,
    ]);
    const csvContent =
      "\uFEFF" +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Danh_sach_Lop_Hoa_${new Date().toLocaleDateString(
      "vi-VN"
    )}.csv`;
    a.click();
  };

  const handleAddInClassTest = (e) => {
    e.preventDefault();
    if (
      !activeStudent ||
      !classTestForm.testName.trim() ||
      !classTestForm.score
    )
      return;

    const newTestRecord = {
      id: "TEST" + Date.now(),
      testName: classTestForm.testName.trim(),
      testType: classTestForm.testType,
      score: parseFloat(classTestForm.score) || 0,
      maxScore: parseFloat(classTestForm.maxScore) || 10,
      date: classTestForm.date,
      teacherNote: classTestForm.teacherNote.trim(),
      attachmentName: classTestForm.attachmentName,
      attachmentType: classTestForm.attachmentType,
      attachmentDataUrl: classTestForm.attachmentDataUrl,
    };

    const existingTests = activeStudent.inClassTests || [];
    const updatedTests = [newTestRecord, ...existingTests];

    const allScores = [
      ...updatedTests.map((t) => Number(t.score)),
      ...(activeStudent.scoreHistory || []).map((h) => Number(h.score)),
    ];
    const newAvg =
      allScores.length > 0
        ? Number(
            (
              allScores.reduce((a, b) => a + b, 0) / allScores.length
            ).toFixed(2)
          )
        : newTestRecord.score;

    updateStudentField(activeStudent.id, {
      inClassTests: updatedTests,
      score: newAvg,
    });

    setClassTestForm({
      testName: "",
      testType: "Kiểm tra định kỳ / 1 tiết",
      score: "",
      maxScore: "10",
      date: new Date().toLocaleDateString("vi-VN"),
      teacherNote: "",
      attachmentName: "",
      attachmentType: "",
      attachmentDataUrl: "",
    });
    notify(`Đã lưu điểm kiểm tra cho HS ${activeStudent.name}!`, "success");
  };

  const handleSaveChapterEdit = (e) => {
    e.preventDefault();
    if (!editingChapter) return;
    const grade = editingChapter.grade;
    const reqList = editingChapter.requirementsText
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean);

    const updatedChapters = (appData.curriculum[grade] || []).map((c) =>
      c.id === editingChapter.id
        ? {
            id: editingChapter.id,
            timeline: editingChapter.timeline,
            targetDate: editingChapter.targetDate,
            title: editingChapter.title,
            formulas: editingChapter.formulas,
            requirements: reqList,
          }
        : c
    );

    saveToAll({
      ...appData,
      curriculum: {
        ...appData.curriculum,
        [grade]: updatedChapters,
      },
    });
    setEditingChapter(null);
    notify("Đã cập nhật thông tin Chương trong lộ trình!", "success");
  };

  const handleAddNewChapter = (e) => {
    e.preventDefault();
    if (!newChapterForm.title.trim()) return;
    const g = newChapterForm.grade;
    const reqs = newChapterForm.requirementsText
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean);

    const newChap = {
      id: `${g}-c${Date.now()}`,
      timeline: newChapterForm.timeline.trim() || "Tháng mới",
      targetDate: newChapterForm.targetDate.trim() || "Đang cập nhật",
      title: newChapterForm.title.trim(),
      formulas: newChapterForm.formulas.trim() || "Công thức trọng tâm",
      requirements:
        reqs.length > 0
          ? reqs
          : ["Nắm vững lý thuyết và vận dụng giải bài tập chương."],
    };

    const nextCurr = {
      ...appData.curriculum,
      [g]: [...(appData.curriculum[g] || []), newChap],
    };
    saveToAll({ ...appData, curriculum: nextCurr });
    setNewChapterForm({
      grade: g,
      timeline: "",
      targetDate: "",
      title: "",
      formulas: "",
      requirementsText: "",
    });
    notify(`Đã thêm "${newChap.title}" vào lộ trình Khối ${g}!`, "success");
  };

  const handleBulkExcelImport = (e) => {
    e.preventDefault();
    if (!excelBulkText.trim()) return;
    const lines = excelBulkText
      .trim()
      .split(/\r?\n/)
      .filter((l) => l.trim().length > 0);

    const newStudentsList = [...appData.students];
    const newClassesList = [...appData.classes];
    const activeYear =
      selectedAcademicYear === "ALL"
        ? appData.currentAcademicYear || "2026 - 2027"
        : selectedAcademicYear;
    let count = 0;

    lines.forEach((line, idx) => {
      const parts = line.includes("\t")
        ? line.split("\t")
        : line.includes("|")
        ? line.split("|")
        : line.split(",");

      if (parts.length >= 2) {
        const name = (parts[0] || "").trim();
        let classId =
          parts.length >= 3 ? (parts[1] || "").trim().toUpperCase() : "10A1";
        let email =
          parts.length >= 3 ? (parts[2] || "").trim() : (parts[1] || "").trim();
        let password = parts.length >= 4 ? (parts[3] || "").trim() : "123456";
        let uniGoal =
          parts.length >= 5 ? (parts[4] || "").trim() : "Đỗ Nguyện vọng 1";

        if (!name) return;

        let detectedGrade = "12";
        if (classId.startsWith("10")) detectedGrade = "10";
        else if (classId.startsWith("11")) detectedGrade = "11";
        else if (classId.startsWith("12")) detectedGrade = "12";

        if (!newClassesList.some((c) => c.id === classId)) {
          newClassesList.push({
            id: classId,
            name: `Lớp Hóa ${classId}`,
            grade: detectedGrade,
            academicYear: activeYear,
            scheduleSummary: "Theo Thời khóa biểu",
            todayDocIds: [],
          });
        }

        newStudentsList.push({
          id: `HS${Date.now().toString().slice(-4)}${idx}`,
          name,
          classId,
          grade: detectedGrade,
          academicYear: activeYear,
          email:
            email || `${name.toLowerCase().replace(/\s+/g, "")}@gmail.com`,
          password: password || "123456",
          targetScore: "8.5+",
          universityGoal: uniGoal,
          personalAchievements: "",
          score: 0,
          attendanceRate: 100,
          attendanceNote: "Đi học đầy đủ",
          attitude: "Tập trung chú ý bài giảng",
          teacherComment: "Đã khởi tạo hồ sơ học tập trực tuyến.",
          roadmapProgress: createDefaultRoadmap(detectedGrade),
          inClassTests: [],
          scoreHistory: [],
          attendanceHistory: [],
        });
        count++;
      }
    });

    if (count > 0) {
      saveToAll({
        ...appData,
        classes: newClassesList,
        students: newStudentsList,
      });
      setExcelBulkText("");
      notify(
        `Đã tạo thành công ${count} tài khoản học sinh từ danh sách Excel (Năm học ${activeYear})!`,
        "success"
      );
    }
  };

  const buildStudentReportEmail = (student) => {
    const cls = appData.classes.find((c) => c.id === student.classId);
    const recentTests = (student.inClassTests || [])
      .slice(0, 5)
      .map(
        (t) => `  • ${t.testName} (${t.date}): ${t.score}/${t.maxScore} điểm`
      )
      .join("\n");

    const subject = `[Lớp Hóa Thầy Dương Anh Tuấn Anh] Báo cáo tiến độ & Điểm kiểm tra của HS ${student.name} (${student.classId})`;
    const body = `Kính gửi Quý Phụ huynh và Học sinh ${student.name},

Hệ thống Lớp Hóa học Thầy Dương Anh Tuấn Anh (Nhật Hạ) trân trọng gửi thông báo tình hình học tập của học sinh:

1. THÔNG TIN LỚP HỌC & MỤC TIÊU:
- Học sinh: ${student.name} (Mã HS: ${student.id})
- Lớp: ${student.classId} (${cls ? cls.name : "Hóa học THPT"}) • Năm học: ${
      student.academicYear || appData.currentAcademicYear || "2026 - 2027"
    }
- Mục tiêu điểm số: ${student.targetScore} | Định hướng Đại học / Thành tích: ${
      student.universityGoal || "Đang cập nhật"
    }

2. TÌNH HÌNH CHUYÊN CẦN & THÁI ĐỘ HỌC TẬP:
- Chuyên cần (Đi học đầy đủ): ${student.attendanceRate}% — ${
      student.attendanceNote
    }
- Thái độ học tập & Mức độ chú ý bài: ${student.attitude}

3. KẾT QUẢ ĐIỂM SỐ & BÀI KIỂM TRA TRÊN LỚP:
- Điểm trung bình hiện tại: ${student.score}/10
${
  recentTests
    ? `- Các bài kiểm tra gần nhất:\n${recentTests}`
    : "- Chưa có bài kiểm tra định kỳ mới."
}

4. NHẬN XÉT CỦA GIÁO VIÊN:
"${student.teacherComment}"

Trân trọng,
Thầy Dương Anh Tuấn Anh (Nhật Hạ)
Email: ${TEACHER_INFO.email}`;

    return {
      modeBadge: `Gửi riêng cho PH/HS ${student.name}`,
      to: student.email,
      subject,
      body,
      mailtoUrl: `mailto:${encodeURIComponent(
        student.email
      )}?cc=${encodeURIComponent(
        TEACHER_INFO.email
      )}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(
        body
      )}`,
    };
  };

  // Danh sách các Ô chức năng Bento Grid
  const BENTO_MODULES = [
    {
      id: "announcements",
      code: "01",
      title: "Tin tức (Học thuật • Học phí • Lớp học)",
      desc: "Chia 3 mục Học thuật, Thông báo học phí, Thông báo lớp học; tự động cập nhật khi GV tải tài liệu mới.",
      badge: `${
        (appData.announcements || []).filter((a) =>
          matchesSelectedYear(a.academicYear)
        ).length
      } bản tin`,
      bg: "bg-[#1B3B48] text-[#F7F6F2]",
      accent: "text-[#E9C46A]",
    },
    {
      id: "calendar",
      code: "02",
      title: "Thời khóa biểu & Đính kèm Tài liệu",
      desc: "Đồng bộ lịch thực, đổi giờ theo tuần và đính kèm trực tiếp tài liệu học hôm đó vào từng ca học.",
      badge: `${
        (appData.calendarEvents || []).filter((e) =>
          matchesSelectedYear(e.academicYear)
        ).length
      } ca học • Live`,
      bg: "bg-white text-[#1B3B48] border border-[#E2DFD7]",
      accent: "text-[#5C7667]",
    },
    {
      id: "curriculum",
      code: "03",
      title: "Lộ trình & Tải Tài liệu Từng Chương",
      desc: "Nội dung Hóa 10, 11, 12 theo từng chương, tích hợp mục tải tài liệu riêng cho từng lớp, từng chương.",
      badge: `${(appData.documents || []).length} tài liệu chương`,
      bg: "bg-[#EFECE6] text-[#1B3B48] border border-[#DFDBD0]",
      accent: "text-[#1B3B48]",
    },
    {
      id: "progress",
      code: "04",
      title: "Tiến độ, Bài Kiểm tra & Nhận xét",
      desc: "Theo dõi đi học đầy đủ, chú ý nghe giảng, bảng điểm các bài kiểm tra trên lớp và nhận xét của Giáo viên.",
      badge:
        currentUser?.role === "student"
          ? "Hồ sơ của bạn"
          : `${yearFilteredStudents.length} hồ sơ HS`,
      bg: "bg-[#2C4A3E] text-[#F7F6F2]",
      accent: "text-[#E9C46A]",
    },
    {
      id: "documents",
      code: "05",
      title: "Kho Tài liệu Lớp/Chương & Giao Bài tập",
      desc: "Tải tài liệu theo từng lớp & từng chương (tự động báo tin tức Học thuật); giao & nộp bài tập qua Mail.",
      badge: `${(appData.documents || []).length} TL • ${
        (appData.homeworks || []).length
      } BTVN`,
      bg: "bg-white text-[#1B3B48] border border-[#E2DFD7]",
      accent: "text-[#5C7667]",
    },
    {
      id: "exams",
      code: "06",
      title: "Đề thi & App Thi thử Trực tuyến",
      desc: "Tách riêng ngân hàng đề thi tải về, đường link App Thi Thử và nơi Học sinh gửi ảnh chụp kết quả.",
      badge: `${appData.examPapers.length} đề thi`,
      bg: "bg-[#F4EFE6] text-[#1B3B48] border border-[#E0D6C3]",
      accent: "text-[#9C6644]",
    },
    {
      id: "honor",
      code: "07",
      title: "Bảng Vàng, Giải HSG & Đại học",
      desc: "Vinh danh điểm kiểm tra cao, thành tích Học sinh giỏi các cấp và danh sách Đậu Đại học (Hiển thị cả ngoài cổng đăng nhập).",
      badge: `${appData.achievements.length} vinh danh`,
      bg: "bg-white text-[#1B3B48] border border-[#E2DFD7]",
      accent: "text-[#1B3B48]",
    },
    {
      id: "chem_tools",
      code: "08",
      title: "Sổ tay Các Chất, Flashcard Riêng & Dụng cụ",
      desc: "Bảng Acid béo, Amino acid, pH & Chỉ thị, Dụng cụ thí nghiệm, Tạo Flashcard cá nhân cho HS & Mini-Game.",
      badge: "5 Bảng tra cứu • Tạo Flashcard",
      bg: "bg-[#EFECE6] text-[#1B3B48] border border-[#DFDBD0]",
      accent: "text-[#5C7667]",
    },
    ...(currentUser?.role === "teacher"
      ? [
          {
            id: "students_admin",
            code: "09",
            title: "Quản lý Lớp, Năm học, Điểm danh & Excel",
            desc: "Quản lý năm học, tạo/xóa lớp, đính kèm tài liệu buổi học, điểm danh nhanh và nhập Excel hàng loạt.",
            badge: `${yearFilteredClasses.length} lớp • ${yearFilteredStudents.length} HS`,
            bg: "bg-[#3D405B] text-[#F7F6F2]",
            accent: "text-[#F2CC8F]",
          },
        ]
      : []),
    {
      id: "chem_feed",
      code: "10",
      title: "Chuyện Hóa Học Hằng Ngày & Hỏi Đáp (Cộng điểm)",
      desc: "Bảng tin kiểu Facebook: Đăng bài báo Hóa học gợi mở, đố vui bình luận đáp án tính điểm tương tác & HS đăng câu hỏi khó.",
      badge: `${(appData.chemFeedPosts || []).length} thảo luận`,
      bg: "bg-[#1B3B48] text-[#F7F6F2] border-2 border-[#E9C46A]",
      accent: "text-[#E9C46A]",
    },
  ];

  // Tổng hợp danh sách Bảng vàng (kết hợp `appData.achievements` và các học sinh có điểm kiểm tra cao trong lớp)
  const topClassScorers = (appData.students || [])
    .filter((s) => Number(s.score) >= 8.5)
    .map((s) => ({
      id: `TOP_SCORE_${s.id}`,
      studentName: s.name,
      classId: s.classId,
      academicYear: s.academicYear || appData.currentAcademicYear || "2026 - 2027",
      category: "Thủ khoa / Xuất sắc",
      title: `Học sinh Xuất sắc Lớp ${s.classId} — Điểm TB: ${s.score}/10`,
      scoreDetail: s.universityGoal
        ? `Mục tiêu: ${s.universityGoal} • Chuyên cần: ${s.attendanceRate}%`
        : `Chuyên cần: ${s.attendanceRate}%`,
      isAutoTop: true,
    }));

  const combinedHonorBoard = [...(appData.achievements || []), ...topClassScorers];

  // ============================================================================
  // MÀN HÌNH KHI CHƯA ĐĂNG NHẬP (HIỂN THỊ BẢNG VÀNG THÀNH TÍCH BÊN NGOÀI CỔNG ĐĂNG NHẬP)
  // ============================================================================
  if (!currentUser) {
    const filteredPublicHonors = combinedHonorBoard.filter((ach) => {
      if (publicHonorFilter !== "ALL" && ach.category !== publicHonorFilter) {
        return false;
      }
      if (
        publicHonorYearFilter !== "ALL" &&
        ach.academicYear &&
        ach.academicYear !== publicHonorYearFilter
      ) {
        return false;
      }
      return true;
    });

    return (
      <div className="min-h-screen bg-[#F7F6F2] text-[#1B3B48] flex flex-col justify-between font-sans">
        <header className="bg-[#1B3B48] text-[#F7F6F2] py-4 px-6 border-b border-[#5C7667]/40 sticky top-0 z-30">
          <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#5C7667] flex items-center justify-center font-bold text-sm text-white">
                HÓA
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-white tracking-wide">
                  {TEACHER_INFO.fullName}
                </h1>
                <p className="text-xs text-[#D8E2DC]">
                  {TEACHER_INFO.subNote} • Năm học hiện tại:{" "}
                  <strong className="text-[#E9C46A]">
                    {appData.currentAcademicYear || "2026 - 2027"}
                  </strong>
                </p>
              </div>
            </div>
            <div className="text-xs text-[#E9C46A] font-mono font-bold">
              🕒 {realTimeNow.toLocaleTimeString("vi-VN")} •{" "}
              {realTimeNow.toLocaleDateString("vi-VN")}
            </div>
          </div>
        </header>

        <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 space-y-8">
          {/* KHỐI ĐĂNG NHẬP CHÍNH */}
          <div className="w-full grid grid-cols-1 lg:grid-cols-12 bg-white rounded-3xl border border-[#E2DFD7] shadow-lg overflow-hidden">
            <div className="lg:col-span-6 p-6 sm:p-8 bg-[#EFECE6] flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-block px-3 py-1 rounded-full bg-[#1B3B48] text-white text-xs font-bold uppercase tracking-wider">
                    Cổng Học tập Nội bộ
                  </span>
                  <span className="inline-block px-3 py-1 rounded-full bg-[#5C7667] text-white text-xs font-bold">
                    📅 Năm học {appData.currentAcademicYear || "2026 - 2027"}
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1B3B48] leading-snug">
                  Theo dõi tiến độ tường tận,
                  <br />
                  Đồng hành vững bước mỗi ngày.
                </h2>
                <blockquote className="p-4 rounded-2xl bg-white border-l-4 border-[#5C7667] text-xs sm:text-sm italic text-[#1B3B48]/90 leading-relaxed">
                  "{TEACHER_INFO.quote}"
                </blockquote>
              </div>

              <div className="space-y-2 text-xs text-[#5C7667] border-t border-[#DFDBD0] pt-4">
                <div className="font-bold text-[#1B3B48]">
                  Quy định Bảo mật & Tiện ích Hệ thống:
                </div>
                <p>
                  • Lộ trình học tập, tài liệu từng chương/lớp, lịch học đính kèm tài liệu hôm đó và bảng điểm cá nhân được bảo mật riêng tư.
                </p>
                <p>
                  • Bản tin lớp học được phân chia rõ: <strong>Học thuật</strong>, <strong>Thông báo học phí</strong> và <strong>Thông báo lớp học</strong> giúp Quý Phụ huynh dễ dàng theo dõi.
                </p>
                <p>
                  • Phụ huynh và Học sinh vui lòng đăng nhập bằng tài khoản đã được Thầy{" "}
                  <strong>{TEACHER_INFO.fullName}</strong> cấp để truy cập hệ thống.
                </p>
              </div>
            </div>

            <div className="lg:col-span-6 p-6 sm:p-8 bg-[#1B3B48] text-[#F7F6F2] flex flex-col justify-center space-y-6">
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-widest text-[#E9C46A]">
                  Xác thực Tài khoản
                </span>
                <h3 className="text-2xl font-bold text-white">
                  Đăng nhập Lớp học
                </h3>
                <p className="text-xs text-gray-300">
                  Dành cho Giáo viên, Phụ huynh và Học sinh của lớp.
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold mb-1.5 text-gray-200">
                    Tài khoản đăng nhập (Email / Mã HS / Họ tên)
                  </label>
                  <input
                    type="text"
                    required
                    value={loginAccount}
                    onChange={(e) => setLoginAccount(e.target.value)}
                    placeholder="Nhập Email hoặc Mã học sinh..."
                    className="w-full px-4 py-3 rounded-xl bg-white text-[#1B3B48] text-sm font-medium focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1.5 text-gray-200">
                    Mật khẩu
                  </label>
                  <input
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 rounded-xl bg-white text-[#1B3B48] text-sm font-medium focus:outline-none"
                  />
                </div>

                {loginError && (
                  <div className="p-3 rounded-xl bg-red-500/20 border border-red-400/40 text-red-100 text-xs font-medium">
                    {loginError}
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full bg-[#5C7667] hover:bg-[#4A6154] text-white font-bold py-3 px-4 rounded-xl text-sm transition shadow-md"
                >
                  Đăng nhập vào Lớp học
                </button>
              </form>

              <div className="pt-4 border-t border-white/10 text-xs text-gray-300 flex items-center justify-between">
                <span>Hỗ trợ cấp tài khoản:</span>
                <a
                  href={`mailto:${TEACHER_INFO.email}`}
                  className="text-[#E9C46A] underline font-semibold"
                >
                  {TEACHER_INFO.email}
                </a>
              </div>
            </div>
          </div>

          {/* ===================================================================
              BẢNG VÀNG THÀNH TÍCH BÊN NGOÀI MÀN HÌNH ĐĂNG NHẬP
          =================================================================== */}
          <section className="bg-white rounded-3xl border-2 border-[#E9C46A] shadow-md p-6 sm:p-8 space-y-5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#EFECE6] pb-4">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1B3B48] text-[#E9C46A] text-xs font-extrabold uppercase tracking-wider">
                  🏆 Bảng Vàng Vinh Danh Thành Tích Trong Lớp
                </div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-[#1B3B48]">
                  Tự hào Thành tích Học sinh Giỏi, Điểm 10 & Đậu Đại học
                </h3>
                <p className="text-xs text-[#5C7667]">
                  Ghi nhận những nỗ lực bứt phá của các thế hệ học sinh Lớp Hóa Thầy{" "}
                  <strong>{TEACHER_INFO.fullName}</strong> ({TEACHER_INFO.subNote}).
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <select
                  value={publicHonorYearFilter}
                  onChange={(e) => setPublicHonorYearFilter(e.target.value)}
                  className="px-3 py-1.5 rounded-xl border border-[#E2DFD7] bg-[#F7F6F2] text-xs font-bold text-[#1B3B48]"
                >
                  <option value="ALL">📅 Tất cả Năm học</option>
                  {(appData.academicYears || DEFAULT_ACADEMIC_YEARS).map((y) => (
                    <option key={y} value={y}>
                      Năm học {y}
                    </option>
                  ))}
                </select>

                {[
                  { id: "ALL", label: "Tất cả" },
                  { id: "Đậu Đại học", label: "🎓 Đậu Đại học" },
                  { id: "Học sinh giỏi", label: "🏅 Học sinh giỏi" },
                  { id: "Thủ khoa / Xuất sắc", label: "🏆 Điểm cao / Xuất sắc" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setPublicHonorFilter(tab.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                      publicHonorFilter === tab.id
                        ? "bg-[#1B3B48] text-[#E9C46A]"
                        : "bg-[#EFECE6] text-[#1B3B48] hover:bg-[#E2DFD7]"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {filteredPublicHonors.length === 0 ? (
              <div className="p-8 rounded-2xl bg-[#F7F6F2] border border-dashed border-[#DFDBD0] text-center space-y-1.5">
                <div className="text-sm font-bold text-[#1B3B48]">
                  🏆 Bảng Vàng hiện đang để trống để Giáo viên cập nhật
                </div>
                <p className="text-xs text-[#5C7667]">
                  Giáo viên đăng nhập và vào <strong>Mục 07 (Bảng Vàng)</strong> để thêm học sinh đạt giải HSG, Điểm 10 hoặc Đậu Đại học hiển thị tại đây.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {filteredPublicHonors.map((ach) => (
                  <div
                    key={ach.id}
                    className="p-5 rounded-2xl bg-gradient-to-br from-[#F7F6F2] to-[#EFECE6] border border-[#E0D6C3] flex flex-col justify-between gap-3 shadow-sm hover:shadow-md transition"
                  >
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center justify-between gap-1">
                        <span className="px-2.5 py-0.5 rounded-full bg-[#1B3B48] text-[#E9C46A] text-[11px] font-bold">
                          {ach.category} • Lớp {ach.classId}
                        </span>
                        <span className="text-[11px] font-bold text-[#5C7667] bg-white px-2 py-0.5 rounded-md border border-[#E2DFD7]">
                          NH: {ach.academicYear || "2026 - 2027"}
                        </span>
                      </div>
                      <h4 className="font-extrabold text-base text-[#1B3B48]">
                        🌟 {ach.studentName}
                      </h4>
                      <p className="text-sm font-bold text-[#2C4A3E]">
                        {ach.title}
                      </p>
                      {ach.scoreDetail && (
                        <p className="text-xs text-[#5C7667] font-medium">
                          {ach.scoreDetail}
                        </p>
                      )}
                    </div>
                    {ach.imageDataUrl && (
                      <img
                        src={ach.imageDataUrl}
                        alt={ach.studentName}
                        className="w-full h-36 object-cover rounded-xl border border-[#E2DFD7] mt-2"
                      />
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>
        </main>

        <footer className="bg-[#EFECE6] border-t border-[#DFDBD0] py-4 px-6 text-center text-xs text-[#5C7667]">
          <strong>{TEACHER_INFO.fullName}</strong> ({TEACHER_INFO.subNote}) • Hệ thống Quản lý Học tập Môn Hóa học 10 • 11 • 12
        </footer>
      </div>
    );
  }

  // Tổng hợp danh sách Thông báo trên Chuông (Bản tin mới đăng, Bài tập & Hạn nộp, Tài liệu mới, và Bài nộp mới của HS báo cho GV)
  const notificationFeed = [
    ...(appData.announcements || [])
      .filter((a) => {
        if (!matchesSelectedYear(a.academicYear)) return false;
        if (currentUser?.role === "student") {
          if (
            a.sendMode === "INDIVIDUAL" &&
            a.targetStudentId &&
            a.targetStudentId !== currentUser.studentId
          ) {
            return false;
          }
          if (
            a.sendMode === "BULK" &&
            a.classId !== "ALL" &&
            a.classId !== currentUser.classId
          ) {
            return false;
          }
        }
        return true;
      })
      .map((a) => {
        const catMeta = getNewsCategoryMeta(a.category || "CLASS_NOTICE");
        return {
          id: `NOTIF_ANN_${a.id}`,
          badge: catMeta.badge,
          title: a.title,
          sub: `${a.targetLabel || a.classId} • ${a.date}`,
          targetView: a.linkedHomeworkId ? "documents" : "announcements",
          category: a.category || "CLASS_NOTICE",
        };
      }),
    ...(currentUser?.role === "teacher"
      ? (appData.homeworkSubmissions || []).map((sub) => ({
          id: `NOTIF_SUB_${sub.id}`,
          badge: "📤 HS Nộp bài tập",
          title: `HS ${sub.studentName} (${sub.classId}) đã nộp: ${sub.homeworkTitle}`,
          sub: `${sub.submittedAt} • ${
            sub.gradeScore !== "" && sub.gradeScore !== undefined
              ? `Đã chấm: ${sub.gradeScore}/10`
              : "Chưa chấm điểm"
          }`,
          targetView: "documents",
          category: "SUBMISSION",
        }))
      : []),
    ...(appData.chemFeedPosts || [])
      .filter((p) => matchesSelectedYear(p.academicYear))
      .map((p) => ({
        id: `NOTIF_FEED_${p.id}`,
        badge:
          p.postType === "STUDENT_QA"
            ? "🙋‍♂️ HS Hỏi bài khó"
            : p.postType === "QUIZ_CHALLENGE"
            ? "🧩 Đố vui Hóa học (+Điểm)"
            : "📰 Chuyện Hóa học hằng ngày",
        title: `${p.authorName}: ${
          p.title || p.content.slice(0, 65)
        }`,
        sub: `${p.createdAt} • ${(p.comments || []).length} bình luận giải đáp`,
        targetView: "chem_feed",
        category: "CHEM_FEED",
      })),
  ];

  const unreadNotifications = notificationFeed.filter(
    (n) => !readNotifIds.includes(n.id)
  );

  // ============================================================================
  // GIAO DIỆN CHÍNH SAU KHI ĐÃ ĐĂNG NHẬP
  // ============================================================================
  return (
    <div className="min-h-screen bg-[#F7F6F2] text-[#1B3B48] flex flex-col font-sans">
      {/* THÔNG BÁO TOAST NỔI */}
      {toastMsg && (
        <div className="fixed bottom-5 right-5 z-50 max-w-md bg-[#1B3B48] text-white px-4 py-3 rounded-2xl shadow-xl border border-[#E9C46A] flex items-center justify-between gap-3 text-xs font-semibold">
          <span>{toastMsg.text}</span>
          <button
            onClick={() => setToastMsg(null)}
            className="text-[#E9C46A] font-bold px-1.5"
          >
            ✕
          </button>
        </div>
      )}

      {/* HỘP THOẠI XÁC NHẬN */}
      {confirmDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl border border-[#E2DFD7]">
            <h3 className="font-bold text-base text-[#1B3B48]">
              Xác nhận thao tác
            </h3>
            <p className="text-xs text-[#5C7667] leading-relaxed">
              {confirmDialog.message}
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setConfirmDialog(null)}
                className="px-4 py-2 rounded-xl bg-gray-100 text-xs font-bold text-[#1B3B48]"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={() => {
                  const fn = confirmDialog.onConfirm;
                  setConfirmDialog(null);
                  if (fn) fn();
                }}
                className="px-4 py-2 rounded-xl bg-red-600 text-white text-xs font-bold"
              >
                Đồng ý
              </button>
            </div>
          </div>
        </div>
      )}

      {/* HEADER */}
      <header className="bg-[#1B3B48] text-[#F7F6F2] border-b border-[#5C7667]/40 sticky top-0 z-40 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3.5 flex flex-wrap items-center justify-between gap-3">
          <div
            onClick={() => setNavStack(["home"])}
            className="cursor-pointer flex items-center gap-3 group"
          >
            <div className="w-10 h-10 rounded-xl bg-[#5C7667] flex items-center justify-center font-bold text-sm text-white">
              HÓA
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold tracking-wide text-white group-hover:text-[#E9C46A] transition">
                {TEACHER_INFO.fullName}
              </h1>
              <div className="flex items-center gap-2 text-xs text-[#D8E2DC]">
                <span className="px-2 py-0.5 rounded bg-white/10 font-medium">
                  {TEACHER_INFO.subNote}
                </span>
                <span className="hidden sm:inline">•</span>
                <span className="hidden sm:inline font-mono text-[#E9C46A]">
                  🕒 {realTimeNow.toLocaleTimeString("vi-VN")} (
                  {realTimeNow.toLocaleDateString("vi-VN")})
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* BỘ CHỌN NĂM HỌC TRÊN HEADER */}
            <div className="flex items-center gap-1.5 bg-[#2C4A3E] px-2.5 py-1.5 rounded-lg border border-[#5C7667] text-xs">
              <span className="text-[#E9C46A] font-bold">📅 Năm học:</span>
              <select
                value={selectedAcademicYear}
                onChange={(e) => setSelectedAcademicYear(e.target.value)}
                className="bg-transparent text-white font-extrabold focus:outline-none cursor-pointer"
              >
                <option value="ALL" className="text-[#1B3B48]">
                  Tất cả các năm
                </option>
                {(appData.academicYears || DEFAULT_ACADEMIC_YEARS).map((y) => (
                  <option key={y} value={y} className="text-[#1B3B48]">
                    {y}
                  </option>
                ))}
              </select>
              {currentUser.role === "teacher" && (
                <button
                  onClick={() => setShowYearManagerModal(true)}
                  className="ml-1 px-1.5 py-0.5 rounded bg-white/15 hover:bg-white/25 text-[10px] font-bold text-[#E9C46A]"
                  title="Thêm hoặc cài đặt Năm học"
                >
                  + Năm học
                </button>
              )}
            </div>

            {currentUser.role === "teacher" && (
              <button
                onClick={() => setShowCloudModal(true)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 border transition ${
                  firebaseUrl
                    ? syncStatus === "error"
                      ? "bg-red-900/50 border-red-400 text-red-100"
                      : "bg-[#2C4A3E] border-[#5C7667] text-[#E9F5DB]"
                    : "bg-[#9C6644] border-[#D4A373] text-white"
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-current" />
                {firebaseUrl
                  ? syncStatus === "syncing"
                    ? "Đang đồng bộ..."
                    : `Đám mây (${lastSyncTime || "Đã kết nối"})`
                  : "Kết nối Đám mây Firebase"}
              </button>
            )}

            {firebaseUrl && (
              <button
                onClick={() => fetchFromFirebase(false)}
                className="px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-medium text-white transition"
              >
                ↻ Cập nhật
              </button>
            )}

            {/* CHUÔNG THÔNG BÁO TIN ĐÃ LÊN & BÀI TẬP / NỘP BÀI */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowBellDropdown((prev) => !prev)}
                className="relative px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-bold text-white flex items-center gap-1.5 transition"
                title="Chuông thông báo tin tức, bài tập & bài nộp mới"
              >
                <span className="text-base leading-none">🔔</span>
                <span className="hidden sm:inline">Thông báo</span>
                {unreadNotifications.length > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full bg-rose-500 text-white text-[10px] font-black animate-pulse">
                    {unreadNotifications.length}
                  </span>
                )}
              </button>

              {showBellDropdown && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white text-[#1B3B48] rounded-2xl shadow-2xl border-2 border-[#1B3B48] z-50 overflow-hidden">
                  <div className="p-3.5 bg-[#1B3B48] text-white flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span>🔔</span>
                      <span className="font-bold text-xs">
                        Thông báo Tin đã lên ({unreadNotifications.length} chưa đọc)
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {unreadNotifications.length > 0 && (
                        <button
                          type="button"
                          onClick={() =>
                            markAllNotificationsRead(
                              notificationFeed.map((x) => x.id)
                            )
                          }
                          className="text-[10px] text-[#E9C46A] underline font-bold"
                        >
                          Đọc tất cả
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => setShowBellDropdown(false)}
                        className="text-xs font-bold text-gray-300 hover:text-white"
                      >
                        ✕
                      </button>
                    </div>
                  </div>

                  <div className="max-h-80 overflow-y-auto divide-y divide-[#EFECE6]">
                    {notificationFeed.length === 0 ? (
                      <div className="p-6 text-center text-xs text-[#5C7667]">
                        Chưa có thông báo mới nào.
                      </div>
                    ) : (
                      notificationFeed.slice(0, 15).map((item) => {
                        const isUnread = !readNotifIds.includes(item.id);
                        return (
                          <div
                            key={item.id}
                            onClick={() => {
                              markSingleNotificationRead(item.id);
                              setShowBellDropdown(false);
                              navigateTo(item.targetView);
                            }}
                            className={`p-3 text-xs cursor-pointer transition hover:bg-[#EFECE6] ${
                              isUnread ? "bg-amber-50/70" : "bg-white"
                            }`}
                          >
                            <div className="flex items-center justify-between gap-2 mb-1">
                              <span className="px-2 py-0.5 rounded bg-[#1B3B48] text-[#E9C46A] text-[10px] font-bold">
                                {item.badge}
                              </span>
                              {isUnread && (
                                <span className="text-[10px] font-extrabold text-rose-600">
                                  ● Mới
                                </span>
                              )}
                            </div>
                            <div className="font-bold text-[#1B3B48] leading-snug">
                              {item.title}
                            </div>
                            <div className="text-[11px] text-[#5C7667] mt-0.5">
                              {item.sub}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>

                  <div className="p-2.5 bg-[#F7F6F2] border-t border-[#E2DFD7] flex justify-between items-center text-[11px]">
                    <button
                      type="button"
                      onClick={() => {
                        setShowBellDropdown(false);
                        navigateTo("announcements");
                      }}
                      className="font-bold text-[#1B3B48] hover:underline"
                    >
                      Xem tất cả Tin tức (Mục 01) →
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowBellDropdown(false);
                        navigateTo("documents");
                      }}
                      className="font-bold text-[#2C4A3E] hover:underline"
                    >
                      Kiểm tra & Chấm bài nộp →
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-lg border border-white/15 text-xs">
              <span className="font-semibold text-[#E9C46A]">
                {currentUser.role === "teacher"
                  ? `GV: ${TEACHER_INFO.fullName}`
                  : `HS: ${currentUser.name} (${currentUser.classId})`}
              </span>
              <button
                onClick={() => {
                  setCurrentUser(null);
                  setNavStack(["home"]);
                }}
                className="bg-white text-[#1B3B48] px-2.5 py-0.5 rounded font-bold hover:bg-gray-200 transition"
              >
                Đăng xuất
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* THANH ĐIỀU HƯỚNG & NÚT QUAY LẠI TRANG TRƯỚC */}
      <div className="bg-[#EFECE6] border-b border-[#DFDBD0] px-4 py-2.5">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            {activeView !== "home" && (
              <button
                onClick={goBack}
                className="bg-[#1B3B48] hover:bg-[#2C4A3E] text-white px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm transition"
              >
                ← Quay lại trang trước
              </button>
            )}
            <button
              onClick={() => setNavStack(["home"])}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeView === "home"
                  ? "bg-[#1B3B48] text-white"
                  : "bg-white text-[#1B3B48] border border-[#DFDBD0] hover:bg-gray-50"
              }`}
            >
              Bảng điều khiển chính
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            {BENTO_MODULES.map((m) => (
              <button
                key={m.id}
                onClick={() => navigateTo(m.id)}
                className={`px-2.5 py-1 rounded-md font-medium transition ${
                  activeView === m.id
                    ? "bg-[#5C7667] text-white font-bold"
                    : "text-[#1B3B48] hover:bg-white/70"
                }`}
              >
                {m.code}. {m.title.split("(")[0].split("&")[0]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* NỘI DUNG CHÍNH */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-6 space-y-8">
        {/* ===================================================================
            TRANG CHỦ BẢNG ĐIỀU KHIỂN
        =================================================================== */}
        {activeView === "home" && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-[#E2DFD7] shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#5C7667]">
                    {currentUser.role === "teacher"
                      ? "Chế độ Quản trị Độc quyền Giáo viên"
                      : `Cổng thông tin Phụ huynh & Học sinh — Lớp ${currentUser.classId}`}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#1B3B48] text-[#E9C46A] text-xs font-bold">
                    📅 Năm học:{" "}
                    {selectedAcademicYear === "ALL"
                      ? "Tất cả các năm"
                      : selectedAcademicYear}
                  </span>
                </div>
                <h2 className="text-2xl font-extrabold text-[#1B3B48]">
                  Xin chào, {currentUser.name}
                </h2>
                <p className="text-xs text-[#5C7667] italic">
                  "{TEACHER_INFO.quote}"
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => navigateTo("curriculum")}
                  className="bg-[#2C4A3E] hover:bg-[#1B3B48] text-white px-3.5 py-2 rounded-xl text-xs font-bold transition"
                >
                  📚 Lộ trình & Tài liệu Từng Chương
                </button>
                <button
                  onClick={() => navigateTo("calendar")}
                  className="bg-[#1B3B48] hover:bg-[#2C4A3E] text-white px-3.5 py-2 rounded-xl text-xs font-bold transition"
                >
                  📅 Lịch Thực & Tài liệu Buổi học
                </button>
                <button
                  onClick={() => navigateTo("chem_feed")}
                  className="bg-[#9C6644] hover:bg-[#7F5135] text-white px-3.5 py-2 rounded-xl text-xs font-bold transition shadow-sm"
                >
                  🔥 Chuyện Hóa Học & Hỏi Đáp (+Điểm)
                </button>
                <button
                  onClick={() => navigateTo("announcements")}
                  className="bg-[#5C7667] hover:bg-[#4A6154] text-white px-3.5 py-2 rounded-xl text-xs font-bold transition"
                >
                  📰 Tin tức (Học thuật • Học phí • Lớp)
                </button>
              </div>
            </div>

            {/* Thanh Tổng quan Danh sách Lớp học, Sĩ số & TÀI LIỆU HỌC HÔM NAY CỦA TỪNG LỚP */}
            <div className="bg-white rounded-2xl p-5 border border-[#E2DFD7] shadow-sm space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="font-bold text-sm text-[#1B3B48] uppercase tracking-wider">
                  Danh sách Lớp học & Tài liệu học hôm nay (
                  {yearFilteredClasses.length} lớp • Năm học{" "}
                  {selectedAcademicYear === "ALL"
                    ? "Tất cả"
                    : selectedAcademicYear}
                  )
                </h3>
                {currentUser.role === "teacher" && (
                  <button
                    onClick={() => navigateTo("students_admin")}
                    className="text-xs font-bold text-[#5C7667] hover:underline"
                  >
                    + Tạo lớp mới / Quản lý Năm học / Điểm danh →
                  </button>
                )}
              </div>

              {yearFilteredClasses.length === 0 && (
                <div className="p-6 rounded-2xl bg-[#F7F6F2] border border-dashed border-[#DFDBD0] text-center space-y-2">
                  <div className="text-sm font-bold text-[#1B3B48]">
                    Chưa có lớp học nào được tạo trong năm học này
                  </div>
                  <p className="text-xs text-[#5C7667]">
                    Các lớp mẫu đã được xóa sạch. Bạn hãy vào <strong>Mục 09</strong> để tạo các lớp học mới của mình.
                  </p>
                  {currentUser.role === "teacher" && (
                    <button
                      onClick={() => navigateTo("students_admin")}
                      className="bg-[#1B3B48] text-white px-4 py-2 rounded-xl text-xs font-bold"
                    >
                      + Vào Mục 09 Tạo Lớp Học Ngay
                    </button>
                  )}
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {yearFilteredClasses
                  .filter(
                    (cls) =>
                      currentUser.role === "teacher" ||
                      cls.id === currentUser.classId
                  )
                  .map((cls) => {
                    const count = getStudentsOfClass(cls.id).length;
                    const todayMaterials = getTodayMaterialsForClass(cls);

                    return (
                      <div
                        key={cls.id}
                        className="p-4 rounded-xl bg-[#F7F6F2] border border-[#E2DFD7] flex flex-col justify-between gap-3"
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="px-2.5 py-0.5 rounded-md bg-[#1B3B48] text-white text-xs font-bold">
                              Lớp {cls.id}
                            </span>
                            <span className="px-2 py-0.5 rounded-full bg-[#5C7667]/15 text-[#2C4A3E] text-xs font-extrabold">
                              👥 {count} học sinh
                            </span>
                          </div>
                          <div className="font-bold text-sm text-[#1B3B48]">
                            {cls.name}
                          </div>
                          <div className="text-[11px] text-[#5C7667]">
                            Khối {cls.grade} • {cls.scheduleSummary}
                          </div>

                          {/* HIỂN THỊ TÀI LIỆU HỌC HÔM ĐÓ TRONG LỚP HỌC */}
                          <div className="p-2.5 rounded-xl bg-white border border-[#DFDBD0] space-y-1.5">
                            <div className="flex items-center justify-between">
                              <span className="text-[11px] font-extrabold text-[#1B3B48]">
                                📎 Tài liệu học hôm nay:
                              </span>
                              {currentUser.role === "teacher" && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    setEditingClassDocsModal({
                                      ...cls,
                                      todayDocIds: cls.todayDocIds || [],
                                      todayCustomDocTitle:
                                        cls.todayCustomDocTitle || "",
                                      todayCustomDocUrl:
                                        cls.todayCustomDocUrl || "",
                                    })
                                  }
                                  className="text-[10px] font-bold text-[#5C7667] hover:underline"
                                >
                                  ✎ Đính kèm TL
                                </button>
                              )}
                            </div>

                            {todayMaterials.length === 0 ? (
                              <p className="text-[11px] text-[#5C7667] italic">
                                Chưa đính kèm tài liệu buổi học hôm nay.
                              </p>
                            ) : (
                              <div className="space-y-1">
                                {todayMaterials.map((mat) => (
                                  <div
                                    key={mat.id}
                                    className="text-[11px] flex items-center justify-between gap-1 bg-[#F7F6F2] px-2 py-1 rounded border border-[#E2DFD7]"
                                  >
                                    <span className="font-semibold text-[#1B3B48] truncate">
                                      📄 {mat.title}
                                    </span>
                                    <div className="flex items-center gap-1 shrink-0">
                                      {mat.url && (
                                        <a
                                          href={mat.url}
                                          target="_blank"
                                          rel="noreferrer"
                                          className="px-1.5 py-0.5 rounded bg-[#1B3B48] text-white text-[10px] font-bold"
                                        >
                                          Mở
                                        </a>
                                      )}
                                      {mat.dataUrl && (
                                        <a
                                          href={mat.dataUrl}
                                          download={mat.fileName || "tailieu"}
                                          className="px-1.5 py-0.5 rounded bg-[#5C7667] text-white text-[10px] font-bold"
                                        >
                                          Tải
                                        </a>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>

                        {currentUser.role === "teacher" && (
                          <div className="flex items-center justify-between pt-2 border-t border-[#E2DFD7] text-[11px] font-bold">
                            <button
                              onClick={() => openQuickAttendance(cls)}
                              className="text-[#2C4A3E] hover:underline"
                            >
                              ✓ Điểm danh & TL hôm nay
                            </button>
                            <button
                              onClick={() => {
                                setSelectedClassFilter(cls.id);
                                navigateTo("progress");
                              }}
                              className="text-[#1B3B48] hover:underline"
                            >
                              Xem HS
                            </button>
                            <button
                              onClick={() => handleDeleteClass(cls)}
                              className="text-red-600 hover:underline"
                            >
                              Xóa lớp
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* Lưới các ô chức năng */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {BENTO_MODULES.map((box) => (
                <div
                  key={box.id}
                  onClick={() => navigateTo(box.id)}
                  className={`${box.bg} rounded-2xl p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition cursor-pointer flex flex-col justify-between min-h-[190px]`}
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-xs font-black tracking-widest uppercase ${box.accent}`}
                      >
                        MỤC {box.code}
                      </span>
                      <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-black/10">
                        {box.badge}
                      </span>
                    </div>
                    <h4 className="text-base font-bold leading-snug">
                      {box.title}
                    </h4>
                    <p className="text-xs opacity-85 leading-relaxed">
                      {box.desc}
                    </p>
                  </div>
                  <div className="pt-4 flex items-center justify-between text-xs font-bold">
                    <span>Truy cập ngay</span>
                    <span>→</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===================================================================
            MỤC 01: BẢN TIN LỚP HỌC (CHIA 3 MỤC: HỌC THUẬT, HỌC PHÍ, THÔNG BÁO LỚP HỌC)
        =================================================================== */}
        {activeView === "announcements" && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-[#E2DFD7] flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase text-[#5C7667]">
                  Mục 01 • Truyền thông Lớp học & Tự động cập nhật khi tải Tài liệu
                </span>
                <h2 className="text-2xl font-bold text-[#1B3B48]">
                  Tin tức Phụ huynh Theo dõi: Học thuật • Thông báo Học phí • Thông báo Lớp học
                </h2>
                <p className="text-xs text-[#5C7667] mt-1">
                  Khi Giáo viên tải một tài liệu mới lên Lộ trình Chương (Mục 03) hoặc Kho Tài liệu (Mục 05), mục Tin tức <strong>📘 Học thuật</strong> sẽ tự động cập nhật ngay.
                </p>
              </div>
              <button
                onClick={goBack}
                className="px-4 py-2 rounded-xl bg-[#EFECE6] text-[#1B3B48] text-xs font-bold hover:bg-[#E2DFD7]"
              >
                ← Quay lại trang trước
              </button>
            </div>

            {/* THANH CHIA CHUYÊN MỤC TIN TỨC (HỌC THUẬT • BÀI TẬP & DEADLINE • HỌC PHÍ • LỚP HỌC) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              <button
                type="button"
                onClick={() => setNewsCategoryFilter("ALL")}
                className={`p-4 rounded-2xl border text-left transition ${
                  newsCategoryFilter === "ALL"
                    ? "bg-[#1B3B48] text-white border-[#1B3B48] shadow-sm"
                    : "bg-white text-[#1B3B48] border-[#E2DFD7] hover:bg-[#EFECE6]"
                }`}
              >
                <div className="text-xs font-bold uppercase opacity-80">
                  Tất cả chuyên mục
                </div>
                <div className="text-lg font-extrabold mt-1">
                  📰 Toàn bộ Tin tức (
                  {
                    (appData.announcements || []).filter((a) =>
                      matchesSelectedYear(a.academicYear)
                    ).length
                  }
                  )
                </div>
                <div className="text-[11px] opacity-80 mt-1">
                  Xem tổng hợp cả 3 mục thông báo
                </div>
              </button>

              {NEWS_CATEGORIES.map((cat) => {
                const count = (appData.announcements || []).filter(
                  (a) =>
                    matchesSelectedYear(a.academicYear) &&
                    (a.category || "CLASS_NOTICE") === cat.id
                ).length;
                const isSelected = newsCategoryFilter === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setNewsCategoryFilter(cat.id)}
                    className={`p-4 rounded-2xl border text-left transition ${
                      isSelected
                        ? `${cat.activeBtn} border-transparent shadow-sm`
                        : "bg-white text-[#1B3B48] border-[#E2DFD7] hover:bg-[#EFECE6]"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold">{cat.badge}</span>
                      <span className="px-2 py-0.5 rounded-full bg-black/10 text-xs font-black">
                        {count} tin
                      </span>
                    </div>
                    <div className="text-base font-bold mt-1">{cat.label}</div>
                    <div className="text-[11px] opacity-85 mt-1 leading-snug">
                      {cat.desc}
                    </div>
                  </button>
                );
              })}
            </div>

            {currentUser.role === "teacher" && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!annForm.title.trim() || !annForm.content.trim()) return;

                  let targetSts = [];
                  let targetLabel = "";

                  if (annForm.sendMode === "INDIVIDUAL") {
                    const st =
                      appData.students.find(
                        (s) => s.id === annForm.targetStudentId
                      ) || activeStudent;
                    if (!st) {
                      notify("Vui lòng chọn 1 Học sinh / Phụ huynh cụ thể!", "warn");
                      return;
                    }
                    targetSts = [st];
                    targetLabel = `Riêng HS: ${st.name} (${st.classId})`;
                  } else {
                    targetSts =
                      annForm.classId === "ALL"
                        ? appData.students
                        : appData.students.filter(
                            (s) => s.classId === annForm.classId
                          );
                    targetLabel =
                      annForm.classId === "ALL"
                        ? "Toàn trường"
                        : `Lớp ${annForm.classId}`;
                  }

                  const activeYear =
                    selectedAcademicYear === "ALL"
                      ? appData.currentAcademicYear || "2026 - 2027"
                      : selectedAcademicYear;

                  const emails = targetSts.map((s) => s.email).filter(Boolean);
                  const catMeta = getNewsCategoryMeta(annForm.category);

                  const newAnn = {
                    id: "ANN" + Date.now(),
                    title: annForm.title.trim(),
                    category: annForm.category,
                    academicYear: activeYear,
                    sendMode: annForm.sendMode,
                    classId: annForm.classId,
                    targetStudentId:
                      annForm.sendMode === "INDIVIDUAL"
                        ? annForm.targetStudentId || activeStudent?.id
                        : "",
                    targetLabel,
                    content: annForm.content.trim(),
                    attachmentName: annForm.attachmentName,
                    attachmentType: annForm.attachmentType,
                    attachmentDataUrl: annForm.attachmentDataUrl,
                    date: new Date().toLocaleString("vi-VN"),
                    recipientCount: emails.length,
                  };
                  saveToAll({
                    ...appData,
                    announcements: [newAnn, ...appData.announcements],
                  });

                  if (annForm.sendEmailNow) {
                    const subject = `[${catMeta.label} - ${targetLabel}] ${newAnn.title}`;
                    const body = `Kính gửi Quý Phụ huynh và Học sinh (${targetLabel}),\nChuyên mục: ${catMeta.label} (Năm học ${activeYear})\n\n${newAnn.content}\n\nTrân trọng,\nThầy Dương Anh Tuấn Anh (${TEACHER_INFO.subNote})\nEmail: ${TEACHER_INFO.email}`;

                    if (
                      annForm.sendMode === "INDIVIDUAL" &&
                      emails.length > 0
                    ) {
                      setEmailPreviewModal({
                        modeBadge: `Gửi cá nhân tới ${targetLabel}`,
                        to: emails[0],
                        subject,
                        body,
                        mailtoUrl: `mailto:${encodeURIComponent(
                          emails[0]
                        )}?cc=${encodeURIComponent(
                          TEACHER_INFO.email
                        )}&subject=${encodeURIComponent(
                          subject
                        )}&body=${encodeURIComponent(body)}`,
                      });
                    } else {
                      const bcc = emails.join(",");
                      setEmailPreviewModal({
                        modeBadge: `Gửi hàng loạt (${emails.length} PH/HS)`,
                        to: bcc || TEACHER_INFO.email,
                        subject,
                        body,
                        mailtoUrl: `mailto:${encodeURIComponent(
                          TEACHER_INFO.email
                        )}?bcc=${encodeURIComponent(
                          bcc
                        )}&subject=${encodeURIComponent(
                          subject
                        )}&body=${encodeURIComponent(body)}`,
                      });
                    }
                  }

                  setAnnForm({
                    ...annForm,
                    title: "",
                    content: "",
                    attachmentName: "",
                    attachmentType: "",
                    attachmentDataUrl: "",
                  });
                  notify(`Đã đăng tin tức vào mục "${catMeta.label}"!`, "success");
                }}
                className="bg-white p-6 rounded-2xl border-2 border-[#1B3B48] space-y-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-3">
                  <h3 className="font-bold text-base text-[#1B3B48]">
                    Soạn Tin tức mới (Chọn chuyên mục: Học thuật / Học phí / Lớp học)
                  </h3>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        setAnnForm({ ...annForm, sendMode: "BULK" })
                      }
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                        annForm.sendMode === "BULK"
                          ? "bg-[#1B3B48] text-white"
                          : "bg-[#EFECE6] text-[#1B3B48]"
                      }`}
                    >
                      📢 Gửi hàng loạt (Theo Lớp / Toàn trường)
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setAnnForm({
                          ...annForm,
                          sendMode: "INDIVIDUAL",
                          targetStudentId:
                            annForm.targetStudentId ||
                            appData.students[0]?.id ||
                            "",
                        })
                      }
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                        annForm.sendMode === "INDIVIDUAL"
                          ? "bg-[#2C4A3E] text-white"
                          : "bg-[#EFECE6] text-[#1B3B48]"
                      }`}
                    >
                      👤 Gửi riêng cho từng HS / PH cụ thể
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  <select
                    value={annForm.category}
                    onChange={(e) =>
                      setAnnForm({ ...annForm, category: e.target.value })
                    }
                    className="p-2.5 rounded-xl border-2 border-[#1B3B48] text-xs bg-[#F7F6F2] font-extrabold text-[#1B3B48]"
                  >
                    {NEWS_CATEGORIES.map((c) => (
                      <option key={c.id} value={c.id}>
                        Chuyên mục: {c.badge}
                      </option>
                    ))}
                  </select>

                  <input
                    type="text"
                    required
                    value={annForm.title}
                    onChange={(e) =>
                      setAnnForm({ ...annForm, title: e.target.value })
                    }
                    placeholder="Tiêu đề thông báo / Bản tin..."
                    className="md:col-span-2 p-2.5 rounded-xl border border-[#E2DFD7] text-sm"
                  />

                  {annForm.sendMode === "BULK" ? (
                    <select
                      value={annForm.classId}
                      onChange={(e) =>
                        setAnnForm({ ...annForm, classId: e.target.value })
                      }
                      className="p-2.5 rounded-xl border border-[#E2DFD7] text-xs bg-white font-semibold"
                    >
                      <option value="ALL">
                        Gửi: Toàn bộ các lớp ({appData.students.length} HS)
                      </option>
                      {appData.classes.map((c) => {
                        const cnt = getStudentsOfClass(c.id).length;
                        return (
                          <option key={c.id} value={c.id}>
                            Gửi: Lớp {c.id} ({cnt} HS)
                          </option>
                        );
                      })}
                    </select>
                  ) : (
                    <select
                      value={annForm.targetStudentId}
                      onChange={(e) =>
                        setAnnForm({
                          ...annForm,
                          targetStudentId: e.target.value,
                        })
                      }
                      className="p-2.5 rounded-xl border-2 border-[#2C4A3E] text-xs bg-white font-bold text-[#1B3B48]"
                    >
                      <option value="">-- Chọn Học sinh / Phụ huynh --</option>
                      {appData.students.map((st) => (
                        <option key={st.id} value={st.id}>
                          {st.name} (Lớp {st.classId} • {st.email})
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                <textarea
                  rows={4}
                  required
                  value={annForm.content}
                  onChange={(e) =>
                    setAnnForm({ ...annForm, content: e.target.value })
                  }
                  placeholder="Nội dung chi tiết (học thuật / học phí / thông báo lớp học)..."
                  className="w-full p-3 rounded-xl border border-[#E2DFD7] text-sm"
                />

                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-2">
                      <label className="text-xs font-bold text-[#1B3B48]">
                        Đính kèm Ảnh / Tài liệu:
                      </label>
                      <input
                        type="file"
                        onChange={(e) =>
                          handleFlexibleFileUpload(e, (res) =>
                            setAnnForm((prev) => ({
                              ...prev,
                              attachmentName: res.fileName,
                              attachmentType: res.fileType,
                              attachmentDataUrl: res.dataUrl,
                            }))
                          )
                        }
                        className="text-xs"
                      />
                    </div>
                    <label className="flex items-center gap-1.5 text-xs font-semibold cursor-pointer">
                      <input
                        type="checkbox"
                        checked={annForm.sendEmailNow}
                        onChange={(e) =>
                          setAnnForm({
                            ...annForm,
                            sendEmailNow: e.target.checked,
                          })
                        }
                      />
                      <span>Mở kèm trình gửi Email cho PH/HS</span>
                    </label>
                  </div>
                  <button
                    type="submit"
                    className="bg-[#1B3B48] text-white px-5 py-2.5 rounded-xl text-sm font-bold"
                  >
                    Đăng Bản Tin Lên Hệ Thống
                  </button>
                </div>
              </form>
            )}

            <div className="space-y-4">
              {appData.announcements
                .filter((a) => {
                  if (!matchesSelectedYear(a.academicYear)) return false;
                  const cat = a.category || "CLASS_NOTICE";
                  if (
                    newsCategoryFilter !== "ALL" &&
                    cat !== newsCategoryFilter
                  ) {
                    return false;
                  }
                  return true;
                })
                .map((a) => {
                  const catMeta = getNewsCategoryMeta(
                    a.category || "CLASS_NOTICE"
                  );
                  return (
                    <div
                      key={a.id}
                      className="bg-white p-5 rounded-2xl border border-[#E2DFD7] shadow-sm space-y-2.5"
                    >
                      <div className="flex flex-wrap justify-between items-center gap-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-xs font-extrabold border ${catMeta.color}`}
                          >
                            {catMeta.badge}
                          </span>
                          <span className="px-2.5 py-0.5 rounded bg-[#1B3B48] text-white text-xs font-bold">
                            {a.targetLabel || a.classId}
                          </span>
                          {a.academicYear && (
                            <span className="text-[11px] font-bold text-[#5C7667] bg-[#F7F6F2] px-2 py-0.5 rounded border border-[#E2DFD7]">
                              Năm học: {a.academicYear}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-[#5C7667]">{a.date}</span>
                          {currentUser.role === "teacher" && (
                            <button
                              onClick={() =>
                                saveToAll({
                                  ...appData,
                                  announcements: appData.announcements.filter(
                                    (x) => x.id !== a.id
                                  ),
                                })
                              }
                              className="text-xs text-red-600 font-bold hover:underline"
                            >
                              Xóa
                            </button>
                          )}
                        </div>
                      </div>
                      <h4 className="font-bold text-base text-[#1B3B48]">
                        {a.title}
                      </h4>
                      <p className="text-sm whitespace-pre-line leading-relaxed text-[#1B3B48]/90">
                        {a.content}
                      </p>

                      {(a.externalUrl || a.attachmentDataUrl) && (
                        <div className="pt-2 flex flex-wrap items-center gap-2">
                          {a.externalUrl && (
                            <a
                              href={a.externalUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="px-3 py-1.5 rounded-xl bg-[#1B3B48] text-white text-xs font-bold"
                            >
                              🔗 Mở Link Tài liệu đính kèm
                            </a>
                          )}
                          {a.attachmentDataUrl && (
                            <a
                              href={a.attachmentDataUrl}
                              download={a.attachmentName || "tailieu"}
                              className="px-3 py-1.5 rounded-xl bg-[#5C7667] text-white text-xs font-bold"
                            >
                              📥 Tải Tệp: {a.attachmentName || "Tài liệu"}
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* ===================================================================
            MỤC 02: THỜI KHÓA BIỂU LỊCH THỰC, ĐỔI GIỜ LINH HOẠT & ĐÍNH KÈM TÀI LIỆU HÔM ĐÓ
        =================================================================== */}
        {activeView === "calendar" && (
          <div className="space-y-6">
            {/* THANH ĐỒNG HỒ THỜI GIAN THỰC & ĐIỀU HƯỚNG TUẦN THỰC TẾ */}
            <div className="bg-white p-6 rounded-2xl border border-[#E2DFD7] shadow-sm space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-extrabold">
                      ● ĐỒNG BỘ THỜI GIAN THỰC
                    </span>
                    <span className="text-xs font-mono font-bold text-[#1B3B48] bg-[#EFECE6] px-3 py-1 rounded-lg">
                      🕒 Bây giờ: {realTimeNow.toLocaleTimeString("vi-VN")} —{" "}
                      {realTimeNow.toLocaleDateString("vi-VN", {
                        weekday: "long",
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold text-[#1B3B48] mt-2">
                    Thời khóa biểu Bảng Lịch Thực & Đính kèm Tài liệu Học Hôm Đó
                  </h2>
                  <p className="text-xs text-[#5C7667] mt-0.5">
                    Mỗi buổi học trên lịch đều có thể đính kèm tài liệu học hôm đó (chọn từ Kho tài liệu chương hoặc tải file/link mới).
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowSlotManager(!showSlotManager)}
                    className="px-3.5 py-2 rounded-xl bg-[#2C4A3E] text-white text-xs font-bold hover:bg-[#1B3B48] transition"
                  >
                    ⚙️ Quản lý / Tạo Khung Giờ (Cột trái)
                  </button>
                  <button
                    onClick={goBack}
                    className="px-4 py-2 rounded-xl bg-[#EFECE6] text-[#1B3B48] text-xs font-bold hover:bg-[#E2DFD7]"
                  >
                    ← Quay lại
                  </button>
                </div>
              </div>

              {/* Thanh Chuyển đổi Tuần */}
              <div className="p-3.5 rounded-2xl bg-[#1B3B48] text-white flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedWeekOffset((w) => w - 1)}
                    className="px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-xs font-bold transition"
                  >
                    ← Tuần trước
                  </button>
                  <button
                    onClick={() => setSelectedWeekOffset(0)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                      selectedWeekOffset === 0
                        ? "bg-[#E9C46A] text-[#1B3B48]"
                        : "bg-white/10 hover:bg-white/20 text-white"
                    }`}
                  >
                    📍 Tuần Hiện Tại (Hôm nay)
                  </button>
                  <button
                    onClick={() => setSelectedWeekOffset((w) => w + 1)}
                    className="px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-xs font-bold transition"
                  >
                    Tuần kế tiếp →
                  </button>
                </div>

                <div className="text-center">
                  <span className="text-xs uppercase tracking-wider text-[#E9C46A] font-bold block">
                    {selectedWeekOffset === 0
                      ? "Đang xem: Tuần hiện tại"
                      : selectedWeekOffset > 0
                      ? `Đang xem: +${selectedWeekOffset} tuần sau`
                      : `Đang xem: ${Math.abs(selectedWeekOffset)} tuần trước`}
                  </span>
                  <span className="text-sm sm:text-base font-extrabold">
                    📅 {activeWeekInfo.weekLabel}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="date"
                    onChange={(e) => {
                      if (!e.target.value) return;
                      const picked = new Date(e.target.value);
                      const pickedMon = getMondayOfDate(picked);
                      const curMon = getMondayOfDate(new Date());
                      const diffWeeks = Math.round(
                        (pickedMon.getTime() - curMon.getTime()) /
                          (7 * 24 * 3600 * 1000)
                      );
                      setSelectedWeekOffset(diffWeeks);
                    }}
                    className="px-2.5 py-1 rounded-lg text-xs text-[#1B3B48] bg-white font-semibold"
                    title="Chọn ngày bất kỳ để nhảy tới tuần đó"
                  />
                  {currentUser.role === "teacher" && (
                    <button
                      onClick={handleCopyWeekToNextWeek}
                      className="px-3 py-1.5 rounded-xl bg-[#5C7667] hover:bg-[#4A6154] text-white text-xs font-bold transition"
                      title="Sao chép lịch tuần này sang tuần sau"
                    >
                      📋 Sao chép sang tuần sau
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* KHUNG QUẢN LÝ / THÊM HÀNG KHUNG GIỜ LINH HOẠT Ở CỘT BÊN TRÁI */}
            {showSlotManager && (
              <div className="bg-white p-6 rounded-2xl border-2 border-[#2C4A3E] space-y-4 shadow-sm">
                <div className="flex items-center justify-between border-b pb-3">
                  <div>
                    <h3 className="font-bold text-base text-[#1B3B48]">
                      ⚙️ Quản lý Các Hàng Khung Giờ (Cột bên trái Bảng lịch)
                    </h3>
                    <p className="text-xs text-[#5C7667]">
                      Bạn có thể tạo thêm các khung giờ riêng (VD: Ca Tối 21:00 - 22:00) hoặc xóa các khung giờ không dùng tới.
                    </p>
                  </div>
                  <button
                    onClick={() => setShowSlotManager(false)}
                    className="text-xs font-bold text-[#5C7667]"
                  >
                    ✕ Đóng
                  </button>
                </div>

                <form
                  onSubmit={handleAddCustomTimeSlot}
                  className="grid grid-cols-1 sm:grid-cols-4 gap-3"
                >
                  <input
                    type="text"
                    value={newSlotForm.label}
                    onChange={(e) =>
                      setNewSlotForm({ ...newSlotForm, label: e.target.value })
                    }
                    placeholder="Tên ca (VD: Ca Luyện đề ĐH)"
                    className="p-2.5 rounded-xl border text-xs"
                  />
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold">Từ:</span>
                    <input
                      type="time"
                      required
                      value={newSlotForm.startTime}
                      onChange={(e) =>
                        setNewSlotForm({
                          ...newSlotForm,
                          startTime: e.target.value,
                        })
                      }
                      className="flex-1 p-2.5 rounded-xl border text-xs font-mono"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold">Đến:</span>
                    <input
                      type="time"
                      required
                      value={newSlotForm.endTime}
                      onChange={(e) =>
                        setNewSlotForm({
                          ...newSlotForm,
                          endTime: e.target.value,
                        })
                      }
                      className="flex-1 p-2.5 rounded-xl border text-xs font-mono"
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-[#1B3B48] text-white px-4 py-2.5 rounded-xl text-xs font-bold"
                  >
                    + Thêm Hàng Khung Giờ Mới
                  </button>
                </form>

                <div className="flex flex-wrap gap-2 pt-2">
                  {activeTimeSlots.map((s) => (
                    <div
                      key={s.id}
                      className="px-3 py-1.5 rounded-xl bg-[#F7F6F2] border border-[#E2DFD7] flex items-center gap-2 text-xs font-bold"
                    >
                      <span>{s.label}</span>
                      <button
                        onClick={() => handleDeleteTimeSlot(s.id)}
                        className="text-red-600 hover:underline ml-1"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* FORM XẾP LỊCH HỌC LINH HOẠT + ĐÍNH KÈM TÀI LIỆU HỌC HÔM ĐÓ */}
            <form
              onSubmit={handleAddCalendarEvent}
              className="bg-white p-6 rounded-2xl border-2 border-[#1B3B48] space-y-4 shadow-sm"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-3">
                <h3 className="font-bold text-base text-[#1B3B48]">
                  {currentUser.role === "teacher"
                    ? "➕ Tạo Ca Học & Đính kèm Tài liệu Buổi Học Hôm Đó (Giáo viên)"
                    : `➕ Thêm Lịch Tự Học Cá Nhân (${currentUser.name})`}
                </h3>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setCalForm({ ...calForm, repeatMode: "WEEK_ONLY" })
                    }
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                      calForm.repeatMode === "WEEK_ONLY"
                        ? "bg-[#1B3B48] text-white"
                        : "bg-[#EFECE6] text-[#1B3B48]"
                    }`}
                  >
                    📌 Chỉ áp dụng cho Tuần đang xem ({activeWeekInfo.days[0].shortDate} - {activeWeekInfo.days[6].shortDate})
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setCalForm({ ...calForm, repeatMode: "RECURRING" })
                    }
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                      calForm.repeatMode === "RECURRING"
                        ? "bg-[#2C4A3E] text-white"
                        : "bg-[#EFECE6] text-[#1B3B48]"
                    }`}
                  >
                    🔁 Lặp lại cố định hàng tuần
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
                <div>
                  <label className="block text-[11px] font-bold mb-1 text-[#5C7667]">
                    1. Thứ & Ngày thực tế:
                  </label>
                  <select
                    value={calForm.dayOfWeek}
                    onChange={(e) =>
                      setCalForm({ ...calForm, dayOfWeek: e.target.value })
                    }
                    className="w-full p-2.5 rounded-xl border border-[#E2DFD7] text-xs bg-white font-bold"
                  >
                    {activeWeekInfo.days.map((d) => (
                      <option key={d.dayOfWeek} value={d.dayOfWeek}>
                        {d.dayOfWeek} ({d.fullDate}){d.isToday ? " • HÔM NAY" : ""}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold mb-1 text-[#5C7667]">
                    2. Giờ bắt đầu:
                  </label>
                  <input
                    type="time"
                    required
                    value={calForm.startTime}
                    onChange={(e) =>
                      setCalForm({ ...calForm, startTime: e.target.value })
                    }
                    className="w-full p-2.5 rounded-xl border border-[#E2DFD7] text-xs font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold mb-1 text-[#5C7667]">
                    3. Giờ kết thúc:
                  </label>
                  <input
                    type="time"
                    required
                    value={calForm.endTime}
                    onChange={(e) =>
                      setCalForm({ ...calForm, endTime: e.target.value })
                    }
                    className="w-full p-2.5 rounded-xl border border-[#E2DFD7] text-xs font-mono font-bold"
                  />
                </div>

                <div className="lg:col-span-2">
                  <label className="block text-[11px] font-bold mb-1 text-[#5C7667]">
                    4. Vị trí Hàng Khung Giờ trên Bảng lịch:
                  </label>
                  <select
                    value={
                      calForm.slotMode === "AUTO_NEW"
                        ? "__AUTO_NEW__"
                        : calForm.slotId
                    }
                    onChange={(e) => {
                      if (e.target.value === "__AUTO_NEW__") {
                        setCalForm({ ...calForm, slotMode: "AUTO_NEW" });
                      } else {
                        const foundSlot = activeTimeSlots.find(
                          (s) => s.id === e.target.value
                        );
                        setCalForm({
                          ...calForm,
                          slotMode: "EXISTING",
                          slotId: e.target.value,
                          startTime: foundSlot?.startTime || calForm.startTime,
                          endTime: foundSlot?.endTime || calForm.endTime,
                        });
                      }
                    }}
                    className="w-full p-2.5 rounded-xl border border-[#E2DFD7] text-xs bg-white font-semibold"
                  >
                    <option value="__AUTO_NEW__">
                      ✨ Tự tạo Hàng Khung Giờ riêng ({calForm.startTime} -{" "}
                      {calForm.endTime})
                    </option>
                    {activeTimeSlots.map((s) => (
                      <option key={s.id} value={s.id}>
                        Đặt vào hàng: {s.label}
                      </option>
                    ))}
                  </select>
                </div>

                {currentUser.role === "teacher" && (
                  <div>
                    <label className="block text-[11px] font-bold mb-1 text-[#5C7667]">
                      5. Phân lớp:
                    </label>
                    <select
                      value={calForm.targetScope}
                      onChange={(e) =>
                        setCalForm({ ...calForm, targetScope: e.target.value })
                      }
                      className="w-full p-2.5 rounded-xl border border-[#E2DFD7] text-xs bg-white font-bold"
                    >
                      <option value="ALL">Tất cả các lớp</option>
                      {appData.classes.map((c) => (
                        <option key={c.id} value={c.id}>
                          Lớp {c.id}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                {calForm.slotMode === "AUTO_NEW" && (
                  <div className="sm:col-span-3">
                    <input
                      type="text"
                      value={calForm.newSlotLabel}
                      onChange={(e) =>
                        setCalForm({
                          ...calForm,
                          newSlotLabel: e.target.value,
                        })
                      }
                      placeholder="Tên hàng ca mới (VD: Ca Tối Muộn)"
                      className="w-full p-2.5 rounded-xl border border-[#2C4A3E] text-xs bg-[#F7F6F2] font-bold"
                    />
                  </div>
                )}
                <div
                  className={
                    calForm.slotMode === "AUTO_NEW"
                      ? "sm:col-span-5"
                      : "sm:col-span-6"
                  }
                >
                  <input
                    type="text"
                    required
                    value={calForm.title}
                    onChange={(e) =>
                      setCalForm({ ...calForm, title: e.target.value })
                    }
                    placeholder="Nội dung buổi học (VD: Chuyên đề Ester - Lipid buổi 2)"
                    className="w-full p-2.5 rounded-xl border border-[#E2DFD7] text-xs"
                  />
                </div>
                <div
                  className={
                    calForm.slotMode === "AUTO_NEW"
                      ? "sm:col-span-4"
                      : "sm:col-span-6"
                  }
                >
                  <input
                    type="text"
                    value={calForm.roomOrNote}
                    onChange={(e) =>
                      setCalForm({ ...calForm, roomOrNote: e.target.value })
                    }
                    placeholder="Link Google Meet / Zoom hoặc Ghi chú phòng học..."
                    className="w-full p-2.5 rounded-xl border border-[#E2DFD7] text-xs"
                  />
                </div>
              </div>

              {/* KHU VỰC ĐÍNH KÈM TÀI LIỆU BUỔI HỌC HÔM ĐÓ TRONG FORM LỊCH HỌC */}
              <div className="p-3.5 rounded-xl bg-[#F7F6F2] border border-[#E2DFD7] space-y-2">
                <div className="text-xs font-bold text-[#1B3B48]">
                  📎 Đính kèm Tài liệu học hôm đó vào Ca học này:
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5 items-center">
                  <select
                    value={calForm.attachedDocId}
                    onChange={(e) => {
                      const docId = e.target.value;
                      const found = (appData.documents || []).find(
                        (d) => d.id === docId
                      );
                      setCalForm({
                        ...calForm,
                        attachedDocId: docId,
                        lessonDocTitle: found
                          ? found.title
                          : calForm.lessonDocTitle,
                        lessonDocUrl: found
                          ? found.externalUrl
                          : calForm.lessonDocUrl,
                      });
                    }}
                    className="p-2 rounded-lg border text-xs bg-white font-semibold"
                  >
                    <option value="">-- Chọn từ Kho tài liệu đã tải --</option>
                    {(appData.documents || []).map((d) => (
                      <option key={d.id} value={d.id}>
                        [{d.classId}] {d.title} ({d.chapterTitle})
                      </option>
                    ))}
                  </select>

                  <input
                    type="text"
                    value={calForm.lessonDocTitle}
                    onChange={(e) =>
                      setCalForm({ ...calForm, lessonDocTitle: e.target.value })
                    }
                    placeholder="Hoặc nhập tên tài liệu hôm đó..."
                    className="p-2 rounded-lg border text-xs bg-white"
                  />

                  <input
                    type="text"
                    value={calForm.lessonDocUrl}
                    onChange={(e) =>
                      setCalForm({ ...calForm, lessonDocUrl: e.target.value })
                    }
                    placeholder="Link tài liệu (Google Drive/PDF)..."
                    className="p-2 rounded-lg border text-xs bg-white"
                  />

                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      onChange={(e) =>
                        handleFlexibleFileUpload(e, (res) =>
                          setCalForm((prev) => ({
                            ...prev,
                            lessonDocTitle: prev.lessonDocTitle || res.fileName,
                            lessonDocFileName: res.fileName,
                            lessonDocDataUrl: res.dataUrl,
                          }))
                        )
                      }
                      className="text-[11px] w-full"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-[#1B3B48] hover:bg-[#2C4A3E] text-white py-2.5 px-5 rounded-xl text-xs font-bold transition"
                >
                  + Lưu Ca Học & Tài Liệu Đính Kèm Vào Bảng Lịch
                </button>
              </div>
            </form>

            {/* Bộ lọc lớp trên Bảng Lịch */}
            <div className="flex flex-wrap items-center justify-between gap-2 bg-white p-4 rounded-2xl border border-[#E2DFD7]">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-[#5C7667]">
                  Lọc theo lớp:
                </span>
                <button
                  onClick={() => setCalendarFilterClass("ALL")}
                  className={`px-3 py-1 rounded-lg text-xs font-bold ${
                    calendarFilterClass === "ALL"
                      ? "bg-[#1B3B48] text-white"
                      : "bg-[#EFECE6] text-[#1B3B48]"
                  }`}
                >
                  Tất cả các lớp
                </button>
                {appData.classes.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setCalendarFilterClass(c.id)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold ${
                      calendarFilterClass === c.id
                        ? "bg-[#1B3B48] text-white"
                        : "bg-[#EFECE6] text-[#1B3B48]"
                    }`}
                  >
                    Lớp {c.id}
                  </button>
                ))}
              </div>
              <span className="text-xs text-[#5C7667]">
                💡 Mẹo: Bấm nút <strong>"✎ Sửa"</strong> trên bất kỳ thẻ lịch nào để đổi giờ hoặc đính kèm/cập nhật tài liệu học hôm đó.
              </span>
            </div>

            {/* BẢNG LƯỚI CALENDAR 7 CỘT */}
            <div className="bg-white rounded-2xl border border-[#E2DFD7] shadow-sm overflow-x-auto">
              <table className="w-full min-w-[980px] border-collapse text-xs">
                <thead>
                  <tr className="bg-[#1B3B48] text-white">
                    <th className="p-3 border border-[#2C4A3E] w-44 text-left">
                      Ca / Khung giờ linh hoạt
                    </th>
                    {activeWeekInfo.days.map((dayObj) => (
                      <th
                        key={dayObj.dayOfWeek}
                        className={`p-3 border border-[#2C4A3E] text-center transition ${
                          dayObj.isToday
                            ? "bg-[#2C4A3E] text-[#E9C46A] ring-2 ring-inset ring-[#E9C46A]"
                            : ""
                        }`}
                      >
                        <div className="font-bold text-xs">
                          {dayObj.dayOfWeek}
                        </div>
                        <div className="text-[11px] font-mono opacity-90 mt-0.5">
                          {dayObj.fullDate}
                        </div>
                        {dayObj.isToday && (
                          <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-[#E9C46A] text-[#1B3B48] text-[10px] font-black uppercase">
                            Hôm nay
                          </span>
                        )}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {activeTimeSlots.map((slot) => (
                    <tr key={slot.id} className="align-top">
                      <td className="p-3 border border-[#E2DFD7] bg-[#EFECE6] font-bold text-[#1B3B48]">
                        <div className="flex items-start justify-between gap-1">
                          <span>{slot.label}</span>
                        </div>
                      </td>

                      {activeWeekInfo.days.map((dayObj) => {
                        const cellEvents = appData.calendarEvents
                          .filter((ev) => {
                            if (!matchesSelectedYear(ev.academicYear))
                              return false;
                            if (
                              ev.dayOfWeek !== dayObj.dayOfWeek ||
                              ev.slotId !== slot.id
                            )
                              return false;

                            const isRecurring =
                              !ev.repeatMode || ev.repeatMode === "RECURRING";
                            if (isRecurring) {
                              if (
                                (ev.excludedWeeks || []).includes(
                                  activeWeekInfo.weekKey
                                )
                              ) {
                                return false;
                              }
                            } else {
                              if (ev.weekKey !== activeWeekInfo.weekKey) {
                                return false;
                              }
                            }

                            if (currentUser.role === "student") {
                              const isMyClass =
                                ev.targetScope === "ALL" ||
                                ev.targetScope === currentUser.classId;
                              const isMyPersonal =
                                ev.targetScope ===
                                `HS:${currentUser.studentId}`;
                              if (!isMyClass && !isMyPersonal) return false;
                            }

                            if (
                              calendarFilterClass !== "ALL" &&
                              ev.targetScope !== calendarFilterClass &&
                              ev.targetScope !== "ALL"
                            ) {
                              return false;
                            }
                            return true;
                          })
                          .sort((a, b) =>
                            (a.startTime || "").localeCompare(b.startTime || "")
                          );

                        return (
                          <td
                            key={dayObj.dayOfWeek}
                            className={`p-2 border border-[#E2DFD7] min-h-[115px] w-36 transition ${
                              dayObj.isToday
                                ? "bg-[#E9C46A]/10"
                                : "bg-[#F7F6F2]/40 hover:bg-white"
                            }`}
                          >
                            <div className="space-y-2">
                              {cellEvents.map((ev) => {
                                const isPersonal =
                                  ev.targetScope?.startsWith("HS:");
                                const liveStatus = getLiveSessionStatus(
                                  dayObj.dateKey,
                                  ev.startTime,
                                  ev.endTime,
                                  realTimeNow
                                );
                                const linkedDoc = (
                                  appData.documents || []
                                ).find((d) => d.id === ev.attachedDocId);
                                const docTitle =
                                  ev.lessonDocTitle || linkedDoc?.title || "";
                                const docUrl =
                                  ev.lessonDocUrl ||
                                  linkedDoc?.externalUrl ||
                                  "";
                                const docDataUrl =
                                  ev.lessonDocDataUrl ||
                                  linkedDoc?.fileDataUrl ||
                                  "";
                                const docFileName =
                                  ev.lessonDocFileName ||
                                  linkedDoc?.fileName ||
                                  "tailieu";

                                return (
                                  <div
                                    key={ev.id}
                                    className={`p-2.5 rounded-xl text-white space-y-1.5 shadow-sm ${
                                      isPersonal
                                        ? "bg-[#5C7667]"
                                        : "bg-[#1B3B48]"
                                    }`}
                                  >
                                    <div className="flex items-center justify-between gap-1">
                                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-white/20">
                                        {ev.ownerName}
                                      </span>
                                      {(currentUser.role === "teacher" ||
                                        isPersonal) && (
                                        <div className="flex items-center gap-1">
                                          <button
                                            onClick={() =>
                                              setEditingCalEvent({
                                                ...ev,
                                                startTime:
                                                  ev.startTime || "18:00",
                                                endTime: ev.endTime || "19:30",
                                                repeatMode:
                                                  ev.repeatMode || "RECURRING",
                                                editScope:
                                                  ev.repeatMode === "RECURRING"
                                                    ? "THIS_WEEK_ONLY"
                                                    : "ALL",
                                              })
                                            }
                                            className="text-[10px] bg-white/15 hover:bg-white/30 px-1.5 py-0.5 rounded text-[#E9C46A] font-bold"
                                            title="Sửa giờ / Đổi ngày / Đính kèm tài liệu"
                                          >
                                            ✎ Sửa
                                          </button>
                                          <button
                                            onClick={() =>
                                              saveToAll({
                                                ...appData,
                                                calendarEvents:
                                                  appData.calendarEvents.filter(
                                                    (x) => x.id !== ev.id
                                                  ),
                                              })
                                            }
                                            className="text-[10px] text-red-200 hover:text-white px-1"
                                            title="Xóa ca học này"
                                          >
                                            ✕
                                          </button>
                                        </div>
                                      )}
                                    </div>

                                    <div className="flex flex-wrap items-center gap-1">
                                      {liveStatus && (
                                        <span
                                          className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded ${liveStatus.color}`}
                                        >
                                          {liveStatus.label}
                                        </span>
                                      )}
                                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-black/25 text-gray-200">
                                        {ev.repeatMode === "WEEK_ONLY"
                                          ? `📌 Tuần ${dayObj.shortDate}`
                                          : "🔁 Hàng tuần"}
                                      </span>
                                    </div>

                                    <div className="font-bold text-xs leading-snug">
                                      {ev.title}
                                    </div>

                                    {ev.customTime && (
                                      <div className="text-[11px] text-[#E9C46A] font-bold">
                                        🕒 {ev.customTime}
                                      </div>
                                    )}

                                    {ev.roomOrNote && (
                                      <div className="text-[10px] opacity-95 break-words">
                                        📍{" "}
                                        {ev.roomOrNote.startsWith("http") ? (
                                          <a
                                            href={ev.roomOrNote}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="underline text-[#E9C46A] font-semibold"
                                          >
                                            Vào link lớp học
                                          </a>
                                        ) : (
                                          ev.roomOrNote
                                        )}
                                      </div>
                                    )}

                                    {/* HIỂN THỊ TÀI LIỆU HỌC HÔM ĐÓ NGAY TRÊN THẺ LỊCH HỌC */}
                                    {docTitle && (
                                      <div className="p-1.5 rounded-lg bg-white/15 border border-white/20 space-y-1 mt-1">
                                        <div className="text-[10px] font-bold text-[#E9C46A] leading-tight">
                                          📎 TL: {docTitle}
                                        </div>
                                        <div className="flex flex-wrap gap-1">
                                          {docUrl && (
                                            <a
                                              href={docUrl}
                                              target="_blank"
                                              rel="noreferrer"
                                              className="px-1.5 py-0.5 rounded bg-[#E9C46A] text-[#1B3B48] text-[9px] font-extrabold"
                                            >
                                              Mở TL
                                            </a>
                                          )}
                                          {docDataUrl && (
                                            <a
                                              href={docDataUrl}
                                              download={docFileName}
                                              className="px-1.5 py-0.5 rounded bg-emerald-300 text-[#1B3B48] text-[9px] font-extrabold"
                                            >
                                              Tải File
                                            </a>
                                          )}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* MODAL SỬA NHANH GIỜ HỌC / ĐỔI NGÀY / ĐÍNH KÈM TÀI LIỆU BUỔI HỌC */}
            {editingCalEvent && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                <form
                  onSubmit={handleSaveEditedCalEvent}
                  className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-xl border border-[#E2DFD7] max-h-[90vh] overflow-y-auto"
                >
                  <div className="flex items-center justify-between border-b pb-3">
                    <h3 className="font-bold text-base text-[#1B3B48]">
                      ✎ Điều chỉnh Lịch & Tài liệu học hôm đó ({editingCalEvent.ownerName})
                    </h3>
                    <button
                      type="button"
                      onClick={() => setEditingCalEvent(null)}
                      className="text-xs font-bold text-[#5C7667]"
                    >
                      ✕ Đóng
                    </button>
                  </div>

                  {editingCalEvent.repeatMode === "RECURRING" && (
                    <div className="p-3 rounded-xl bg-[#F7F6F2] border border-[#E2DFD7] space-y-2 text-xs">
                      <div className="font-bold text-[#1B3B48]">
                        Bạn muốn áp dụng thay đổi (giờ học / tài liệu hôm đó) như thế nào?
                      </div>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          checked={
                            editingCalEvent.editScope === "THIS_WEEK_ONLY"
                          }
                          onChange={() =>
                            setEditingCalEvent({
                              ...editingCalEvent,
                              editScope: "THIS_WEEK_ONLY",
                            })
                          }
                        />
                        <span>
                          <strong>Chỉ áp dụng riêng cho Tuần đang xem</strong> (
                          {activeWeekInfo.weekLabel})
                        </span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          checked={editingCalEvent.editScope === "ALL"}
                          onChange={() =>
                            setEditingCalEvent({
                              ...editingCalEvent,
                              editScope: "ALL",
                            })
                          }
                        />
                        <span>
                          <strong>Áp dụng cố định cho tất cả các tuần</strong>
                        </span>
                      </label>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="block font-bold mb-1">
                        Chuyển sang Thứ:
                      </label>
                      <select
                        value={editingCalEvent.dayOfWeek}
                        onChange={(e) =>
                          setEditingCalEvent({
                            ...editingCalEvent,
                            dayOfWeek: e.target.value,
                          })
                        }
                        className="w-full p-2.5 rounded-xl border bg-white font-bold"
                      >
                        {activeWeekInfo.days.map((d) => (
                          <option key={d.dayOfWeek} value={d.dayOfWeek}>
                            {d.dayOfWeek} ({d.shortDate})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold mb-1">
                        Hàng Khung giờ:
                      </label>
                      <select
                        value={editingCalEvent.slotId}
                        onChange={(e) =>
                          setEditingCalEvent({
                            ...editingCalEvent,
                            slotId: e.target.value,
                          })
                        }
                        className="w-full p-2.5 rounded-xl border bg-white font-bold"
                      >
                        {activeTimeSlots.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold mb-1">
                        Giờ bắt đầu mới:
                      </label>
                      <input
                        type="time"
                        value={editingCalEvent.startTime}
                        onChange={(e) =>
                          setEditingCalEvent({
                            ...editingCalEvent,
                            startTime: e.target.value,
                          })
                        }
                        className="w-full p-2.5 rounded-xl border font-mono font-bold"
                      />
                    </div>

                    <div>
                      <label className="block font-bold mb-1">
                        Giờ kết thúc mới:
                      </label>
                      <input
                        type="time"
                        value={editingCalEvent.endTime}
                        onChange={(e) =>
                          setEditingCalEvent({
                            ...editingCalEvent,
                            endTime: e.target.value,
                          })
                        }
                        className="w-full p-2.5 rounded-xl border font-mono font-bold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold mb-1">
                      Tên buổi học:
                    </label>
                    <input
                      type="text"
                      value={editingCalEvent.title}
                      onChange={(e) =>
                        setEditingCalEvent({
                          ...editingCalEvent,
                          title: e.target.value,
                        })
                      }
                      className="w-full p-2.5 rounded-xl border text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold mb-1">
                      Link phòng học / Ghi chú:
                    </label>
                    <input
                      type="text"
                      value={editingCalEvent.roomOrNote}
                      onChange={(e) =>
                        setEditingCalEvent({
                          ...editingCalEvent,
                          roomOrNote: e.target.value,
                        })
                      }
                      className="w-full p-2.5 rounded-xl border text-xs"
                    />
                  </div>

                  {/* ĐÍNH KÈM TÀI LIỆU HỌC HÔM ĐÓ TRONG MODAL SỬA LỊCH */}
                  <div className="p-3 rounded-xl bg-[#F7F6F2] border border-[#E2DFD7] space-y-2 text-xs">
                    <div className="font-bold text-[#1B3B48]">
                      📎 Tài liệu học đính kèm cho buổi học này:
                    </div>
                    <select
                      value={editingCalEvent.attachedDocId || ""}
                      onChange={(e) => {
                        const docId = e.target.value;
                        const found = (appData.documents || []).find(
                          (d) => d.id === docId
                        );
                        setEditingCalEvent({
                          ...editingCalEvent,
                          attachedDocId: docId,
                          lessonDocTitle: found
                            ? found.title
                            : editingCalEvent.lessonDocTitle,
                          lessonDocUrl: found
                            ? found.externalUrl
                            : editingCalEvent.lessonDocUrl,
                        });
                      }}
                      className="w-full p-2 rounded-lg border bg-white font-semibold"
                    >
                      <option value="">
                        -- Chọn từ Kho tài liệu Lớp/Chương --
                      </option>
                      {(appData.documents || []).map((d) => (
                        <option key={d.id} value={d.id}>
                          [{d.classId}] {d.title} ({d.chapterTitle})
                        </option>
                      ))}
                    </select>
                    <input
                      type="text"
                      value={editingCalEvent.lessonDocTitle || ""}
                      onChange={(e) =>
                        setEditingCalEvent({
                          ...editingCalEvent,
                          lessonDocTitle: e.target.value,
                        })
                      }
                      placeholder="Tên tài liệu buổi học hôm đó..."
                      className="w-full p-2 rounded-lg border bg-white"
                    />
                    <input
                      type="text"
                      value={editingCalEvent.lessonDocUrl || ""}
                      onChange={(e) =>
                        setEditingCalEvent({
                          ...editingCalEvent,
                          lessonDocUrl: e.target.value,
                        })
                      }
                      placeholder="Link tải tài liệu (Google Drive / OneDrive)..."
                      className="w-full p-2 rounded-lg border bg-white"
                    />
                    <input
                      type="file"
                      onChange={(e) =>
                        handleFlexibleFileUpload(e, (res) =>
                          setEditingCalEvent((prev) => ({
                            ...prev,
                            lessonDocTitle:
                              prev.lessonDocTitle || res.fileName,
                            lessonDocFileName: res.fileName,
                            lessonDocDataUrl: res.dataUrl,
                          }))
                        )
                      }
                      className="text-[11px]"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setEditingCalEvent(null)}
                      className="px-4 py-2 rounded-xl bg-gray-100 text-xs font-bold"
                    >
                      Hủy
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-[#1B3B48] text-white text-xs font-bold"
                    >
                      Lưu Thay Đổi Lịch & Tài Liệu
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}

        {/* ===================================================================
            MỤC 03: LỘ TRÌNH CHƯƠNG TRÌNH, YCCĐ & TẢI TÀI LIỆU CHO TỪNG LỚP TỪNG CHƯƠNG
        =================================================================== */}
        {activeView === "curriculum" && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-[#E2DFD7] flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase text-[#5C7667]">
                  Mục 03 • Chương trình GDPT 2018 & Tài liệu Từng Chương
                </span>
                <h2 className="text-2xl font-bold text-[#1B3B48]">
                  Lộ trình Hóa học 10 • 11 • 12 & Tải Tài liệu Cho Từng Lớp, Từng Chương
                </h2>
                <p className="text-xs text-[#5C7667] mt-1">
                  Mỗi chương đã tạo trong lộ trình đều có khu vực tải tài liệu riêng cho từng lớp. Khi Giáo viên tải tài liệu lên, mục Tin tức <strong>📘 Học thuật</strong> sẽ tự động cập nhật.
                </p>
              </div>
              <button
                onClick={goBack}
                className="px-4 py-2 rounded-xl bg-[#EFECE6] text-[#1B3B48] text-xs font-bold hover:bg-[#E2DFD7]"
              >
                ← Quay lại trang trước
              </button>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
              <div className="flex flex-1 gap-3">
                {["10", "11", "12"].map((grade) => (
                  <button
                    key={grade}
                    onClick={() => {
                      setSelectedGradeTab(grade);
                      setCurriculumClassFilter("ALL");
                    }}
                    className={`flex-1 py-3 px-4 rounded-2xl font-bold text-sm border transition ${
                      selectedGradeTab === grade
                        ? "bg-[#1B3B48] text-white border-[#1B3B48]"
                        : "bg-white text-[#1B3B48] border-[#E2DFD7] hover:bg-[#EFECE6]"
                    }`}
                  >
                    Hóa học Lớp {grade} (
                    {(appData.curriculum?.[grade] || []).length} Chương)
                  </button>
                ))}
              </div>

              {/* Bộ lọc Lớp trong Khối để xem/tải tài liệu của từng lớp */}
              <div className="flex items-center gap-2 bg-white px-4 py-2.5 rounded-2xl border border-[#E2DFD7]">
                <span className="text-xs font-bold text-[#5C7667]">
                  Lọc tài liệu theo Lớp (Khối {selectedGradeTab}):
                </span>
                <select
                  value={curriculumClassFilter}
                  onChange={(e) => setCurriculumClassFilter(e.target.value)}
                  className="text-xs font-extrabold text-[#1B3B48] bg-[#F7F6F2] px-2.5 py-1.5 rounded-lg border border-[#E2DFD7]"
                >
                  <option value="ALL">
                    Tất cả các lớp Khối {selectedGradeTab}
                  </option>
                  {appData.classes
                    .filter((c) => c.grade === selectedGradeTab)
                    .map((c) => (
                      <option key={c.id} value={c.id}>
                        Lớp {c.id} ({c.name})
                      </option>
                    ))}
                </select>
              </div>
            </div>

            {currentUser.role === "teacher" && (
              <form
                onSubmit={handleAddNewChapter}
                className="bg-white p-6 rounded-2xl border-2 border-[#1B3B48] space-y-4"
              >
                <h3 className="font-bold text-base text-[#1B3B48]">
                  + Thêm Chương / Chuyên đề mới vào Lộ trình Lớp {selectedGradeTab}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <input
                    type="text"
                    required
                    value={newChapterForm.title}
                    onChange={(e) =>
                      setNewChapterForm({
                        ...newChapterForm,
                        grade: selectedGradeTab,
                        title: e.target.value,
                      })
                    }
                    placeholder="Tên chương..."
                    className="sm:col-span-2 p-2.5 rounded-xl border border-[#E2DFD7] text-sm"
                  />
                  <input
                    type="text"
                    value={newChapterForm.timeline}
                    onChange={(e) =>
                      setNewChapterForm({
                        ...newChapterForm,
                        grade: selectedGradeTab,
                        timeline: e.target.value,
                      })
                    }
                    placeholder="Tháng học (VD: Tháng 05)"
                    className="p-2.5 rounded-xl border border-[#E2DFD7] text-sm"
                  />
                  <input
                    type="text"
                    value={newChapterForm.targetDate}
                    onChange={(e) =>
                      setNewChapterForm({
                        ...newChapterForm,
                        grade: selectedGradeTab,
                        targetDate: e.target.value,
                      })
                    }
                    placeholder="Học tới ngày nào (VD: Tới 25/05/2026)"
                    className="p-2.5 rounded-xl border border-[#E2DFD7] text-sm"
                  />
                </div>
                <input
                  type="text"
                  value={newChapterForm.formulas}
                  onChange={(e) =>
                    setNewChapterForm({
                      ...newChapterForm,
                      grade: selectedGradeTab,
                      formulas: e.target.value,
                    })
                  }
                  placeholder="Các công thức hóa học trọng tâm..."
                  className="w-full p-2.5 rounded-xl border border-[#E2DFD7] text-sm"
                />
                <textarea
                  rows={3}
                  value={newChapterForm.requirementsText}
                  onChange={(e) =>
                    setNewChapterForm({
                      ...newChapterForm,
                      grade: selectedGradeTab,
                      requirementsText: e.target.value,
                    })
                  }
                  placeholder="Nhập Yêu cầu cần đạt (mỗi dòng 1 ý)..."
                  className="w-full p-2.5 rounded-xl border border-[#E2DFD7] text-sm"
                />
                <button
                  type="submit"
                  className="bg-[#1B3B48] text-white px-5 py-2 rounded-xl text-xs font-bold"
                >
                  Lưu Chương mới vào Lộ trình
                </button>
              </form>
            )}

            <div className="space-y-5">
              {(appData.curriculum?.[selectedGradeTab] || []).map((chap) => {
                const chapterDocs = (appData.documents || []).filter((d) => {
                  if (!matchesSelectedYear(d.academicYear)) return false;
                  const matchChap =
                    d.chapterId === chap.id || d.chapterTitle === chap.title;
                  if (!matchChap) return false;
                  if (
                    curriculumClassFilter !== "ALL" &&
                    d.classId !== "ALL" &&
                    d.classId !== curriculumClassFilter
                  ) {
                    return false;
                  }
                  if (currentUser.role === "student") {
                    return (
                      d.classId === "ALL" || d.classId === currentUser.classId
                    );
                  }
                  return true;
                });

                const gradeClasses = appData.classes.filter(
                  (c) => c.grade === selectedGradeTab
                );

                return (
                  <div
                    key={chap.id}
                    className="bg-white p-6 rounded-2xl border border-[#E2DFD7] shadow-sm space-y-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#EFECE6] pb-3">
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-xs font-bold uppercase px-2.5 py-0.5 rounded bg-[#1B3B48] text-white">
                            {chap.timeline}
                          </span>
                          <span className="text-xs font-bold px-2.5 py-0.5 rounded bg-[#EFECE6] text-[#2C4A3E]">
                            ⏳ Mốc thời gian: {chap.targetDate || "Theo kế hoạch"}
                          </span>
                        </div>
                        <h3 className="font-extrabold text-lg text-[#1B3B48] pt-1">
                          {chap.title}
                        </h3>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-semibold text-[#5C7667] bg-[#F7F6F2] px-3 py-1 rounded-lg border border-[#E2DFD7]">
                          Trọng tâm: {chap.formulas}
                        </span>
                        {currentUser.role === "teacher" && (
                          <>
                            <button
                              type="button"
                              onClick={() => {
                                setActiveChapterUploadId(
                                  activeChapterUploadId === chap.id
                                    ? null
                                    : chap.id
                                );
                                setChapterDocForm({
                                  title: "",
                                  classId:
                                    gradeClasses[0]?.id || "ALL",
                                  externalUrl: "",
                                  note: "",
                                  fileName: "",
                                  fileType: "",
                                  fileDataUrl: "",
                                });
                              }}
                              className="bg-[#1B3B48] text-[#E9C46A] px-3 py-1 rounded-lg text-xs font-bold"
                            >
                              + Tải tài liệu cho Chương này
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                setEditingChapter({
                                  ...chap,
                                  grade: selectedGradeTab,
                                  requirementsText: (
                                    chap.requirements || []
                                  ).join("\n"),
                                })
                              }
                              className="bg-[#5C7667] text-white px-3 py-1 rounded-lg text-xs font-bold"
                            >
                              Sửa Chương
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                const nextList = (
                                  appData.curriculum[selectedGradeTab] || []
                                ).filter((x) => x.id !== chap.id);
                                saveToAll({
                                  ...appData,
                                  curriculum: {
                                    ...appData.curriculum,
                                    [selectedGradeTab]: nextList,
                                  },
                                });
                              }}
                              className="text-red-600 text-xs font-bold px-2"
                            >
                              Xóa
                            </button>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <div className="text-xs font-bold uppercase tracking-wider text-[#1B3B48]">
                        Yêu cầu cần đạt:
                      </div>
                      <ul className="space-y-1.5 text-sm text-[#1B3B48]/90 list-disc pl-5">
                        {(chap.requirements || []).map((req, i) => (
                          <li key={i} className="leading-relaxed">
                            {req}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* FORM TẢI TÀI LIỆU LÊN TRỰC TIẾP TRONG CHƯƠNG ĐÓ (CHỌN LỚP ÁP DỤNG) */}
                    {currentUser.role === "teacher" &&
                      activeChapterUploadId === chap.id && (
                        <form
                          onSubmit={(e) => handleUploadChapterDocument(e, chap)}
                          className="p-4 rounded-2xl bg-[#EFECE6] border-2 border-[#1B3B48] space-y-3"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-extrabold text-[#1B3B48]">
                              📤 Tải Tài liệu mới lên "{chap.title}" (Tự động cập nhật vào Tin tức Học thuật)
                            </span>
                            <button
                              type="button"
                              onClick={() => setActiveChapterUploadId(null)}
                              className="text-xs font-bold text-[#5C7667]"
                            >
                              ✕ Đóng
                            </button>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                            <input
                              type="text"
                              required
                              value={chapterDocForm.title}
                              onChange={(e) =>
                                setChapterDocForm({
                                  ...chapterDocForm,
                                  title: e.target.value,
                                })
                              }
                              placeholder="Tên tài liệu (VD: Chuyên đề bài tập Cấu tạo nguyên tử)"
                              className="p-2.5 rounded-xl border text-xs bg-white"
                            />

                            <select
                              value={chapterDocForm.classId}
                              onChange={(e) =>
                                setChapterDocForm({
                                  ...chapterDocForm,
                                  classId: e.target.value,
                                })
                              }
                              className="p-2.5 rounded-xl border text-xs bg-white font-bold"
                            >
                              <option value="ALL">
                                Áp dụng: Toàn bộ các lớp Khối {selectedGradeTab}
                              </option>
                              {gradeClasses.map((c) => (
                                <option key={c.id} value={c.id}>
                                  Dành riêng cho Lớp {c.id} ({c.name})
                                </option>
                              ))}
                            </select>

                            <input
                              type="text"
                              value={chapterDocForm.externalUrl}
                              onChange={(e) =>
                                setChapterDocForm({
                                  ...chapterDocForm,
                                  externalUrl: e.target.value,
                                })
                              }
                              placeholder="Link tải Google Drive / OneDrive (nếu có)..."
                              className="p-2.5 rounded-xl border text-xs bg-white"
                            />
                          </div>

                          <div className="flex flex-wrap items-center justify-between gap-3">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold">
                                Chọn File từ máy:
                              </span>
                              <input
                                type="file"
                                onChange={(e) =>
                                  handleFlexibleFileUpload(e, (res) =>
                                    setChapterDocForm((prev) => ({
                                      ...prev,
                                      title: prev.title || res.fileName,
                                      fileName: res.fileName,
                                      fileType: res.fileType,
                                      fileDataUrl: res.dataUrl,
                                    }))
                                  )
                                }
                                className="text-xs"
                              />
                            </div>
                            <button
                              type="submit"
                              className="bg-[#1B3B48] text-white px-4 py-2 rounded-xl text-xs font-bold"
                            >
                              Lưu Tài liệu & Đăng Tin Học thuật
                            </button>
                          </div>
                        </form>
                      )}

                    {/* DANH SÁCH TÀI LIỆU ĐÃ TẢI LÊN CỦA CHƯƠNG NÀY THEO TỪNG LỚP */}
                    <div className="pt-3 border-t border-[#EFECE6] space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-extrabold text-[#2C4A3E]">
                          📚 Tài liệu học tập của {chap.title} ({chapterDocs.length} tài liệu)
                        </span>
                      </div>

                      {chapterDocs.length === 0 ? (
                        <p className="text-xs text-[#5C7667] italic">
                          Chưa có tài liệu nào được tải lên cho chương này.
                        </p>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                          {chapterDocs.map((doc) => (
                            <div
                              key={doc.id}
                              className="p-3 rounded-xl bg-[#F7F6F2] border border-[#E2DFD7] flex items-center justify-between gap-2"
                            >
                              <div className="space-y-0.5 min-w-0">
                                <div className="flex items-center gap-1.5">
                                  <span className="px-2 py-0.5 rounded bg-[#1B3B48] text-white text-[10px] font-bold">
                                    {doc.classId === "ALL"
                                      ? `Khối ${doc.grade}`
                                      : `Lớp ${doc.classId}`}
                                  </span>
                                  <span className="text-[10px] text-[#5C7667]">
                                    {doc.createdAt}
                                  </span>
                                </div>
                                <div className="font-bold text-xs text-[#1B3B48] truncate">
                                  📄 {doc.title}
                                </div>
                              </div>

                              <div className="flex items-center gap-1.5 shrink-0">
                                {doc.externalUrl && (
                                  <a
                                    href={doc.externalUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="px-2.5 py-1 rounded-lg bg-[#1B3B48] text-white text-xs font-bold"
                                  >
                                    🔗 Mở Link
                                  </a>
                                )}
                                {doc.fileDataUrl && (
                                  <a
                                    href={doc.fileDataUrl}
                                    download={doc.fileName || "tailieu"}
                                    className="px-2.5 py-1 rounded-lg bg-[#5C7667] text-white text-xs font-bold"
                                  >
                                    ⬇ Tải về
                                  </a>
                                )}
                                {currentUser.role === "teacher" && (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      saveToAll({
                                        ...appData,
                                        documents: (
                                          appData.documents || []
                                        ).filter((x) => x.id !== doc.id),
                                      })
                                    }
                                    className="text-red-600 text-xs font-bold px-1"
                                  >
                                    ✕
                                  </button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {editingChapter && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                <form
                  onSubmit={handleSaveChapterEdit}
                  className="bg-white rounded-2xl max-w-2xl w-full p-6 space-y-4 shadow-xl border border-[#E2DFD7]"
                >
                  <div className="flex items-center justify-between border-b pb-3">
                    <h3 className="font-bold text-lg text-[#1B3B48]">
                      Cập nhật Chương, Thời gian học & Yêu cầu cần đạt
                    </h3>
                    <button
                      type="button"
                      onClick={() => setEditingChapter(null)}
                      className="text-xs font-bold text-[#5C7667]"
                    >
                      ✕ Đóng
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      required
                      value={editingChapter.title}
                      onChange={(e) =>
                        setEditingChapter({
                          ...editingChapter,
                          title: e.target.value,
                        })
                      }
                      className="w-full p-2.5 rounded-xl border text-sm"
                    />
                    <input
                      type="text"
                      value={editingChapter.timeline}
                      onChange={(e) =>
                        setEditingChapter({
                          ...editingChapter,
                          timeline: e.target.value,
                        })
                      }
                      className="w-full p-2.5 rounded-xl border text-sm"
                    />
                    <input
                      type="text"
                      value={editingChapter.targetDate}
                      onChange={(e) =>
                        setEditingChapter({
                          ...editingChapter,
                          targetDate: e.target.value,
                        })
                      }
                      className="w-full p-2.5 rounded-xl border text-sm"
                    />
                    <input
                      type="text"
                      value={editingChapter.formulas}
                      onChange={(e) =>
                        setEditingChapter({
                          ...editingChapter,
                          formulas: e.target.value,
                        })
                      }
                      className="w-full p-2.5 rounded-xl border text-sm"
                    />
                  </div>
                  <textarea
                    rows={5}
                    value={editingChapter.requirementsText}
                    onChange={(e) =>
                      setEditingChapter({
                        ...editingChapter,
                        requirementsText: e.target.value,
                      })
                    }
                    className="w-full p-3 rounded-xl border text-sm"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setEditingChapter(null)}
                      className="px-4 py-2 rounded-xl bg-gray-100 text-xs font-bold"
                    >
                      Hủy
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-[#1B3B48] text-white text-xs font-bold"
                    >
                      Lưu cập nhật
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}

        {/* ===================================================================
            MỤC 04: HỒ SƠ TIẾN ĐỘ CÁ NHÂN, BÀI KIỂM TRA TRÊN LỚP & NHẬN XÉT
        =================================================================== */}
        {activeView === "progress" && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-[#E2DFD7] flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase text-[#5C7667]">
                  Mục 04 • Năm học:{" "}
                  {selectedAcademicYear === "ALL"
                    ? "Tất cả"
                    : selectedAcademicYear}
                </span>
                <h2 className="text-2xl font-bold text-[#1B3B48]">
                  Tiến độ Cá nhân, Kết quả Bài Kiểm tra trên lớp & Nhận xét
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3.5 py-2 rounded-xl bg-[#5C7667] text-white text-xs font-bold"
                >
                  🖨 In Phiếu Báo cáo
                </button>
                <button
                  onClick={goBack}
                  className="px-4 py-2 rounded-xl bg-[#EFECE6] text-[#1B3B48] text-xs font-bold hover:bg-[#E2DFD7]"
                >
                  ← Quay lại trang trước
                </button>
              </div>
            </div>

            {appData.students.length === 0 ? (
              <div className="bg-white p-8 rounded-2xl border border-[#E2DFD7] text-center space-y-3">
                <p className="text-sm text-[#5C7667]">
                  Chưa có hồ sơ học sinh nào.
                </p>
                {currentUser.role === "teacher" && (
                  <button
                    onClick={() => navigateTo("students_admin")}
                    className="bg-[#1B3B48] text-white px-4 py-2 rounded-xl text-xs font-bold"
                  >
                    Vào Mục 09 để thêm học sinh từ Excel →
                  </button>
                )}
              </div>
            ) : (
              <>
                {currentUser.role === "teacher" && (
                  <div className="bg-white p-4 rounded-2xl border border-[#E2DFD7] flex flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-bold text-[#5C7667]">
                        Lọc theo lớp:
                      </span>
                      <button
                        onClick={() => setSelectedClassFilter("ALL")}
                        className={`px-3 py-1 rounded-lg text-xs font-bold ${
                          selectedClassFilter === "ALL"
                            ? "bg-[#1B3B48] text-white"
                            : "bg-[#EFECE6] text-[#1B3B48]"
                        }`}
                      >
                        Tất cả ({yearFilteredStudents.length} HS)
                      </button>
                      {yearFilteredClasses.map((c) => {
                        const cnt = getStudentsOfClass(c.id, yearFilteredStudents).length;
                        return (
                          <button
                            key={c.id}
                            onClick={() => setSelectedClassFilter(c.id)}
                            className={`px-3 py-1 rounded-lg text-xs font-bold ${
                              selectedClassFilter === c.id
                                ? "bg-[#1B3B48] text-white"
                                : "bg-[#EFECE6] text-[#1B3B48]"
                            }`}
                          >
                            Lớp {c.id} ({cnt} HS)
                          </button>
                        );
                      })}
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#1B3B48]">
                        Chọn học sinh:
                      </span>
                      <select
                        value={activeStudent?.id || ""}
                        onChange={(e) => setSelectedStudentId(e.target.value)}
                        className="p-2 rounded-xl border border-[#E2DFD7] text-sm font-semibold bg-[#F7F6F2]"
                      >
                        {yearFilteredStudents
                          .filter(
                            (s) =>
                              selectedClassFilter === "ALL" ||
                              s.classId === selectedClassFilter
                          )
                          .map((s) => (
                            <option key={s.id} value={s.id}>
                              {s.name} ({s.classId})
                            </option>
                          ))}
                      </select>
                    </div>
                  </div>
                )}

                {activeStudent && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="bg-white p-5 rounded-2xl border border-[#E2DFD7] space-y-1">
                        <span className="text-xs text-[#5C7667] font-semibold">
                          Học sinh & Mục tiêu Đại học
                        </span>
                        <div className="text-lg font-extrabold text-[#1B3B48]">
                          {activeStudent.name} ({activeStudent.classId})
                        </div>
                        <div className="text-xs font-bold text-[#5C7667]">
                          NV / Thành tích:{" "}
                          {activeStudent.universityGoal || "Đang cập nhật"}
                        </div>
                      </div>

                      <div className="bg-white p-5 rounded-2xl border border-[#E2DFD7] space-y-1">
                        <span className="text-xs text-[#5C7667] font-semibold">
                          Điểm trung bình các bài kiểm tra
                        </span>
                        <div className="text-3xl font-black text-[#1B3B48]">
                          {activeStudent.score}{" "}
                          <span className="text-xs font-normal text-[#5C7667]">
                            / 10 (Mục tiêu {activeStudent.targetScore})
                          </span>
                        </div>
                      </div>

                      <div className="bg-white p-5 rounded-2xl border border-[#E2DFD7] space-y-1">
                        <span className="text-xs text-[#5C7667] font-semibold">
                          Chuyên cần (Đi học đầy đủ)
                        </span>
                        <div className="text-base font-extrabold text-[#2C4A3E]">
                          {activeStudent.attendanceRate}% —{" "}
                          {activeStudent.attendanceNote}
                        </div>
                      </div>

                      <div className="bg-white p-5 rounded-2xl border border-[#E2DFD7] space-y-1">
                        <span className="text-xs text-[#5C7667] font-semibold">
                          Thái độ học tập & Chú ý bài
                        </span>
                        <div className="text-sm font-bold text-[#1B3B48]">
                          {activeStudent.attitude}
                        </div>
                      </div>
                    </div>

                    {/* BẢNG KẾT QUẢ BÀI KIỂM TRA TRÊN LỚP */}
                    <div className="bg-white p-6 rounded-2xl border border-[#E2DFD7] space-y-4">
                      <h3 className="font-bold text-base text-[#1B3B48]">
                        📝 Kết quả Bài Kiểm tra trên lớp của {activeStudent.name}
                      </h3>

                      {currentUser.role === "teacher" && (
                        <form
                          onSubmit={handleAddInClassTest}
                          className="p-4 rounded-xl bg-[#F7F6F2] border border-[#E2DFD7] space-y-3"
                        >
                          <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5">
                            <input
                              type="text"
                              required
                              value={classTestForm.testName}
                              onChange={(e) =>
                                setClassTestForm({
                                  ...classTestForm,
                                  testName: e.target.value,
                                })
                              }
                              placeholder="Tên bài KT (VD: Kiểm tra Chương 1)"
                              className="sm:col-span-2 p-2 rounded-lg border text-xs bg-white"
                            />
                            <select
                              value={classTestForm.testType}
                              onChange={(e) =>
                                setClassTestForm({
                                  ...classTestForm,
                                  testType: e.target.value,
                                })
                              }
                              className="p-2 rounded-lg border text-xs bg-white"
                            >
                              <option value="Kiểm tra 15 phút">
                                Kiểm tra 15 phút
                              </option>
                              <option value="Kiểm tra định kỳ / 1 tiết">
                                Kiểm tra định kỳ / 1 tiết
                              </option>
                              <option value="Kiểm tra Giữa kì">
                                Kiểm tra Giữa kì
                              </option>
                              <option value="Kiểm tra Cuối kì">
                                Kiểm tra Cuối kì
                              </option>
                            </select>
                            <input
                              type="number"
                              step="0.1"
                              required
                              value={classTestForm.score}
                              onChange={(e) =>
                                setClassTestForm({
                                  ...classTestForm,
                                  score: e.target.value,
                                })
                              }
                              placeholder="Điểm đạt được"
                              className="p-2 rounded-lg border text-xs bg-white"
                            />
                            <input
                              type="text"
                              value={classTestForm.date}
                              onChange={(e) =>
                                setClassTestForm({
                                  ...classTestForm,
                                  date: e.target.value,
                                })
                              }
                              placeholder="Ngày kiểm tra"
                              className="p-2 rounded-lg border text-xs bg-white"
                            />
                          </div>
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <input
                              type="text"
                              value={classTestForm.teacherNote}
                              onChange={(e) =>
                                setClassTestForm({
                                  ...classTestForm,
                                  teacherNote: e.target.value,
                                })
                              }
                              placeholder="Nhận xét bài làm..."
                              className="flex-1 p-2 rounded-lg border text-xs bg-white"
                            />
                            <button
                              type="submit"
                              className="bg-[#1B3B48] text-white px-4 py-2 rounded-lg text-xs font-bold"
                            >
                              Lưu điểm bài kiểm tra
                            </button>
                          </div>
                        </form>
                      )}

                      {(activeStudent.inClassTests || []).length === 0 ? (
                        <p className="text-xs text-[#5C7667]">
                          Chưa có bài kiểm tra trên lớp nào được ghi nhận.
                        </p>
                      ) : (
                        <div className="overflow-x-auto">
                          <table className="w-full text-left text-xs border-collapse">
                            <thead>
                              <tr className="border-b border-[#E2DFD7] text-[#5C7667] uppercase">
                                <th className="py-2.5">Ngày</th>
                                <th className="py-2.5">Loại bài</th>
                                <th className="py-2.5">Tên bài kiểm tra</th>
                                <th className="py-2.5">Điểm số</th>
                                <th className="py-2.5">Nhận xét bài làm</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-[#EFECE6]">
                              {(activeStudent.inClassTests || []).map((t) => (
                                <tr key={t.id}>
                                  <td className="py-3">{t.date}</td>
                                  <td className="py-3">{t.testType}</td>
                                  <td className="py-3 font-bold text-[#1B3B48]">
                                    {t.testName}
                                  </td>
                                  <td className="py-3 font-black text-base text-[#1B3B48]">
                                    {t.score}/{t.maxScore || 10}
                                  </td>
                                  <td className="py-3 text-[#5C7667]">
                                    {t.teacherNote || "—"}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>

                    {/* NHẬN XÉT CHUNG & GỬI MAIL RIÊNG */}
                    <div className="bg-white p-6 rounded-2xl border border-[#E2DFD7] space-y-4">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <h3 className="font-bold text-base text-[#1B3B48]">
                          Nhận xét của Giáo viên & Gửi Báo cáo Email riêng cho {activeStudent.name}
                        </h3>
                        {currentUser.role === "teacher" && (
                          <button
                            onClick={() =>
                              setEmailPreviewModal(
                                buildStudentReportEmail(activeStudent)
                              )
                            }
                            className="bg-[#5C7667] text-white px-3.5 py-1.5 rounded-xl text-xs font-bold"
                          >
                            ✉ Gửi Báo cáo Riêng qua Email cho PH/HS {activeStudent.name}
                          </button>
                        )}
                      </div>

                      <div className="p-4 rounded-xl bg-[#F7F6F2] border border-[#E2DFD7] text-sm">
                        <strong>
                          Nhận xét của Thầy {TEACHER_INFO.fullName}:
                        </strong>{" "}
                        "{activeStudent.teacherComment}"
                      </div>

                      {currentUser.role === "teacher" && (
                        <div className="pt-3 border-t border-[#E2DFD7] grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <input
                            type="text"
                            value={activeStudent.attitude}
                            onChange={(e) =>
                              updateStudentField(activeStudent.id, {
                                attitude: e.target.value,
                              })
                            }
                            placeholder="Thái độ chú ý bài..."
                            className="p-2 rounded-lg border text-xs"
                          />
                          <input
                            type="text"
                            value={activeStudent.universityGoal || ""}
                            onChange={(e) =>
                              updateStudentField(activeStudent.id, {
                                universityGoal: e.target.value,
                              })
                            }
                            placeholder="Trường ĐH mục tiêu..."
                            className="p-2 rounded-lg border text-xs"
                          />
                          <input
                            type="text"
                            value={activeStudent.teacherComment}
                            onChange={(e) =>
                              updateStudentField(activeStudent.id, {
                                teacherComment: e.target.value,
                              })
                            }
                            placeholder="Nhận xét của GV..."
                            className="p-2 rounded-lg border text-xs"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* ===================================================================
            MỤC 05: KHO TÀI LIỆU THEO LỚP/CHƯƠNG & GIAO BÀI TẬP QUA MAIL
        =================================================================== */}
        {activeView === "documents" && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-[#E2DFD7] flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase text-[#5C7667]">
                  Mục 05 • Kho Tài liệu Lớp/Chương & Giao Bài tập qua Email
                </span>
                <h2 className="text-2xl font-bold text-[#1B3B48]">
                  Kho Tài liệu Học tập Theo Lớp/Chương, Giao Bài tập & Nơi Nộp Bài
                </h2>
                <p className="text-xs text-[#5C7667] mt-1">
                  Khi Giáo viên tải tài liệu mới lên Kho Tài liệu, mục Tin tức <strong>📘 Học thuật</strong> sẽ tự động cập nhật để Phụ huynh và Học sinh theo dõi.
                </p>
              </div>
              <button
                onClick={goBack}
                className="px-4 py-2 rounded-xl bg-[#EFECE6] text-[#1B3B48] text-xs font-bold hover:bg-[#E2DFD7]"
              >
                ← Quay lại trang trước
              </button>
            </div>

            {/* KHU VỰC 1: TẢI LÊN & TRA CỨU TÀI LIỆU THEO TỪNG LỚP, TỪNG CHƯƠNG */}
            <div className="bg-white p-6 rounded-2xl border-2 border-[#2C4A3E] space-y-5 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-3">
                <div>
                  <h3 className="font-bold text-base text-[#1B3B48]">
                    📚 Kho Tài Liệu Học Tập Theo Từng Lớp & Từng Chương Trong Lộ Trình
                  </h3>
                  <p className="text-xs text-[#5C7667]">
                    Đồng bộ trực tiếp với Mục 03 (Lộ trình Chương) và Mục 01 (Tin tức Học thuật).
                  </p>
                </div>
              </div>

              {currentUser.role === "teacher" && (
                <form
                  onSubmit={handleUploadDocInModule05}
                  className="p-4 rounded-2xl bg-[#F7F6F2] border border-[#E2DFD7] space-y-3"
                >
                  <div className="text-xs font-extrabold text-[#1B3B48]">
                    ➕ Giáo viên tải Tài liệu mới lên (Tự động tạo Bản tin Học thuật):
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <select
                      value={docForm.grade}
                      onChange={(e) => {
                        const g = e.target.value;
                        const firstChap =
                          (appData.curriculum?.[g] || [])[0]?.id || "";
                        const firstCls =
                          appData.classes.find((c) => c.grade === g)?.id ||
                          "ALL";
                        setDocForm({
                          ...docForm,
                          grade: g,
                          chapterId: firstChap,
                          classId: firstCls,
                        });
                      }}
                      className="p-2.5 rounded-xl border text-xs bg-white font-bold"
                    >
                      <option value="10">Khối 10</option>
                      <option value="11">Khối 11</option>
                      <option value="12">Khối 12</option>
                    </select>

                    <select
                      value={docForm.classId}
                      onChange={(e) =>
                        setDocForm({ ...docForm, classId: e.target.value })
                      }
                      className="p-2.5 rounded-xl border text-xs bg-white font-bold"
                    >
                      <option value="ALL">
                        Tất cả các lớp Khối {docForm.grade}
                      </option>
                      {appData.classes
                        .filter((c) => c.grade === docForm.grade)
                        .map((c) => (
                          <option key={c.id} value={c.id}>
                            Lớp {c.id} ({c.name})
                          </option>
                        ))}
                    </select>

                    <select
                      value={docForm.chapterId}
                      onChange={(e) =>
                        setDocForm({ ...docForm, chapterId: e.target.value })
                      }
                      className="md:col-span-2 p-2.5 rounded-xl border text-xs bg-white font-bold"
                    >
                      {(appData.curriculum?.[docForm.grade] || []).map(
                        (chap) => (
                          <option key={chap.id} value={chap.id}>
                            {chap.title}
                          </option>
                        )
                      )}
                    </select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
                    <input
                      type="text"
                      required
                      value={docForm.title}
                      onChange={(e) =>
                        setDocForm({ ...docForm, title: e.target.value })
                      }
                      placeholder="Tên tài liệu (VD: Lý thuyết & Bài tập Ester)"
                      className="p-2.5 rounded-xl border text-xs bg-white"
                    />
                    <input
                      type="text"
                      value={docForm.externalUrl}
                      onChange={(e) =>
                        setDocForm({ ...docForm, externalUrl: e.target.value })
                      }
                      placeholder="Link tải Google Drive / OneDrive (nếu có)..."
                      className="p-2.5 rounded-xl border text-xs bg-white"
                    />
                    <input
                      type="file"
                      onChange={(e) =>
                        handleFlexibleFileUpload(e, (res) =>
                          setDocForm((prev) => ({
                            ...prev,
                            title: prev.title || res.fileName,
                            fileName: res.fileName,
                            fileType: res.fileType,
                            fileDataUrl: res.dataUrl,
                          }))
                        )
                      }
                      className="text-xs"
                    />
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="bg-[#2C4A3E] text-white px-5 py-2 rounded-xl text-xs font-bold"
                    >
                      📤 Tải Tài Liệu Lên & Cập Nhật Tin Tức
                    </button>
                  </div>
                </form>
              )}

              {/* Bộ lọc Kho tài liệu */}
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-xs font-bold text-[#5C7667]">
                  Lọc theo Lớp:
                </span>
                <select
                  value={docFilterClass}
                  onChange={(e) => setDocFilterClass(e.target.value)}
                  className="p-2 rounded-xl border text-xs bg-[#F7F6F2] font-bold"
                >
                  <option value="ALL">Tất cả các lớp</option>
                  {appData.classes.map((c) => (
                    <option key={c.id} value={c.id}>
                      Lớp {c.id}
                    </option>
                  ))}
                </select>

                <span className="text-xs font-bold text-[#5C7667]">
                  Lọc theo Chương:
                </span>
                <select
                  value={docFilterChapter}
                  onChange={(e) => setDocFilterChapter(e.target.value)}
                  className="p-2 rounded-xl border text-xs bg-[#F7F6F2] font-bold"
                >
                  <option value="ALL">Tất cả các chương (10 • 11 • 12)</option>
                  {["10", "11", "12"].flatMap((g) =>
                    (appData.curriculum?.[g] || []).map((ch) => (
                      <option key={ch.id} value={ch.id}>
                        [Khối {g}] {ch.title}
                      </option>
                    ))
                  )}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {(appData.documents || [])
                  .filter((d) => {
                    if (!matchesSelectedYear(d.academicYear)) return false;
                    if (
                      docFilterClass !== "ALL" &&
                      d.classId !== "ALL" &&
                      d.classId !== docFilterClass
                    ) {
                      return false;
                    }
                    if (
                      docFilterChapter !== "ALL" &&
                      d.chapterId !== docFilterChapter
                    ) {
                      return false;
                    }
                    if (currentUser.role === "student") {
                      return (
                        d.classId === "ALL" || d.classId === currentUser.classId
                      );
                    }
                    return true;
                  })
                  .map((doc) => (
                    <div
                      key={doc.id}
                      className="p-4 rounded-xl bg-[#F7F6F2] border border-[#E2DFD7] flex items-center justify-between gap-3"
                    >
                      <div className="space-y-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="px-2 py-0.5 rounded bg-[#1B3B48] text-white text-[10px] font-bold">
                            {doc.classId === "ALL"
                              ? `Khối ${doc.grade}`
                              : `Lớp ${doc.classId}`}
                          </span>
                          <span className="px-2 py-0.5 rounded bg-[#EFECE6] text-[#2C4A3E] text-[10px] font-bold">
                            {doc.chapterTitle}
                          </span>
                        </div>
                        <div className="font-bold text-sm text-[#1B3B48] truncate">
                          📄 {doc.title}
                        </div>
                        <div className="text-[11px] text-[#5C7667]">
                          Cập nhật: {doc.createdAt}
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        {doc.externalUrl && (
                          <a
                            href={doc.externalUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="bg-[#1B3B48] text-white px-3 py-1.5 rounded-lg text-xs font-bold"
                          >
                            🔗 Mở Link
                          </a>
                        )}
                        {doc.fileDataUrl && (
                          <a
                            href={doc.fileDataUrl}
                            download={doc.fileName || "tailieu"}
                            className="bg-[#5C7667] text-white px-3 py-1.5 rounded-lg text-xs font-bold"
                          >
                            ⬇ Tải File
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* KHU VỰC 2: GIAO BÀI TẬP QUA MAIL & NỘP BÀI TẬP */}
            {currentUser.role === "teacher" && (
              <form
                onSubmit={handleAssignHomeworkAndEmail}
                className="bg-white p-6 rounded-2xl border-2 border-[#1B3B48] space-y-4 shadow-sm"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-3">
                  <div>
                    <h3 className="font-bold text-base text-[#1B3B48]">
                      📩 Ô Giao Bài Tập Trực Tiếp Qua Email (Kèm File Bài tập & Link Nơi Nộp Bài)
                    </h3>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        setHwForm({ ...hwForm, sendMode: "BULK" })
                      }
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                        hwForm.sendMode === "BULK"
                          ? "bg-[#1B3B48] text-white"
                          : "bg-[#EFECE6] text-[#1B3B48]"
                      }`}
                    >
                      📢 Gửi hàng loạt theo Lớp
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setHwForm({
                          ...hwForm,
                          sendMode: "INDIVIDUAL",
                          targetStudentId:
                            hwForm.targetStudentId ||
                            appData.students[0]?.id ||
                            "",
                        })
                      }
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                        hwForm.sendMode === "INDIVIDUAL"
                          ? "bg-[#2C4A3E] text-white"
                          : "bg-[#EFECE6] text-[#1B3B48]"
                      }`}
                    >
                      👤 Gửi cho từng HS / PH cụ thể
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <input
                    type="text"
                    required
                    value={hwForm.title}
                    onChange={(e) =>
                      setHwForm({ ...hwForm, title: e.target.value })
                    }
                    placeholder="Tên bài tập (VD: Bài tập Ester - Lipid)"
                    className="p-2.5 rounded-xl border border-[#E2DFD7] text-sm"
                  />

                  {hwForm.sendMode === "BULK" ? (
                    <select
                      value={hwForm.classId}
                      onChange={(e) =>
                        setHwForm({ ...hwForm, classId: e.target.value })
                      }
                      className="p-2.5 rounded-xl border border-[#E2DFD7] text-sm bg-white font-semibold"
                    >
                      <option value="ALL">Gửi toàn bộ các lớp</option>
                      {appData.classes.map((c) => {
                        const cnt = getStudentsOfClass(c.id).length;
                        return (
                          <option key={c.id} value={c.id}>
                            Gửi cả Lớp {c.id} ({cnt} HS)
                          </option>
                        );
                      })}
                    </select>
                  ) : (
                    <select
                      value={hwForm.targetStudentId}
                      onChange={(e) =>
                        setHwForm({
                          ...hwForm,
                          targetStudentId: e.target.value,
                        })
                      }
                      className="p-2.5 rounded-xl border-2 border-[#2C4A3E] text-sm bg-white font-bold text-[#1B3B48]"
                    >
                      <option value="">
                        -- Chọn Học sinh / Phụ huynh nhận bài --
                      </option>
                      {appData.students.map((st) => (
                        <option key={st.id} value={st.id}>
                          {st.name} (Lớp {st.classId} • {st.email})
                        </option>
                      ))}
                    </select>
                  )}

                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold text-[#1B3B48]">
                      ⏰ Cài đặt Thời gian khóa nộp bài (Tới giờ này sẽ tự khóa):
                    </label>
                    <input
                      type="datetime-local"
                      value={hwForm.deadlineISO}
                      onChange={(e) =>
                        setHwForm({ ...hwForm, deadlineISO: e.target.value })
                      }
                      className="w-full p-2 rounded-xl border-2 border-[#9C6644] text-xs font-mono font-bold bg-[#F7F6F2]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={hwForm.dueDate}
                    onChange={(e) =>
                      setHwForm({ ...hwForm, dueDate: e.target.value })
                    }
                    placeholder="Ghi chú hạn nộp hiển thị thêm (Nếu để trống sẽ lấy theo giờ khóa nộp ở trên)"
                    className="p-2.5 rounded-xl border border-[#E2DFD7] text-xs"
                  />
                  <div className="text-[11px] text-[#9C6644] font-semibold flex items-center">
                    🔒 Lưu ý: Khi đồng hồ điểm đúng Thời gian khóa nộp bài ở trên, cổng nộp bài và link nộp bài của bài tập này sẽ tự động khóa lại.
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
                  <div>
                    <label className="block text-xs font-bold mb-1">
                      1. Tải File Bài tập lên Web:
                    </label>
                    <input
                      type="file"
                      onChange={(e) =>
                        handleFlexibleFileUpload(e, (res) =>
                          setHwForm((prev) => ({
                            ...prev,
                            fileName: res.fileName,
                            fileType: res.fileType,
                            fileDataUrl: res.dataUrl,
                          }))
                        )
                      }
                      className="text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-1">
                      2. Link tải File Bài tập (Drive/OneDrive):
                    </label>
                    <input
                      type="text"
                      value={hwForm.fileUrl}
                      onChange={(e) =>
                        setHwForm({ ...hwForm, fileUrl: e.target.value })
                      }
                      placeholder="https://drive.google.com/..."
                      className="w-full p-2.5 rounded-xl border border-[#E2DFD7] text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-1">
                      3. Link dẫn tới Nơi Nộp Bài trong Email:
                    </label>
                    <input
                      type="text"
                      value={hwForm.submissionPortalLink}
                      onChange={(e) =>
                        setHwForm({
                          ...hwForm,
                          submissionPortalLink: e.target.value,
                        })
                      }
                      className="w-full p-2.5 rounded-xl border border-[#E2DFD7] text-xs"
                    />
                  </div>
                </div>

                <textarea
                  rows={2}
                  value={hwForm.description}
                  onChange={(e) =>
                    setHwForm({ ...hwForm, description: e.target.value })
                  }
                  placeholder="Ghi chú hướng dẫn làm bài..."
                  className="w-full p-2.5 rounded-xl border border-[#E2DFD7] text-xs"
                />

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="bg-[#1B3B48] text-white px-5 py-2.5 rounded-xl text-xs font-bold"
                  >
                    {hwForm.sendMode === "INDIVIDUAL"
                      ? "Giao Bài tập & Gửi Mail Riêng cho HS/PH"
                      : "Giao Bài tập & Gửi Mail Hàng loạt"}
                  </button>
                </div>
              </form>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-[#E2DFD7] space-y-4">
                <h3 className="font-bold text-base text-[#1B3B48]">
                  📋 Danh sách Bài tập đã giao (
                  {
                    (appData.homeworks || []).filter((h) =>
                      matchesSelectedYear(h.academicYear)
                    ).length
                  }
                  )
                </h3>
                {(appData.homeworks || []).filter((h) =>
                  matchesSelectedYear(h.academicYear)
                ).length === 0 ? (
                  <div className="p-6 rounded-xl bg-[#F7F6F2] text-center text-xs text-[#5C7667]">
                    Chưa có bài tập nào được giao.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {(appData.homeworks || [])
                      .filter((h) => matchesSelectedYear(h.academicYear))
                      .map((hw) => {
                        const statusInfo = getHomeworkDeadlineStatus(
                          hw,
                          realTimeNow
                        );
                        return (
                          <div
                            key={hw.id}
                            className={`p-4 rounded-xl border space-y-2.5 ${
                              statusInfo.isExpired
                                ? "bg-red-50/60 border-red-200"
                                : "bg-[#F7F6F2] border-[#E2DFD7]"
                            }`}
                          >
                            <div className="flex flex-wrap items-start justify-between gap-2">
                              <div>
                                <span className="font-bold text-sm text-[#1B3B48] block">
                                  {hw.title} ({hw.targetLabel || hw.classId})
                                </span>
                                {hw.description && (
                                  <p className="text-xs text-[#5C7667] mt-0.5">
                                    {hw.description}
                                  </p>
                                )}
                              </div>

                              <div className="flex flex-wrap items-center gap-2">
                                <span
                                  className={`px-2.5 py-0.5 rounded-full text-[11px] font-extrabold ${
                                    statusInfo.isExpired
                                      ? "bg-red-600 text-white"
                                      : "bg-emerald-100 text-emerald-900"
                                  }`}
                                >
                                  {statusInfo.remainingText ||
                                    `Hạn: ${hw.dueDate}`}
                                </span>
                                {currentUser.role === "teacher" && (
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteHomework(hw)}
                                    className="px-2.5 py-1 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition"
                                    title="Xóa bài tập đã giao này"
                                  >
                                    🗑 Xóa bài tập
                                  </button>
                                )}
                              </div>
                            </div>

                            <div className="text-[11px] font-semibold text-[#9C6644]">
                              ⏰ Thời hạn hoàn thành: {statusInfo.label}
                            </div>

                            <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                              <div className="flex flex-wrap gap-2">
                                {!statusInfo.isExpired ? (
                                  <>
                                    {hw.fileUrl && (
                                      <a
                                        href={hw.fileUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="bg-[#1B3B48] text-white px-3 py-1 rounded-lg text-xs font-bold"
                                      >
                                        📥 Mở Link File Bài tập
                                      </a>
                                    )}
                                    {hw.fileDataUrl && (
                                      <a
                                        href={hw.fileDataUrl}
                                        download={hw.fileName || "baitap"}
                                        className="bg-[#5C7667] text-white px-3 py-1 rounded-lg text-xs font-bold"
                                      >
                                        📎 Tải File Đề ({hw.fileName})
                                      </a>
                                    )}
                                    <button
                                      type="button"
                                      onClick={() =>
                                        setHwSubForm((prev) => ({
                                          ...prev,
                                          homeworkId: hw.id,
                                        }))
                                      }
                                      className="bg-[#2C4A3E] text-[#E9C46A] px-3 py-1 rounded-lg text-xs font-bold"
                                    >
                                      👉 Chọn nộp bài tập này
                                    </button>
                                  </>
                                ) : (
                                  <span className="text-xs font-bold text-red-700 bg-red-100 px-3 py-1 rounded-lg">
                                    🔒 Đã hết thời gian hoàn thành — Link nộp bài tập đã khóa
                                  </span>
                                )}
                              </div>

                              {/* Giáo viên có thể chỉnh lại giờ hạn nộp nếu muốn mở lại */}
                              {currentUser.role === "teacher" && (
                                <div className="flex items-center gap-1 text-[11px]">
                                  <span className="text-[#5C7667] font-semibold">
                                    Đổi hạn:
                                  </span>
                                  <input
                                    type="datetime-local"
                                    value={hw.deadlineISO || ""}
                                    onChange={(e) => {
                                      const newIso = e.target.value;
                                      const nextHws = (
                                        appData.homeworks || []
                                      ).map((x) =>
                                        x.id === hw.id
                                          ? {
                                              ...x,
                                              deadlineISO: newIso,
                                              dueDate: newIso
                                                ? new Date(
                                                    newIso
                                                  ).toLocaleString("vi-VN")
                                                : x.dueDate,
                                            }
                                          : x
                                      );
                                      saveToAll({
                                        ...appData,
                                        homeworks: nextHws,
                                      });
                                    }}
                                    className="p-1 rounded border bg-white text-[11px] font-mono"
                                  />
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                  </div>
                )}
              </div>

              <div className="lg:col-span-5 bg-white p-6 rounded-2xl border-2 border-[#5C7667] space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-base text-[#1B3B48]">
                      📤 Nơi Học Sinh Nộp Bài Tập Về Nhà
                    </h3>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#2C4A3E] text-white text-[11px] font-bold">
                      {(appData.homeworkSubmissions || []).length} bài đã nộp
                    </span>
                  </div>
                  <p className="text-xs text-[#5C7667]">
                    Chỉ các bài tập còn trong thời gian hoàn thành mới mở cổng nộp bài. Khi tới hạn, link nộp bài sẽ tự động khóa.
                  </p>

                  <form onSubmit={handleSubmitHomeworkWork} className="space-y-3">
                    <select
                      required
                      value={hwSubForm.homeworkId}
                      onChange={(e) =>
                        setHwSubForm({
                          ...hwSubForm,
                          homeworkId: e.target.value,
                        })
                      }
                      className="w-full p-2.5 rounded-xl border text-xs bg-white font-semibold"
                    >
                      <option value="">-- 1. Chọn bài tập cần nộp --</option>
                      {(appData.homeworks || []).map((hw) => {
                        const st = getHomeworkDeadlineStatus(hw, realTimeNow);
                        return (
                          <option
                            key={hw.id}
                            value={hw.id}
                            disabled={st.isExpired}
                          >
                            {st.isExpired
                              ? `🔒 [ĐÃ HẾT HẠN - KHÓA NỘP] ${hw.title}`
                              : `🟢 ${hw.title} (${st.label})`}
                          </option>
                        );
                      })}
                    </select>

                    {/* Chọn Học sinh nộp bài (hiển thị cho Giáo viên khi nộp thử / nộp hộ hoặc kiểm tra) */}
                    {currentUser.role === "teacher" ? (
                      <div className="space-y-2 p-2.5 rounded-xl bg-[#F7F6F2] border border-[#E2DFD7]">
                        <label className="block text-[11px] font-bold text-[#1B3B48]">
                          2. Chọn Học sinh nộp bài (Dành cho GV nộp hộ / kiểm tra):
                        </label>
                        {appData.students.length > 0 ? (
                          <select
                            value={hwSubForm.studentId || activeStudent?.id || ""}
                            onChange={(e) =>
                              setHwSubForm({
                                ...hwSubForm,
                                studentId: e.target.value,
                              })
                            }
                            className="w-full p-2 rounded-lg border text-xs bg-white font-bold text-[#1B3B48]"
                          >
                            {appData.students.map((st) => (
                              <option key={st.id} value={st.id}>
                                👤 {st.name} (Lớp {st.classId} • Mã: {st.id})
                              </option>
                            ))}
                          </select>
                        ) : (
                          <div className="grid grid-cols-3 gap-2">
                            <input
                              type="text"
                              value={hwSubForm.studentNameCustom}
                              onChange={(e) =>
                                setHwSubForm({
                                  ...hwSubForm,
                                  studentNameCustom: e.target.value,
                                })
                              }
                              placeholder="Nhập tên HS nộp bài..."
                              className="col-span-2 p-2 rounded-lg border text-xs bg-white"
                            />
                            <input
                              type="text"
                              value={hwSubForm.studentClassCustom}
                              onChange={(e) =>
                                setHwSubForm({
                                  ...hwSubForm,
                                  studentClassCustom: e.target.value,
                                })
                              }
                              placeholder="Lớp (VD: 10A1)"
                              className="p-2 rounded-lg border text-xs bg-white"
                            />
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="p-2 rounded-xl bg-[#F7F6F2] border text-xs font-bold text-[#1B3B48]">
                        👤 Học sinh nộp bài: {currentUser.name} (Lớp {currentUser.classId})
                      </div>
                    )}

                    {(() => {
                      const selectedHw = (appData.homeworks || []).find(
                        (h) => h.id === hwSubForm.homeworkId
                      );
                      const st = selectedHw
                        ? getHomeworkDeadlineStatus(selectedHw, realTimeNow)
                        : null;
                      if (st && st.isExpired) {
                        return (
                          <div className="p-3 rounded-xl bg-red-100 border border-red-300 text-red-800 text-xs font-bold">
                            ⛔ Bài tập này đã tới thời gian hoàn thành. Link nộp bài đã khóa!
                          </div>
                        );
                      }
                      return (
                        <>
                          <div>
                            <label className="block text-[11px] font-bold text-[#1B3B48] mb-1">
                              3. Đính kèm Ảnh chụp bài làm / File bài nộp:
                            </label>
                            <input
                              type="file"
                              onChange={(e) =>
                                handleFlexibleFileUpload(e, (res) =>
                                  setHwSubForm((prev) => ({
                                    ...prev,
                                    fileName: res.fileName,
                                    fileType: res.fileType,
                                    fileDataUrl: res.dataUrl,
                                  }))
                                )
                              }
                              className="text-xs w-full"
                            />
                            {hwSubForm.fileName && (
                              <div className="text-[11px] text-emerald-700 font-bold mt-1">
                                ✓ Đã đính kèm: {hwSubForm.fileName}
                              </div>
                            )}
                          </div>
                          <textarea
                            rows={2}
                            value={hwSubForm.studentNote}
                            onChange={(e) =>
                              setHwSubForm({
                                ...hwSubForm,
                                studentNote: e.target.value,
                              })
                            }
                            placeholder="Ghi chú bài nộp (VD: Em nộp bài tập chương 1 ạ)..."
                            className="w-full p-2.5 rounded-xl border text-xs"
                          />
                          <button
                            type="submit"
                            className="w-full bg-[#2C4A3E] hover:bg-[#1B3B48] text-white py-2.5 rounded-xl text-xs font-bold transition shadow-sm"
                          >
                            Nộp Bài Tập Lên Hệ Thống
                          </button>
                        </>
                      );
                    })()}
                  </form>
                </div>

                {/* DANH SÁCH BÀI NỘP HIỂN THỊ TRỰC TIẾP NGAY TRONG Ô NỘP BÀI */}
                <div className="pt-4 border-t border-[#E2DFD7] space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-[#1B3B48]">
                      📥 Bài làm Học sinh đã nộp ({(appData.homeworkSubmissions || []).length})
                    </span>
                  </div>

                  {(appData.homeworkSubmissions || []).length === 0 ? (
                    <div className="p-4 rounded-xl bg-[#F7F6F2] text-center text-xs text-[#5C7667] italic">
                      Chưa có bài nộp nào. Khi học sinh nộp bài ở trên, bài làm sẽ hiện ngay tại đây.
                    </div>
                  ) : (
                    <div className="max-h-72 overflow-y-auto space-y-2 pr-1">
                      {(appData.homeworkSubmissions || [])
                        .filter(
                          (sub) =>
                            currentUser.role === "teacher" ||
                            sub.studentId === currentUser.studentId
                        )
                        .map((sub) => (
                          <div
                            key={sub.id}
                            className="p-3 rounded-xl bg-[#F7F6F2] border border-[#E2DFD7] space-y-1.5 text-xs"
                          >
                            <div className="flex items-center justify-between gap-2">
                              <span className="font-extrabold text-[#1B3B48]">
                                👤 {sub.studentName} (Lớp {sub.classId})
                              </span>
                              <span className="text-[10px] text-[#5C7667]">
                                {sub.submittedAt}
                              </span>
                            </div>
                            <div className="font-bold text-[#2C4A3E]">
                              📌 Bài: {sub.homeworkTitle}
                            </div>
                            {sub.studentNote && (
                              <div className="text-[#1B3B48]/90 italic">
                                "{sub.studentNote}"
                              </div>
                            )}

                            <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                              <div className="flex flex-wrap items-center gap-1.5">
                                {sub.fileDataUrl ? (
                                  <>
                                    {sub.fileType === "image" && (
                                      <button
                                        type="button"
                                        onClick={() =>
                                          setPreviewSubmissionModal(sub)
                                        }
                                        className="px-2.5 py-1 rounded bg-[#1B3B48] text-[#E9C46A] text-[11px] font-bold"
                                      >
                                        👁 Xem ảnh bài làm
                                      </button>
                                    )}
                                    <a
                                      href={sub.fileDataUrl}
                                      download={sub.fileName || "bailam_hs"}
                                      className="px-2.5 py-1 rounded bg-[#5C7667] text-white text-[11px] font-bold"
                                    >
                                      ⬇ Tải tệp ({sub.fileName || "Bài nộp"})
                                    </a>
                                  </>
                                ) : (
                                  <span className="text-[11px] text-[#5C7667]">
                                    (Nộp ghi chú trực tiếp)
                                  </span>
                                )}
                              </div>

                              {sub.gradeScore !== "" &&
                              sub.gradeScore !== undefined ? (
                                <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 font-black text-[11px]">
                                  ✓ Đã chấm: {sub.gradeScore}/10
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-bold text-[11px]">
                                  ⏳ Chờ chấm điểm
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* ===================================================================
                Ô RIÊNG KIỂM TRA HỌC SINH ĐÃ NỘP BÀI HAY CHƯA & CHẤM ĐIỂM NHẬP VÀO HỒ SƠ HỌC TẬP
            =================================================================== */}
            <div className="bg-white p-6 rounded-2xl border-2 border-[#1B3B48] space-y-5 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#EFECE6] pb-4">
                <div className="space-y-1">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#1B3B48] text-[#E9C46A] text-xs font-extrabold uppercase">
                    ✅ Quản lý Nộp bài & Chấm điểm Đồng bộ Hồ sơ (Mục 04)
                  </span>
                  <h3 className="font-extrabold text-lg text-[#1B3B48] pt-1">
                    Bảng Theo Dõi Học Sinh Đã Nộp / Chưa Nộp Bài & Chấm Điểm Nhập Vào Hồ Sơ Học Tập
                  </h3>
                  <p className="text-xs text-[#5C7667]">
                    Giáo viên kiểm tra trạng thái nộp bài của từng học sinh, xem tệp bài làm, chấm điểm và bấm <strong>"Chấm & Nhập vào Hồ sơ"</strong> để điểm tự động lưu vào bảng điểm cá nhân của học sinh tại Mục 04.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <select
                    value={selectedTrackerHwId}
                    onChange={(e) => setSelectedTrackerHwId(e.target.value)}
                    className="p-2.5 rounded-xl border-2 border-[#1B3B48] text-xs bg-[#F7F6F2] font-bold text-[#1B3B48]"
                  >
                    <option value="ALL">
                      📋 Xem tất cả bài tập đã giao ({(appData.homeworks || []).length})
                    </option>
                    {(appData.homeworks || []).map((hw) => (
                      <option key={hw.id} value={hw.id}>
                        Bài tập: {hw.title} ({hw.targetLabel || hw.classId})
                      </option>
                    ))}
                  </select>

                  <div className="flex gap-1 bg-[#EFECE6] p-1 rounded-xl text-xs font-bold">
                    {[
                      { id: "ALL", label: "Tất cả HS" },
                      { id: "SUBMITTED", label: "✅ Đã nộp" },
                      { id: "NOT_SUBMITTED", label: "⏳ Chưa nộp" },
                    ].map((stTab) => (
                      <button
                        key={stTab.id}
                        type="button"
                        onClick={() => setTrackerStatusFilter(stTab.id)}
                        className={`px-3 py-1.5 rounded-lg transition ${
                          trackerStatusFilter === stTab.id
                            ? "bg-[#1B3B48] text-white"
                            : "text-[#1B3B48] hover:bg-white/60"
                        }`}
                      >
                        {stTab.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {(appData.homeworks || []).length === 0 ? (
                <div className="p-6 rounded-xl bg-[#F7F6F2] text-center text-xs text-[#5C7667]">
                  Chưa có bài tập nào được giao. Hãy giao bài tập ở khung phía trên để theo dõi trạng thái nộp bài và chấm điểm cho học sinh.
                </div>
              ) : (
                <div className="space-y-6">
                  {(appData.homeworks || [])
                    .filter(
                      (hw) =>
                        selectedTrackerHwId === "ALL" ||
                        hw.id === selectedTrackerHwId
                    )
                    .map((hw) => {
                      const deadlineInfo = getHomeworkDeadlineStatus(
                        hw,
                        realTimeNow
                      );
                      // Lấy danh sách học sinh thuộc phạm vi bài tập này
                      const assignedStudents = (appData.students || []).filter(
                        (st) => {
                          if (currentUser.role === "student") {
                            return st.id === currentUser.studentId;
                          }
                          if (hw.sendMode === "INDIVIDUAL") {
                            return st.id === hw.targetStudentId;
                          }
                          return (
                            hw.classId === "ALL" ||
                            isSameClass(st.classId, hw.classId)
                          );
                        }
                      );

                      const hwSubs = (
                        appData.homeworkSubmissions || []
                      ).filter((sub) => sub.homeworkId === hw.id);

                      // Bao gồm cả những học sinh đã nộp bài cho bài tập này nhưng chưa nằm trong bộ lọc lớp (để không bao giờ sót bài nộp)
                      const extraSubmittedStudents = hwSubs
                        .filter(
                          (sub) =>
                            !assignedStudents.some(
                              (st) => st.id === sub.studentId
                            )
                        )
                        .map((sub) => {
                          const existingSt = (appData.students || []).find(
                            (s) => s.id === sub.studentId
                          );
                          return (
                            existingSt || {
                              id: sub.studentId,
                              name: sub.studentName || "Học sinh nộp bài",
                              classId: sub.classId || hw.classId || "CHUNG",
                              score: sub.gradeScore || 0,
                            }
                          );
                        });

                      const allTrackedStudents = [
                        ...assignedStudents,
                        ...extraSubmittedStudents,
                      ];

                      // Ghép danh sách học sinh + các bài nộp của bài tập này
                      const studentRows = allTrackedStudents.map((st) => {
                        const foundSub = hwSubs.find(
                          (sub) => sub.studentId === st.id
                        );
                        const hasSubmitted =
                          Boolean(foundSub) ||
                          (hw.completedBy || []).includes(st.id);
                        return {
                          student: st,
                          submission: foundSub || null,
                          hasSubmitted,
                        };
                      });

                      const filteredRows = studentRows.filter((row) => {
                        if (trackerStatusFilter === "SUBMITTED")
                          return row.hasSubmitted;
                        if (trackerStatusFilter === "NOT_SUBMITTED")
                          return !row.hasSubmitted;
                        return true;
                      });

                      const submittedCount = studentRows.filter(
                        (r) => r.hasSubmitted
                      ).length;

                      return (
                        <div
                          key={hw.id}
                          className="p-4 rounded-2xl bg-[#F7F6F2] border border-[#E2DFD7] space-y-3"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E2DFD7] pb-2.5">
                            <div>
                              <span className="font-extrabold text-sm text-[#1B3B48]">
                                📌 {hw.title} — {hw.targetLabel || hw.classId}
                              </span>
                              <div className="text-xs text-[#5C7667] mt-0.5">
                                Hạn nộp: <strong>{deadlineInfo.label}</strong>
                              </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
                              <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-900">
                                ✅ Đã nộp: {submittedCount}/{studentRows.length} HS
                              </span>
                              <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-900">
                                ⏳ Chưa nộp:{" "}
                                {Math.max(
                                  0,
                                  studentRows.length - submittedCount
                                )}{" "}
                                HS
                              </span>
                            </div>
                          </div>

                          {studentRows.length === 0 ? (
                            <p className="text-xs text-[#5C7667] italic">
                              Chưa có học sinh nào trong lớp này. Hãy thêm học sinh ở Mục 09 để theo dõi và chấm điểm.
                            </p>
                          ) : filteredRows.length === 0 ? (
                            <p className="text-xs text-[#5C7667] italic">
                              Không có học sinh nào khớp với bộ lọc trạng thái hiện tại.
                            </p>
                          ) : (
                            <div className="overflow-x-auto">
                              <table className="w-full text-left text-xs border-collapse bg-white rounded-xl overflow-hidden">
                                <thead>
                                  <tr className="bg-[#1B3B48] text-white">
                                    <th className="p-3 border">Học sinh & Lớp</th>
                                    <th className="p-3 border">
                                      Trạng thái nộp bài
                                    </th>
                                    <th className="p-3 border">
                                      Bài làm & Ghi chú của HS
                                    </th>
                                    <th className="p-3 border">
                                      Chấm điểm (Thang 10) & Nhận xét
                                    </th>
                                    {currentUser.role === "teacher" && (
                                      <th className="p-3 border text-center">
                                        Lưu vào Hồ sơ học tập
                                      </th>
                                    )}
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-[#E2DFD7]">
                                  {filteredRows.map(
                                    ({ student, submission, hasSubmitted }) => {
                                      const rowKey = submission
                                        ? submission.id
                                        : `${hw.id}_${student.id}`;
                                      const currentInput =
                                        gradingInputs[rowKey] || {};
                                      const displayScore =
                                        currentInput.score !== undefined
                                          ? currentInput.score
                                          : submission?.gradeScore ?? "";
                                      const displayFeedback =
                                        currentInput.feedback !== undefined
                                          ? currentInput.feedback
                                          : submission?.teacherFeedback ?? "";

                                      return (
                                        <tr
                                          key={student.id}
                                          className="hover:bg-[#F7F6F2]/60"
                                        >
                                          <td className="p-3 border font-bold text-[#1B3B48]">
                                            <div>{student.name}</div>
                                            <div className="text-[11px] text-[#5C7667] font-normal">
                                              Lớp {student.classId} • ĐTB hiện tại:{" "}
                                              <strong>
                                                {student.score}/10
                                              </strong>
                                            </div>
                                          </td>

                                          <td className="p-3 border">
                                            {hasSubmitted ? (
                                              <div className="space-y-1">
                                                <span className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 font-extrabold text-[11px]">
                                                  ✅ Đã nộp bài
                                                </span>
                                                {submission?.submittedAt && (
                                                  <div className="text-[10px] text-[#5C7667]">
                                                    Lúc: {submission.submittedAt}
                                                  </div>
                                                )}
                                              </div>
                                            ) : (
                                              <span
                                                className={`inline-block px-2.5 py-0.5 rounded-full font-extrabold text-[11px] ${
                                                  deadlineInfo.isExpired
                                                    ? "bg-red-100 text-red-800"
                                                    : "bg-amber-100 text-amber-900"
                                                }`}
                                              >
                                                {deadlineInfo.isExpired
                                                  ? "❌ Quá hạn chưa nộp"
                                                  : "⏳ Chưa nộp bài"}
                                              </span>
                                            )}
                                          </td>

                                          <td className="p-3 border">
                                            {submission ? (
                                              <div className="space-y-1">
                                                {submission.studentNote && (
                                                  <p className="text-[#1B3B48]">
                                                    "{submission.studentNote}"
                                                  </p>
                                                )}
                                                {submission.fileDataUrl && (
                                                  <div className="flex flex-wrap gap-1.5">
                                                    {submission.fileType ===
                                                      "image" && (
                                                      <button
                                                        type="button"
                                                        onClick={() =>
                                                          setPreviewSubmissionModal(
                                                            submission
                                                          )
                                                        }
                                                        className="px-2.5 py-1 rounded bg-[#1B3B48] text-[#E9C46A] text-[11px] font-bold"
                                                      >
                                                        👁 Xem ảnh
                                                      </button>
                                                    )}
                                                    <a
                                                      href={
                                                        submission.fileDataUrl
                                                      }
                                                      download={
                                                        submission.fileName ||
                                                        "bailam_hs"
                                                      }
                                                      className="inline-block px-2.5 py-1 rounded bg-[#5C7667] text-white text-[11px] font-bold"
                                                    >
                                                      ⬇ Tải bài nộp (
                                                      {submission.fileName ||
                                                        "Tệp"}
                                                      )
                                                    </a>
                                                  </div>
                                                )}
                                              </div>
                                            ) : (
                                              <span className="text-[#5C7667] italic">
                                                Chưa có tệp bài nộp
                                              </span>
                                            )}
                                          </td>

                                          <td className="p-3 border">
                                            {currentUser.role === "teacher" ? (
                                              <div className="flex flex-col sm:flex-row gap-2">
                                                <input
                                                  type="number"
                                                  step="0.1"
                                                  min="0"
                                                  max="10"
                                                  value={displayScore}
                                                  onChange={(e) =>
                                                    setGradingInputs({
                                                      ...gradingInputs,
                                                      [rowKey]: {
                                                        ...currentInput,
                                                        score: e.target.value,
                                                        feedback:
                                                          displayFeedback,
                                                      },
                                                    })
                                                  }
                                                  placeholder="Điểm (0-10)"
                                                  className="w-24 p-2 rounded-lg border font-black text-[#1B3B48] bg-[#F7F6F2]"
                                                />
                                                <input
                                                  type="text"
                                                  value={displayFeedback}
                                                  onChange={(e) =>
                                                    setGradingInputs({
                                                      ...gradingInputs,
                                                      [rowKey]: {
                                                        ...currentInput,
                                                        score: displayScore,
                                                        feedback:
                                                          e.target.value,
                                                      },
                                                    })
                                                  }
                                                  placeholder="Nhận xét bài làm..."
                                                  className="flex-1 p-2 rounded-lg border bg-[#F7F6F2]"
                                                />
                                              </div>
                                            ) : (
                                              <div>
                                                {submission?.gradeScore !==
                                                  undefined &&
                                                submission?.gradeScore !== "" ? (
                                                  <div>
                                                    <span className="font-black text-sm text-[#2C4A3E]">
                                                      Điểm:{" "}
                                                      {submission.gradeScore}/10
                                                    </span>
                                                    {submission.teacherFeedback && (
                                                      <p className="text-[#5C7667] mt-0.5">
                                                        Nhận xét:{" "}
                                                        {
                                                          submission.teacherFeedback
                                                        }
                                                      </p>
                                                    )}
                                                  </div>
                                                ) : (
                                                  <span className="text-[#5C7667] italic">
                                                    Đang chờ Thầy chấm điểm
                                                  </span>
                                                )}
                                              </div>
                                            )}
                                          </td>

                                          {currentUser.role === "teacher" && (
                                            <td className="p-3 border text-center">
                                              <button
                                                type="button"
                                                onClick={() =>
                                                  handleGradeHomeworkAndSyncProfile(
                                                    hw,
                                                    student,
                                                    submission
                                                  )
                                                }
                                                className="px-3 py-1.5 rounded-xl bg-[#1B3B48] hover:bg-[#2C4A3E] text-[#E9C46A] text-xs font-bold transition shadow-sm"
                                              >
                                                {submission?.isSyncedToProfile
                                                  ? "✓ Cập nhật lại Điểm Hồ sơ"
                                                  : "💯 Chấm & Nhập vào Hồ sơ"}
                                              </button>
                                              {submission?.isSyncedToProfile && (
                                                <div className="text-[10px] font-bold text-emerald-700 mt-1">
                                                  ✓ Đã lưu vào Hồ sơ Mục 04
                                                </div>
                                              )}
                                            </td>
                                          )}
                                        </tr>
                                      );
                                    }
                                  )}
                                </tbody>
                              </table>
                            </div>
                          )}
                        </div>
                      );
                    })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ===================================================================
            MỤC 06: NGÂN HÀNG ĐỀ THI (CHIA THEO NĂM HỌC & HÌNH THỨC GKI, HKI, THPT... + TẢI TỆP HOẶC LINK)
        =================================================================== */}
        {activeView === "exams" && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-[#E2DFD7] flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase text-[#5C7667]">
                  Mục 06 • Ngân hàng Đề thi theo Năm học & Hình thức kỳ thi
                </span>
                <h2 className="text-2xl font-bold text-[#1B3B48]">
                  Kho Đề thi (GKI • HKI • GKII • HKII • THPT Quốc gia) — Tải Tệp hoặc Gắn Link
                </h2>
                <p className="text-xs text-[#5C7667] mt-1">
                  Phân loại rõ theo từng <strong>Năm học</strong> và từng <strong>Hình thức thi</strong> (GKI Lớp 10, HKI Lớp 10, ..., THPT Quốc gia). Hỗ trợ tải tệp đề thi trực tiếp từ máy hoặc gắn đường link.
                </p>
              </div>
              <button
                onClick={goBack}
                className="px-4 py-2 rounded-xl bg-[#EFECE6] text-[#1B3B48] text-xs font-bold hover:bg-[#E2DFD7]"
              >
                ← Quay lại trang trước
              </button>
            </div>

            {currentUser.role === "teacher" && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!examForm.title.trim()) return;
                  const chosenYear =
                    examForm.academicYear ||
                    (selectedAcademicYear === "ALL"
                      ? appData.currentAcademicYear || "2026 - 2027"
                      : selectedAcademicYear);
                  const catMeta = getExamCategoryMeta(examForm.examCategory);

                  const newEx = {
                    id: "EX" + Date.now(),
                    ...examForm,
                    academicYear: chosenYear,
                    examCategoryLabel: catMeta.short,
                    date: new Date().toLocaleDateString("vi-VN"),
                  };
                  saveToAll({
                    ...appData,
                    examPapers: [newEx, ...appData.examPapers],
                  });
                  setExamForm({
                    ...examForm,
                    title: "",
                    fileUrl: "",
                    appLink: "",
                    fileName: "",
                    fileType: "",
                    fileDataUrl: "",
                  });
                  notify(
                    `Đã đăng đề thi "${newEx.title}" (${catMeta.short} • Năm học ${chosenYear})!`,
                    "success"
                  );
                }}
                className="bg-white p-6 rounded-2xl border-2 border-[#1B3B48] space-y-4 shadow-sm"
              >
                <div className="border-b pb-3 flex flex-wrap items-center justify-between gap-2">
                  <h3 className="font-bold text-base text-[#1B3B48]">
                    ➕ Đăng Đề thi mới (Chọn Năm học, Hình thức thi & Tải Tệp hoặc Link)
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold mb-1 text-[#5C7667]">
                      1. Năm học:
                    </label>
                    <select
                      value={examForm.academicYear}
                      onChange={(e) =>
                        setExamForm({
                          ...examForm,
                          academicYear: e.target.value,
                        })
                      }
                      className="w-full p-2.5 rounded-xl border text-xs bg-white font-bold text-[#1B3B48]"
                    >
                      {(appData.academicYears || DEFAULT_ACADEMIC_YEARS).map(
                        (y) => (
                          <option key={y} value={y}>
                            Năm học {y}
                          </option>
                        )
                      )}
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-[11px] font-bold mb-1 text-[#5C7667]">
                      2. Hình thức / Kỳ thi (GKI, HKI, GKII, HKII, THPT...):
                    </label>
                    <select
                      value={examForm.examCategory}
                      onChange={(e) =>
                        setExamForm({
                          ...examForm,
                          examCategory: e.target.value,
                        })
                      }
                      className="w-full p-2.5 rounded-xl border-2 border-[#1B3B48] text-xs bg-[#F7F6F2] font-extrabold text-[#1B3B48]"
                    >
                      {EXAM_CATEGORIES.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold mb-1 text-[#5C7667]">
                      3. Áp dụng cho Lớp:
                    </label>
                    <select
                      value={examForm.classId}
                      onChange={(e) =>
                        setExamForm({ ...examForm, classId: e.target.value })
                      }
                      className="w-full p-2.5 rounded-xl border text-xs bg-white font-bold"
                    >
                      <option value="ALL">Tất cả các lớp</option>
                      {appData.classes.map((c) => (
                        <option key={c.id} value={c.id}>
                          Lớp {c.id}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  <input
                    type="text"
                    required
                    value={examForm.title}
                    onChange={(e) =>
                      setExamForm({ ...examForm, title: e.target.value })
                    }
                    placeholder="Tên đề thi (VD: Đề thi thử HKI Hóa 10 - Đề số 01)..."
                    className="md:col-span-3 p-2.5 rounded-xl border text-xs"
                  />
                  <input
                    type="text"
                    value={examForm.duration}
                    onChange={(e) =>
                      setExamForm({ ...examForm, duration: e.target.value })
                    }
                    placeholder="Thời gian (VD: 50 phút)"
                    className="p-2.5 rounded-xl border text-xs"
                  />
                </div>

                <div className="p-3.5 rounded-xl bg-[#F7F6F2] border border-[#E2DFD7] grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
                  <div>
                    <label className="block text-xs font-bold mb-1 text-[#1B3B48]">
                      📎 Cách 1: Tải Tệp Đề thi từ máy (PDF/Word/Ảnh):
                    </label>
                    <input
                      type="file"
                      onChange={(e) =>
                        handleFlexibleFileUpload(e, (res) =>
                          setExamForm((prev) => ({
                            ...prev,
                            title: prev.title || res.fileName,
                            fileName: res.fileName,
                            fileType: res.fileType,
                            fileDataUrl: res.dataUrl,
                          }))
                        )
                      }
                      className="text-xs w-full"
                    />
                    {examForm.fileName && (
                      <div className="text-[11px] text-emerald-700 font-bold mt-1">
                        ✓ Đã chọn tệp: {examForm.fileName}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold mb-1 text-[#1B3B48]">
                      🔗 Cách 2: Dán Link File Đề thi (Drive/OneDrive):
                    </label>
                    <input
                      type="text"
                      value={examForm.fileUrl || ""}
                      onChange={(e) =>
                        setExamForm({ ...examForm, fileUrl: e.target.value })
                      }
                      placeholder="https://drive.google.com/..."
                      className="w-full p-2 rounded-lg border text-xs bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold mb-1 text-[#1B3B48]">
                      🖥 Cách 3: Link App Thi thử trực tuyến (Nếu có):
                    </label>
                    <input
                      type="text"
                      value={examForm.appLink}
                      onChange={(e) =>
                        setExamForm({ ...examForm, appLink: e.target.value })
                      }
                      placeholder="https://azota.vn/... hoặc Google Form"
                      className="w-full p-2 rounded-lg border text-xs bg-white"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="bg-[#1B3B48] text-white px-5 py-2.5 rounded-xl text-xs font-bold"
                  >
                    Đăng Đề thi
                  </button>
                </div>
              </form>
            )}

            {/* THANH LỌC ĐỀ THI THEO NĂM HỌC & HÌNH THỨC THI (GKI LỚP 10, HKI LỚP 10, ..., THPT) */}
            <div className="bg-white p-5 rounded-2xl border border-[#E2DFD7] space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#1B3B48]">
                    📅 Lọc theo Năm học:
                  </span>
                  <select
                    value={examFilterYear}
                    onChange={(e) => setExamFilterYear(e.target.value)}
                    className="p-2 rounded-xl border text-xs bg-[#F7F6F2] font-bold text-[#1B3B48]"
                  >
                    <option value="ALL">Tất cả các Năm học</option>
                    {(appData.academicYears || DEFAULT_ACADEMIC_YEARS).map(
                      (y) => (
                        <option key={y} value={y}>
                          Năm học {y}
                        </option>
                      )
                    )}
                  </select>
                </div>

                <span className="text-xs text-[#5C7667] font-semibold">
                  Chọn hình thức kỳ thi bên dưới để lọc nhanh:
                </span>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-1">
                <button
                  type="button"
                  onClick={() => setExamFilterCategory("ALL")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                    examFilterCategory === "ALL"
                      ? "bg-[#1B3B48] text-[#E9C46A]"
                      : "bg-[#EFECE6] text-[#1B3B48] hover:bg-[#E2DFD7]"
                  }`}
                >
                  Tất cả hình thức ({appData.examPapers.length})
                </button>
                {EXAM_CATEGORIES.map((cat) => {
                  const cnt = appData.examPapers.filter(
                    (e) => (e.examCategory || "THPT_QG") === cat.id
                  ).length;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setExamFilterCategory(cat.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                        examFilterCategory === cat.id
                          ? "bg-[#1B3B48] text-[#E9C46A]"
                          : "bg-[#EFECE6] text-[#1B3B48] hover:bg-[#E2DFD7]"
                      }`}
                    >
                      {cat.short} {cnt > 0 ? `(${cnt})` : ""}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* DANH SÁCH ĐỀ THI ĐÃ ĐĂNG */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {appData.examPapers
                .filter((ex) => {
                  if (
                    examFilterYear !== "ALL" &&
                    ex.academicYear &&
                    ex.academicYear !== examFilterYear
                  ) {
                    return false;
                  }
                  if (
                    examFilterCategory !== "ALL" &&
                    (ex.examCategory || "THPT_QG") !== examFilterCategory
                  ) {
                    return false;
                  }
                  return true;
                })
                .map((ex) => {
                  const catMeta = getExamCategoryMeta(ex.examCategory);
                  return (
                    <div
                      key={ex.id}
                      className="bg-white p-5 rounded-2xl border border-[#E2DFD7] flex flex-col justify-between gap-3 shadow-sm"
                    >
                      <div className="space-y-1.5">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span className="px-2.5 py-0.5 rounded-full bg-[#1B3B48] text-[#E9C46A] text-xs font-extrabold">
                              {catMeta.short}
                            </span>
                            <span className="px-2 py-0.5 rounded bg-[#EFECE6] text-[#2C4A3E] text-xs font-bold">
                              📅 NH: {ex.academicYear || "2026 - 2027"}
                            </span>
                            <span className="text-xs font-bold text-[#5C7667]">
                              •{" "}
                              {ex.classId === "ALL"
                                ? "Mọi lớp"
                                : `Lớp ${ex.classId}`}
                            </span>
                          </div>

                          {currentUser.role === "teacher" && (
                            <button
                              type="button"
                              onClick={() =>
                                saveToAll({
                                  ...appData,
                                  examPapers: appData.examPapers.filter(
                                    (x) => x.id !== ex.id
                                  ),
                                })
                              }
                              className="text-xs text-red-600 font-bold hover:underline"
                            >
                              🗑 Xóa đề
                            </button>
                          )}
                        </div>

                        <h4 className="font-bold text-base text-[#1B3B48]">
                          📝 {ex.title}
                        </h4>
                        <div className="text-xs text-[#5C7667]">
                          ⏱ Thời gian làm bài: {ex.duration || "50 phút"} • Ngày đăng: {ex.date}
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#EFECE6]">
                        {ex.fileDataUrl && (
                          <a
                            href={ex.fileDataUrl}
                            download={ex.fileName || "dethi"}
                            className="bg-[#5C7667] hover:bg-[#4A6154] text-white px-3.5 py-1.5 rounded-xl text-xs font-bold"
                          >
                            📥 Tải Tệp Đề Thi ({ex.fileName || "Tệp đính kèm"})
                          </a>
                        )}
                        {ex.fileUrl && (
                          <a
                            href={ex.fileUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="bg-[#2C4A3E] hover:bg-[#1B3B48] text-white px-3.5 py-1.5 rounded-xl text-xs font-bold"
                          >
                            🔗 Mở Link Tệp Đề Thi
                          </a>
                        )}
                        {ex.appLink && (
                          <a
                            href={ex.appLink}
                            target="_blank"
                            rel="noreferrer"
                            className="bg-[#1B3B48] text-[#E9C46A] px-3.5 py-1.5 rounded-xl text-xs font-bold"
                          >
                            🖥 Mở App Thi Thử →
                          </a>
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* ===================================================================
            MỤC 07: BẢNG VÀNG VINH DANH & THÀNH TÍCH CÁ NHÂN (ĐỒNG BỘ RA NGOÀI MÀN HÌNH ĐĂNG NHẬP)
        =================================================================== */}
        {activeView === "honor" && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-[#E2DFD7] flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase text-[#5C7667]">
                  Mục 07 • Tự hào Lớp Hóa Thầy Dương Anh Tuấn Anh (Hiển thị cả ngoài màn hình đăng nhập)
                </span>
                <h2 className="text-2xl font-bold text-[#1B3B48]">
                  Bảng Vàng Vinh Danh, Giải Học sinh giỏi & Đậu Đại học
                </h2>
              </div>
              <button
                onClick={goBack}
                className="px-4 py-2 rounded-xl bg-[#EFECE6] text-[#1B3B48] text-xs font-bold hover:bg-[#E2DFD7]"
              >
                ← Quay lại trang trước
              </button>
            </div>

            {currentUser.role === "teacher" && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!achForm.studentName.trim() || !achForm.title.trim())
                    return;
                  saveToAll({
                    ...appData,
                    achievements: [
                      { id: "ACH" + Date.now(), ...achForm },
                      ...appData.achievements,
                    ],
                  });
                  setAchForm({
                    studentName: "",
                    classId: "12A1",
                    academicYear:
                      selectedAcademicYear === "ALL"
                        ? appData.currentAcademicYear || "2026 - 2027"
                        : selectedAcademicYear,
                    category: "Đậu Đại học",
                    title: "",
                    scoreDetail: "",
                    imageName: "",
                    imageDataUrl: "",
                  });
                  notify("Đã đăng thành tích mới lên Bảng Vàng!", "success");
                }}
                className="bg-white p-6 rounded-2xl border-2 border-[#1B3B48] space-y-4"
              >
                <h3 className="font-bold text-base text-[#1B3B48]">
                  + Thêm Hồ sơ Vinh danh Thành tích (Đồng bộ ra Bảng Vàng ngoài màn hình Đăng nhập)
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                  <input
                    type="text"
                    required
                    value={achForm.studentName}
                    onChange={(e) =>
                      setAchForm({ ...achForm, studentName: e.target.value })
                    }
                    placeholder="Họ và tên học sinh..."
                    className="p-2.5 rounded-xl border text-xs"
                  />
                  <input
                    type="text"
                    value={achForm.classId}
                    onChange={(e) =>
                      setAchForm({ ...achForm, classId: e.target.value })
                    }
                    placeholder="Lớp / Khóa"
                    className="p-2.5 rounded-xl border text-xs"
                  />
                  <select
                    value={achForm.academicYear}
                    onChange={(e) =>
                      setAchForm({ ...achForm, academicYear: e.target.value })
                    }
                    className="p-2.5 rounded-xl border text-xs bg-white font-bold"
                  >
                    {(appData.academicYears || DEFAULT_ACADEMIC_YEARS).map(
                      (y) => (
                        <option key={y} value={y}>
                          Năm học {y}
                        </option>
                      )
                    )}
                  </select>
                  <select
                    value={achForm.category}
                    onChange={(e) =>
                      setAchForm({ ...achForm, category: e.target.value })
                    }
                    className="p-2.5 rounded-xl border text-xs bg-white font-bold"
                  >
                    <option value="Đậu Đại học">🎓 Đậu Đại học</option>
                    <option value="Học sinh giỏi">🏅 Giải Học sinh giỏi</option>
                    <option value="Thủ khoa / Xuất sắc">
                      🏆 Thủ khoa / Điểm 10 Hóa
                    </option>
                  </select>
                  <input
                    type="text"
                    required
                    value={achForm.title}
                    onChange={(e) =>
                      setAchForm({ ...achForm, title: e.target.value })
                    }
                    placeholder="Trường Đại học đậu / Giải thưởng..."
                    className="p-2.5 rounded-xl border text-xs"
                  />
                </div>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <input
                    type="text"
                    value={achForm.scoreDetail}
                    onChange={(e) =>
                      setAchForm({ ...achForm, scoreDetail: e.target.value })
                    }
                    placeholder="Chi tiết điểm số (VD: Điểm Hóa 9.75 • Tổng điểm 28.5)..."
                    className="flex-1 p-2.5 rounded-xl border text-xs"
                  />
                  <button
                    type="submit"
                    className="bg-[#1B3B48] text-white px-5 py-2.5 rounded-xl text-xs font-bold"
                  >
                    Đăng lên Bảng Vàng
                  </button>
                </div>
              </form>
            )}

            {combinedHonorBoard.filter((ach) =>
              matchesSelectedYear(ach.academicYear)
            ).length === 0 && (
              <div className="bg-white p-8 rounded-2xl border border-dashed border-[#DFDBD0] text-center space-y-1.5">
                <div className="text-sm font-bold text-[#1B3B48]">
                  🏆 Danh sách Bảng Vàng đang trống
                </div>
                <p className="text-xs text-[#5C7667]">
                  Các học sinh vinh danh mẫu đã được xóa. Hãy điền thông tin vào khung phía trên để tạo vinh danh mới.
                </p>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {combinedHonorBoard
                .filter((ach) => matchesSelectedYear(ach.academicYear))
                .map((ach) => (
                  <div
                    key={ach.id}
                    className="bg-white p-5 rounded-2xl border border-[#E2DFD7] space-y-2 flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-0.5 rounded-full bg-[#1B3B48] text-[#E9C46A] text-xs font-bold">
                          {ach.category} • {ach.classId}
                        </span>
                        <span className="text-[11px] font-bold text-[#5C7667]">
                          {ach.academicYear || "2026 - 2027"}
                        </span>
                      </div>
                      <h4 className="font-extrabold text-base text-[#1B3B48]">
                        {ach.studentName}
                      </h4>
                      <p className="text-sm font-bold text-[#2C4A3E]">
                        {ach.title}
                      </p>
                      {ach.scoreDetail && (
                        <p className="text-xs text-[#5C7667]">
                          {ach.scoreDetail}
                        </p>
                      )}
                    </div>
                    {currentUser.role === "teacher" && !ach.isAutoTop && (
                      <div className="pt-2 border-t flex justify-end">
                        <button
                          onClick={() =>
                            saveToAll({
                              ...appData,
                              achievements: appData.achievements.filter(
                                (x) => x.id !== ach.id
                              ),
                            })
                          }
                          className="text-xs text-red-600 font-bold hover:underline"
                        >
                          Xóa vinh danh
                        </button>
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* ===================================================================
            MỤC 08: SỔ TAY CÁC CHẤT CẦN NHỚ, DỤNG CỤ THÍ NGHIỆM & TẠO FLASHCARD CÁ NHÂN
        =================================================================== */}
        {activeView === "chem_tools" && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-[#E2DFD7] flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase text-[#5C7667]">
                  Mục 08 • Sổ tay Hóa học Toàn diện & Tiện ích Cá nhân
                </span>
                <h2 className="text-2xl font-bold text-[#1B3B48]">
                  Sổ tay Các Chất Cần Nhớ, Dụng cụ Thí nghiệm, Tạo Flashcard Cá nhân & Đấu trường Hóa học
                </h2>
              </div>
              <button
                onClick={goBack}
                className="px-4 py-2 rounded-xl bg-[#EFECE6] text-[#1B3B48] text-xs font-bold hover:bg-[#E2DFD7]"
              >
                ← Quay lại trang trước
              </button>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-[#E2DFD7] space-y-5 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#EFECE6] pb-3">
                <h3 className="font-bold text-lg text-[#1B3B48]">
                  📖 Bảng Các Chất Cần Nhớ, Chất Chỉ Thị pH & Dụng Cụ Thí Nghiệm (Chuẩn IUPAC)
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { id: "FATTY_ACIDS", label: "1. Acid béo & Chất béo" },
                    { id: "AMINO_ACIDS", label: "2. Amino acid cần nhớ" },
                    { id: "PH_INDICATORS", label: "3. Thang pH & Chất chỉ thị" },
                    {
                      id: "LAB_EQUIPMENT",
                      label: "4. Dụng cụ thí nghiệm & Công dụng",
                    },
                    { id: "PRECIPITATES", label: "5. Màu kết tủa & Phức chất" },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setRefTab(tab.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                        refTab === tab.id
                          ? "bg-[#1B3B48] text-white shadow-sm"
                          : "bg-[#EFECE6] text-[#1B3B48] hover:bg-[#E2DFD7]"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {refTab === "FATTY_ACIDS" && (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-[#1B3B48] text-white">
                        <th className="p-3 border">Tên thường (IUPAC)</th>
                        <th className="p-3 border">Tên thay thế IUPAC</th>
                        <th className="p-3 border">Công thức cấu tạo</th>
                        <th className="p-3 border">Phân tử khối (M)</th>
                        <th className="p-3 border">Triglyceride tương ứng</th>
                        <th className="p-3 border">Đặc điểm & Trạng thái</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E2DFD7]">
                      {FATTY_ACIDS_TABLE.map((fa, i) => (
                        <tr key={i} className="hover:bg-[#F7F6F2]">
                          <td className="p-3 border font-bold text-[#1B3B48]">
                            {fa.name}
                          </td>
                          <td className="p-3 border text-[#5C7667] font-semibold">
                            {fa.iupac}
                          </td>
                          <td className="p-3 border font-mono font-bold">
                            {fa.formula}
                          </td>
                          <td className="p-3 border font-bold text-[#2C4A3E]">
                            {fa.molarMass}
                          </td>
                          <td className="p-3 border font-semibold">
                            {fa.triglyceride}
                          </td>
                          <td className="p-3 border">{fa.property}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {refTab === "AMINO_ACIDS" && (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-[#1B3B48] text-white">
                        <th className="p-3 border">Kí hiệu</th>
                        <th className="p-3 border">Tên thường</th>
                        <th className="p-3 border">Tên thay thế IUPAC</th>
                        <th className="p-3 border">Công thức cấu tạo</th>
                        <th className="p-3 border">M (g/mol)</th>
                        <th className="p-3 border">Số nhóm chức</th>
                        <th className="p-3 border">Đổi màu Quỳ tím & pH</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E2DFD7]">
                      {AMINO_ACIDS_TABLE.map((aa, i) => (
                        <tr key={i} className="hover:bg-[#F7F6F2]">
                          <td className="p-3 border font-black text-[#1B3B48]">
                            {aa.symbol}
                          </td>
                          <td className="p-3 border font-bold">
                            {aa.commonName}
                          </td>
                          <td className="p-3 border text-[#5C7667]">
                            {aa.iupacName}
                          </td>
                          <td className="p-3 border font-mono font-bold">
                            {aa.formula}
                          </td>
                          <td className="p-3 border font-black text-sm text-[#2C4A3E]">
                            {aa.molarMass}
                          </td>
                          <td className="p-3 border">{aa.groups}</td>
                          <td className="p-3 border font-semibold">
                            {aa.litmus}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {refTab === "PH_INDICATORS" && (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-[#1B3B48] text-white">
                        <th className="p-3 border">Chất chỉ thị</th>
                        <th className="p-3 border">Môi trường Acid</th>
                        <th className="p-3 border">Môi trường Trung tính</th>
                        <th className="p-3 border">Môi trường Base (Kiềm)</th>
                        <th className="p-3 border">Ứng dụng trọng tâm</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E2DFD7]">
                      {PH_INDICATORS_TABLE.map((ind, i) => (
                        <tr key={i} className="hover:bg-[#F7F6F2]">
                          <td className="p-3 border font-bold text-[#1B3B48]">
                            {ind.indicator}
                          </td>
                          <td className="p-3 border font-semibold text-red-700">
                            {ind.acidColor}
                          </td>
                          <td className="p-3 border font-semibold">
                            {ind.neutralColor}
                          </td>
                          <td className="p-3 border font-semibold text-blue-800">
                            {ind.baseColor}
                          </td>
                          <td className="p-3 border text-[#5C7667]">
                            {ind.application}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {refTab === "LAB_EQUIPMENT" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {LAB_EQUIPMENT_TABLE.map((eq, i) => (
                    <div
                      key={i}
                      className="p-4 rounded-xl bg-[#F7F6F2] border border-[#E2DFD7] space-y-1.5 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-sm text-[#1B3B48]">
                          🔬 {eq.name}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-[#1B3B48] text-white text-[10px] font-bold">
                          {eq.category}
                        </span>
                      </div>
                      <p className="text-[#1B3B48] leading-relaxed">
                        <strong>Công dụng:</strong> {eq.usage}
                      </p>
                      <p className="text-[#9C6644] font-semibold">
                        ⚠️ Lưu ý thao tác chuẩn: {eq.note}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {refTab === "PRECIPITATES" && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                  {CHEM_REFERENCE_NOTES.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-[#F7F6F2] border border-[#E2DFD7] space-y-1 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-black text-sm text-[#1B3B48]">
                          {item.formula}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-[#1B3B48] text-white font-bold text-[10px]">
                          {item.color}
                        </span>
                      </div>
                      <p className="text-[#5C7667] leading-relaxed">
                        {item.note}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* TẠO FLASHCARD CÁ NHÂN CHO HỌC SINH */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <form
                onSubmit={handleCreatePersonalFlashcard}
                className="lg:col-span-5 bg-white p-6 rounded-2xl border-2 border-[#5C7667] space-y-3.5 shadow-sm"
              >
                <h3 className="font-bold text-base text-[#1B3B48]">
                  ✨ Tạo Flashcard Cá Nhân Của Bạn
                </h3>
                <div className="grid grid-cols-2 gap-2.5 text-xs">
                  <select
                    value={newFlashcardForm.grade}
                    onChange={(e) =>
                      setNewFlashcardForm({
                        ...newFlashcardForm,
                        grade: e.target.value,
                      })
                    }
                    className="p-2.5 rounded-xl border bg-white font-semibold"
                  >
                    <option value="10">Hóa học Lớp 10</option>
                    <option value="11">Hóa học Lớp 11</option>
                    <option value="12">Hóa học Lớp 12</option>
                  </select>
                  <input
                    type="text"
                    value={newFlashcardForm.topic}
                    onChange={(e) =>
                      setNewFlashcardForm({
                        ...newFlashcardForm,
                        topic: e.target.value,
                      })
                    }
                    placeholder="Chủ đề (VD: Amino acid)"
                    className="p-2.5 rounded-xl border"
                  />
                </div>
                <input
                  type="text"
                  required
                  value={newFlashcardForm.front}
                  onChange={(e) =>
                    setNewFlashcardForm({
                      ...newFlashcardForm,
                      front: e.target.value,
                    })
                  }
                  placeholder="Mặt trước: Câu hỏi / Tên chất..."
                  className="w-full p-2.5 rounded-xl border text-xs"
                />
                <textarea
                  rows={2}
                  required
                  value={newFlashcardForm.back}
                  onChange={(e) =>
                    setNewFlashcardForm({
                      ...newFlashcardForm,
                      back: e.target.value,
                    })
                  }
                  placeholder="Mặt sau: Đáp án / Công thức..."
                  className="w-full p-2.5 rounded-xl border text-xs"
                />
                <button
                  type="submit"
                  className="w-full bg-[#2C4A3E] text-white py-2.5 rounded-xl text-xs font-bold"
                >
                  + Lưu vào Bộ Flashcard Cá nhân
                </button>
              </form>

              <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-[#E2DFD7] space-y-4 flex flex-col justify-between">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="font-bold text-base text-[#1B3B48]">
                    🗂 Lật Thẻ Ôn Tập Flashcard
                  </h3>
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => {
                        setFlashcardSource("ALL");
                        setCardIndex(0);
                        setIsCardFlipped(false);
                      }}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                        flashcardSource === "ALL"
                          ? "bg-[#1B3B48] text-white"
                          : "bg-[#EFECE6] text-[#1B3B48]"
                      }`}
                    >
                      Tất cả thẻ
                    </button>
                    <button
                      onClick={() => {
                        setFlashcardSource("PERSONAL");
                        setCardIndex(0);
                        setIsCardFlipped(false);
                      }}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                        flashcardSource === "PERSONAL"
                          ? "bg-[#2C4A3E] text-white"
                          : "bg-[#EFECE6] text-[#1B3B48]"
                      }`}
                    >
                      Thẻ Cá nhân ({(appData.customFlashcards || []).length})
                    </button>
                  </div>
                </div>

                {(() => {
                  const personalList = appData.customFlashcards || [];
                  const combined =
                    flashcardSource === "PERSONAL"
                      ? personalList
                      : [...personalList, ...FLASHCARDS_BANK];
                  if (combined.length === 0) {
                    return (
                      <div className="p-8 rounded-2xl bg-[#F7F6F2] text-center text-xs text-[#5C7667]">
                        Chưa có thẻ Flashcard cá nhân nào.
                      </div>
                    );
                  }
                  const cur = combined[cardIndex % combined.length];
                  return (
                    <div className="space-y-3">
                      <div
                        onClick={() => setIsCardFlipped(!isCardFlipped)}
                        className="min-h-[160px] p-6 rounded-2xl bg-[#1B3B48] text-white flex flex-col items-center justify-center text-center cursor-pointer"
                      >
                        <span className="text-[11px] uppercase text-[#E9C46A] mb-2">
                          {isCardFlipped
                            ? "ĐÁP ÁN (Bấm để lật lại)"
                            : "CÂU HỎI (Bấm vào thẻ để xem đáp án)"}
                        </span>
                        <p className="text-base font-bold">
                          {isCardFlipped ? cur.back : cur.front}
                        </p>
                      </div>
                      <div className="flex justify-end">
                        <button
                          onClick={() => {
                            setIsCardFlipped(false);
                            setCardIndex((prev) => prev + 1);
                          }}
                          className="text-xs font-bold text-white bg-[#1B3B48] px-4 py-2 rounded-xl"
                        >
                          Thẻ tiếp theo →
                        </button>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>
        )}

        {/* ===================================================================
            MỤC 10: CHUYỆN HÓA HỌC HẰNG NGÀY, BÀI BÁO GỢI MỞ & HỎI ĐÁP CÂU HỎI KHÓ (KIỂU FACEBOOK + TÍNH ĐIỂM TƯƠNG TÁC)
        =================================================================== */}
        {activeView === "chem_feed" && (
          <div className="space-y-6">
            {/* HEADER CHUYÊN MỤC */}
            <div className="bg-white p-6 rounded-2xl border border-[#E2DFD7] flex flex-wrap items-center justify-between gap-4 shadow-sm">
              <div>
                <span className="text-xs font-bold uppercase text-[#9C6644]">
                  Mục 10 • Diễn đàn Cảm hứng Hóa học & Cộng đồng Học tập Tương tác
                </span>
                <h2 className="text-2xl font-bold text-[#1B3B48] mt-0.5">
                  🧪 Chuyện Hóa Học Hằng Ngày, Đố Vui Nhận Điểm & Góc Hỏi Bài Khó
                </h2>
                <p className="text-xs text-[#5C7667] mt-1">
                  Nơi Thầy đăng các bài báo Hóa học đời sống thú vị, câu hỏi gợi mở để Học sinh bình luận đáp án tích lũy <strong>Điểm Tương Tác</strong>, đồng thời Học sinh có thể đăng <strong>Câu hỏi khó</strong> nhờ Thầy và các bạn cùng giải đáp.
                </p>
              </div>
              <button
                onClick={goBack}
                className="px-4 py-2 rounded-xl bg-[#EFECE6] text-[#1B3B48] text-xs font-bold hover:bg-[#E2DFD7]"
              >
                ← Quay lại trang trước
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* CỘT TRÁI (8 CỘT): KHUNG ĐĂNG BÀI KIỂU FACEBOOK & DÒNG THỜI GIAN BÀI VIẾT */}
              <div className="lg:col-span-8 space-y-5">
                {/* KHUNG ĐĂNG BÀI MỚI (CREATE POST BOX KIỂU FACEBOOK) */}
                <form
                  onSubmit={handleCreateChemFeedPost}
                  className="bg-white p-5 sm:p-6 rounded-2xl border-2 border-[#1B3B48] space-y-4 shadow-sm"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#EFECE6] pb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-full bg-[#1B3B48] text-[#E9C46A] flex items-center justify-center font-black text-xs">
                        {currentUser.role === "teacher" ? "GV" : "HS"}
                      </div>
                      <div>
                        <h3 className="font-bold text-sm sm:text-base text-[#1B3B48]">
                          {currentUser.role === "teacher"
                            ? "✍️ Đăng Bài Báo Hóa Học Gợi Mở / Câu Đố Tương Tác / Câu Hỏi"
                            : `🙋‍♂️ Đăng Câu Hỏi Hóa Học Khó Nhờ Thầy & Bạn Giải Đáp (${currentUser.name})`}
                        </h3>
                        <p className="text-[11px] text-[#5C7667]">
                          Mỗi bình luận tham gia trả lời được <strong>+1 điểm tương tác</strong>; bình luận đúng đáp án được Thầy duyệt nhận thêm <strong>+{newPostForm.rewardPoints} điểm thưởng</strong>!
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Chọn loại bài đăng */}
                  {currentUser.role === "teacher" && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {[
                        {
                          id: "DAILY_STORY",
                          label: "📰 Chuyện Hóa học & Bài báo gợi mở",
                        },
                        {
                          id: "QUIZ_CHALLENGE",
                          label: "🧩 Đố vui Hóa học (Bình luận nhận điểm)",
                        },
                        {
                          id: "STUDENT_QA",
                          label: "🙋‍♂️ Đăng Câu hỏi khó (Thảo luận giải bài)",
                        },
                      ].map((t) => (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() =>
                            setNewPostForm({ ...newPostForm, postType: t.id })
                          }
                          className={`p-2.5 rounded-xl text-xs font-bold border text-left transition ${
                            newPostForm.postType === t.id
                              ? "bg-[#1B3B48] text-[#E9C46A] border-[#1B3B48]"
                              : "bg-[#F7F6F2] text-[#1B3B48] border-[#E2DFD7] hover:bg-[#EFECE6]"
                          }`}
                        >
                          {t.label}
                        </button>
                      ))}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <select
                      value={newPostForm.grade}
                      onChange={(e) =>
                        setNewPostForm({
                          ...newPostForm,
                          grade: e.target.value,
                        })
                      }
                      className="p-2.5 rounded-xl border text-xs bg-[#F7F6F2] font-bold text-[#1B3B48]"
                    >
                      <option value="ALL">🌐 Tất cả các khối (10 • 11 • 12)</option>
                      <option value="10">Khối 10</option>
                      <option value="11">Khối 11</option>
                      <option value="12">Khối 12</option>
                    </select>

                    {currentUser.role === "teacher" && (
                      <div className="flex items-center gap-2 bg-[#F7F6F2] px-3 py-2 rounded-xl border">
                        <span className="text-xs font-bold text-[#1B3B48]">
                          ⭐ Điểm thưởng đáp án đúng:
                        </span>
                        <input
                          type="number"
                          min="1"
                          max="50"
                          value={newPostForm.rewardPoints}
                          onChange={(e) =>
                            setNewPostForm({
                              ...newPostForm,
                              rewardPoints: e.target.value,
                            })
                          }
                          className="w-16 p-1 rounded border text-xs font-black text-center bg-white"
                        />
                      </div>
                    )}

                    {currentUser.role === "teacher" &&
                      newPostForm.postType === "STUDENT_QA" &&
                      appData.students.length > 0 && (
                        <select
                          value={newPostForm.authorStudentId}
                          onChange={(e) =>
                            setNewPostForm({
                              ...newPostForm,
                              authorStudentId: e.target.value,
                            })
                          }
                          className="p-2.5 rounded-xl border text-xs bg-white font-semibold"
                        >
                          <option value="">
                            -- Đăng với tên Thầy hoặc chọn HS hỏi --
                          </option>
                          {appData.students.map((st) => (
                            <option key={st.id} value={st.id}>
                              HS hỏi: {st.name} (Lớp {st.classId})
                            </option>
                          ))}
                        </select>
                      )}
                  </div>

                  <input
                    type="text"
                    value={newPostForm.title}
                    onChange={(e) =>
                      setNewPostForm({ ...newPostForm, title: e.target.value })
                    }
                    placeholder={
                      currentUser.role === "student" ||
                      newPostForm.postType === "STUDENT_QA"
                        ? "Tiêu đề câu hỏi khó (VD: Nhờ Thầy và các bạn giải thích giúp em bài toán điện phân hỗn hợp...)"
                        : "Tiêu đề bài báo / Chuyện Hóa học hôm nay (VD: Vì sao cắt hành tây lại chảy nước mắt? Có công thức Hóa học nào ẩn giấu?)..."
                    }
                    className="w-full p-3 rounded-xl border border-[#E2DFD7] text-sm font-bold text-[#1B3B48]"
                  />

                  <textarea
                    rows={4}
                    required
                    value={newPostForm.content}
                    onChange={(e) =>
                      setNewPostForm({
                        ...newPostForm,
                        content: e.target.value,
                      })
                    }
                    placeholder={
                      currentUser.role === "student" ||
                      newPostForm.postType === "STUDENT_QA"
                        ? "Nhập chi tiết đề bài hoặc chỗ em đang thắc mắc chưa hiểu rõ..."
                        : "Nội dung bài báo khoa học, hiện tượng Hóa học thực tiễn hoặc câu hỏi gợi mở để học sinh vào bình luận đáp án..."
                    }
                    className="w-full p-3 rounded-xl border border-[#E2DFD7] text-sm leading-relaxed"
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center bg-[#F7F6F2] p-3 rounded-xl border border-[#E2DFD7]">
                    <div>
                      <label className="block text-[11px] font-bold text-[#1B3B48] mb-1">
                        📷 Đính kèm Ảnh minh họa / Ảnh chụp đề bài khó:
                      </label>
                      <input
                        type="file"
                        accept="image/*,.pdf,.doc,.docx"
                        onChange={(e) =>
                          handleFlexibleFileUpload(e, (res) =>
                            setNewPostForm((prev) => ({
                              ...prev,
                              imageName: res.fileName,
                              imageType: res.fileType,
                              imageDataUrl: res.dataUrl,
                            }))
                          )
                        }
                        className="text-xs w-full"
                      />
                      {newPostForm.imageName && (
                        <div className="text-[11px] text-emerald-700 font-bold mt-1">
                          ✓ Đã đính kèm: {newPostForm.imageName}
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-[#1B3B48] mb-1">
                        🔗 Link bài báo khoa học / Nguồn tham khảo (Nếu có):
                      </label>
                      <input
                        type="text"
                        value={newPostForm.articleUrl}
                        onChange={(e) =>
                          setNewPostForm({
                            ...newPostForm,
                            articleUrl: e.target.value,
                          })
                        }
                        placeholder="https://..."
                        className="w-full p-2 rounded-lg border text-xs bg-white"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="bg-[#1B3B48] hover:bg-[#2C4A3E] text-white px-5 py-2.5 rounded-xl text-xs font-bold transition shadow-sm"
                    >
                      {currentUser.role === "student" ||
                      newPostForm.postType === "STUDENT_QA"
                        ? "🙋‍♂️ Đăng Câu Hỏi Nhờ Thầy & Bạn Giải Đáp"
                        : "🚀 Đăng Lên Bảng Tin Chuyện Hóa Học"}
                    </button>
                  </div>
                </form>

                {/* THANH LỌC BÀI VIẾT TRÊN BẢNG TIN */}
                <div className="bg-white p-4 rounded-2xl border border-[#E2DFD7] flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { id: "ALL", label: "🌐 Tất cả bài đăng" },
                      {
                        id: "DAILY_STORY",
                        label: "📰 Chuyện Hóa học & Bài báo",
                      },
                      {
                        id: "QUIZ_CHALLENGE",
                        label: "🧩 Đố vui gợi mở (+Điểm)",
                      },
                      {
                        id: "STUDENT_QA",
                        label: "🙋‍♂️ Câu hỏi khó của HS",
                      },
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setFeedFilterType(tab.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                          feedFilterType === tab.id
                            ? "bg-[#1B3B48] text-[#E9C46A]"
                            : "bg-[#EFECE6] text-[#1B3B48] hover:bg-[#E2DFD7]"
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  <select
                    value={feedFilterGrade}
                    onChange={(e) => setFeedFilterGrade(e.target.value)}
                    className="p-2 rounded-xl border text-xs bg-[#F7F6F2] font-bold text-[#1B3B48]"
                  >
                    <option value="ALL">Mọi khối lớp</option>
                    <option value="10">Khối 10</option>
                    <option value="11">Khối 11</option>
                    <option value="12">Khối 12</option>
                  </select>
                </div>

                {/* DANH SÁCH BÀI VIẾT KIỂU FACEBOOK FEED */}
                {(appData.chemFeedPosts || []).filter((p) => {
                  if (!matchesSelectedYear(p.academicYear)) return false;
                  if (
                    feedFilterType !== "ALL" &&
                    p.postType !== feedFilterType
                  ) {
                    return false;
                  }
                  if (
                    feedFilterGrade !== "ALL" &&
                    p.grade !== "ALL" &&
                    p.grade !== feedFilterGrade
                  ) {
                    return false;
                  }
                  return true;
                }).length === 0 ? (
                  <div className="bg-white p-8 rounded-2xl border border-dashed border-[#DFDBD0] text-center space-y-2">
                    <div className="text-base font-bold text-[#1B3B48]">
                      🧪 Chưa có bài viết hoặc câu hỏi nào trên Bảng tin Hóa học
                    </div>
                    <p className="text-xs text-[#5C7667]">
                      Giáo viên có thể đăng bài báo Hóa học đời sống thú vị hoặc câu hỏi đố vui ở khung phía trên; Học sinh có thể đăng câu hỏi khó để cả lớp cùng bình luận giải đáp và tích điểm tương tác!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-5">
                    {(appData.chemFeedPosts || [])
                      .filter((p) => {
                        if (!matchesSelectedYear(p.academicYear)) return false;
                        if (
                          feedFilterType !== "ALL" &&
                          p.postType !== feedFilterType
                        ) {
                          return false;
                        }
                        if (
                          feedFilterGrade !== "ALL" &&
                          p.grade !== "ALL" &&
                          p.grade !== feedFilterGrade
                        ) {
                          return false;
                        }
                        return true;
                      })
                      .map((post) => {
                        const actorId =
                          currentUser?.role === "student"
                            ? currentUser.studentId
                            : "TEACHER";
                        const liked = (post.likes || []).includes(actorId);
                        const loved = (post.loves || []).includes(actorId);
                        const ideaed = (post.ideas || []).includes(actorId);
                        const draftObj = commentDrafts[post.id] || {};
                        const attachObj = commentAttachments[post.id] || null;

                        return (
                          <article
                            key={post.id}
                            className="bg-white rounded-2xl border border-[#E2DFD7] shadow-sm overflow-hidden"
                          >
                            {/* Post Header kiểu Facebook */}
                            <div className="p-5 flex items-start justify-between gap-3 border-b border-[#F7F6F2]">
                              <div className="flex items-center gap-3">
                                <div
                                  className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-xs text-white ${
                                    post.authorRole === "teacher"
                                      ? "bg-[#1B3B48]"
                                      : "bg-[#2C4A3E]"
                                  }`}
                                >
                                  {post.authorRole === "teacher" ? "GV" : "HS"}
                                </div>
                                <div>
                                  <div className="flex flex-wrap items-center gap-2">
                                    <span className="font-extrabold text-sm text-[#1B3B48]">
                                      {post.authorName}
                                    </span>
                                    <span
                                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                                        post.postType === "STUDENT_QA"
                                          ? "bg-rose-100 text-rose-800"
                                          : post.postType === "QUIZ_CHALLENGE"
                                          ? "bg-amber-100 text-amber-900"
                                          : "bg-sky-100 text-sky-900"
                                      }`}
                                    >
                                      {post.postType === "STUDENT_QA"
                                        ? "🙋‍♂️ Câu hỏi khó cần giải đáp"
                                        : post.postType === "QUIZ_CHALLENGE"
                                        ? `🧩 Đố vui Hóa học (+${post.rewardPoints} điểm thưởng)`
                                        : `📰 Chuyện Hóa học hằng ngày (+${post.rewardPoints} điểm thưởng)`}
                                    </span>
                                    {post.isResolved && (
                                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-[10px] font-extrabold">
                                        ✅ Đã có lời giải đúng
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-[11px] text-[#5C7667] mt-0.5">
                                    🕒 {post.createdAt} •{" "}
                                    {post.grade === "ALL"
                                      ? "Toàn khối 10 • 11 • 12"
                                      : `Khối ${post.grade}`}
                                  </div>
                                </div>
                              </div>

                              {(currentUser.role === "teacher" ||
                                (currentUser.role === "student" &&
                                  post.authorId === currentUser.studentId)) && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    askConfirm(
                                      "Bạn có chắc muốn xóa bài đăng này khỏi Bảng tin Hóa học?",
                                      () => {
                                        saveToAll({
                                          ...appData,
                                          chemFeedPosts: (
                                            appData.chemFeedPosts || []
                                          ).filter((x) => x.id !== post.id),
                                        });
                                        notify("Đã xóa bài đăng.", "info");
                                      }
                                    )
                                  }
                                  className="text-xs text-red-600 font-bold hover:underline"
                                >
                                  🗑 Xóa bài
                                </button>
                              )}
                            </div>

                            {/* Post Body */}
                            <div className="p-5 space-y-3">
                              {post.title && (
                                <h4 className="font-extrabold text-base sm:text-lg text-[#1B3B48] leading-snug">
                                  {post.title}
                                </h4>
                              )}
                              <p className="text-sm text-[#1B3B48]/90 whitespace-pre-line leading-relaxed">
                                {post.content}
                              </p>

                              {post.articleUrl && (
                                <div className="p-3 rounded-xl bg-[#F7F6F2] border border-[#E2DFD7] flex items-center justify-between gap-2 text-xs">
                                  <span className="font-bold text-[#1B3B48] truncate">
                                    🔗 Nguồn bài báo / Tài liệu gợi mở:{" "}
                                    {post.articleUrl}
                                  </span>
                                  <a
                                    href={post.articleUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="px-3 py-1 rounded-lg bg-[#1B3B48] text-white font-bold shrink-0"
                                  >
                                    Đọc bài báo →
                                  </a>
                                </div>
                              )}

                              {post.imageDataUrl && (
                                <div className="rounded-xl overflow-hidden border border-[#E2DFD7] bg-[#F7F6F2] p-2 flex justify-center">
                                  {post.imageType === "image" ? (
                                    <img
                                      src={post.imageDataUrl}
                                      alt={post.title || "Hình minh họa Hóa học"}
                                      className="max-w-full h-auto max-h-96 object-contain rounded-lg"
                                    />
                                  ) : (
                                    <a
                                      href={post.imageDataUrl}
                                      download={post.imageName || "tailieu_hoa"}
                                      className="px-4 py-2 rounded-xl bg-[#5C7667] text-white text-xs font-bold"
                                    >
                                      📎 Tải tệp đính kèm ({post.imageName})
                                    </a>
                                  )}
                                </div>
                              )}
                            </div>

                            {/* Thanh Reaction kiểu Facebook */}
                            <div className="px-5 py-2.5 bg-[#F7F6F2] border-y border-[#E2DFD7] flex flex-wrap items-center justify-between gap-2 text-xs">
                              <div className="flex flex-wrap items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleTogglePostReaction(post.id, "likes")
                                  }
                                  className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition ${
                                    liked
                                      ? "bg-[#1B3B48] text-white"
                                      : "bg-white text-[#1B3B48] border border-[#E2DFD7] hover:bg-[#EFECE6]"
                                  }`}
                                >
                                  <span>👍 Thích</span>
                                  <span className="px-1.5 py-0.2 rounded-full bg-black/10 text-[11px]">
                                    {(post.likes || []).length}
                                  </span>
                                </button>

                                <button
                                  type="button"
                                  onClick={() =>
                                    handleTogglePostReaction(post.id, "loves")
                                  }
                                  className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition ${
                                    loved
                                      ? "bg-rose-600 text-white"
                                      : "bg-white text-[#1B3B48] border border-[#E2DFD7] hover:bg-[#EFECE6]"
                                  }`}
                                >
                                  <span>❤️ Yêu Hóa học</span>
                                  <span className="px-1.5 py-0.2 rounded-full bg-black/10 text-[11px]">
                                    {(post.loves || []).length}
                                  </span>
                                </button>

                                <button
                                  type="button"
                                  onClick={() =>
                                    handleTogglePostReaction(post.id, "ideas")
                                  }
                                  className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition ${
                                    ideaed
                                      ? "bg-amber-500 text-[#1B3B48]"
                                      : "bg-white text-[#1B3B48] border border-[#E2DFD7] hover:bg-[#EFECE6]"
                                  }`}
                                >
                                  <span>💡 Phát hiện hay</span>
                                  <span className="px-1.5 py-0.2 rounded-full bg-black/10 text-[11px]">
                                    {(post.ideas || []).length}
                                  </span>
                                </button>
                              </div>

                              <span className="text-[#5C7667] font-bold">
                                💬 {(post.comments || []).length} bình luận đáp án & giải đáp
                              </span>
                            </div>

                            {/* Khu vực Danh sách Bình luận & Ô nhập Bình luận kiểu Facebook */}
                            <div className="p-5 bg-[#F7F6F2]/50 space-y-3">
                              {(post.comments || []).length > 0 && (
                                <div className="space-y-2.5">
                                  {(post.comments || []).map((cmt) => (
                                    <div
                                      key={cmt.id}
                                      className={`p-3.5 rounded-2xl border text-xs space-y-1.5 ${
                                        cmt.isApprovedCorrect
                                          ? "bg-emerald-50 border-emerald-400 shadow-sm"
                                          : cmt.authorRole === "teacher"
                                          ? "bg-amber-50/70 border-[#E9C46A]"
                                          : "bg-white border-[#E2DFD7]"
                                      }`}
                                    >
                                      <div className="flex flex-wrap items-center justify-between gap-2">
                                        <div className="flex flex-wrap items-center gap-1.5">
                                          <span className="font-extrabold text-[#1B3B48]">
                                            {cmt.authorRole === "teacher"
                                              ? `👨‍🏫 ${cmt.authorName}`
                                              : `👤 ${cmt.authorName} (Lớp ${cmt.authorClass})`}
                                          </span>
                                          {cmt.authorRole === "student" && (
                                            <span className="px-2 py-0.5 rounded-full bg-[#1B3B48] text-[#E9C46A] text-[10px] font-bold">
                                              +{cmt.awardedPoints || 1} điểm tương tác
                                            </span>
                                          )}
                                          {cmt.isApprovedCorrect && (
                                            <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-extrabold">
                                              🌟 Đáp án đúng / Lời giải xuất sắc
                                            </span>
                                          )}
                                        </div>

                                        <div className="flex items-center gap-2">
                                          <span className="text-[10px] text-[#5C7667]">
                                            {cmt.createdAt}
                                          </span>
                                          {currentUser.role === "teacher" &&
                                            cmt.authorRole === "student" && (
                                              <button
                                                type="button"
                                                onClick={() =>
                                                  handleApproveCommentAnswer(
                                                    post,
                                                    cmt
                                                  )
                                                }
                                                className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold transition ${
                                                  cmt.isApprovedCorrect
                                                    ? "bg-gray-200 text-[#1B3B48]"
                                                    : "bg-emerald-600 hover:bg-emerald-700 text-white"
                                                }`}
                                              >
                                                {cmt.isApprovedCorrect
                                                  ? "✓ Đã thưởng điểm"
                                                  : `⭐ Duyệt Đúng (+${post.rewardPoints} điểm)`}
                                              </button>
                                            )}
                                        </div>
                                      </div>

                                      {cmt.text && (
                                        <p className="text-[#1B3B48] whitespace-pre-line leading-relaxed">
                                          {cmt.text}
                                        </p>
                                      )}

                                      {cmt.attachmentDataUrl && (
                                        <div className="pt-1">
                                          {cmt.attachmentType === "image" ? (
                                            <img
                                              src={cmt.attachmentDataUrl}
                                              alt="Ảnh lời giải"
                                              className="max-h-52 rounded-xl border border-[#E2DFD7]"
                                            />
                                          ) : (
                                            <a
                                              href={cmt.attachmentDataUrl}
                                              download={
                                                cmt.attachmentName || "loigiai"
                                              }
                                              className="inline-block px-3 py-1 rounded bg-[#5C7667] text-white text-[11px] font-bold"
                                            >
                                              📎 Tải tệp lời giải (
                                              {cmt.attachmentName})
                                            </a>
                                          )}
                                        </div>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              )}

                              {/* Form viết bình luận đáp án / lời giải */}
                              <form
                                onSubmit={(e) => handleAddPostComment(e, post)}
                                className="space-y-2 pt-1"
                              >
                                {currentUser.role === "teacher" &&
                                  appData.students.length > 0 && (
                                    <div className="flex items-center gap-2 text-[11px]">
                                      <span className="font-bold text-[#5C7667]">
                                        Bình luận với tư cách:
                                      </span>
                                      <select
                                        value={draftObj.asStudentId || ""}
                                        onChange={(e) =>
                                          setCommentDrafts({
                                            ...commentDrafts,
                                            [post.id]: {
                                              ...draftObj,
                                              asStudentId: e.target.value,
                                            },
                                          })
                                        }
                                        className="px-2 py-1 rounded-lg border bg-white font-bold text-[#1B3B48]"
                                      >
                                        <option value="">
                                          👨‍🏫 Giáo viên ({TEACHER_INFO.fullName})
                                        </option>
                                        {appData.students.map((st) => (
                                          <option key={st.id} value={st.id}>
                                            👤 Học sinh: {st.name} (Lớp{" "}
                                            {st.classId})
                                          </option>
                                        ))}
                                      </select>
                                    </div>
                                  )}

                                <div className="flex flex-col sm:flex-row gap-2">
                                  <input
                                    type="text"
                                    value={draftObj.text || ""}
                                    onChange={(e) =>
                                      setCommentDrafts({
                                        ...commentDrafts,
                                        [post.id]: {
                                          ...draftObj,
                                          text: e.target.value,
                                        },
                                      })
                                    }
                                    placeholder="Viết bình luận đáp án hoặc lời giải của bạn (+1 điểm tương tác)..."
                                    className="flex-1 p-2.5 rounded-xl border border-[#E2DFD7] text-xs bg-white"
                                  />
                                  <button
                                    type="submit"
                                    className="bg-[#1B3B48] hover:bg-[#2C4A3E] text-white px-4 py-2.5 rounded-xl text-xs font-bold shrink-0"
                                  >
                                    Gửi bình luận
                                  </button>
                                </div>

                                <div className="flex items-center justify-between text-[11px] text-[#5C7667]">
                                  <label className="cursor-pointer hover:underline font-semibold flex items-center gap-1">
                                    <span>📷 Đính kèm ảnh chụp nháp/lời giải:</span>
                                    <input
                                      type="file"
                                      accept="image/*,.pdf"
                                      onChange={(e) =>
                                        handleFlexibleFileUpload(e, (res) =>
                                          setCommentAttachments((prev) => ({
                                            ...prev,
                                            [post.id]: res,
                                          }))
                                        )
                                      }
                                      className="text-[10px]"
                                    />
                                  </label>
                                  {attachObj && (
                                    <span className="text-emerald-700 font-bold">
                                      ✓ Đã chọn: {attachObj.fileName}
                                    </span>
                                  )}
                                </div>
                              </form>
                            </div>
                          </article>
                        );
                      })}
                  </div>
                )}
              </div>

              {/* CỘT PHẢI (4 CỘT): BẢNG XẾP HẠNG ĐIỂM TƯƠNG TÁC HÓA HỌC & QUY ĐỔI VÀO HỒ SƠ */}
              <div className="lg:col-span-4 space-y-5">
                <div className="bg-white p-5 rounded-2xl border-2 border-[#E9C46A] shadow-sm space-y-4">
                  <div className="space-y-1 border-b border-[#EFECE6] pb-3">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#1B3B48] text-[#E9C46A] text-[10px] font-extrabold uppercase">
                      🏆 Bảng Xếp Hạng Tương Tác
                    </span>
                    <h3 className="font-extrabold text-base text-[#1B3B48] pt-1">
                      Điểm Tương Tác & Giải Đáp Hóa Học
                    </h3>
                    <p className="text-[11px] text-[#5C7667]">
                      Học sinh bình luận trả lời bài viết (<strong>+1 điểm</strong>), đăng câu hỏi hay (<strong>+2 điểm</strong>) và được Thầy duyệt đáp án đúng (<strong>+Điểm thưởng</strong>).
                    </p>
                  </div>

                  {appData.students.length === 0 ? (
                    <p className="text-xs text-[#5C7667] italic text-center py-4">
                      Chưa có học sinh nào trong lớp. Hãy thêm học sinh ở Mục 09 để tính điểm tương tác.
                    </p>
                  ) : (
                    <div className="space-y-2.5 max-h-[520px] overflow-y-auto pr-1">
                      {[...appData.students]
                        .sort(
                          (a, b) =>
                            Number(b.engagementPoints || 0) -
                            Number(a.engagementPoints || 0)
                        )
                        .map((st, i) => {
                          const pts = Number(st.engagementPoints || 0);
                          return (
                            <div
                              key={st.id}
                              className="p-3 rounded-xl bg-[#F7F6F2] border border-[#E2DFD7] flex items-center justify-between gap-2 text-xs"
                            >
                              <div className="flex items-center gap-2.5 min-w-0">
                                <span
                                  className={`w-6 h-6 rounded-full flex items-center justify-center font-black text-[11px] shrink-0 ${
                                    i === 0
                                      ? "bg-[#E9C46A] text-[#1B3B48]"
                                      : i === 1
                                      ? "bg-[#2C4A3E] text-white"
                                      : "bg-white border text-[#1B3B48]"
                                  }`}
                                >
                                  {i + 1}
                                </span>
                                <div className="min-w-0">
                                  <div className="font-bold text-[#1B3B48] truncate">
                                    {st.name}
                                  </div>
                                  <div className="text-[10px] text-[#5C7667]">
                                    Lớp {st.classId} •{" "}
                                    <strong className="text-[#2C4A3E]">
                                      ⭐ {pts} điểm tương tác
                                    </strong>
                                  </div>
                                </div>
                              </div>

                              {currentUser.role === "teacher" && (
                                <div className="flex items-center gap-1 shrink-0">
                                  <button
                                    type="button"
                                    onClick={() =>
                                      adjustStudentEngagementPoints(st.id, 1)
                                    }
                                    className="px-2 py-1 rounded bg-[#EFECE6] hover:bg-[#E2DFD7] text-[#1B3B48] font-bold text-[10px]"
                                    title="Cộng nhanh 1 điểm tương tác"
                                  >
                                    +1
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleConvertEngagementToProfileScore(st)
                                    }
                                    className="px-2 py-1 rounded bg-[#1B3B48] text-[#E9C46A] font-bold text-[10px]"
                                    title="Nhập điểm thưởng tương tác vào Hồ sơ học tập Mục 04"
                                  >
                                    Nhập Hồ sơ
                                  </button>
                                </div>
                              )}
                            </div>
                          );
                        })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ===================================================================
            MỤC 09: QUẢN TRỊ LỚP HỌC, NĂM HỌC, ĐÍNH KÈM TÀI LIỆU LỚP, ĐIỂM DANH, EXCEL
        =================================================================== */}
        {activeView === "students_admin" && currentUser.role === "teacher" && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-[#E2DFD7] flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase text-[#5C7667]">
                  Mục 09 • Độc quyền Giáo viên ({TEACHER_INFO.email})
                </span>
                <h2 className="text-2xl font-bold text-[#1B3B48]">
                  Quản lý Năm học, Lớp học (Đính kèm Tài liệu hôm nay), Điểm danh & Nhập Excel
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowYearManagerModal(true)}
                  className="px-4 py-2 rounded-xl bg-[#1B3B48] text-[#E9C46A] text-xs font-bold"
                >
                  📅 Quản lý Năm học
                </button>
                <button
                  onClick={handleExportCSV}
                  className="px-4 py-2 rounded-xl bg-[#2C4A3E] text-white text-xs font-bold"
                >
                  ⬇ Xuất Danh sách & Điểm ra Excel (.CSV)
                </button>
                <button
                  onClick={goBack}
                  className="px-4 py-2 rounded-xl bg-[#EFECE6] text-[#1B3B48] text-xs font-bold hover:bg-[#E2DFD7]"
                >
                  ← Quay lại trang trước
                </button>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border-2 border-[#1B3B48] space-y-5">
              <h3 className="font-bold text-base text-[#1B3B48]">
                1. Tạo Lớp học mới theo Năm học & Danh sách Lớp ({yearFilteredClasses.length} lớp)
              </h3>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!newClassForm.id.trim() || !newClassForm.name.trim())
                    return;
                  const cid = newClassForm.id.trim().toUpperCase();
                  if (appData.classes.some((c) => c.id === cid)) {
                    notify("Mã lớp này đã tồn tại!", "warn");
                    return;
                  }
                  saveToAll({
                    ...appData,
                    classes: [
                      ...appData.classes,
                      {
                        id: cid,
                        isUserCreated: true,
                        name: newClassForm.name.trim(),
                        grade: newClassForm.grade,
                        academicYear:
                          newClassForm.academicYear ||
                          appData.currentAcademicYear ||
                          "2026 - 2027",
                        scheduleSummary:
                          newClassForm.scheduleSummary.trim() ||
                          "Đang cập nhật",
                        todayDocIds: [],
                      },
                    ],
                  });
                  setNewClassForm({
                    id: "",
                    name: "",
                    grade: "10",
                    academicYear:
                      appData.currentAcademicYear || "2026 - 2027",
                    scheduleSummary: "",
                  });
                  notify(`Đã tạo Lớp ${cid}!`, "success");
                }}
                className="grid grid-cols-1 sm:grid-cols-6 gap-3"
              >
                <input
                  type="text"
                  required
                  value={newClassForm.id}
                  onChange={(e) =>
                    setNewClassForm({ ...newClassForm, id: e.target.value })
                  }
                  placeholder="Mã lớp (VD: 12TA1_ĐH)"
                  className="p-2.5 rounded-xl border text-xs"
                />
                <input
                  type="text"
                  required
                  value={newClassForm.name}
                  onChange={(e) =>
                    setNewClassForm({ ...newClassForm, name: e.target.value })
                  }
                  placeholder="Tên lớp (VD: Luyện thi Đại Học)"
                  className="p-2.5 rounded-xl border text-xs"
                />
                <select
                  value={newClassForm.grade}
                  onChange={(e) =>
                    setNewClassForm({ ...newClassForm, grade: e.target.value })
                  }
                  className="p-2.5 rounded-xl border text-xs bg-white font-bold"
                >
                  <option value="10">Khối 10</option>
                  <option value="11">Khối 11</option>
                  <option value="12">Khối 12</option>
                </select>
                <select
                  value={newClassForm.academicYear}
                  onChange={(e) =>
                    setNewClassForm({
                      ...newClassForm,
                      academicYear: e.target.value,
                    })
                  }
                  className="p-2.5 rounded-xl border text-xs bg-white font-bold"
                >
                  {(appData.academicYears || DEFAULT_ACADEMIC_YEARS).map(
                    (y) => (
                      <option key={y} value={y}>
                        Năm học {y}
                      </option>
                    )
                  )}
                </select>
                <input
                  type="text"
                  value={newClassForm.scheduleSummary}
                  onChange={(e) =>
                    setNewClassForm({
                      ...newClassForm,
                      scheduleSummary: e.target.value,
                    })
                  }
                  placeholder="Ca học (VD: 21:00 - 22:00)"
                  className="p-2.5 rounded-xl border text-xs"
                />
                <button
                  type="submit"
                  className="bg-[#1B3B48] text-white rounded-xl text-xs font-bold px-4 py-2.5"
                >
                  + Tạo Lớp Mới
                </button>
              </form>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
                {yearFilteredClasses.map((cls) => {
                  const classStudentCount = getStudentsOfClass(cls.id).length;
                  const todayMaterials = getTodayMaterialsForClass(cls);

                  return (
                    <div
                      key={cls.id}
                      className="p-4 rounded-2xl bg-[#F7F6F2] border border-[#E2DFD7] flex flex-col justify-between gap-3 shadow-sm"
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="px-2.5 py-1 rounded-lg bg-[#1B3B48] text-white text-xs font-bold">
                            Lớp {cls.id} (Khối {cls.grade})
                          </span>
                          <span className="px-2.5 py-1 rounded-full bg-[#2C4A3E] text-white text-xs font-extrabold">
                            Sĩ số: {classStudentCount} HS
                          </span>
                        </div>
                        <div className="text-[11px] font-bold text-[#5C7667]">
                          📅 Năm học:{" "}
                          {cls.academicYear ||
                            appData.currentAcademicYear ||
                            "2026 - 2027"}
                        </div>
                        <h4 className="font-bold text-base text-[#1B3B48]">
                          {cls.name}
                        </h4>
                        <p className="text-xs text-[#5C7667]">
                          🕒 Lịch học: {cls.scheduleSummary}
                        </p>

                        {/* Đính kèm tài liệu học hôm đó trong lớp */}
                        <div className="p-2.5 rounded-xl bg-white border border-[#E2DFD7] space-y-1 mt-1">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold text-[#1B3B48]">
                              📎 Tài liệu học hôm nay ({todayMaterials.length}):
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                setEditingClassDocsModal({
                                  ...cls,
                                  todayDocIds: cls.todayDocIds || [],
                                  todayCustomDocTitle:
                                    cls.todayCustomDocTitle || "",
                                  todayCustomDocUrl:
                                    cls.todayCustomDocUrl || "",
                                })
                              }
                              className="text-[10px] font-bold text-[#5C7667] underline"
                            >
                              + Đính kèm TL
                            </button>
                          </div>
                          {todayMaterials.map((m) => (
                            <div
                              key={m.id}
                              className="text-[11px] text-[#2C4A3E] font-semibold truncate"
                            >
                              • {m.title}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-[#E2DFD7]">
                        <button
                          onClick={() => openQuickAttendance(cls)}
                          className="bg-[#5C7667] hover:bg-[#4A6154] text-white px-3 py-1.5 rounded-lg text-xs font-bold"
                        >
                          ✓ Điểm danh & TL buổi học
                        </button>
                        <button
                          onClick={() => handleDeleteClass(cls)}
                          className="bg-red-50 border border-red-200 text-red-700 hover:bg-red-100 px-2.5 py-1.5 rounded-lg text-xs font-bold"
                        >
                          Xóa lớp
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <form
                onSubmit={handleBulkExcelImport}
                className="bg-white p-6 rounded-2xl border border-[#E2DFD7] space-y-3"
              >
                <h3 className="font-bold text-base text-[#1B3B48]">
                  2. Tạo Tài khoản Hàng loạt từ Excel (Gán vào Năm học đang chọn)
                </h3>
                <textarea
                  rows={5}
                  required
                  value={excelBulkText}
                  onChange={(e) => setExcelBulkText(e.target.value)}
                  placeholder={
                    "Nguyễn Minh Khôi\t10A1\tkhoi.nm@gmail.com\t123456\tĐH Y Dược TP.HCM"
                  }
                  className="w-full p-3 rounded-xl border text-xs font-mono"
                />
                <button
                  type="submit"
                  className="w-full bg-[#1B3B48] text-white py-2.5 rounded-xl text-xs font-bold"
                >
                  Tạo Tài khoản Hàng loạt
                </button>
              </form>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!singleStudent.name.trim()) return;

                  // Xác định Mã lớp chuẩn xác từ danh sách lớp hiện tại hoặc mã lớp người dùng nhập
                  const rawTargetClass = (
                    singleStudent.classId ||
                    appData.classes[0]?.id ||
                    ""
                  )
                    .trim()
                    .toUpperCase();

                  if (!rawTargetClass) {
                    notify(
                      "Bạn chưa có lớp học nào! Hãy tạo ít nhất 1 Lớp học ở mục 1 phía trên trước khi thêm học sinh.",
                      "warn"
                    );
                    return;
                  }

                  let nextClasses = [...(appData.classes || [])];
                  let clsObj = nextClasses.find((c) =>
                    isSameClass(c.id, rawTargetClass)
                  );
                  const activeYear =
                    selectedAcademicYear === "ALL"
                      ? appData.currentAcademicYear || "2026 - 2027"
                      : selectedAcademicYear;

                  // Nếu mã lớp chưa tồn tại trong danh sách lớp thì tự động khởi tạo lớp đó luôn để sĩ số luôn khớp 100%
                  if (!clsObj) {
                    let detectedGrade = "12";
                    if (rawTargetClass.startsWith("10")) detectedGrade = "10";
                    else if (rawTargetClass.startsWith("11"))
                      detectedGrade = "11";
                    clsObj = {
                      id: rawTargetClass,
                      isUserCreated: true,
                      name: `Lớp Hóa ${rawTargetClass}`,
                      grade: detectedGrade,
                      academicYear: activeYear,
                      scheduleSummary: "Theo Thời khóa biểu",
                      todayDocIds: [],
                    };
                    nextClasses.push(clsObj);
                  }

                  const canonicalClassId = clsObj.id;
                  const gradeStr = clsObj.grade || "12";
                  const generatedEmail =
                    singleStudent.email.trim() ||
                    `${singleStudent.name
                      .trim()
                      .toLowerCase()
                      .replace(/\s+/g, "")}@gmail.com`;

                  const newSt = {
                    id:
                      "HS" +
                      Date.now().toString().slice(-4) +
                      Math.floor(10 + Math.random() * 89),
                    name: singleStudent.name.trim(),
                    classId: canonicalClassId,
                    grade: gradeStr,
                    academicYear: clsObj.academicYear || activeYear,
                    email: generatedEmail,
                    password: singleStudent.password.trim() || "123456",
                    targetScore: singleStudent.targetScore || "8.5+",
                    universityGoal: singleStudent.universityGoal.trim(),
                    personalAchievements: "",
                    score: 0,
                    attendanceRate: 100,
                    attendanceNote: "Đi học đầy đủ",
                    attitude: "Tập trung chú ý bài giảng",
                    teacherComment: "Đã khởi tạo hồ sơ học tập trực tuyến.",
                    roadmapProgress: createDefaultRoadmap(gradeStr),
                    inClassTests: [],
                    scoreHistory: [],
                    attendanceHistory: [],
                  };

                  const nextStudents = [...(appData.students || []), newSt];
                  saveToAll({
                    ...appData,
                    classes: nextClasses,
                    students: nextStudents,
                  });
                  setSelectedStudentId(newSt.id);
                  setSingleStudent({
                    name: "",
                    classId: canonicalClassId,
                    email: "",
                    password: "",
                    targetScore: "8.5+",
                    universityGoal: "",
                  });
                  const updatedCount = getStudentsOfClass(
                    canonicalClassId,
                    nextStudents
                  ).length;
                  notify(
                    `✅ Đã thêm HS ${newSt.name} vào Lớp ${canonicalClassId}! Sĩ số Lớp ${canonicalClassId} hiện tại: ${updatedCount} học sinh.`,
                    "success"
                  );
                }}
                className="bg-white p-6 rounded-2xl border border-[#E2DFD7] space-y-3"
              >
                <h3 className="font-bold text-base text-[#1B3B48]">
                  3. Thêm Từng Học sinh vào Lớp (Tự động cập nhật Sĩ số & Hồ sơ)
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    required
                    value={singleStudent.name}
                    onChange={(e) =>
                      setSingleStudent({
                        ...singleStudent,
                        name: e.target.value,
                      })
                    }
                    placeholder="Họ và tên học sinh..."
                    className="p-2.5 rounded-xl border text-xs"
                  />

                  {appData.classes.length > 0 ? (
                    <select
                      value={
                        appData.classes.some((c) =>
                          isSameClass(c.id, singleStudent.classId)
                        )
                          ? singleStudent.classId
                          : appData.classes[0]?.id || ""
                      }
                      onChange={(e) =>
                        setSingleStudent({
                          ...singleStudent,
                          classId: e.target.value,
                        })
                      }
                      className="p-2.5 rounded-xl border-2 border-[#1B3B48] text-xs bg-[#F7F6F2] font-bold text-[#1B3B48]"
                    >
                      {appData.classes.map((c) => (
                        <option key={c.id} value={c.id}>
                          Chọn Lớp: {c.id} ({c.name} • Sĩ số:{" "}
                          {getStudentsOfClass(c.id).length} HS)
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      required
                      value={singleStudent.classId}
                      onChange={(e) =>
                        setSingleStudent({
                          ...singleStudent,
                          classId: e.target.value.toUpperCase(),
                        })
                      }
                      placeholder="Nhập Mã lớp (VD: 10A1, 12A1)..."
                      className="p-2.5 rounded-xl border-2 border-[#9C6644] text-xs font-bold"
                    />
                  )}

                  <input
                    type="email"
                    value={singleStudent.email}
                    onChange={(e) =>
                      setSingleStudent({
                        ...singleStudent,
                        email: e.target.value,
                      })
                    }
                    placeholder="Email đăng nhập (Có thể để trống hệ thống tự tạo)"
                    className="p-2.5 rounded-xl border text-xs"
                  />
                  <input
                    type="text"
                    value={singleStudent.password}
                    onChange={(e) =>
                      setSingleStudent({
                        ...singleStudent,
                        password: e.target.value,
                      })
                    }
                    placeholder="Mật khẩu (Mặc định: 123456)"
                    className="p-2.5 rounded-xl border text-xs"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-[#5C7667] hover:bg-[#2C4A3E] text-white py-2.5 rounded-xl text-xs font-bold transition shadow-sm"
                >
                  + Thêm Học sinh vào Lớp
                </button>
              </form>
            </div>

            {/* ===================================================================
                Ô XEM DANH SÁCH HỌC SINH CÁC LỚP ĐÃ CẬP NHẬT (SĨ SỐ, ĐỔI LỚP, XÓA HS)
            =================================================================== */}
            <div className="bg-white p-6 rounded-2xl border-2 border-[#1B3B48] space-y-4 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#EFECE6] pb-4">
                <div>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#1B3B48] text-[#E9C46A] text-xs font-extrabold uppercase">
                    👥 Danh sách Học sinh đã cập nhật
                  </span>
                  <h3 className="font-extrabold text-lg text-[#1B3B48] mt-1">
                    4. Bảng Danh Sách Học Sinh Theo Từng Lớp ({appData.students.length} Học sinh)
                  </h3>
                  <p className="text-xs text-[#5C7667]">
                    Xem chi tiết danh sách học sinh của từng lớp, kiểm tra tài khoản/mật khẩu, đổi lớp nhanh hoặc mở hồ sơ học tập.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <input
                    type="text"
                    value={rosterSearchQuery}
                    onChange={(e) => setRosterSearchQuery(e.target.value)}
                    placeholder="🔍 Tìm tên, mã HS hoặc email..."
                    className="p-2 rounded-xl border text-xs bg-[#F7F6F2] w-52"
                  />
                </div>
              </div>

              {/* Thanh chọn Lớp kèm Sĩ số trực tiếp */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setRosterFilterClass("ALL")}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                    rosterFilterClass === "ALL"
                      ? "bg-[#1B3B48] text-[#E9C46A]"
                      : "bg-[#EFECE6] text-[#1B3B48] hover:bg-[#E2DFD7]"
                  }`}
                >
                  Tất cả các lớp ({appData.students.length} HS)
                </button>
                {appData.classes.map((cls) => {
                  const cnt = getStudentsOfClass(cls.id).length;
                  return (
                    <button
                      key={cls.id}
                      type="button"
                      onClick={() => setRosterFilterClass(cls.id)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                        isSameClass(rosterFilterClass, cls.id)
                          ? "bg-[#1B3B48] text-[#E9C46A]"
                          : "bg-[#EFECE6] text-[#1B3B48] hover:bg-[#E2DFD7]"
                      }`}
                    >
                      Lớp {cls.id} — Sĩ số: {cnt} HS
                    </button>
                  );
                })}
              </div>

              {appData.students.length === 0 ? (
                <div className="p-8 rounded-2xl bg-[#F7F6F2] border border-dashed border-[#DFDBD0] text-center text-xs text-[#5C7667]">
                  Chưa có học sinh nào trong hệ thống. Bạn hãy thêm học sinh ở mục 2 hoặc mục 3 phía trên để danh sách tự động hiển thị tại đây.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-[#1B3B48] text-white">
                        <th className="p-3 border">STT</th>
                        <th className="p-3 border">Mã HS</th>
                        <th className="p-3 border">Họ và tên Học sinh</th>
                        <th className="p-3 border">Lớp học (Đổi lớp)</th>
                        <th className="p-3 border">Năm học</th>
                        <th className="p-3 border">Tài khoản Email</th>
                        <th className="p-3 border">Mật khẩu</th>
                        <th className="p-3 border">Điểm TB / Chuyên cần</th>
                        <th className="p-3 border text-center">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E2DFD7]">
                      {appData.students
                        .filter((st) => {
                          if (
                            rosterFilterClass !== "ALL" &&
                            !isSameClass(st.classId, rosterFilterClass)
                          ) {
                            return false;
                          }
                          if (rosterSearchQuery.trim()) {
                            const q = rosterSearchQuery.trim().toLowerCase();
                            const matchName = (st.name || "")
                              .toLowerCase()
                              .includes(q);
                            const matchId = (st.id || "")
                              .toLowerCase()
                              .includes(q);
                            const matchEmail = (st.email || "")
                              .toLowerCase()
                              .includes(q);
                            return matchName || matchId || matchEmail;
                          }
                          return true;
                        })
                        .map((st, idx) => {
                          const subCount = (
                            appData.homeworkSubmissions || []
                          ).filter((sub) => sub.studentId === st.id).length;

                          return (
                            <tr
                              key={st.id}
                              className="hover:bg-[#F7F6F2] transition"
                            >
                              <td className="p-3 border font-bold text-[#5C7667]">
                                {idx + 1}
                              </td>
                              <td className="p-3 border font-mono font-bold text-[#1B3B48]">
                                {st.id}
                              </td>
                              <td className="p-3 border font-extrabold text-[#1B3B48]">
                                {st.name}
                              </td>
                              <td className="p-3 border">
                                <select
                                  value={st.classId}
                                  onChange={(e) => {
                                    const newClsId = e.target.value;
                                    const targetCls = appData.classes.find(
                                      (c) => isSameClass(c.id, newClsId)
                                    );
                                    updateStudentField(st.id, {
                                      classId: newClsId,
                                      grade: targetCls?.grade || st.grade,
                                    });
                                    notify(
                                      `Đã chuyển HS ${st.name} sang Lớp ${newClsId}!`,
                                      "success"
                                    );
                                  }}
                                  className="px-2 py-1 rounded-lg border bg-[#F7F6F2] font-bold text-[#1B3B48]"
                                >
                                  {!appData.classes.some((c) =>
                                    isSameClass(c.id, st.classId)
                                  ) && (
                                    <option value={st.classId}>
                                      Lớp {st.classId}
                                    </option>
                                  )}
                                  {appData.classes.map((c) => (
                                    <option key={c.id} value={c.id}>
                                      Lớp {c.id}
                                    </option>
                                  ))}
                                </select>
                              </td>
                              <td className="p-3 border font-semibold text-[#5C7667]">
                                {st.academicYear ||
                                  appData.currentAcademicYear ||
                                  "2026 - 2027"}
                              </td>
                              <td className="p-3 border font-mono text-[#1B3B48]">
                                {st.email}
                              </td>
                              <td className="p-3 border font-mono font-bold text-[#2C4A3E]">
                                {st.password}
                              </td>
                              <td className="p-3 border">
                                <div className="font-bold text-[#1B3B48]">
                                  ĐTB: {st.score}/10 • CC: {st.attendanceRate}%
                                </div>
                                <div className="text-[11px] text-[#5C7667]">
                                  Đã nộp: {subCount} BTVN
                                </div>
                              </td>
                              <td className="p-3 border text-center">
                                <div className="flex items-center justify-center gap-1.5">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setSelectedStudentId(st.id);
                                      navigateTo("progress");
                                    }}
                                    className="px-2.5 py-1 rounded-lg bg-[#1B3B48] text-white font-bold"
                                  >
                                    Hồ sơ & Điểm
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      askConfirm(
                                        `Bạn có chắc muốn xóa học sinh ${st.name} (${st.id}) khỏi Lớp ${st.classId}?`,
                                        () => {
                                          saveToAll({
                                            ...appData,
                                            students: appData.students.filter(
                                              (x) => x.id !== st.id
                                            ),
                                          });
                                          notify(
                                            `Đã xóa học sinh ${st.name}.`,
                                            "info"
                                          );
                                        }
                                      )
                                    }
                                    className="px-2 py-1 rounded-lg bg-red-50 text-red-600 border border-red-200 font-bold"
                                  >
                                    Xóa
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* MODAL QUẢN LÝ NĂM HỌC */}
      {showYearManagerModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-xl border border-[#E2DFD7]">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="font-bold text-base text-[#1B3B48]">
                  📅 Quản lý Danh mục Năm học
                </h3>
                <p className="text-xs text-[#5C7667]">
                  Phân chia lớp học, học sinh, tài liệu, bản tin và thành tích theo từng năm học.
                </p>
              </div>
              <button
                onClick={() => setShowYearManagerModal(false)}
                className="text-xs font-bold text-[#5C7667]"
              >
                ✕ Đóng
              </button>
            </div>

            <form onSubmit={handleAddAcademicYear} className="flex gap-2">
              <input
                type="text"
                required
                value={newYearInput}
                onChange={(e) => setNewYearInput(e.target.value)}
                placeholder="Nhập năm học mới (VD: 2027 - 2028)"
                className="flex-1 p-2.5 rounded-xl border text-xs"
              />
              <button
                type="submit"
                className="bg-[#1B3B48] text-white px-4 py-2.5 rounded-xl text-xs font-bold"
              >
                + Thêm Năm Học
              </button>
            </form>

            <div className="space-y-2 max-h-60 overflow-y-auto">
              {(appData.academicYears || DEFAULT_ACADEMIC_YEARS).map((y) => {
                const isCurrent = appData.currentAcademicYear === y;
                return (
                  <div
                    key={y}
                    className="p-3 rounded-xl bg-[#F7F6F2] border border-[#E2DFD7] flex items-center justify-between text-xs"
                  >
                    <div className="font-bold text-[#1B3B48] flex items-center gap-2">
                      <span>Năm học {y}</span>
                      {isCurrent && (
                        <span className="px-2 py-0.5 rounded bg-[#2C4A3E] text-white text-[10px]">
                          Mặc định hiện tại
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {!isCurrent && (
                        <button
                          type="button"
                          onClick={() => handleSetDefaultAcademicYear(y)}
                          className="text-[#1B3B48] font-bold hover:underline"
                        >
                          Đặt làm mặc định
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedAcademicYear(y);
                          setShowYearManagerModal(false);
                        }}
                        className="px-2.5 py-1 rounded bg-[#1B3B48] text-white font-bold"
                      >
                        Chọn xem
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* MODAL ĐÍNH KÈM TÀI LIỆU HỌC HÔM NAY CHO LỚP HỌC */}
      {editingClassDocsModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <form
            onSubmit={handleSaveClassTodayMaterials}
            className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-xl border border-[#E2DFD7]"
          >
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="font-bold text-base text-[#1B3B48]">
                  📎 Đính kèm Tài liệu học hôm nay — Lớp {editingClassDocsModal.id}
                </h3>
                <p className="text-xs text-[#5C7667]">
                  Học sinh và Phụ huynh trong lớp sẽ thấy ngay tài liệu học hôm đó.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEditingClassDocsModal(null)}
                className="text-xs font-bold text-[#5C7667]"
              >
                ✕ Đóng
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <label className="block font-bold text-[#1B3B48]">
                1. Chọn các tài liệu đã tải lên trong Kho tài liệu của Lớp/Chương:
              </label>
              <div className="max-h-40 overflow-y-auto space-y-1.5 p-2.5 rounded-xl bg-[#F7F6F2] border">
                {(appData.documents || []).length === 0 ? (
                  <p className="text-[#5C7667] italic">
                    Kho tài liệu hiện đang trống.
                  </p>
                ) : (
                  (appData.documents || []).map((d) => {
                    const checked = (
                      editingClassDocsModal.todayDocIds || []
                    ).includes(d.id);
                    return (
                      <label
                        key={d.id}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={(e) => {
                            const prev =
                              editingClassDocsModal.todayDocIds || [];
                            const next = e.target.checked
                              ? [...prev, d.id]
                              : prev.filter((x) => x !== d.id);
                            setEditingClassDocsModal({
                              ...editingClassDocsModal,
                              todayDocIds: next,
                            });
                          }}
                        />
                        <span className="font-semibold">
                          [{d.classId}] {d.title} ({d.chapterTitle})
                        </span>
                      </label>
                    );
                  })
                )}
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <label className="block font-bold text-[#1B3B48]">
                2. Hoặc ghi nhanh tài liệu / link bài học hôm nay:
              </label>
              <input
                type="text"
                value={editingClassDocsModal.todayCustomDocTitle || ""}
                onChange={(e) =>
                  setEditingClassDocsModal({
                    ...editingClassDocsModal,
                    todayCustomDocTitle: e.target.value,
                  })
                }
                placeholder="Tên tài liệu hôm nay (VD: Phiếu bài tập tốc độ phản ứng)..."
                className="w-full p-2.5 rounded-xl border"
              />
              <input
                type="text"
                value={editingClassDocsModal.todayCustomDocUrl || ""}
                onChange={(e) =>
                  setEditingClassDocsModal({
                    ...editingClassDocsModal,
                    todayCustomDocUrl: e.target.value,
                  })
                }
                placeholder="Link tài liệu (Google Drive / PDF)..."
                className="w-full p-2.5 rounded-xl border"
              />
              <input
                type="file"
                onChange={(e) =>
                  handleFlexibleFileUpload(e, (res) =>
                    setEditingClassDocsModal((prev) => ({
                      ...prev,
                      todayCustomDocTitle:
                        prev.todayCustomDocTitle || res.fileName,
                      todayCustomDocFileName: res.fileName,
                      todayCustomDocDataUrl: res.dataUrl,
                    }))
                  )
                }
                className="text-xs"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEditingClassDocsModal(null)}
                className="px-4 py-2 rounded-xl bg-gray-100 text-xs font-bold"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-[#1B3B48] text-white text-xs font-bold"
              >
                Lưu Tài Liệu Học Hôm Nay
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL ĐIỂM DANH NHANH & ĐÍNH KÈM TÀI LIỆU BUỔI HỌC HÔM ĐÓ */}
      {attendanceModalClass && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <form
            onSubmit={handleSaveAttendanceSession}
            className="bg-white rounded-2xl max-w-3xl w-full p-6 space-y-4 shadow-xl max-h-[90vh] flex flex-col"
          >
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-lg text-[#1B3B48]">
                ✓ Điểm danh & Tài liệu Buổi học hôm nay — Lớp {attendanceModalClass.id}
              </h3>
              <button
                type="button"
                onClick={() => setAttendanceModalClass(null)}
                className="text-xs font-bold text-[#5C7667]"
              >
                ✕ Đóng
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
              <input
                type="text"
                required
                value={sessionTopic}
                onChange={(e) => setSessionTopic(e.target.value)}
                placeholder="Chủ đề buổi học hôm nay..."
                className="p-2.5 rounded-xl border"
              />
              <select
                value={sessionDocId}
                onChange={(e) => setSessionDocId(e.target.value)}
                className="p-2.5 rounded-xl border bg-white font-semibold"
              >
                <option value="">-- Đính kèm TL từ Kho tài liệu --</option>
                {(appData.documents || []).map((d) => (
                  <option key={d.id} value={d.id}>
                    [{d.classId}] {d.title}
                  </option>
                ))}
              </select>
              <input
                type="text"
                value={sessionCustomDocTitle}
                onChange={(e) => setSessionCustomDocTitle(e.target.value)}
                placeholder="Hoặc ghi tên tài liệu buổi học hôm nay..."
                className="p-2.5 rounded-xl border"
              />
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              {appData.students
                .filter((s) => s.classId === attendanceModalClass.id)
                .map((st) => {
                  const cur = sessionRecords[st.id] || {
                    status: "PRESENT",
                    attitude: "Chú ý nghe giảng, ghi chép bài đầy đủ",
                  };
                  return (
                    <div
                      key={st.id}
                      className="p-3 rounded-xl bg-[#F7F6F2] border grid grid-cols-1 sm:grid-cols-12 gap-2 items-center text-xs"
                    >
                      <div className="sm:col-span-3 font-bold text-[#1B3B48]">
                        {st.name}
                      </div>
                      <div className="sm:col-span-4">
                        <select
                          value={cur.status}
                          onChange={(e) =>
                            setSessionRecords({
                              ...sessionRecords,
                              [st.id]: { ...cur, status: e.target.value },
                            })
                          }
                          className="w-full p-2 rounded-lg border bg-white font-semibold"
                        >
                          <option value="PRESENT">✅ Có mặt đầy đủ</option>
                          <option value="LATE">🕒 Đi học muộn</option>
                          <option value="EXCUSED">📩 Vắng có phép</option>
                          <option value="ABSENT">❌ Vắng không phép</option>
                        </select>
                      </div>
                      <div className="sm:col-span-5">
                        <input
                          type="text"
                          value={cur.attitude}
                          onChange={(e) =>
                            setSessionRecords({
                              ...sessionRecords,
                              [st.id]: { ...cur, attitude: e.target.value },
                            })
                          }
                          className="w-full p-2 rounded-lg border bg-white"
                        />
                      </div>
                    </div>
                  );
                })}
            </div>
            <div className="flex justify-end gap-2 pt-3 border-t">
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-[#1B3B48] text-white text-xs font-bold"
              >
                Lưu Điểm danh & Tài liệu hôm nay
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL CẤU HÌNH ĐÁM MÂY FIREBASE */}
      {showCloudModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-xl">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-bold text-base text-[#1B3B48]">
                Kết nối Đám mây Firebase Realtime Database
              </h3>
              <button
                onClick={() => setShowCloudModal(false)}
                className="text-xs font-bold"
              >
                ✕ Đóng
              </button>
            </div>
            <input
              type="text"
              value={tempFirebaseInput}
              onChange={(e) => setTempFirebaseInput(e.target.value)}
              placeholder="https://lophoaduonganhtuananh-default-rtdb.asia-southeast1.firebasedatabase.app"
              className="w-full p-2.5 rounded-xl border text-xs font-mono"
            />
            <div className="flex justify-end">
              <button
                onClick={() => {
                  const trimmed = tempFirebaseInput.trim();
                  setFirebaseUrl(trimmed);
                  safeSetStorage("data_nhatha_firebase_url", trimmed);
                  setShowCloudModal(false);
                  if (trimmed) saveToAll(appData);
                }}
                className="bg-[#1B3B48] text-white px-4 py-2 rounded-xl text-xs font-bold"
              >
                Lưu & Đồng bộ ngay
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL XEM TRƯỚC & GỬI EMAIL */}
      {emailPreviewModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 space-y-4 shadow-xl">
            <div className="flex justify-between items-center border-b pb-3">
              <div>
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded bg-[#1B3B48] text-[#E9C46A]">
                  {emailPreviewModal.modeBadge || "Gửi Email"}
                </span>
                <h3 className="font-bold text-base text-[#1B3B48] mt-1">
                  Nội dung Email gửi Phụ huynh & Học sinh
                </h3>
              </div>
              <button
                onClick={() => setEmailPreviewModal(null)}
                className="text-xs font-bold"
              >
                ✕ Đóng
              </button>
            </div>
            <div className="text-xs space-y-2 bg-[#F7F6F2] p-4 rounded-xl border">
              <div>
                <strong>Người nhận:</strong> {emailPreviewModal.to}
              </div>
              <div>
                <strong>Tiêu đề:</strong> {emailPreviewModal.subject}
              </div>
              <pre className="whitespace-pre-wrap font-sans text-xs pt-2 border-t max-h-60 overflow-y-auto">
                {emailPreviewModal.body}
              </pre>
            </div>
            <div className="flex justify-end gap-2">
              <a
                href={emailPreviewModal.mailtoUrl}
                className="bg-[#1B3B48] text-white px-4 py-2 rounded-xl text-xs font-bold"
              >
                Mở ứng dụng Mail để gửi ngay
              </a>
            </div>
          </div>
        </div>
      )}

      {/* MODAL XEM TRỰC TIẾP ẢNH / BÀI LÀM HỌC SINH NỘP */}
      {previewSubmissionModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <span className="px-2.5 py-0.5 rounded bg-[#1B3B48] text-[#E9C46A] text-xs font-bold">
                  Bài nộp của HS: {previewSubmissionModal.studentName} (Lớp{" "}
                  {previewSubmissionModal.classId})
                </span>
                <h3 className="font-bold text-base text-[#1B3B48] mt-1">
                  {previewSubmissionModal.homeworkTitle}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setPreviewSubmissionModal(null)}
                className="text-xs font-bold text-[#5C7667]"
              >
                ✕ Đóng
              </button>
            </div>

            {previewSubmissionModal.studentNote && (
              <div className="p-3 rounded-xl bg-[#F7F6F2] border text-xs">
                <strong>Ghi chú của học sinh:</strong>{" "}
                {previewSubmissionModal.studentNote}
              </div>
            )}

            {previewSubmissionModal.fileDataUrl && (
              <div className="rounded-xl overflow-hidden border border-[#E2DFD7] bg-[#F7F6F2] p-2 flex justify-center">
                <img
                  src={previewSubmissionModal.fileDataUrl}
                  alt={previewSubmissionModal.fileName || "Bài làm học sinh"}
                  className="max-w-full h-auto max-h-[60vh] object-contain rounded-lg"
                />
              </div>
            )}

            <div className="flex justify-end gap-2">
              {previewSubmissionModal.fileDataUrl && (
                <a
                  href={previewSubmissionModal.fileDataUrl}
                  download={previewSubmissionModal.fileName || "bailam_hs"}
                  className="px-4 py-2 rounded-xl bg-[#5C7667] text-white text-xs font-bold"
                >
                  ⬇ Tải tệp về máy
                </a>
              )}
              <button
                type="button"
                onClick={() => setPreviewSubmissionModal(null)}
                className="px-4 py-2 rounded-xl bg-[#1B3B48] text-white text-xs font-bold"
              >
                Đóng cửa sổ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="bg-[#EFECE6] border-t border-[#DFDBD0] py-5 px-4 mt-auto">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[#5C7667]">
          <div>
            <strong className="text-[#1B3B48]">{TEACHER_INFO.fullName}</strong>{" "}
            • {TEACHER_INFO.subNote} • Email: {TEACHER_INFO.email}
          </div>
          <div className="font-semibold text-[#1B3B48]">
            HỆ THỐNG LỚP HỌC HÓA HỌC 10 • 11 • 12 (CTGDPT 2018) • NĂM HỌC{" "}
            {selectedAcademicYear === "ALL"
              ? "TẤT CẢ"
              : selectedAcademicYear}
          </div>
        </div>
      </footer>
    </div>
  );
}