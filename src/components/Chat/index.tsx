import { useEffect, useState, KeyboardEvent } from "react";
import { ChatLogsType } from "@/types";
import { clearChatLogs, getChatLogs, updateChatLogs } from "@/utils/ChatStorage";
import { getCompletion } from "@/utils/getCompletion";
import { Textarea, ActionIcon } from "@mantine/core";
import { IconSend, IconEraser } from "@tabler/icons-react";
// import clsx from "clsx";

const LOCAL_KEY = 'ai_demo';

export const Chat = () => {

    const [ prompt, setPrompt ] = useState('');

    const [ loading, setLoading ] = useState(false);

    const [ completion, setCompletion ] = useState('');

    const [ chatList, setChatList ] = useState<ChatLogsType>([]);

    useEffect(() => {
        const logs = getChatLogs(LOCAL_KEY);
        setChatList(logs);
    }, []);

    const onClear = () => {
        clearChatLogs(LOCAL_KEY);
        setChatList([]);
    };

    const onKeyDown = (e:KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            getAIResp();
        }
        
    };

    const setChatLogs = (logs: ChatLogsType) => {
        setChatList(logs);
        updateChatLogs(LOCAL_KEY, logs);
    };

    const getAIResp = async () => {

        if (prompt.trim() === '') {
            alert('Please input valid prompt.');
            return;
        }
        
        setLoading(true);

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
        });

        setPrompt('');
        setCompletion(resp.content);
        // console.log(resp);
        setChatLogs([
            ...list,
            {
                role: 'assistant',
                content: resp.content
            }
        ]);

        setLoading(false);
    };

    return (
    <div className="h-screen items-center flex flex-col">
        <div className="w-3/5 h-[calc(100vh-7rem)] flex-col overflow-y-auto rounded-sm">
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
            <ActionIcon className="mr-2" onClick={ onClear } disabled={ loading }>
                <IconEraser size={50}></IconEraser>
            </ActionIcon>
            <Textarea
                disabled={ loading }
                placeholder="Enter your prompt" 
                className="w-full" 
                value={ prompt }
                onChange={ (e) => { setPrompt(e.target.value); } }
                onKeyDown={ onKeyDown }
            >
            </Textarea>
            <ActionIcon className="ml-2" onClick={ getAIResp } loading={ loading }>
                <IconSend size={50}></IconSend>
            </ActionIcon>
            {/* <Button onClick={ getAIResp }>Send</Button> */}
        </div>
    </div>
    );
};