interface HeadingProps {
  title: string
  description?: string
  variant?: "small" | "large"
}

export default function Heading({ title, description, variant = "large" }: HeadingProps) {
  return (
    <div className="space-y-1">
      <h2
        className={
          variant === "small"
            ? "text-lg font-semibold"
            : "text-2xl font-bold"
        }
      >
        {title}
      </h2>

      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
    </div>
  )
}
