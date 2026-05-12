// app/api/chat/route.ts
import { NextRequest, NextResponse } from "next/server"

export const runtime = "nodejs"
export const maxDuration = 60

const GEMINI_MODEL = "gemini-2.5-flash"

export async function POST(req: NextRequest) {
  const { userName, concern } = await req.json()

  if (!process.env.GEMINI_API_KEY) {
    console.error("[api/chat] GEMINI_API_KEY is not set")
    return NextResponse.json(
      { message: null, error: "GEMINI_API_KEY is not set on the server." },
      { status: 500 },
    )
  }

  const prompt = `
사용자 이름: ${userName}
사용자 고민: ${concern}

[고민 내용 요약] 에는 ${concern} 내용을 요약해주고, [고민에 대한 짧은 공감과 해결책]을 제시해서 아래 형식에 맞게 답변해주세요.

다음 형식으로 답변해주세요:
"${userName}님의 고민은 [고민 내용 요약] 이시군요. [고민에 대한 짧은 공감과 해결책]

팀스파르타에는 내가 원하는 시간에 재택근무할 수 있는 튜터 활동과 대기업 등에서 진행하는 오프라인 튜터 활동이 있어요!
> 튜터 지원하러가기 : https://spartacodingclub.kr/"
`

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.7 },
        }),
      },
    )

    const data = await res.json()

    if (!res.ok) {
      console.error("[api/chat] Gemini API error:", res.status, JSON.stringify(data))
      return NextResponse.json(
        { message: null, error: data?.error?.message ?? `Gemini API ${res.status}` },
        { status: 502 },
      )
    }

    const aiMessage = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? null

    if (!aiMessage) {
      console.error("[api/chat] No text in response:", JSON.stringify(data))
      return NextResponse.json(
        { message: null, error: "No text returned by Gemini.", raw: data },
        { status: 502 },
      )
    }

    return NextResponse.json({ message: aiMessage })
  } catch (err) {
    console.error("[api/chat] Fetch failed:", err)
    return NextResponse.json(
      { message: null, error: (err as Error).message },
      { status: 500 },
    )
  }
}
