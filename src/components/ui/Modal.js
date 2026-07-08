"use client";

import { XIcon } from "@/components/ui/Icons";

/** Centered modal — render it conditionally; backdrop & × call onClose. */
export default function Modal({ onClose, title, children, maxWidth = "max-w-md" }) {
  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-ink/40 px-4">
      <button
        aria-label="Close"
        onClick={onClose}
        tabIndex={-1}
        className="absolute inset-0 cursor-default"
      />
      <div
        className={`relative w-full ${maxWidth} max-h-[85vh] overflow-y-auto rounded-2xl bg-white p-6 shadow-xl`}
      >
        <button
          aria-label="Close dialog"
          onClick={onClose}
          className="absolute right-4 top-4 text-ink/40 hover:text-ink"
        >
          <XIcon />
        </button>
        {title && (
          <h2 className="pr-8 font-display text-xl text-forest">{title}</h2>
        )}
        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
}
