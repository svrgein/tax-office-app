import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import type { Database } from '@/types/database.types';
import formidable from 'formidable';
import fs from 'fs';
import * as XLSX from 'xlsx';

export const runtime = 'edge';

export async function POST(req: Request) {
  // Note: edge runtime doesn't support formidable/fs — this is an example for Node runtime.
  try {
    const form = new formidable.IncomingForm();
    const parsed: any = await new Promise((resolve, reject) => {
      form.parse(req as any, (err, fields, files) => {
        if (err) return reject(err);
        resolve({ fields, files });
      });
    });

    const file = parsed.files.file;
    const buffer = fs.readFileSync(file.filepath);
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(sheet);

    // TODO: validate rows and insert into Supabase

    return NextResponse.json({ imported: rows.length });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
