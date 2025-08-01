"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

interface Attachment {
  url: string;
  type: "image" | "pdf";
  name: string;
}

interface Note {
  _id: string;
  title: string;
  content: string;
  attachments?: Attachment[];
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export default function NoteDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const [note, setNote] = useState<Note | null>(null);

  useEffect(() => {
    fetch(`/api/notes/${id}`)
      .then(res => res.json())
      .then(setNote);
  }, [id]);

  if (!note) return <div>載入中...</div>;

  return (
    <main style={{ maxWidth: 600, margin: '0 auto', padding: 24 }}>
      <h1>{note.title}</h1>
      <div style={{ color: '#888', fontSize: 14 }}>建立：{new Date(note.createdAt).toLocaleString()}</div>
      {note.tags && note.tags.length > 0 && (
        <div style={{ margin: '8px 0' }}>
          {note.tags.map(tag => (
            <span key={tag} style={{ background: '#eee', borderRadius: 4, padding: '2px 8px', marginRight: 8, fontSize: 12 }}>{tag}</span>
          ))}
        </div>
      )}
      <article style={{ margin: '16px 0' }}>
        <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit' }}>{note.content}</pre>
      </article>
      {note.attachments && note.attachments.length > 0 && (
        <section>
          <h3>附件</h3>
          <ul>
            {note.attachments.map(att => (
              <li key={att.url} style={{ marginBottom: 8 }}>
                {att.type === 'image' ? (
                  <img src={att.url} alt={att.name} style={{ maxWidth: 400, maxHeight: 300 }} />
                ) : att.type === 'pdf' ? (
                  <a href={att.url} target="_blank" rel="noopener noreferrer">{att.name} (PDF)</a>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
} 