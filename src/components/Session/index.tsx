import { useEffect, useState } from "react";
import { SessionList } from "@/types";
import * as chatStorage from '@/utils/ChatStorage';
import { useMantineColorScheme, ActionIcon } from "@mantine/core";
import { IconTrash, IconMessagePlus } from "@tabler/icons-react";

type Props = {
    sessionId: string;
    onChange: (arg: string) => void;
};

export const Session = ({ sessionId, onChange }: Props) => {

    const [ sessionList, setSessionList ] = useState<SessionList>([]);
    const { colorScheme } = useMantineColorScheme();

    useEffect(() => {
        const list = chatStorage.getSessionStore();
        setSessionList(list);
    }, []);

    const createSession = () => {
        // const list = chatStorage.getSessionStore();
        const newSession = {
            name: `session-${sessionList.length + 1}`,
            id: Date.now().toString()
        };
        onChange(newSession.id);
        let list = chatStorage.addSession(newSession);
        setSessionList(list);
    };

    const removeSession = (id: string) => {
        let list = chatStorage.removeSession(id);
        if (sessionId === id) {
            onChange(list[0].id);
        }
        setSessionList(list);
    };

    return (
        <div className="h-screen w-64 flex flex-col px-2">
            {
                sessionList.map(({ id, name }) => {
                    return (
                        <div>
                            <div>{ name }</div>

                            { 
                                sessionList.length > 1 ? 
                                    <IconTrash 
                                        size=".8rem" 
                                        color="gray" 
                                        onClick={ (e) => { 
                                            e.stopPropagation();
                                            removeSession(id);
                                        }}
                                        className="mx-1 invisible group-hover:visible"
                                    >
                                    </IconTrash>
                                : null
                            }
                        </div>
                    );
                })
            }
        </div>
    );
}