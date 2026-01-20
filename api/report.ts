import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  try {
    // 1) 메서드 제한
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method Not Allowed" });
    }

    // 2) 바디 파싱 (Vercel 환경에 따라 string/object 혼재 가능)
    const body =
      typeof req.body === "string" ? JSON.parse(req.body) : req.body;

    const { userInfo, pai, categories } = body ?? {};

    // 3) payload 검증 (SSOT 유지)
    if (!userInfo || typeof pai !== "number" || !categories) {
      return res.status(400).json({
        error: "Invalid payload",
        received: body ?? null,
      });
    }

    // ✅ 4) 임시 응답: 서버가 살아있는지 확인용
    return res.status(200).json({
      reportText: "SERVER_OK_REPORT_PLACEHOLDER",
    });
  } catch (err: any) {
    console.error("REPORT_API_ERROR:", err);
    return res.status(500).json({
      error: "Report generation failed",
      message: err?.message ?? String(err),
    });
  }
}

