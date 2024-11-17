import { useEffect, useRef } from "react";
import { Message, Who } from "../types";

interface MessagesProps {
    messages: Message[];
}

const formatMessage = (message: string): JSX.Element => {
    if (message === "" || message === "\n") {
        return (<br />);
    }
    return (<span>{message}</span>);
};

const Messages = ({ messages }: MessagesProps) => {
    const messagesEndRef = useRef<null | HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages]);

    return (
        < section className="m-4" >
            <div className="min-h-80 max-h-80 border-gray-400 border border-solid p-4 bg-slate-700 overflow-y-scroll">
                <ul>
                    {messages?.map((message, index) => (
                        <li key={index}>
                            <span className={message.who === Who.Server ? "italic" : "text-slate-400"}>
                                {formatMessage(message.text)}
                            </span>
                        </li>
                    ))}
                </ul>
                <div ref={messagesEndRef} />
            </div>
        </section >
    )
}

export default Messages;