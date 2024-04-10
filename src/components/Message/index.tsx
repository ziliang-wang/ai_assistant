import { useEffect, useState, KeyboardEvent, useRef } from "react";
import { Assistant, MessageList } from "@/types";
// import { ChatLogsType } from "@/types";
import * as chatStorage from "@/utils/ChatStorage";
// import { clearMessage, getMessage, updateMessage } from "@/utils/ChatStorage";
// import { clearChatLogs, getChatLogs, updateChatLogs } from "@/utils/ChatStorage";
import chatService from "@/utils/chatServe";
// import { getCompletion } from "@/utils/getCompletion";
import { Textarea, ActionIcon, Button, Popover } from "@mantine/core";
import { IconSend, IconEraser, IconSendOff, IconDotsVertical, IconUser, IconAlien } from "@tabler/icons-react";
import Link from "next/link";
import clsx from "clsx";
import { AssistantSelect } from "../AssistantSelect";
import { notifications } from "@mantine/notifications";

const showNotification = (message: string) => {
    notifications.show({
        id: 'Alert',
        title: 'Alert',
        message,
        color: 'red',
        autoClose: 3000
    });
};

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
    const [ assistant, setAssistant ] = useState<Assistant>();

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
        const session = chatStorage.getSession(sessionId);
        setAssistant(session?.assistant);
        const msg = chatStorage.getMessage(sessionId);
        // const logs = getMessage(sessionId);
        // const logs = getChatLogs(sessionId);
        setMessage(msg);
        
        if (loading) {
            chatService.cancel();
        }

    }, [sessionId]);

    const onAssistantChange = (assistant: Assistant) => {
        setAssistant(assistant);
        chatStorage.updateSession(sessionId, {
            assistant: assistant.id,

        });
    }

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

    let msgScrollTop: number;
    const messageRef: any = useRef(null);
    const itemRef: any = useRef(null);
    const inputRef: any = useRef(null);

    useEffect(() => {
        msgScrollTop = itemRef.current?.offsetTop || 0;
        messageRef.current.scrollTop = msgScrollTop;
        inputRef.current.focus();
    });


    const onSubmit = () => {

        if (loading) {
            return chatService.cancel();
        }

        if (prompt.trim() === '' || prompt.length < 5) {
            // alert('Please input valid prompt.');
            showNotification('至少說個Hello吧，字數太少就沒什麼意思了啦');
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
            options: assistant,
            history: list.slice(-assistant?.max_log!)
        });
        setPrompt('');
    };

    return (
        <div className="h-[100vh] flex flex-col w-full bg-slate-200 pb-2">
            {/* header */}
            <div 
                className={clsx([
                    'flex',
                    'justify-between',
                    'items-center',
                    'p-4',
                    'shadow-sm',
                    'h-[4rem]'
                ])}
            >
                {/* left */}
                <Popover width={100} position="bottom" withArrow shadow="sm">
                    <Popover.Target>
                    <Link href="/assistant">
                        <Button 
                            size="sm" 
                            variant="subtle" 
                            className="px-1"
                            rightIcon={ <IconDotsVertical size="1rem" /> }
                        >
                            Jomunn AI 助理管理
                        </Button>
                    </Link>
                    </Popover.Target>
                    {/* <Popover.Dropdown>
                        <Link href="/assistant">助理管理</Link>
                    </Popover.Dropdown> */}
                </Popover>
                {/* center */}
                {/* <div>Welcome to Jomunn AI</div> */}
                {/* right */}
                <AssistantSelect
                    value={ assistant?.id! }
                    onChange={ onAssistantChange } 
                ></AssistantSelect>
            </div>
            {/* message content */}
            <div ref={messageRef} className="h-[calc(100vh-4rem)] overflow-y-auto mx-auto w-[90%] md:w-5/6 flex-col rounded-sm">
                {
                    message.map((item, idx) => {
                        return (
                            <div key={`${item.role}-${idx}`}
                                style={
                                    {
                                        display: item.role === 'user' ? 'flex' : 'block',
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
                                <div className="flex items-center">
                                    <div 
                                        style={{ 
                                                order: item.role == 'user' ? 1 : 0, 
                                                marginRight: item.role == 'assistant' ? '.5rem' : 0,
                                                marginLeft: item.role == 'user' ? '.5rem' : 0
                                            }}>
                                        {item.role == 'assistant' ? <IconAlien /> : <IconUser />}
                                    </div>
                                    <div ref={itemRef} className="shadow-md rounded-md py-2 mt-1 px-2 w-full bg-blue-200">
                                        {item.content}
                                    </div>
                                </div>
                                { item.role == 'assistant' && idx === message.length - 1 && loading ? 
                                    <div    
                                        onClick={() => { chatService.cancel(); }} 
                                        className="
                                            cursor-pointer 
                                            w-[10%] 
                                            mx-auto 
                                            text-center 
                                            p-1 
                                            text-sm 
                                            mt-3 
                                            rounded-xl 
                                            bg-white"
                                        >
                                        停止
                                    </div> 
                                    : null
                                }                  
                            </div>
                        );
                    })
                }
            </div>
            <div className="mx-auto flex items-center w-[90%] md:w-5/6 mt-6">
                <ActionIcon className="mr-2" onClick={onClear} disabled={loading}>
                    <IconEraser size={50}></IconEraser>
                </ActionIcon>
                <Textarea
                    ref={inputRef}
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