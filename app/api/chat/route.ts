import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { query, conversation_id, user } = await req.json()

  const res = await fetch(`${process.env.DIFY_API_URL}/chat-messages`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.DIFY_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      inputs: {},
      query,
      response_mode: 'blocking',
      user: user || 'web-user',
      ...(conversation_id && { conversation_id }),
    }),
  })

  if (!res.ok) {
    return NextResponse.json({ error: 'Dify API 请求失败' }, { status: 500 })
  }

  const data = await res.json()
  return NextResponse.json(data)
}
