"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Note {
  _id: string;
  title: string;
  createdAt: string;
}

export default function AdminDashboard() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined" && localStorage.getItem("admin_login") !== "1") {
      router.replace("/admin/login");
      return;
    }
    fetch("/api/notes")
      .then(res => res.json())
      .then(data => setNotes(data))
      .finally(() => setLoading(false));
  }, [router]);

  const handleDelete = async (id: string) => {
    if (!window.confirm("確定要刪除這筆筆記嗎？")) return;
    await fetch(`/api/notes/${id}`, { method: "DELETE" });
    setNotes(notes => notes.filter(n => n._id !== id));
  };

  return (
    <main style={{ maxWidth: 700, margin: "0 auto", padding: 24 }}>
      <h1>管理後台</h1>
      <Link href="/admin/new"><button>新增筆記</button></Link>
      {loading ? <div>載入中...</div> : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {notes.map(note => (
            <li key={note._id} style={{ marginBottom: 24, borderBottom: '1px solid #eee', paddingBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <strong>{note.title}</strong>
                  <span style={{ color: '#888', fontSize: 13, marginLeft: 12 }}>{new Date(note.createdAt).toLocaleString()}</span>
                </div>
                <div>
                  <Link href={`/admin/edit/${note._id}`}><button style={{ marginRight: 8 }}>編輯</button></Link>
                  <button onClick={() => handleDelete(note._id)} style={{ color: 'red' }}>刪除</button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
} 