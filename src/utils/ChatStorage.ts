// api層
import { MESSAGE_STORE, SESSION_STORE, ASSISTANT_STORE } from "./constant";
import { ChatLogsStorageType, MessageList, SessionList, Session, SessionInfo } from "@/types";
// import { ChatLogsStorageType, ChatLogsType } from "@/types";
import { getLocal, setLocal } from "./storage";
import assistantStore from "./assistantStore";

// save ChatLogs

// const MESSAGE_STORE = 'ai_chatLogs';
// Messages
export const getMessageStore = () => {
    let list = getLocal<ChatLogsStorageType>(MESSAGE_STORE);
    if (!list) {
        list = {};
        setLocal(MESSAGE_STORE, list);
    }
    return list;
};


export const getMessage = (id: string) => {
    const logs = getMessageStore();
    return logs[id] || [];
};
// export const getChatLogs = (id: string) => {
//     const logs = getMessageStore();
//     return logs[id] || [];
// };


export const updateMessage = (id: string, log: MessageList) => {
    const logs = getMessageStore();
    logs[id] = log;
    setLocal(MESSAGE_STORE, logs);
};

// export const updateChatLogs = (id: string, log: ChatLogsType) => {
//     const logs = getChatLogsContainer();
//     logs[id] = log;
//     setLocal(MESSAGE_STORE, logs);
// };

export const clearMessage = (id: string) => {
    const logs = getMessageStore();

    if (logs[id]) {
        logs[id] = [];
    }

    setLocal(MESSAGE_STORE, logs);
}
// sessions
export const getSessionStore = (): SessionList => {
    let list: SessionList = getLocal(SESSION_STORE) as SessionList;

    const assistant = assistantStore.getList()[0];

    if (!list) {
        const session = {
            name: 'chat',
            assistant: assistant.id,
            id: Date.now().toString()
        }

        list = [session];
        updateMessage(session.id, []);
        setLocal(SESSION_STORE, list);
    }
    return list;
};


export const updateSessionStore = (list: SessionList) => {
    setLocal(SESSION_STORE, list);
};


export const addSession = (session: Session): SessionList => {
    const list: any = getSessionStore();
    list.push(session);
    updateSessionStore(list);
    return list;
};


export const getSession = (id: string): SessionInfo | null => {
    const list = getSessionStore();
    const session = list.find(session => session.id === id);

    if (!session) return null;

    const { assistant } = session;

    let assistantInfo = assistantStore.getAssistant(assistant);

    if (!assistantInfo) {
        assistantInfo = assistantStore.getList()[0];
        updateSession(session.id, { assistant: assistantInfo.id });
    }

    return {
        ...session,
        assistant: assistantInfo,

    }

    // return list.find(session => session.id === id) || null;
    // return list.find(session => session.id === id) || {};
};

// 把里面的id取出來，其它變成可選
export const updateSession = (id: string, data: Partial<Omit<Session, 'id'>>): SessionList => {
    const list = getSessionStore();
    const index = list.findIndex(session => session.id === id);
    if (index > -1) {
        list[index] = {
            ...list[index],
            ...data
        }
        updateSessionStore(list);
    }
    return list;
};


export const removeSession = (id: string) => {
    const list = getSessionStore();
    const newList = list.filter(session => session.id !== id);
    updateSessionStore(newList);
    return newList;
};