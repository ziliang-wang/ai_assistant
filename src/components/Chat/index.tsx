import { ChatLogsType } from "@/types";
import { getCompletion } from "@/utils/getCompletion";
import { Textarea, Button } from "@mantine/core";
import { useState } from "react";


export const Chat = () => {

    const [ prompt, setPrompt ] = useState('');

    const [ completion, setCompletion ] = useState('');

    const [ chatList, setChatList ] = useState<ChatLogsType>([]);

    const getAIResp = async () => {
        const list = [
            ...chatList,
            {
                role: 'user',
                content: prompt
            }
        ];

        setChatList(list);

        const resp = await getCompletion({
            prompt
        })
        setCompletion(resp.content);
        // console.log(resp);
        setChatList([
            ...list,
            {
                role: 'assistant',
                content: resp.content
            }
        ]);
    };

    return (
    <div className="h-screen items-center flex flex-col">
        <div className="h-[50vh]">
            {
                chatList.map((item, idx) => {
                    return (
                        <div key={ `${item.role}-${idx}` }>
                            <div>{ item.role }</div>
                            <div>{ item.content }</div>
                        </div>
                    );
                })
            }
        </div>
        <div className="flex items-center w-3/5">
            <Textarea
                placeholder="Enter your prompt" 
                className="w-full" 
                value={ prompt }
                onChange={ (e) => { setPrompt(e.target.value); } }
            >
            </Textarea>
            <Button onClick={ getAIResp }>Send</Button>
        </div>
    </div>
    );
};