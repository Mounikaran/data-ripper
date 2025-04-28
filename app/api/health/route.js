import { NextResponse } from "next/server";

/**
 * Health check endpoint for monitoring application status
 * GET /api/health
 */
export async function GET() {
  try {
    return NextResponse.json(
      {
        status: "ok",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Health check failed:", error);
    return NextResponse.json(
      {
        status: "error",
        message: error.message || "Health check failed",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
