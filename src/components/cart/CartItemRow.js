"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";
import { formatINR } from "@/lib/format";

/** One cart line: image, name, size, unit price, qty stepper, remove. */
export default function CartItemRow({ item }) {
  const { updateItem, removeItem } = useCart();
  const toast = useToast();
  const [pending, setPending] = useState(false);

  const name = item.productName || item.name || "Product";
  const slug = item.productSlug || item.slug;
  const image = item.imageUrl || item.productImageUrl || null;
  const unitPrice = item.discountPrice ?? item.price ?? 0;
  const lineTotal = item.totalPrice ?? item.itemTotal ?? unitPrice * (item.quantity || 1);

  async function setQty(quantity) {
    if (quantity < 1 || pending) return;
    setPending(true);
    try {
      await updateItem(item.id, quantity);
    } catch (e) {
      toast.error(e.message || "Could not update quantity.");
    } finally {
      setPending(false);
    }
  }

  async function handleRemove() {
    if (pending) return;
    setPending(true);
    try {
      await removeItem(item.id);
      toast.info(`Removed ${name} from cart`);
    } catch (e) {
      toast.error(e.message || "Could not remove item.");
      setPending(false);
    }
  }

  const stepBtn =
    "flex h-8 w-8 items-center justify-center rounded-full border border-ink/15 text-ink/70 transition-colors hover:border-forest hover:text-forest disabled:cursor-not-allowed disabled:opacity-40";

  const productHref = slug ? `/products/${slug}` : null;

  return (
    <div className={`flex gap-4 py-5 ${pending ? "opacity-60" : ""}`}>
      {/* Image */}
      <div className="relative h-28 w-22 shrink-0 overflow-hidden rounded-lg bg-cream ring-1 ring-ink/5">
        {image ? (
          <Image
            src={image}
            alt={name}
            fill
            sizes="88px"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center font-display text-lg text-forest/30">
            KS
          </div>
        )}
      </div>

      {/* Details */}
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            {productHref ? (
              <Link
                href={productHref}
                className="line-clamp-2 text-sm font-medium text-ink hover:text-forest"
              >
                {name}
              </Link>
            ) : (
              <p className="line-clamp-2 text-sm font-medium text-ink">{name}</p>
            )}
            {item.size && (
              <p className="mt-1 text-xs text-ink/50">Size: {item.size}</p>
            )}
            <p className="mt-1 text-sm text-ink/70">{formatINR(unitPrice)}</p>
          </div>
          <p className="shrink-0 text-sm font-semibold text-ink">
            {formatINR(lineTotal)}
          </p>
        </div>

        <div className="mt-auto flex items-center justify-between pt-3">
          {/* Quantity stepper */}
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setQty((item.quantity || 1) - 1)}
              disabled={pending || (item.quantity || 1) <= 1}
              aria-label="Decrease quantity"
              className={stepBtn}
            >
              −
            </button>
            <span className="min-w-6 text-center text-sm font-medium text-ink">
              {item.quantity || 1}
            </span>
            <button
              type="button"
              onClick={() => setQty((item.quantity || 1) + 1)}
              disabled={pending}
              aria-label="Increase quantity"
              className={stepBtn}
            >
              +
            </button>
          </div>

          <button
            type="button"
            onClick={handleRemove}
            disabled={pending}
            className="text-xs font-medium text-vermilion underline-offset-4 hover:underline disabled:opacity-50"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}
