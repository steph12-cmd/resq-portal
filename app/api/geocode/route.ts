import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get('lat');
  const lng = searchParams.get('lng');

  if (!lat || !lng) {
    return NextResponse.json({ error: 'lat and lng are required' }, { status: 400 });
  }

  try {
    const key = process.env.GOOGLE_GEOCODING_API_KEY;
    const res = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${key}`
    );
    const data = await res.json();
    const address = data.results?.[0]?.formatted_address || null;
    return NextResponse.json({ address });
  } catch (error) {
    console.log('Geocode error:', error);
    return NextResponse.json({ address: null }, { status: 500 });
  }
}