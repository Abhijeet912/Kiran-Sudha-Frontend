export default function Input({
  label,
  error,
  hint,
  id,
  className = "",
  ...props
}) {
  const inputId = id || props.name;
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-ink">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`h-11 rounded-lg border bg-white px-3.5 text-sm text-ink outline-none transition-colors placeholder:text-ink/40 focus:border-forest focus:ring-2 focus:ring-forest/20 ${
          error ? "border-vermilion" : "border-ink/20"
        } ${className}`}
        {...props}
      />
      {error ? (
        <p className="text-xs text-vermilion">{error}</p>
      ) : hint ? (
        <p className="text-xs text-ink/50">{hint}</p>
      ) : null}
    </div>
  );
}
