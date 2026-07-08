/** Status pills per the design-system order-status pattern. */

export const ORDER_STATUS_META = {
  PENDING_PAYMENT: {
    label: "Pending Payment",
    className: "bg-gold/15 text-gold",
  },
  PLACED: { label: "Placed", className: "bg-forest/10 text-forest" },
  CONFIRMED: { label: "Confirmed", className: "bg-forest/15 text-forest" },
  SHIPPED: { label: "Shipped", className: "bg-gold/15 text-gold" },
  DELIVERED: { label: "Delivered", className: "bg-success/10 text-success" },
  CANCELLED: { label: "Cancelled", className: "bg-vermilion/10 text-vermilion" },
};

export const RETURN_STATUS_META = {
  REQUESTED: { label: "Requested", className: "bg-gold/15 text-gold" },
  APPROVED: { label: "Approved", className: "bg-forest/10 text-forest" },
  REJECTED: { label: "Rejected", className: "bg-vermilion/10 text-vermilion" },
  COMPLETED: { label: "Completed", className: "bg-success/10 text-success" },
};

export default function OrderStatusPill({ status, meta = ORDER_STATUS_META }) {
  const m = meta[status] || { label: status || "—", className: "bg-ink/10 text-ink/70" };
  return (
    <span
      className={`inline-block whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-medium uppercase tracking-wide ${m.className}`}
    >
      {m.label}
    </span>
  );
}
