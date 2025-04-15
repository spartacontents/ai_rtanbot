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

[팀스파르타 튜터 활동] 
: 팀스파르타에서 튜터로 활동할 수 있는 활동 내용을 사용자의 고민에 연관지어서 제시해줄 것.
: 돈을 많이 벌고 싶다면 아래 튜터역할  중에 적절하게 하나 선택해서 제시할 것.
- 오프라인 강사 튜터(DX 교육 등)
- 온라인 강의 튜터
- 학습 자료 제작 튜터
- 질의응답 튜터
- 학습 지원 튜터
- 학습 상담 튜터

다음 형식으로 답변해주세요:
"그대의 고민은 [고민 내용 요약 이로다.]  \n [고민에 대한 짧은 공감과 짧은 해결책] 
\n나도 그대와 비슷한 근심이 있었는데, 팀스파르타에서는 여러가지 교육 튜터 활동을 [고민과 연관있는 튜터활동 내용으로 연관지어서 해결한 경험을 얘기해줘]
\n그대에게 알맞은 역할인 팀스파르타 [당신에게 알맞은 튜터 역할제시]로 지원해보시오~!
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

