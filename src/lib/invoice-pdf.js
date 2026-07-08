/**
 * Client-side tax-invoice PDF (jsPDF + autotable).
 * Crisp vector output, brand palette, direct download — no print dialog,
 * no browser headers/footers. Amounts use "Rs." (the built-in PDF fonts
 * have no ₹ glyph; embedding a font isn't worth the bundle weight).
 */

import { formatDate } from "@/lib/format";
import { SUPPORT_EMAIL } from "@/lib/static-content";

const FOREST = [44, 71, 39];
const FOREST_DARK = [30, 46, 24];
const IVORY = [248, 243, 234];
const CREAM = [243, 235, 216];
const GOLD = [173, 134, 59];
const VERMILION = [206, 59, 51];
const INK = [36, 40, 31];
const GRAY = [122, 126, 116];
const SUCCESS = [46, 107, 76];

const nf = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 2 });
const rs = (value) =>
  value == null || Number.isNaN(Number(value))
    ? ""
    : `Rs. ${nf.format(Number(value))}`;

/** The favicon SVG wraps the logo PNG as a data URI — reuse it. */
async function loadLogoDataUri() {
  try {
    const res = await fetch("/icon.svg");
    const svg = await res.text();
    const match = svg.match(/data:image\/png;base64,[A-Za-z0-9+/=]+/);
    return match ? match[0] : null;
  } catch {
    return null;
  }
}

function shippingInfo(order) {
  const a = order.shippingAddress || order.address || null;
  if (a && typeof a === "object") {
    return {
      name: a.fullName || a.name || "",
      phone: a.phone || "",
      lines: [
        a.addressLine1,
        a.addressLine2,
        [a.city, a.state].filter(Boolean).join(", "),
        a.pincode,
      ].filter(Boolean),
    };
  }
  return {
    name: order.shippingFullName || order.customerName || "",
    phone: order.shippingPhone || "",
    lines: [
      order.shippingAddressLine1,
      order.shippingAddressLine2,
      [order.shippingCity, order.shippingState].filter(Boolean).join(", "),
      order.shippingPincode,
    ].filter(Boolean),
  };
}

export async function generateInvoicePdf(order) {
  const jspdfModule = await import("jspdf");
  const JsPDF = jspdfModule.jsPDF || jspdfModule.default;
  const autoTableModule = await import("jspdf-autotable");
  const autoTable = autoTableModule.default || autoTableModule.autoTable;

  const doc = new JsPDF({ unit: "pt", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 48;

  // ================= Header band =================
  doc.setFillColor(...FOREST);
  doc.rect(0, 0, pageW, 118, "F");
  // gold hairline under the band + vermilion dot accent
  doc.setFillColor(...GOLD);
  doc.rect(0, 118, pageW, 2.5, "F");

  const logo = await loadLogoDataUri();
  let brandX = margin;
  if (logo) {
    doc.addImage(logo, "PNG", margin, 31, 56, 56);
    brandX = margin + 70;
  }

  doc.setTextColor(...IVORY);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.text("Kiran Sudha", brandX, 62);
  const brandWidth = doc.getTextWidth("Kiran Sudha");
  doc.setFillColor(...VERMILION);
  doc.circle(brandX + brandWidth + 8, 58, 2.6, "F");

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(226, 220, 202);
  doc.text("India's legacy, worn anew", brandX, 78);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(15);
  doc.setTextColor(...IVORY);
  doc.text("TAX INVOICE", pageW - margin, 58, { align: "right" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(226, 220, 202);
  doc.text("Prices inclusive of GST", pageW - margin, 74, { align: "right" });

  // ================= Meta columns =================
  const colRightX = pageW / 2 + 16;
  let y = 154;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(...GOLD);
  doc.text("INVOICE DETAILS", margin, y);
  doc.text("BILLED & SHIPPED TO", colRightX, y);
  y += 16;

  // Left column
  const metaRows = [
    ["Invoice no.", order.orderNumber || `KS-${order.id}`],
    ["Order date", formatDate(order.createdAt)],
    [
      "Payment",
      `${order.paymentMethod === "COD" ? "Cash on Delivery" : "Paid online"}${
        order.paymentStatus ? ` (${order.paymentStatus})` : ""
      }`,
    ],
  ];
  let leftY = y;
  doc.setFontSize(9.5);
  metaRows.forEach(([label, value]) => {
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...GRAY);
    doc.text(label, margin, leftY);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...INK);
    doc.text(String(value || "—"), margin + 70, leftY);
    leftY += 15;
  });

  // Right column (address)
  const address = shippingInfo(order);
  let rightY = y;
  if (address.name) {
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...INK);
    doc.text(address.name, colRightX, rightY);
    rightY += 15;
  }
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...GRAY);
  address.lines.forEach((line) => {
    const wrapped = doc.splitTextToSize(String(line), pageW - margin - colRightX);
    doc.text(wrapped, colRightX, rightY);
    rightY += wrapped.length * 13;
  });
  if (address.phone) {
    doc.text(`Mobile: ${address.phone}`, colRightX, rightY);
    rightY += 13;
  }

  y = Math.max(leftY, rightY) + 14;

  // ================= Items table =================
  const items = order.items || [];
  const body = items.map((item) => {
    const unit = item.discountPrice ?? item.price ?? 0;
    const line =
      item.totalPrice ?? item.itemTotal ?? unit * (item.quantity || 1);
    return [
      item.productName || item.name || "Item",
      item.size || "-",
      String(item.quantity || 1),
      rs(unit),
      rs(line),
    ];
  });

  autoTable(doc, {
    startY: y,
    margin: { left: margin, right: margin },
    head: [["Item", "Size", "Qty", "Rate", "Amount"]],
    body,
    theme: "plain",
    styles: {
      font: "helvetica",
      fontSize: 9.5,
      textColor: INK,
      cellPadding: { top: 7, bottom: 7, left: 8, right: 8 },
    },
    headStyles: {
      fillColor: FOREST,
      textColor: IVORY,
      fontStyle: "bold",
      fontSize: 8.5,
    },
    alternateRowStyles: { fillColor: IVORY },
    columnStyles: {
      0: { cellWidth: "auto" },
      1: { halign: "center", cellWidth: 50 },
      2: { halign: "right", cellWidth: 40 },
      3: { halign: "right", cellWidth: 90 },
      4: { halign: "right", cellWidth: 95, fontStyle: "bold" },
    },
  });

  // ================= Totals =================
  let ty = (doc.lastAutoTable?.finalY || y) + 22;
  if (ty > pageH - 220) {
    doc.addPage();
    ty = 64;
  }

  const labelX = pageW - margin - 230;
  const valueX = pageW - margin;
  const totalRow = (label, value, opts = {}) => {
    doc.setFont("helvetica", opts.bold ? "bold" : "normal");
    doc.setFontSize(opts.size || 9.5);
    doc.setTextColor(...(opts.labelColor || GRAY));
    doc.text(label, labelX, ty);
    doc.setTextColor(...(opts.valueColor || INK));
    doc.text(value, valueX, ty, { align: "right" });
    ty += opts.gap || 16;
  };

  if (order.subtotal != null) {
    totalRow("Subtotal (incl. GST)", rs(order.subtotal));
  }
  if (Number(order.couponDiscount) > 0) {
    totalRow(
      `Coupon${order.couponCode ? ` (${order.couponCode})` : ""}`,
      `- ${rs(order.couponDiscount)}`,
      { valueColor: SUCCESS }
    );
  }
  if (order.deliveryCharge != null) {
    totalRow(
      "Delivery",
      Number(order.deliveryCharge) === 0 ? "FREE" : rs(order.deliveryCharge),
      Number(order.deliveryCharge) === 0 ? { valueColor: SUCCESS } : {}
    );
  }

  // divider
  doc.setDrawColor(...GOLD);
  doc.setLineWidth(0.8);
  doc.line(labelX, ty - 6, valueX, ty - 6);
  ty += 8;

  totalRow("Grand Total", rs(order.totalAmount), {
    bold: true,
    size: 13,
    labelColor: INK,
    valueColor: FOREST_DARK,
    gap: 15,
  });

  if (order.gst != null && Number(order.gst) > 0) {
    doc.setFont("helvetica", "italic");
    doc.setFontSize(8);
    doc.setTextColor(...GRAY);
    doc.text(`Includes GST of ${rs(order.gst)}`, valueX, ty, {
      align: "right",
    });
  }

  // ================= Footer (every page) =================
  const pages = doc.getNumberOfPages();
  for (let p = 1; p <= pages; p += 1) {
    doc.setPage(p);
    const footY = pageH - 46;
    doc.setDrawColor(...GOLD);
    doc.setLineWidth(0.6);
    doc.line(margin, footY, pageW - margin, footY);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(...GRAY);
    doc.text(
      `Kiran Sudha  ·  ${SUPPORT_EMAIL}  ·  This is a computer-generated invoice and does not require a signature.`,
      pageW / 2,
      footY + 14,
      { align: "center" }
    );
    if (pages > 1) {
      doc.text(`Page ${p} of ${pages}`, pageW - margin, footY + 14, {
        align: "right",
      });
    }
  }

  doc.save(`Invoice-${order.orderNumber || order.id}.pdf`);
}
