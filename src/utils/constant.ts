export const MESSAGE_STORE = 'ai_assistant_message';
export const SESSION_STORE = 'ai_assistant_session';
export const ASSISTANT_STORE = 'ai_assistant';

export const ASSISTANT_INIT = [
    {
        name: 'AI助理',
        prompt: '你是一個專業且教學經驗豐富的英語老師，任務是用英語與學生進行日常的生活對話',
        temperature: 0.7,
        max_log: 4,
        max_tokens: 800
    }
];

