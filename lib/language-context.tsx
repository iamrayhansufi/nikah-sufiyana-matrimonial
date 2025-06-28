"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

// Google Translate language codes for Indian languages
export const SUPPORTED_LANGUAGES = {
  en: { name: 'English', native: 'English', flag: '🇺🇸', gtCode: 'en' },
  hi: { name: 'Hindi', native: 'हिंदी', flag: '🇮🇳', gtCode: 'hi' },
  ur: { name: 'Urdu', native: 'اردو', flag: '🇵🇰', gtCode: 'ur' },
  te: { name: 'Telugu', native: 'తెలుగు', flag: '🇮🇳', gtCode: 'te' },
  mr: { name: 'Marathi', native: 'मराठी', flag: '🇮🇳', gtCode: 'mr' },
  ta: { name: 'Tamil', native: 'தமிழ்', flag: '🇮🇳', gtCode: 'ta' },
  gu: { name: 'Gujarati', native: 'ગુજરાતી', flag: '🇮🇳', gtCode: 'gu' },
  kn: { name: 'Kannada', native: 'ಕನ್ನಡ', flag: '🇮🇳', gtCode: 'kn' },
  ml: { name: 'Malayalam', native: 'മലയാളം', flag: '🇮🇳', gtCode: 'ml' },
  pa: { name: 'Punjabi', native: 'ਪੰਜਾਬੀ', flag: '🇮🇳', gtCode: 'pa' },
  bn: { name: 'Bengali', native: 'বাংলা', flag: '🇮🇳', gtCode: 'bn' },
  or: { name: 'Odia', native: 'ଓଡ଼ିଆ', flag: '🇮🇳', gtCode: 'or' },
  as: { name: 'Assamese', native: 'অসমীয়া', flag: '🇮🇳', gtCode: 'as' },
  ne: { name: 'Nepali', native: 'नेपाली', flag: '🇳🇵', gtCode: 'ne' },
  ar: { name: 'Arabic', native: 'العربية', flag: '🇸🇦', gtCode: 'ar' }
}

type LanguageCode = keyof typeof SUPPORTED_LANGUAGES

interface LanguageContextType {
  currentLanguage: LanguageCode
  setLanguage: (lang: LanguageCode) => void
  isTranslating: boolean
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

// Google Translate script and initialization
declare global {
  interface Window {
    google: any
    googleTranslateElementInit: () => void
  }
}

interface LanguageProviderProps {
  children: ReactNode
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [currentLanguage, setCurrentLanguage] = useState<LanguageCode>('en')
  const [isTranslating, setIsTranslating] = useState(false)
  const [googleTranslateLoaded, setGoogleTranslateLoaded] = useState(false)

  // Load Google Translate script
  useEffect(() => {
    if (typeof window !== 'undefined' && !window.google?.translate) {
      // Create the script element
      const script = document.createElement('script')
      script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit'
      script.async = true
      
      // Initialize Google Translate
      window.googleTranslateElementInit = () => {
        if (window.google?.translate?.TranslateElement) {
          new window.google.translate.TranslateElement({
            pageLanguage: 'en',
            includedLanguages: Object.values(SUPPORTED_LANGUAGES).map(lang => lang.gtCode).join(','),
            layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
            autoDisplay: false,
            multilanguagePage: true
          }, 'google_translate_element')
          setGoogleTranslateLoaded(true)
        }
      }

      document.head.appendChild(script)

      // Create hidden div for Google Translate widget
      const translateDiv = document.createElement('div')
      translateDiv.id = 'google_translate_element'
      translateDiv.style.display = 'none'
      document.body.appendChild(translateDiv)

      return () => {
        if (script.parentNode) {
          script.parentNode.removeChild(script)
        }
        if (translateDiv.parentNode) {
          translateDiv.parentNode.removeChild(translateDiv)
        }
      }
    }
  }, [])

  const setLanguage = async (lang: LanguageCode) => {
    if (lang === currentLanguage) return

    setIsTranslating(true)
    setCurrentLanguage(lang)

    // Handle RTL languages
    const rtlLanguages = ['ur', 'ar']
    if (rtlLanguages.includes(lang)) {
      document.documentElement.dir = 'rtl'
      document.documentElement.classList.add('rtl')
    } else {
      document.documentElement.dir = 'ltr'
      document.documentElement.classList.remove('rtl')
    }

    // Save language preference
    localStorage.setItem('preferred-language', lang)

    // Use Google Translate if available
    if (googleTranslateLoaded && window.google?.translate) {
      try {
        // Find the Google Translate select element
        const translateSelect = document.querySelector('.goog-te-combo') as HTMLSelectElement
        if (translateSelect) {
          translateSelect.value = SUPPORTED_LANGUAGES[lang].gtCode
          translateSelect.dispatchEvent(new Event('change'))
        } else {
          // Fallback: try to trigger translation programmatically
          const targetLangCode = SUPPORTED_LANGUAGES[lang].gtCode
          if (targetLangCode !== 'en') {
            // Reset to English first, then translate
            setTimeout(() => {
              const event = new CustomEvent('translatePage', { detail: { language: targetLangCode } })
              window.dispatchEvent(event)
            }, 100)
          }
        }
      } catch (error) {
        console.error('Translation error:', error)
      }
    }

    // Reset translation state after a delay
    setTimeout(() => {
      setIsTranslating(false)
    }, 1500)
  }

  // Load saved language preference
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLang = localStorage.getItem('preferred-language') as LanguageCode
      if (savedLang && SUPPORTED_LANGUAGES[savedLang]) {
        setLanguage(savedLang)
      }
    }
  }, [])

  return (
    <LanguageContext.Provider value={{ currentLanguage, setLanguage, isTranslating }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
