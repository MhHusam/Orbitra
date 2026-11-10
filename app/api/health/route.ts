import { sql } from "drizzle-orm";                               
import { getDb } from "@/lib/db";

export async function GET() {                                       
  try {                                                             
    const db = getDb();
    await db.run(sql`select 1`);                                     
    return Response.json({ ok: true, db: true });                    
  } catch (error) {                                                 
    console.error("health check failed", error);
    return Response.json({ ok: false, db: false }, { status: 500 });
  }
}