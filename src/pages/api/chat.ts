// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { MessageList } from '@/types';
// import type { NextApiRequest, NextApiResponse } from 'next';
import type { NextRequest } from 'next/server';
import { createParser, ParsedEvent, ReconnectInterval } from 'eventsource-parser'; 
// type Data = {
//   name: string
// }

type StreamPayLoad = {
  model: string;
  messages: MessageList;
  temperature?: number;
  stream: boolean;
  max_tokens?: number;
};

export default async function handler(
  req: NextRequest,
  // req: NextApiRequest,
  // res: NextApiResponse<Data>
  // res: NextApiResponse
) {

  const { prompt, history=[], options={} } = await req.json();
  // const { prompt, history=[], options={} } = await req.body;

  const data = {
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: 'system',
        content: 'you are ai assistant'
      },
      ...history,
      {
        role: 'user',
        content: prompt
      }
    ],
    stream: true,
    ...options
  };

  const strem = await requestStream(data);
  return new Response(strem);

  // const resp = await fetch('https://api.openai.com/v1/chat/completions', {
  //   headers: {
  //     Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
  //     'Content-Type': 'application/json'
  //   },
  //   method: 'POST',
  //   body: JSON.stringify(data)
  // })

  // const json = await resp.json();

  // res.status(200).json({ name: 'John Doe' })
  // res.status(200).json({...json.choices[0].message});
}

const requestStream = async (payload: StreamPayLoad) => {
  let counter = 0;
  const resp = await fetch('https://api.openai.com/v1/chat/completions', {
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json'
    },
    method: 'POST',
    body: JSON.stringify(payload)
  })
  // try error 若有錯務， 直接返回
  if (resp.status !== 200) {
    return resp.body;
  }
  return createStream(resp, counter);
};

const createStream = (response: Response, counter: number) => {
  
  const decoder = new TextDecoder('utf-8');
  const encoder = new TextEncoder();
  
  return new ReadableStream({
    async start(controller) {

      const onParse = (event: ParsedEvent | ReconnectInterval) => {
        if (event.type === 'event') {
          const data = event.data;
          if (data === '[DONE]') {
            controller.close();
            return;
          }
          try {
            const json = JSON.parse(data);
            const text = json.choices[0]?.delta?.content || '';
            if (counter < 2 && (text.match(/\n/) || []).length) {
              return;
            }
            const q = encoder.encode(text);
            controller.enqueue(q);
            counter++;
          } catch (error) {

          }
        }
      };

      const parser = createParser(onParse);

      for await (const chunk of response.body as any) {
        // console.log(decoder.decode(chunk));
        parser.feed(decoder.decode(chunk));
      }
    }
  })
};

export const config = {
  runtime: 'edge'
};
