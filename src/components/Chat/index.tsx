import { getCompletion } from "@/utils/getCompletion";
import { Textarea, Button } from "@mantine/core";
import { useState } from "react";


export const Chat = () => {

    const [ prompt, setPrompt ] = useState('');

    const [ completion, setCompletion ] = useState('');

    const getAIResp = async () => {
        const resp = await getCompletion({
            prompt
        })
        setCompletion(resp.content);
        // console.log(resp);
        
    };

    return (
    <div className="h-screen items-center flex flex-col">
        <div>{ completion }</div>
        <div className="flex items-center w-3/5">
            <Textarea
                placeholder="Enter your prompt" 
                className="w-full" 
                value={ prompt }
                onChange={ (e) => { setPrompt(e.target.value); } }
            >
            </Textarea>
            <Button onClick={ getAIResp }>Send</Button>
        </div>
    </div>
    );
};