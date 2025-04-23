import { NextResponse } from 'next/server';
import { supabase } from '../../lib/supabaseClient';

export async function GET(
  { params }: { params: { table: string}}
) {
  try {
    const table = params.table;

    const { data, error } = await supabase
      .from(table)
      .select("*");

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, data})
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: { table: string }}
) {
  try {
    const table = params.table;
    const { filter } = await request.json();

    let query = supabase.from(table).select('*');

    if (filter && Object.keys(filter).length > 0) {
      Object.entries(filter).forEach(([campo, valor]) => {
        query = query.eq(campo, valor as string);
      });
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ success: true, data });

  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}