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
// export type ChatLogsType = Message[];
// export type ChatLogsType = ChatLogType[];

export type ChatLogsStorageType = {
    [key: string]: MessageList
};

// export type ChatLogsStorageType = {
//     [key: string]: ChatLogsType
// };
