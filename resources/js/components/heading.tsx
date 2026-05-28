export default function Heading({
  title,
  description,
  variant = "default",
}: {
  title: string
  description?: string
  variant?: "default" | "small"
}) {
  const isSmall = variant === "small"

  return (
    <header className={isSmall ? "" : "mb-8 space-y-0.5"}>
      <h2
        className={
          isSmall
            ? "mb-0.5 text-base font-medium"
            : "text-xl font-semibold tracking-tight"
        }
      >
        {title}
      </h2>

      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
    </header>
  )
}
