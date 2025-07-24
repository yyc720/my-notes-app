"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

interface Attachment {
  url: string;
  type: string;
  name: string;
}

interface Note {
  _id: string;
  title: string;
  content: string;
  attachments?: Attachment[];
  tags?: string[];
}

export default function EditNotePage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetch(`/api/notes/${id}`)
      .then(res => res.json())
      .then((note: Note) => {
        setTitle(note.title);
        setContent(note.content);
        setTags(note.tags?.join(",") || "");
        setAttachments(note.attachments || []);
      });
  }, [id]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setNewFiles(Array.from(e.target.files));
    }
  };

  const handleRemoveAttachment = (url: string) => {
    setAttachments(attachments => attachments.filter(att => att.url !== url));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    let uploaded: Attachment[] = [];
    if (newFiles.length > 0) {
      const formData = new FormData();
      newFiles.forEach(file => formData.append("file", file));
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (!res.ok) {
        setError("檔案上傳失敗");
        setLoading(false);
        return;
      }
      uploaded = await res.json();
    }
    const res = await fetch(`/api/notes/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        content,
        tags: tags.split(",").map(t => t.trim()).filter(Boolean),
        attachments: [...attachments, ...uploaded],
      }),
    });
    if (!res.ok) {
      setError("更新筆記失敗");
      setLoading(false);
      return;
    }
    router.push("/admin/dashboard");
  };

  return (
    <main style={{ maxWidth: 600, margin: "0 auto", padding: 24 }}>
      <h1>編輯筆記</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="標題"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
          style={{ width: "100%", padding: 8, marginBottom: 12 }}
        />
        <textarea
          placeholder="內容 (支援 Markdown)"
          value={content}
          onChange={e => setContent(e.target.value)}
          rows={8}
          required
          style={{ width: "100%", padding: 8, marginBottom: 12 }}
        />
        <input
          type="text"
          placeholder="標籤（用逗號分隔）"
          value={tags}
          onChange={e => setTags(e.target.value)}
          style={{ width: "100%", padding: 8, marginBottom: 12 }}
        />
        <div style={{ marginBottom: 12 }}>
          <strong>已上傳附件：</strong>
          <ul>
            {attachments.map(att => (
              <li key={att.url} style={{ marginBottom: 4 }}>
                {att.type === 'image' ? (
                  <img src={att.url} alt={att.name} style={{ maxWidth: 100, maxHeight: 80, verticalAlign: 'middle' }} />
                ) : att.type === 'pdf' ? (
                  <a href={att.url} target="_blank" rel="noopener noreferrer">{att.name} (PDF)</a>
                ) : null}
                <button type="button" onClick={() => handleRemoveAttachment(att.url)} style={{ marginLeft: 8, color: 'red' }}>移除</button>
              </li>
            ))}
          </ul>
        </div>
        <input
          type="file"
          multiple
          accept="image/*,application/pdf"
          onChange={handleFileChange}
          style={{ marginBottom: 12 }}
        />
        <button type="submit" disabled={loading} style={{ width: "100%", padding: 8 }}>
          {loading ? "送出中..." : "更新"}
        </button>
        {error && <div style={{ color: "red", marginTop: 8 }}>{error}</div>}
      </form>
    </main>
  );
} 