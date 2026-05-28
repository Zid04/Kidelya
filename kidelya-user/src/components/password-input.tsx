import { forwardRef, useState } from "react"

const PasswordInput = forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ ...props }, ref) => {
    const [show, setShow] = useState(false)

    return (
      <div className="relative">
        <input
          ref={ref}
          type={show ? "text" : "password"}
          className="w-full rounded-md border px-3 py-2"
          {...props}
        />

        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground"
        >
          {show ? "Cacher" : "Voir"}
        </button>
      </div>
    )
  }
)

PasswordInput.displayName = "PasswordInput"
export default PasswordInput
