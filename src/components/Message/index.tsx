import { useEffect, useState, KeyboardEvent } from "react";
import { MessageList } from "@/types";
// import { ChatLogsType } from "@/types";
import * as chatStorage from "@/utils/ChatStorage";
// import { clearMessage, getMessage, updateMessage } from "@/utils/ChatStorage";
// import { clearChatLogs, getChatLogs, updateChatLogs } from "@/utils/ChatStorage";
import chatService from "@/utils/chatServe";
// import { getCompletion } from "@/utils/getCompletion";
import { Textarea, ActionIcon, Button, Popover } from "@mantine/core";
import { IconSend, IconEraser, IconSendOff, IconDotsVertical } from "@tabler/icons-react";
import Link from "next/link";
import clsx from "clsx";
// import clsx from "clsx";

// const sessionId = 'ai_demo';

type Props = {
    sessionId: string;
};

export const Message = ({sessionId}: Props) => {

    const [prompt, setPrompt] = useState('');

    const [loading, setLoading] = useState(false);

    // const [completion, setCompletion] = useState('');

    const [message, setMessage] = useState<MessageList>([]);
    // const [chatList, setChatList] = useState<MessageList>([]);
    // const [ chatList, setChatList ] = useState<ChatLogsType>([]);

    const updateMessage = (msg: MessageList) => {
        setMessage(msg);
        chatStorage.updateMessage(sessionId, msg);
    };


    chatService.actions = {
        onCompleting: sug => setSuggestion(sug),
        onCompleted: () => {
            setLoading(false);
        }
    };


    useEffect(() => {
        const msg = chatStorage.getMessage(sessionId);
        // const logs = getMessage(sessionId);
        // const logs = getChatLogs(sessionId);
        setMessage(msg);
        
        if (loading) {
            chatService.cancel();
        }

    }, [sessionId]);

    const onClear = () => {
        // chatStorage.clearMessage(sessionId);
        // clearChatLogs(sessionId);
        // setMessage([]);
        updateMessage([]);
    };

    const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            onSubmit();
            // getAIResp();
        }
    };

    const setSuggestion = (suggestion: string) => {
        if (suggestion === '') return;
        const len = message.length;
        const lastMessage = len ? message[len - 1] : null;
        let newList: MessageList = [];
        if (lastMessage?.role === 'assistant') {
            newList = [
                ...message.slice(0, len - 1),
                {
                    ...lastMessage,
                    content: suggestion
                }
            ]
        } else {
            newList = [
                ...message,
                {
                    role: 'assistant',
                    content: suggestion
                }
            ];
        }
        setMessages(newList);
        // setChatList(newList);
    };

    const setMessages = (msg: MessageList) => {
        setMessage(msg);
        chatStorage.updateMessage(sessionId, msg);
        // updateChatLogs(sessionId, msg);
    };

    // const setChatLogs = (logs: MessageList) => {
    //     setChatList(logs);
    //     updateChatLogs(sessionId, logs);
    // };

    // const setChatLogs = (logs: ChatLogsType) => {
    //     setChatList(logs);
    //     updateChatLogs(sessionId, logs);
    // };

    // const getAIResp = async () => {

    //     if (prompt.trim() === '' || prompt.length < 6) {
    //         alert('Please input valid prompt.');
    //         return;
    //     }

    //     setLoading(true);

    //     const list: MessageList = [
    //         ...chatList,
    //         {
    //             role: 'user',
    //             content: prompt
    //         }
    //     ];

    //     setChatLogs(list);

    //     const resp = await getCompletion({
    //         prompt,
    //         history: chatList.slice(-4)
    //     });

    //     setPrompt('');
    //     // setCompletion(resp.content);
    //     // console.log(resp);
    //     setChatLogs([
    //         ...list,
    //         {
    //             role: 'assistant',
    //             content: resp.content
    //         }
    //     ]);

    //     setLoading(false);
    // };
    const onSubmit = () => {

        if (loading) {
            return chatService.cancel();
        }

        if (prompt.trim() === '' || prompt.length < 5) {
            alert('Please input valid prompt.');
            return;
        }

        let list: MessageList = [
            ...message,
            {
                role: 'user',
                content: prompt
            }
        ];
        setMessages(list);
        setLoading(true);
        chatService.getStream({
            prompt,
            history: list.slice(-6)
        });
        setPrompt('');
    };

    return (
        <div className="h-screen flex flex-col w-full bg-slate-200">
            {/* header */}
            <div 
                className={clsx([
                    'flex',
                    'justify-between',
                    'items-center',
                    'p-4',
                    'shadow-sm',
                    'h-[6rem]'
                ])}
            >
                {/* left */}
                <Popover width={100} position="bottom" withArrow shadow="sm">
                    <Popover.Target>
                        <Button 
                            size="sm" 
                            variant="subtle" 
                            className="px-1"
                            rightIcon={ <IconDotsVertical size="1rem" /> }
                        >
                            Jomunn AI 助理
                        </Button>
                    </Popover.Target>
                    <Popover.Dropdown>
                        <Link href="/assistant">助理管理</Link>
                    </Popover.Dropdown>
                </Popover>
                {/* right */}
                <div>選擇助理</div>
            </div>
            {/* message content */}
            <div className="w-3/5 h-[calc(100vh-7rem)] flex-col overflow-y-auto scrollbar-none rounded-sm">
                {
                    message.map((item, idx) => {
                        return (
                            <div key={`${item.role}-${idx}`}
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
                                <div>{item.role}</div>
                                <div className="rounded-md py-2 mt-1 w-full md:w-[50%] bg-blue-200">
                                    {item.content}
                                </div>
                            </div>
                        );
                    })
                }
            </div>
            <div className="flex items-center w-3/5 mt-6">
                <ActionIcon className="mr-2" onClick={onClear} disabled={loading}>
                    <IconEraser size={50}></IconEraser>
                </ActionIcon>
                <Textarea
                    disabled={loading}
                    placeholder="Enter your prompt"
                    className="w-full"
                    value={prompt}
                    onChange={(e) => { setPrompt(e.target.value); }}
                    onKeyDown={onKeyDown}
                >
                </Textarea>
                {/* <ActionIcon className="ml-2" onClick={ onSubmit } loading={loading}> */}
                <ActionIcon className="ml-2" onClick={ onSubmit }>
                    {
                        loading ? <IconSendOff /> : <IconSend size={50} />
                    }
                    {/* <IconSend size={50}></IconSend> */}
                </ActionIcon>
                {/* <ActionIcon className="ml-2" onClick={getAIResp} loading={loading}>
                    <IconSend size={50}></IconSend>
                </ActionIcon> */}
                {/* <Button onClick={ getAIResp }>Send</Button> */}
            </div>
        </div>
    );
};