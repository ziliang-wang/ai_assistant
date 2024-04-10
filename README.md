近看過在類似的應用里，AI回覆進行式，會有Stop按鈕，功能是停止串流輸出，

從善如流，於是也在Jomuunn專案里，加入類似的功能，

在JSX里，新增以下程式碼，達到預期效果：

![image](https://github.com/ziliang-wang/ai_assistant/assets/56996180/20f6bba2-92ab-4159-b8ae-afb685de17a6)

其中，chatService.cancel()方法，是我之前另外封裝的，其實就是內建的實例物件，用來停止網路請求。

new AbortController();

Bugs fixed record:

1,
發現的問題是，message的頁面在每次render後，scrollbar 無法自動往下，

而且讓用戶輸入的input，也必須每次自動獲得焦點會好一點，

修正思路是，取得相關的dom元素，做scrollTop和focus()的操作即可，

以下為修正bug的程式碼：

![image](https://github.com/ziliang-wang/ai_assistant/assets/56996180/83bd3adb-4f98-4933-90b0-3d22549c340e)














This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
