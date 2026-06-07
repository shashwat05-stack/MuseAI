export function Equalizer({
  active = true,
  className,
  barClassName = 'bg-primary',
}: {
  active?: boolean
  className?: string
  barClassName?: string
}) {
  const bars = [0, 0.2, 0.4, 0.1, 0.3]
  return (
    <div
      className={`flex h-4 items-end gap-0.5 ${className ?? ''}`}
      aria-hidden="true"
    >
      {bars.map((delay, i) => (
        <span
          key={i}
          className={`w-0.5 rounded-full ${barClassName}`}
          style={{
            height: '100%',
            transformOrigin: 'bottom',
            animation: active
              ? `eq-bar 0.9s ease-in-out ${delay}s infinite`
              : 'none',
            transform: active ? undefined : 'scaleY(0.3)',
          }}
        />
      ))}
    </div>
  )
}
