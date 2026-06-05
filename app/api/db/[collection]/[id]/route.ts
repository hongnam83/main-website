import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

const DB_FILE = path.join(process.cwd(), 'local_db.json');

function readDB(): any {
  if (!fs.existsSync(DB_FILE)) return {};
  try {
    return JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
  } catch {
    return {};
  }
}

function writeDB(data: any) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ collection: string; id: string }> }
) {
  const { collection: col, id } = await params;
  const db = readDB();
  const collection = db[col] || [];
  const item = collection.find((i: any) => i.id === id);
  if (!item) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  return NextResponse.json(item);
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ collection: string; id: string }> }
) {
  const { collection: col, id } = await params;
  const db = readDB();
  if (!db[col]) db[col] = [];
  const collection = db[col];
  const body = await request.json();
  const merge = request.nextUrl.searchParams.get('merge') === 'true';
  const index = collection.findIndex((i: any) => String(i.id) === String(id));

  if (index >= 0) {
    if (merge) {
      collection[index] = { ...collection[index], ...body, id };
    } else {
      collection[index] = { ...body, id };
    }
  } else {
    collection.push({ ...body, id });
  }

  writeDB(db);
  return NextResponse.json({ success: true });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ collection: string; id: string }> }
) {
  const { collection: col, id } = await params;
  const db = readDB();
  if (!db[col]) {
    return NextResponse.json({ success: true });
  }
  db[col] = db[col].filter((i: any) => i.id !== id);
  writeDB(db);
  return NextResponse.json({ success: true });
}
