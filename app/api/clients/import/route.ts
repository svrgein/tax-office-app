import { NextResponse } from 'next/server';
import * as XLSX from 'xlsx';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    const firstSheetName = workbook.SheetNames[0];
    if (!firstSheetName) {
      return NextResponse.json({ error: 'No sheets found in workbook' }, { status: 400 });
    }
    const sheet = workbook.Sheets[firstSheetName];
    if (!sheet) {
      return NextResponse.json({ error: 'Sheet is empty or invalid' }, { status: 400 });
    }
    const rows = XLSX.utils.sheet_to_json(sheet);

    // TODO: validate rows and insert into Supabase

    return NextResponse.json({ imported: rows.length });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

