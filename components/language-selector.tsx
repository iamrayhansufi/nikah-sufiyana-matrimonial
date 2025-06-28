"use client"

import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select"
import { Globe } from "lucide-react"
import { useLanguage, SUPPORTED_LANGUAGES } from "@/lib/language-context"

interface LanguageSelectorProps {
  variant?: "desktop" | "mobile"
}

export function LanguageSelector({ variant = "desktop" }: LanguageSelectorProps) {
  const { currentLanguage, setLanguage, isTranslating } = useLanguage()

  const handleLanguageChange = (value: string) => {
    setLanguage(value as keyof typeof SUPPORTED_LANGUAGES)
  }

  if (variant === "desktop") {
    return (
      <Select value={currentLanguage} onValueChange={handleLanguageChange}>
        <SelectTrigger className="w-32 h-9">
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            <span className="text-xs">
              {isTranslating ? "..." : SUPPORTED_LANGUAGES[currentLanguage].flag}
            </span>
          </div>
        </SelectTrigger>
        <SelectContent>
          {Object.entries(SUPPORTED_LANGUAGES).map(([code, lang]) => (
            <SelectItem key={code} value={code}>
              {lang.flag} {lang.native}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    )
  }

  return (
    <Select value={currentLanguage} onValueChange={handleLanguageChange}>
      <SelectTrigger>
        <div className="flex items-center gap-2">
          <Globe className="h-4 w-4" />
          <span>
            {isTranslating ? "Translating..." : SUPPORTED_LANGUAGES[currentLanguage].native}
          </span>
        </div>
      </SelectTrigger>
      <SelectContent>
        {Object.entries(SUPPORTED_LANGUAGES).map(([code, lang]) => (
          <SelectItem key={code} value={code}>
            {lang.flag} {lang.native}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
