import { revalidatePath } from "next/cache";
import { timingSafeEqual, createHmac } from "node:crypto";

function secretsEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return timingSafeEqual(ab, bb);
}

function isAuthorized(req: Request, secret: string): boolean {
  const url = new URL(req.url);
  if (
    url.searchParams.get("secret") &&
    secretsEqual(url.searchParams.get("secret")!, secret)
  ) {
    return true;
  }
  const auth = req.headers.get("authorization") ?? "";
  if (auth.startsWith("Bearer ") && secretsEqual(auth.slice(7), secret)) {
    return true;
  }
  return false;
}

async function verifyGitHubSignature(
  req: Request,
  rawBody: string,
  secret: string
): Promise<boolean> {
  const sig = req.headers.get("x-hub-signature-256");
  if (!sig) return true; // no signature configured — fall back to secret check
  const expected = `sha256=${createHmac("sha256", secret).update(rawBody).digest("hex")}`;
  try {
    return timingSafeEqual(Buffer.from(sig), Buffer.from(expected));
  } catch {
    return false;
  }
}

export async function handleRevalidate(req: Request): Promise<Response> {
  const secret = process.env.REVALIDATE_SECRET;
  if (!secret) {
    return Response.json(
      { error: "REVALIDATE_SECRET is not configured" },
      { status: 500 }
    );
  }

  const rawBody =
    req.method === "POST" ? await req.text().catch(() => "") : "";

  if (!(await verifyGitHubSignature(req, rawBody, secret))) {
    return Response.json({ error: "Invalid signature" }, { status: 401 });
  }

  if (!isAuthorized(req, secret)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Only rebuild on pushes to main (manual curls / schedules without
  // these headers still pass).
  const event = req.headers.get("x-github-event");
  const ref = (() => {
    try {
      return (JSON.parse(rawBody || "{}") as { ref?: string }).ref;
    } catch {
      return undefined;
    }
  })();
  if (event && event !== "push") {
    return Response.json({ revalidated: false, reason: "ignored event" });
  }
  if (event === "push" && ref && ref !== "refs/heads/main") {
    return Response.json({ revalidated: false, reason: "ignored branch" });
  }

  // Revalidates the whole homepage: GitHub heatmap + LeetCode tracker.
  revalidatePath("/");
  return Response.json({ revalidated: true });
}
