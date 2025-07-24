import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db();
    const notes = await db.collection('notes').find({}).sort({ createdAt: -1 }).toArray();
    return NextResponse.json(notes);
  } catch (error) {
    return NextResponse.json({ error: '取得筆記失敗' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, content, attachments, tags } = body;
    const now = new Date().toISOString();
    const note = {
      title,
      content,
      attachments: attachments || [],
      tags: tags || [],
      createdAt: now,
      updatedAt: now,
    };
    const client = await clientPromise;
    const db = client.db();
    const result = await db.collection('notes').insertOne(note);
    return NextResponse.json({ ...note, _id: result.insertedId });
  } catch (error) {
    console.error('API /api/notes error:', error);
    return NextResponse.json({ error: '新增筆記失敗', detail: String(error) }, { status: 500 });
  }
} 