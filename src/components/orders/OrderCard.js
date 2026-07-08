import Link from "next/link";
import OrderStatusPill from "@/components/orders/OrderStatusPill";
import { formatDate, formatINR } from "@/lib/format";

/** One order in the history list. */
export default function OrderCard({ order }) {
  const items = order.items || [];
  const names = items
    .map((it) => it.productName || it.name)
    .filter(Boolean);
  const preview = names.slice(0, 2).join(", ");
  const more = names.length - 2;
  const itemCount = items.reduce((sum, it) => sum + (it.quantity || 1), 0);

  return (
    <Link
      href={`/orders/${order.id}`}
      className="block rounded-xl bg-white p-5 ring-1 ring-ink/10 transition-shadow hover:shadow-md"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-semibold text-ink">
          {order.orderNumber || `Order #${order.id}`}
        </p>
        <OrderStatusPill status={order.orderStatus} />
      </div>

      <p className="mt-1 text-xs text-ink/50">
        Placed {formatDate(order.createdAt)}
        {itemCount > 0 &&
          ` · ${itemCount} item${itemCount === 1 ? "" : "s"}`}
      </p>

      {preview && (
        <p className="mt-2 line-clamp-1 text-sm text-ink/70">
          {preview}
          {more > 0 && <span className="text-ink/40"> +{more} more</span>}
        </p>
      )}

      <div className="mt-3 flex items-baseline justify-between border-t border-ink/5 pt-3">
        <span className="text-sm text-ink/60">
          {order.paymentMethod === "COD" ? "Cash on Delivery" : "Paid online"}
        </span>
        <span className="font-display text-lg text-forest">
          {formatINR(order.totalAmount)}
        </span>
      </div>
    </Link>
  );
}
