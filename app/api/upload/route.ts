import { NextRequest, NextResponse } from 'next/server';
import { join } from 'path';
import { writeFile, mkdir } from 'fs/promises';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const files = formData.getAll('file') as File[];
  const uploadDir = join(process.cwd(), 'public', 'uploads');
  await mkdir(uploadDir, { recursive: true });
  const uploaded = [];
  for (const file of files) {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const ext = file.name.split('.').pop()?.toLowerCase() || '';
    const type = ext === 'pdf' ? 'pdf' : 'image';
    const filename = `${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
    const filepath = join(uploadDir, filename);
    await writeFile(filepath, buffer);
    uploaded.push({
      url: `/uploads/${filename}`,
      type,
      name: file.name,
    });
  }
  return NextResponse.json(uploaded);
} 