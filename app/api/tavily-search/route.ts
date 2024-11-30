import { NextResponse } from 'next/server';
import { tavily } from '@tavily/core';

const tvly = tavily({ apiKey: process.env.TAVILY_API_KEY });

export async function POST(req: Request) {
  try {
    const { query } = await req.json();
    const response = await tvly.search(query, {
      includeAnswer: true,
      includeImageDescriptions: true,
    });

    // Filter out problematic image URLs
    if (response.images) {
      response.images = response.images.filter(img => 
        img.url.startsWith('https://') && 
        !img.url.includes('..') &&
        !img.url.includes(' ')
      );
    }

    return NextResponse.json(response, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      }
    });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}