import { NextResponse } from "next/server"

// Configure CORS to allow requests from your frontend
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
}

// Handle OPTIONS requests for CORS preflight
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders })
}

export async function GET() {
  return NextResponse.json(
    {
      status: "success",
      message: "API is working correctly",
      timestamp: new Date().toISOString(),
    },
    { headers: corsHeaders },
  )
}

