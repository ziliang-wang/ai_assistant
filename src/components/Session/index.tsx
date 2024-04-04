import { useEffect, useState } from "react";
import { SessionList } from "@/types";
import * as chatStorage from '@/utils/ChatStorage';
import { useMantineColorScheme, ActionIcon } from "@mantine/core";
import { IconTrash, IconMessagePlus } from "@tabler/icons-react";
import clsx from "clsx";
import { EditableText } from "../EditableText";

type Props = {
    sessionId: string;
    onChange: (arg: string) => void;
    className?: string;
};

const itemBaseClasses = "flex cursor-pointer h-[2.4rem] items-center justify-between group px-4 rounded-md";

const generateItemClasses = (
    id: string,
    sessionId: string,
    colorScheme: string
) => {
    return clsx(
        [
            itemBaseClasses,
            {
                "hover:bg-white": colorScheme === "light",
                // "hover:bg-gray-300/60": colorScheme === "light",
                "bg-gray-200/60": id !== sessionId && colorScheme === "light",
                // "bg-gray-200/60": id !== sessionId && colorScheme === "light",
                "bg-white": id === sessionId && colorScheme === "light",
                // "bg-gray-300": id === sessionId && colorScheme === "light",
                // "hover:bg-purple": colorScheme === "dark",
                "hover:bg-zinc-800/50": colorScheme === "dark",
                "bg-zinc-800/20": id !== sessionId && colorScheme === "dark",
                "bg-zinc-800/90": id === sessionId && colorScheme === "dark"
            }
        ]
    );
};

export const Session = ({ sessionId, onChange, className }: Props) => {

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

    const updateSession = (name: string) => {
        let newSessionList = chatStorage.updateSession(sessionId, { name });
        setSessionList(newSessionList);
    };

    return (
        // className="h-screen w-64 flex flex-col px-2 bg-slate-500"
        <div
            className={clsx(
                {
                  "bg-black/10": colorScheme === "dark",
                  "bg-gray-100": colorScheme === "light",
                },
                "h-screen",
                "w-64",
                "flex",
                "flex-col",
                "px-2",
                "bg-slate-800",
                className,
              )} 
        >
            <div className="flex items-center justify-center py-2 w-full my-2">
                <ActionIcon onClick={ createSession } color="green" size="sm">
                    <IconMessagePlus size="5rem" />
                </ActionIcon>
                {/* <IconArrowBadgeLeft color="white"></IconArrowBadgeLeft> */}
                {/* <div className="text-white text-sm">Add&nbsp;ChatRoom</div> */}
            </div>
            <div className="pb-4 overflow-y-auto scrollbar-none flex flex-col gap-y-2">
                {
                    sessionList.map(({ id, name }) => {
                        return (
                            <div 
                                key={ id } 
                                onClick={() => { onChange(id); }}
                                className={ `${generateItemClasses(id, sessionId, colorScheme)}` }
                            >
                                <EditableText 
                                    text={ name } 
                                    onSave={() => { updateSession(name); }}
                                >
                                </EditableText>
                                {/* <div className="font-bold">{ name }</div> */}

                                { 
                                    sessionList.length > 1 ? 
                                        <IconTrash 
                                            size="1rem" 
                                            color="green" 
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
        </div>
    );
}