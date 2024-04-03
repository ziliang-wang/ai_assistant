import { Message } from "@/types";
// import { resolve } from "path";
// import { ChatLogType } from "@/types";
// type ChatLogType = {
//     role: string;
//     content: string;
// };

type StreamParams = {
    prompt: string;
    history?: Message[];
    // history?: ChatLogType[];
    options?: {
        temperature?: number;
        max_tokens?: number;
        // top_p?: number;
        // frequency_penalty?: number;
        // presence_penalty?: number;
    };
};

// type Props = {
//     prompt: string;
//     history?: Message[];
//     // history?: ChatLogType[];
//     options?: {
//         temperature?: number;
//         max_tokens?: number;
//         // top_p?: number;
//         // frequency_penalty?: number;
//         // presence_penalty?: number;
//     };
// };

type Actions = {
    onCompleting: (sug: string) => void;
    onCompleted: (sug: string) => void;

};


class ChatService {
    
    private static instance: ChatService;
    // callback1
    public actions?: Actions;
    // callback2

    public static getInstance(): ChatService {
        if (!ChatService.instance) {
            ChatService.instance = new ChatService();
        }
        return ChatService.instance;
    }

    public async getStream(params: StreamParams) {
        const { prompt, history=[], options={} } = params;
        let suggestion = '';

        try {
            const response = await fetch('/api/chat', {
                headers: {
                    'Content-Type': 'application/json'
                },
                method: 'POST',
                body: JSON.stringify({
                    prompt,
                    history,
                    options
                })
            });
            const data = response.body;
            if (!data) {
                return;
            }

            const reader = data.getReader();
            const decoder = new TextDecoder('utf-8');
            let done = false;

            while (!done) {
                const { value, done: doneReadingStream  } = await reader.read();
                done = doneReadingStream;
                const chunkValue = decoder.decode(value);
                suggestion += chunkValue;
                this.actions?.onCompleting(suggestion);

                await new Promise(resolve => setTimeout(resolve, 100));
            }

        } catch (error) {
            
        } finally {
            this.actions?.onCompleted?.(suggestion);
        }
    }
}

const chatService = ChatService.getInstance();

export default chatService;

// export const getCompletion = async (params: Props) => {
//     const resp = await fetch('/api/chat', {
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         method: 'POST',
//         body: JSON.stringify(params)
//     });

//     if (!resp.ok) {
//         throw new Error(resp.statusText);
//     }

//     const data = resp.json();
//     return data;
// };