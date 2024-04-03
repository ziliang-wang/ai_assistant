import { useEffect, useState } from "react";
import * as chatStorage from '@/utils/ChatStorage';
import { Message } from "@/components/Message";
import { Session } from "@/components/Session";

export const Chat = () => {

    const [ sessionId, setSessionId ] = useState<string>('');

    useEffect(() => {
        const init = () => {
            const list = chatStorage.getSessionStore();
            const id = list[0].id;
            setSessionId(id);
        };
        init();
    }, []);

    return (
        <div className="h-screen flex w-screen">
            <Session sessionId={ sessionId } onChange={ setSessionId } />
            <Message sessionId={ sessionId } />
        </div>
    )
};