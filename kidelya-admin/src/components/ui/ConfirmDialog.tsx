interface Props {
  message: string
  onConfirm: () => void
  children: React.ReactNode
}

export default function ConfirmDialog({ message, onConfirm, children }: Props) {
  const handleClick = () => {
    if (confirm(message)) onConfirm()
  }

  return (
    <span onClick={handleClick} className="cursor-pointer">
      {children}
    </span>
  )
}
