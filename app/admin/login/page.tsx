"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 這裡密碼寫死在前端，正式上線建議改用環境變數或後端驗證
    if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD || password === "notion123") {
      localStorage.setItem("admin_login", "1");
      router.push("/admin/dashboard");
    } else {
      setError("密碼錯誤");
    }
  };

  return (
    <main style={{ maxWidth: 320, margin: "80px auto", padding: 24, border: "1px solid #eee", borderRadius: 8 }}>
      <h2>管理登入</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="請輸入管理密碼"
          value={password}
          onChange={e => setPassword(e.target.value)}
          style={{ width: "100%", padding: 8, marginBottom: 12 }}
        />
        <button type="submit" style={{ width: "100%", padding: 8 }}>登入</button>
        {error && <div style={{ color: "red", marginTop: 8 }}>{error}</div>}
      </form>
    </main>
  );
} 