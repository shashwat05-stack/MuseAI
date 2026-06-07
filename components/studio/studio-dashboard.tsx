"use client"

import { useState } from "react"
import { artists, songs, formatPlays, formatTime } from "@/lib/music-data"
import { SectionHeader } from "@/components/section-header"
import { BarChart, LineChart } from "@/components/studio/mini-chart"
import { Button } from "@/components/ui/button"
import {
  TrendingUp,
  Users,
  DollarSign,
  Play,
  Sparkles,
  ArrowUpRight,
  Upload,
  BarChart3,
  Globe,
} from "lucide-react"

const streamsByDay = [
  { label: "Mon", value: 420 },
  { label: "Tue", value: 510 },
  { label: "Wed", value: 480 },
  { label: "Thu", value: 620 },
  { label: "Fri", value: 790 },
  { label: "Sat", value: 910 },
  { label: "Sun", value: 840 },
]

const revenueByMonth = [
  { label: "Jan", value: 12 },
  { label: "Feb", value: 18 },
  { label: "Mar", value: 16 },
  { label: "Apr", value: 24 },
  { label: "May", value: 31 },
  { label: "Jun", value: 42 },
]

const topCountries = [
  { country: "United States", pct: 34 },
  { country: "India", pct: 21 },
  { country: "United Kingdom", pct: 14 },
  { country: "Germany", pct: 9 },
  { country: "Japan", pct: 7 },
]

function StatCard({
  icon: Icon,
  label,
  value,
  delta,
}: {
  icon: React.ElementType
  label: string
  value: string
  delta: string
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-center justify-between">
        <div className="flex size-9 items-center justify-center rounded-lg bg-primary/15 text-primary">
          <Icon className="size-4" />
        </div>
        <span className="flex items-center gap-1 text-xs font-medium text-primary">
          <ArrowUpRight className="size-3" />
          {delta}
        </span>
      </div>
      <p className="mt-4 text-2xl font-semibold tracking-tight">{value}</p>
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  )
}

export function StudioDashboard() {
  const artist = artists[0]
  const [tab, setTab] = useState<"overview" | "music" | "audience">("overview")
  const artistSongs = songs.filter((s) => s.artistId === artist.id)

  return (
    <div className="space-y-8 pb-8">
      {/* Header */}
      <div className="flex flex-col gap-4 rounded-3xl border border-border bg-gradient-to-br from-card to-secondary/40 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <img
            src={artist.image || "/placeholder.svg"}
            alt={artist.name}
            className="size-16 rounded-full object-cover ring-2 ring-primary/40"
          />
          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Creator Studio</p>
            <h1 className="text-2xl font-semibold tracking-tight">{artist.name}</h1>
            <p className="text-sm text-muted-foreground">{formatPlays(artist.monthlyListeners)} monthly listeners</p>
          </div>
        </div>
        <Button className="gap-2 rounded-full">
          <Upload className="size-4" />
          Upload release
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 rounded-full border border-border bg-card p-1 w-fit">
        {(["overview", "music", "audience"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium capitalize transition-colors ${
              tab === t ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "overview" && (
        <>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <StatCard icon={Play} label="Streams (30d)" value="4.57M" delta="12.4%" />
            <StatCard icon={Users} label="Followers" value="892K" delta="3.1%" />
            <StatCard icon={DollarSign} label="Revenue (30d)" value="$42,180" delta="18.9%" />
            <StatCard icon={TrendingUp} label="Save rate" value="38%" delta="5.2%" />
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-2xl border border-border bg-card p-5">
              <SectionHeader title="Streams this week" subtitle="Daily play count (thousands)" />
              <BarChart data={streamsByDay} accent="var(--chart-1)" />
            </div>
            <div className="rounded-2xl border border-border bg-card p-5">
              <SectionHeader title="Revenue trend" subtitle="Monthly royalties ($K)" />
              <LineChart data={revenueByMonth} accent="var(--chart-3)" />
            </div>
          </div>

          {/* AI insights */}
          <div className="rounded-2xl border border-primary/30 bg-primary/5 p-5">
            <div className="mb-3 flex items-center gap-2">
              <Sparkles className="size-4 text-primary" />
              <h3 className="font-semibold">AI Insights</h3>
            </div>
            <ul className="grid gap-3 sm:grid-cols-3">
              <li className="rounded-xl border border-border bg-card p-4">
                <p className="text-xs uppercase tracking-wider text-muted-foreground">Best release time</p>
                <p className="mt-1 font-medium">Friday, 12:00 AM EST</p>
                <p className="mt-1 text-sm text-muted-foreground">Your audience peaks for weekend discovery.</p>
              </li>
              <li className="rounded-xl border border-border bg-card p-4">
                <p className="text-xs uppercase tracking-wider text-muted-foreground">Viral potential</p>
                <p className="mt-1 font-medium text-primary">High — &ldquo;Neon Pulse&rdquo;</p>
                <p className="mt-1 text-sm text-muted-foreground">Skip rate down 22%, save rate trending up.</p>
              </li>
              <li className="rounded-xl border border-border bg-card p-4">
                <p className="text-xs uppercase tracking-wider text-muted-foreground">Audience prediction</p>
                <p className="mt-1 font-medium">+260K listeners</p>
                <p className="mt-1 text-sm text-muted-foreground">Projected over next 30 days at current pace.</p>
              </li>
            </ul>
          </div>
        </>
      )}

      {tab === "music" && (
        <div className="rounded-2xl border border-border bg-card p-2">
          <div className="flex items-center justify-between px-4 py-3">
            <h3 className="font-semibold">Your catalog</h3>
            <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <BarChart3 className="size-4" />
              {artistSongs.length} tracks
            </span>
          </div>
          <div className="divide-y divide-border">
            {artistSongs.map((s) => (
              <div key={s.id} className="flex items-center gap-4 px-4 py-3">
                <img src={s.cover || "/placeholder.svg"} alt={s.title} className="size-11 rounded-md object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{s.title}</p>
                  <p className="truncate text-sm text-muted-foreground">{s.album}</p>
                </div>
                <div className="hidden text-right sm:block">
                  <p className="text-sm font-medium">{formatPlays(s.plays)}</p>
                  <p className="text-xs text-muted-foreground">plays</p>
                </div>
                <span className="text-sm tabular-nums text-muted-foreground">{formatTime(s.duration)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "audience" && (
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="mb-4 flex items-center gap-2">
              <Globe className="size-4 text-primary" />
              <h3 className="font-semibold">Top countries</h3>
            </div>
            <ul className="space-y-3">
              {topCountries.map((c) => (
                <li key={c.country}>
                  <div className="mb-1 flex justify-between text-sm">
                    <span>{c.country}</span>
                    <span className="text-muted-foreground">{c.pct}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-secondary">
                    <div className="h-full rounded-full bg-primary" style={{ width: `${c.pct}%` }} />
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-border bg-card p-5">
            <SectionHeader title="Listener retention" subtitle="Avg. completion across catalog" />
            <LineChart
              data={[
                { label: "0%", value: 100 },
                { label: "25%", value: 86 },
                { label: "50%", value: 71 },
                { label: "75%", value: 58 },
                { label: "100%", value: 44 },
              ]}
              accent="var(--chart-2)"
            />
          </div>
        </div>
      )}
    </div>
  )
}
