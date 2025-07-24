import Link from 'next/link';

interface Note {
  _id: string;
  title: string;
  content: string;
  createdAt: string;
}

async function getNotes(): Promise<Note[]> {
  const baseUrl =
    process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : 'http://localhost:3000';
  const res = await fetch(`${baseUrl}/api/notes`, { cache: 'no-store' });
  if (!res.ok) return [];
  const data = await res.json();
  // 防呆：如果不是陣列就回傳空陣列
  return Array.isArray(data) ? data : [];
}

export default async function HomePage() {
  const notes = await getNotes();
  return (
    <main style={{ maxWidth: 600, margin: '0 auto', padding: 24 }}>
      <h1>我的筆記</h1>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {notes.map(note => (
          <li key={note._id} style={{ marginBottom: 32, borderBottom: '1px solid #eee', paddingBottom: 16 }}>
            <Link href={`/note/${note._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <h2>{note.title}</h2>
              <div style={{ color: '#888', fontSize: 14 }}>{new Date(note.createdAt).toLocaleString()}</div>
              <p>{note.content.slice(0, 80)}{note.content.length > 80 ? '...' : ''}</p>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
