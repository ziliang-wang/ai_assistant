export type Role = 'user' | 'assistant' | 'system';

export type Message = {
    role: Role;
    content: string;
};
// export type ChatLogType = {
//     role: Role;
//     content: string;
// };
export type MessageList = Message[];
// 多個session
export type Session = {
    name: string;
    id: string;
};

export type SessionList = Session[];


// export type ChatLogsType = Message[];
// export type ChatLogsType = ChatLogType[];

export type ChatLogsStorageType = {
    [key: string]: MessageList
};

// export type ChatLogsStorageType = {
//     [key: string]: ChatLogsType
// };
// assistant module
export type Assistant = {
    id: string;
    name: string;
    prompt: string;
    description?: string;
    temperature?: number;
    max_log: number;
    max_tokens: number;
};


export type AssistantList = Assistant[]; 