// app/api/summary/route.ts
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  const { userName, concern } = await req.json()

  const prompt = `
사용자 이름: ${userName}
사용자 고민: ${concern}

[고민 내용 요약] 에는 ${concern} 내용을 요약해주고, [고민에 대한 짧은 공감과 해결책]을 제시해서 아래 형식에 맞게 답변해주세요.

다음 형식으로 답변해주세요:
"${userName}님의 고민은 [고민 내용 요약] 이시군요. [고민에 대한 짧은 공감과 해결책] 

팀스파르타에는 내가 원하는 시간에 재택근무할 수 있는 튜터 활동과 대기업 등에서 진행하는 오프라인 튜터 활동이 있어요!
> 튜터 지원하러가기 : https://spartacodingclub.kr/"
`

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    }),
  })

  const data = await res.json()
  const aiMessage = data?.choices?.[0]?.message?.content ?? null

  return NextResponse.json({ message: aiMessage })
}

