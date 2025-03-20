import { NextResponse } from 'next/server';

/**
 * Health check endpoint for monitoring application status
 * GET /api/health
 */
export async function GET() {
  try {
    // You can add more health checks here if needed
    // For example, database connection checks, external service checks, etc.
    
    return NextResponse.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      version: process.env.npm_package_version || 'unknown'
    }, { status: 200 });
  } catch (error) {
    console.error('Health check failed:', error);
    return NextResponse.json({
      status: 'error',
      message: error.message || 'Health check failed',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
