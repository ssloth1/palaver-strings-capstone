import React, { useEffect, useState } from 'react';
import axios from 'axios';

function ViewMessages() {

    const [messages, setMessages] = useState([]);

    /*
    Send email from local storage.
    */

    const request = { "email":localStorage.getItem('email') };

    useEffect(() => {
        const data = async () => {
            const messageData = await axios.post("http://localhost:4000/api/messages/mail", request);
            setMessages(messageData.data)
        }

        data();
    }, []);

    return (
        <div>
            <h1>Inbox</h1>
            <ul>
                {messages.map(message => (
                    <li key={message._id}>
                        <p>From: {message.fromUser} To: {message.toUsers} RE: {message.subjectLine}</p>
                        <p>{message.messageText}</p>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default ViewMessages;