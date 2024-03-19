import React, { useEffect, useState } from 'react';
import axios from 'axios';
import messageService from "../../services/messageServices";
import Loader from './Loader';


function ViewMessages() {

    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        const email = localStorage.getItem('email');
        const request = { email: email};
        
        const fetchData = async () => {
            try {
                //Retrieve messages based on user's email
                const messageData = await axios.post("http://localhost:4000/api/messages/mail", request);
                //run messages through message render to change user ids to names
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
            <h1>inbox</h1>
            <ul>
                {messages.map(message => (
                    <li key={message._id}>
                        <p>from: {message.fromUser} to: {message.toUsers} re: {message.subjectLine}</p>
                        <p>{message.messageText}</p>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default ViewMessages;