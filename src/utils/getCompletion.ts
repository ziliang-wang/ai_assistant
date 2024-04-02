import { ChatLogType } from "@/types";
// type ChatLogType = {
//     role: string;
//     content: string;
// };

type Props = {
    prompt: string;
    history?: ChatLogType[];
    options?: {
        temperature?: number;
        max_tokens?: number;
        // top_p?: number;
        // frequency_penalty?: number;
        // presence_penalty?: number;
    };
};

export const getCompletion = async (params: Props) => {
    const resp = await fetch('/api/chat', {
        headers: {
            'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify(params)
    });

    if (!resp.ok) {
        throw new Error(resp.statusText);
    }

    const data = resp.json();
    return data;
};