import React from "react";

const MessageCard = ({isReqUserMessage, content}) => {
    return (
        // braces in classname to accomodate the condition
        <div className={`py-2 px-2 rounded-md max-w-[50%] ${isReqUserMessage ? "self-end bg-purple-100" : "self-start bg-white"}`}>
            <p>{content}</p>
        </div>
    )
}

export default MessageCard;