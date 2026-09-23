import { handleRevalidate } from "@/lib/revalidate";

export async function POST(req: Request): Promise<Response> {
  return handleRevalidate(req);
}

// GET with ?secret=... for manual testing / curl.
export async function GET(req: Request): Promise<Response> {
  return handleRevalidate(req);
}
