import { Playfair_Display, El_Messiri } from "next/font/google"

export const playfair = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
})

export const elMessiri = El_Messiri({
  subsets: ["latin", "arabic"],
  display: "swap",
})