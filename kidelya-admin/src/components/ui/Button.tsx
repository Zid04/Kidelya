interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
}

export default function Button({ children, className = '', ...props }: ButtonProps) {
  return (
    <button
      {...props}
      className={`
        px-4 py-2 
        bg-purple-600 hover:bg-purple-700 
        dark:bg-purple-700 dark:hover:bg-purple-600 
        text-white 
        rounded-lg text-sm 
        transition 
        disabled:opacity-50 
        ${className}
      `}
    >
      {children}
    </button>
  )
}
