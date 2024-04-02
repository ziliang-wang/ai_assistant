import { ChatLogsType } from "@/types";
import { getChatLogs, updateChatLogs } from "@/utils/ChatStorage";
import { getCompletion } from "@/utils/getCompletion";
import { Textarea, Button } from "@mantine/core";
// import clsx from "clsx";
import { useEffect, useState } from "react";

const LOCAL_KEY = 'ai_demo';

export const Chat = () => {

    const [ prompt, setPrompt ] = useState('');

    const [ completion, setCompletion ] = useState('');

    const [ chatList, setChatList ] = useState<ChatLogsType>([]);

    useEffect(() => {
        const logs = getChatLogs(LOCAL_KEY);
        setChatList(logs);
    }, []);

    const setChatLogs = (logs: ChatLogsType) => {
        setChatList(logs);
        updateChatLogs(LOCAL_KEY, logs);
    };

    const getAIResp = async () => {
        const list = [
            ...chatList,
            {
                role: 'user',
                content: prompt
            }
        ];

        setChatLogs(list);

        const resp = await getCompletion({
            prompt
        })
        setCompletion(resp.content);
        // console.log(resp);
        setChatLogs([
            ...list,
            {
                role: 'assistant',
                content: resp.content
            }
        ]);
    };

    return (
    <div className="h-screen items-center flex flex-col">
        <div className="w-3/5 flex-col h-[calc(100vh-10rem]) overflow-y-auto rounded-sm">
            {
                chatList.map((item, idx) => {
                    return (
                        <div key={ `${item.role}-${idx}` }
                            style={
                                { 
                                    display: item.role === 'user' ? 'flex' : '',
                                    flexDirection: item.role === 'user' ? 'column' : 'column',
                                    alignItems: item.role === 'user' ? 'flex-end' : 'flex-start',
                                    marginTop: '1rem',
                                    textAlign: item.role === 'user' ? 'right' : 'left',

                                }
                            }
                            //  className={clsx({
                            //         flex: item.role === 'user',
                            //         'flex-col': item.role === 'user',
                            //         'items-end': item.role === 'user'
                            //         },'mt-4')}
                            >
                            <div>{ item.role }</div>
                            <div className="rounded-md py-2 mt-1 w-full md:w-[50%] bg-blue-200">
                                { item.content }
                            </div>
                        </div>
                    );
                })
            }
        </div>
        <div className="flex items-center w-3/5 mt-6">
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