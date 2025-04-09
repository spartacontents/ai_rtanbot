// app/api/summary/route.ts
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  const { userName, concern } = await req.json()

  const prompt = `
사용자 이름: ${userName}
사용자 고민: ${concern}

[고민 내용 요약] : 고민(${concern}) 내용을 정리해줄 것. 

[해결책] : 고민에 대한 짧은 공감과 해결책 제시. 
- 말투 : 스파르타 용사가 말하는 말투로 ~하오, ~있소 체로 작성할 것.
- 부정어 없이 긍정어로만 작성할 것.
- 단점을 언급하지 말 것.
 
다음 형식으로 답변해주세요:
"당신의 고민은 [고민 내용 요약] 이군요. \n [고민에 대한 짧은 공감과 짧은 해결책] 
\n팀스파르타에서는 여러가지 교육 튜터 활동을 [고민을 튜터 지원해야한다는 내용과 연관지어서 말해줘]
  `

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    }),
  })

  const data = await res.json()
  const aiMessage = data?.choices?.[0]?.message?.content ?? null

  return NextResponse.json({ message: aiMessage })
}

