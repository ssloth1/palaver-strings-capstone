import React, { useEffect, useState } from 'react';
import axios from 'axios';
import messageService from "../../../services/messageServices";
import Loader from '../../general-components/Loader';


function SentMessages() {

    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);

        const email = localStorage.getItem('email');
        const request = { email: email};
        
        const fetchData = async () => {
            try {
                const messageData = await axios.get("http://localhost:4000/api/messages/fromUser/", request);
                const messages = await messageService.renderMessages(messageData.data);
                //update messages
                setMessages(messages);
                //turn off loading
                setLoading(false);
            } catch (error) {
                console.error('Fetch error:', error);
            }
        };    
        fetchData();
    }, []);

    if (loading) {
        return <Loader />;
    }

    return (
        <div>
            <h1>Outbox</h1>
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

export default SentMessages;