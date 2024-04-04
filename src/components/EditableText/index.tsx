import { ChangeEvent, useState, KeyboardEvent } from "react";
import clsx from "clsx";

type Props = {
    text: string;
    onSave: (name: string) => void;
};

export const EditableText = (props: Props) => {

    const [ isEditing, setIsEditing ] = useState(false);
    const [ text, setText ] = useState(props.text);

    const onChange = (e: ChangeEvent<HTMLInputElement>) => {
        setText(e.target.value);
    };

    const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            setIsEditing(false);
            props.onSave(text);
        }
    };

    const onBlur = () => {
        if (isEditing) {
            setIsEditing(false);
            setText(props.text);
        }
    };

    if (isEditing) {
        return (
            <div>
                <input
                    className={
                        clsx([
                            'w-[10rem',
                            'flex',
                            'items-center',
                            'h-[2rem]',
                            'outline-none',
                            'border-none'
                        ])
                    } 
                    value={ text } 
                    onChange={ onChange } 
                    onKeyDown={ onKeyDown }
                    onBlur={ onBlur }
                    autoFocus
                />
            </div>
        );
    } 
    return (
        <div
            onDoubleClick={() => { setIsEditing(true); }}
            className={
                clsx([
                    'font-bold',
                    'leading-9',
                    'w-[10rem]',
                    'h-[2-rem]',
                    'overflow-hidden',
                    'text-ellipsis',
                    'whitespace-nowrap'
                ])  
            }
        >
            { text }
        </div>
    );
};