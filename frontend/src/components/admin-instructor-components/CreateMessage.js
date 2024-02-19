import React, { useContext, useState } from "react";
import { AuthContext } from '../../contexts/AuthContext';
import axios from 'axios';
import styles from './styles/CreateMessage.module.css';

function WriteMessage() {

    console.log("WriteMessage");

    const [statusMessage, setStatusMessage] = useState(""); // Just displays the submission status to the user.

    const {
        isLoggedIn,
        isAdmin,
        isInstructor
    } = useContext(AuthContext);

    const [formData, setFormData] = useState({

        toUsers: "",
        subjectLine: "",
        messageText: "",
        //toCategory //to be implemented in a future ticket.
    });

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: value,
        }));

    };

    const onSubmit = async (event) => {
        event.preventDefault();

        if(!isAdmin && !isInstructor){
            console.error("Only admins or instructors can send messages.");
            setStatusMessage("Only admins or instructors can send messages.");
        }

        if (!isLoggedIn) {
            console.error("Your login has expired.  You must be logged in to send messages.");
            setStatusMessage("Your login has expired.  You must be logged in to send messages.");
            return;
        }

        const userEmail = localStorage.getItem('email');

        const submissionData = {
            ...formData,
            fromUser: userEmail,
        };

        console.log(submissionData);

        try {
            const response = await axios.post('http://localhost:4000/api/messages', submissionData); //Need to update message controller to find user by email
            console.log("Message sent.", response.data);
            setStatusMessage("Message sent!");
        } catch (error) {
            console.log("Error creating message", error.message);
            setStatusMessage("Error creating message");
        }
    };

    return (
        <div className={styles.createMessage}>
            <form onSubmit={onSubmit}>

                {/*Text input for recipient email*/}
                <input type='text' name='toUsers' value={formData.toUsers} onChange={handleChange} placeholder="Recipient's Email" required />

                {/*Text input for subject*/}
                <input type='text' name='subjectLine' value={formData.subjectLine} onChange={handleChange} placeholder="Subject" />

                {/*Textarea input for message text */}
                <textarea name="messageText" rows="20" cols="60" value={formData.messageText} onChange={handleChange} placeholder="Type your message here..." required />
                
                {/*Submit Button*/}
                <button type="submit">Send Message</button>
                {statusMessage && <p>{statusMessage}</p>}
            </form>
        </div>
    );  
     
}

export default WriteMessage;