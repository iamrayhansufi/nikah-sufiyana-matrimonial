import { NextResponse } from "next/server";

// Subscription plans data
const plans = [
  {
    id: "basic",
    name: "Basic",
    price: 500,
    duration: 30,
    features: ["View profiles", "Send interests", "Basic filters"],
  },
  {
    id: "premium",
    name: "Premium",
    price: 1500,
    duration: 90,
    features: [
      "All basic features",
      "Advanced filters",
      "Priority support",
      "Unlimited contacts",
    ],
  },
];

export async function GET(request: Request) {
  try {
    return NextResponse.json({ plans });
  } catch (error) {
    console.error("Error getting subscription plans:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}