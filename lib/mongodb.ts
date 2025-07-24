import { MongoClient } from 'mongodb';

if (!process.env.MONGODB_URI) {
  throw new Error('請在 .env.local 檔案中設定 MONGODB_URI');
}

const uri = process.env.MONGODB_URI;
const options = {};

let client;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === 'development') {
  // 在開發環境下使用全域變數避免熱重載時重複連線
  if (!(global as any)._mongoClientPromise) {
    client = new MongoClient(uri!, options);
    (global as any)._mongoClientPromise = client.connect();
  }
  clientPromise = (global as any)._mongoClientPromise;
} else {
  // 在生產環境下直接建立新連線
  client = new MongoClient(uri!, options);
  clientPromise = client.connect();
}

export default clientPromise; 