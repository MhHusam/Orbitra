import { getDb } from "@/lib/db";

export function GET() {
  const db = getDb(); 
  return Response.json({ ok: true });
  
}