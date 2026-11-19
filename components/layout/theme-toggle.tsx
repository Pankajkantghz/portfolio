'use client'
import { MoonIcon, SunIcon } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Button } from '../ui/button'

export default function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme()

  return (
    <Button
      size="sm"
      variant="ghost"
      onClick={() => {
        setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
      }}
    >
      {resolvedTheme === 'dark' ? (
        <SunIcon className="size-4 text-orange-300" />
      ) : (
        <MoonIcon className="size-4 text-sky-950" />
      )}
    </Button>
  )
}
