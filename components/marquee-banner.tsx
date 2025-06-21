"use client"

import { useState, useEffect } from "react"

export function MarqueeBanner() {
  const messages = [
    "✨ 100% Halal Matchmaking",    
    "👨‍👩‍👧‍👦 Trusted by Muslim Families",
    "🤝 Personalized Matchmaking Support",
    "🔒 Verified Profiles Only",
    "🌍 Indian Muslim Community",
  ]

  return (
    <div className="bg-gradient-to-r from-[#C7203E] to-[#A11B35] text-white py-2 overflow-hidden whitespace-nowrap">
      <div className="inline-flex animate-marquee">
        {messages.map((message, index) => (
          <span key={index} className="mx-8 text-lg font-medium font-body">
            {message}
          </span>
        ))}
        {/* Duplicate messages for seamless loop */}
        {messages.map((message, index) => (
          <span key={`dup-${index}`} className="mx-8 text-lg font-medium font-body">
            {message}
          </span>
        ))}
      </div>
    </div>
  )
}
