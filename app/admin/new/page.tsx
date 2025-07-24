"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewNotePage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachments(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    // 先上傳附件
    let uploaded: { url: string; type: string; name: string }[] = [];
    if (attachments.length > 0) {
      const formData = new FormData();
      attachments.forEach(file => formData.append("file", file));
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (!res.ok) {
        setError("檔案上傳失敗");
        setLoading(false);
        return;
      }
      uploaded = await res.json();
    }
    // 新增筆記
    const res = await fetch("/api/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        content,
        tags: tags.split(",").map(t => t.trim()).filter(Boolean),
        attachments: uploaded,
      }),
    });
    if (!res.ok) {
      setError("新增筆記失敗");
      setLoading(false);
      return;
    }
    router.push("/admin/dashboard");
  };

  return (
    <main style={{ maxWidth: 600, margin: "0 auto", padding: 24 }}>
      <h1>新增筆記</h1>
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
        <input
          type="file"
          multiple
          accept="image/*,application/pdf"
          onChange={handleFileChange}
          style={{ marginBottom: 12 }}
        />
        <button type="submit" disabled={loading} style={{ width: "100%", padding: 8 }}>
          {loading ? "送出中..." : "新增"}
        </button>
        {error && <div style={{ color: "red", marginTop: 8 }}>{error}</div>}
      </form>
    </main>
  );
} 