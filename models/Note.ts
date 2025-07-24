export interface Attachment {
  url: string; // 檔案連結
  type: 'image' | 'pdf';
  name: string;
}

export interface Note {
  _id?: string;
  title: string;
  content: string; // Markdown 內容
  attachments?: Attachment[];
  tags?: string[];
  createdAt: string;
  updatedAt: string;
} 