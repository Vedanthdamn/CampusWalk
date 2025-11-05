import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('hostels')
      .select('*')
      .order('name');

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching hostels:', error);
    return NextResponse.json(
      { error: 'Failed to fetch hostels' },
      { status: 500 }
    );
  }
}
