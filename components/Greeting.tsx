'use client'

import { useEffect, useState } from 'react'
import { Sparkles } from 'lucide-react'

interface GreetingProps {
  userName: string
}

function getGreeting(hour: number): string {
  if (hour >= 0 && hour < 12) return 'Good morning'
  if (hour >= 12 && hour < 18) return 'Good afternoon'
  return 'Good evening'
}

export default function Greeting({ userName }: GreetingProps) {
  const [greeting, setGreeting] = useState('')
  const [dateLabel, setDateLabel] = useState('')

  useEffect(() => {
    const now = new Date()
    const hour = now.getHours()
    setGreeting(getGreeting(hour))
    setDateLabel(
      now.toLocaleDateString(undefined, {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
      })
    )
  }, [])

  // Render nothing on the server / before hydration to avoid mismatch
  if (!greeting) return null

  return (
    <>
      <p className="eyebrow">
        <Sparkles size={13} /> {dateLabel}
      </p>
      <h1>
        {greeting}, {userName}
        <span>.</span>
      </h1>
    </>
  )
}
