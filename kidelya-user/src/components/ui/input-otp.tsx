import * as React from "react"
import { cn } from "@/utils/cn"

type NativeInputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "onChange" | "value" | "maxLength"
>

export interface InputOTPProps extends NativeInputProps {
  maxLength: number
  value: string
  onChange: (value: string) => void
}

export function InputOTP({
  maxLength,
  value,
  onChange,
  className,
  ...props
}: InputOTPProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    if (newValue.length <= maxLength) {
      onChange(newValue)
    }
  }

  return (
    <input
      {...props}
      data-otp-input
      inputMode="numeric"
      autoComplete="one-time-code"
      value={value}
      onChange={handleChange}
      maxLength={maxLength}
      className={cn(
        "w-0 h-0 opacity-0 absolute pointer-events-none",
        className
      )}
    />
  )
}

export function InputOTPGroup({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      {children}
    </div>
  )
}

export function InputOTPSlot({
  index,
  className,
}: {
  index: number
  className?: string
}) {
  return (
    <div
      data-otp-slot={index}
      className={cn(
        "flex h-12 w-10 items-center justify-center rounded-lg border border-[#FDC600]/40 text-xl font-semibold text-[#93197D] bg-white",
        "focus-within:ring-2 focus-within:ring-[#E94E6F]",
        className
      )}
    >
      <SlotContent index={index} />
    </div>
  )
}

function SlotContent({ index }: { index: number }) {
  const input = document.querySelector(
    "input[data-otp-input]"
  ) as HTMLInputElement | null
  const value = input?.value ?? ""
  return <span>{value[index] ?? ""}</span>
}
