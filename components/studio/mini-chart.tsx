"use client"

type Point = { label: string; value: number }

export function BarChart({ data, accent = "var(--primary)" }: { data: Point[]; accent?: string }) {
  const max = Math.max(...data.map((d) => d.value), 1)
  return (
    <div className="flex h-40 items-end gap-2">
      {data.map((d) => (
        <div key={d.label} className="flex flex-1 flex-col items-center gap-2">
          <div className="flex w-full flex-1 items-end">
            <div
              className="w-full rounded-t-md transition-all"
              style={{ height: `${(d.value / max) * 100}%`, backgroundColor: accent, minHeight: 4 }}
            />
          </div>
          <span className="text-[10px] text-muted-foreground">{d.label}</span>
        </div>
      ))}
    </div>
  )
}

export function LineChart({ data, accent = "var(--primary)" }: { data: Point[]; accent?: string }) {
  const max = Math.max(...data.map((d) => d.value), 1)
  const min = Math.min(...data.map((d) => d.value), 0)
  const range = max - min || 1
  const w = 100
  const h = 100
  const step = data.length > 1 ? w / (data.length - 1) : w
  const points = data.map((d, i) => {
    const x = i * step
    const y = h - ((d.value - min) / range) * h
    return [x, y] as const
  })
  const path = points.map((p, i) => `${i === 0 ? "M" : "L"}${p[0].toFixed(2)},${p[1].toFixed(2)}`).join(" ")
  const area = `${path} L${w},${h} L0,${h} Z`
  return (
    <div className="h-40 w-full">
      <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className="h-full w-full">
        <defs>
          <linearGradient id="line-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={accent} stopOpacity="0.35" />
            <stop offset="100%" stopColor={accent} stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={area} fill="url(#line-fill)" />
        <path d={path} fill="none" stroke={accent} strokeWidth="2" vectorEffect="non-scaling-stroke" />
      </svg>
      <div className="mt-2 flex justify-between">
        {data.map((d) => (
          <span key={d.label} className="text-[10px] text-muted-foreground">
            {d.label}
          </span>
        ))}
      </div>
    </div>
  )
}
