import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export const runtime = 'nodejs';

export async function GET(
  req: NextRequest,
  context: { params: { id: string } }
) {
  const id = context.params.id;
  try {
    const client = await clientPromise;
    const db = client.db();
    const note = await db.collection('notes').findOne({ _id: new ObjectId(id) });
    if (!note) return NextResponse.json({ error: '找不到筆記' }, { status: 404 });
    return NextResponse.json(note);
  } catch (error) {
    return NextResponse.json({ error: '查詢筆記失敗' }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  context: { params: { id: string } }
) {
  const id = context.params.id;
  try {
    const body = await req.json();
    const { title, content, attachments, tags } = body;
    const now = new Date().toISOString();
    const client = await clientPromise;
    const db = client.db();
    const result = await db.collection('notes').findOneAndUpdate(
      { _id: new ObjectId(id) },
      {
        $set: {
          title,
          content,
          attachments: attachments || [],
          tags: tags || [],
          updatedAt: now,
        },
      },
      { returnDocument: 'after' }
    );
    if (!result || !result.value) return NextResponse.json({ error: '找不到筆記' }, { status: 404 });
    return NextResponse.json(result.value);
  } catch (error) {
    return NextResponse.json({ error: '更新筆記失敗' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: { id: string } }
) {
  const id = context.params.id;
  try {
    const client = await clientPromise;
    const db = client.db();
    const result = await db.collection('notes').deleteOne({ _id: new ObjectId(id) });
    if (!result || result.deletedCount === 0) return NextResponse.json({ error: '找不到筆記' }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: '刪除筆記失敗' }, { status: 500 });
  }
} 