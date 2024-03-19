import React, { useEffect, useContext, useState } from "react";
import { AuthContext } from '../../../contexts/AuthContext';
import axios from 'axios';
import styles from '../styles/CreateMessage.module.css';
import { USER_TYPES } from "../../../constants/formconstants";
import Loader from "../../general-components/Loader";

function WriteMessage() {

    console.log("WriteMessage");

    const [statusMessage, setStatusMessage] = useState(""); // Just displays the submission status to the user.
    const [loading, setLoading] = useState(false);
    const [palaverClasses, setPalaverClasses] = useState(new Array());

    const {
        isLoggedIn,
        isAdmin,
        isInstructor
    } = useContext(AuthContext);

    const [formData, setFormData] = useState({

        toUsers: [],
        subjectLine: "",
        messageText: "",
        toCategory: "",
        toClass: [],

    });    

    useEffect(() => {
        setLoading(true);
        fetch('/api/classes/')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (Array.isArray(data)) {
                const nameData = new Array();
                for (const item of data) {
                    console.log([item.name, item._id]);
                    nameData.push([item.name, item._id]);
                }
                setPalaverClasses(nameData);
            } else {
                console.warn('received data is not in an array');
                setPalaverClasses([]);
            }
        })
        .catch(error => {
            console.error('fetch error:', error);
            setStatusMessage(error.toString());
        })
        .finally(() => setLoading(false)); // Stop loading (purely cosmetic)
    }, []);

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
            return;
        }

        if (!isLoggedIn) {
            console.error("Your login has expired.  You must be logged in to send messages.");
            setStatusMessage("Your login has expired.  You must be logged in to send messages.");
            return;
        }

        if (!formData.toUsers && formData.toCategory === "" && formData.toClass === ""){
            console.error("There must be at least one recipient");
            setStatusMessage("There must be at least one recipient");
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

    if (loading) {
        return <Loader />;
    }

    return (
        <div className={styles.createMessage}>
            <form onSubmit={onSubmit}>

                {/*Text input for recipient email*/}
                <input type='text' name='toUsers' value={formData.toUsers} onChange={handleChange} placeholder="recipient's email" />

                {/*Dropdown to select a user-group*/}
                <select name="toCategory" value={formData.toCategory} onChange={handleChange} >
                <option value="">do not message a group.</option>
                {USER_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
                </select>

                {/*Dropdown to select a class*/}
                <select name="toClass" value={formData.toClass} onChange={handleChange} >
                <option value="">do not message a class.</option>
                {palaverClasses.map(item => <option key={item} value={item[1]}>{item[0]}</option>)}
                </select>

                {/*Text input for subject*/}
                <input type='text' name='subjectLine' value={formData.subjectLine} onChange={handleChange} placeholder="Subject" />

                {/*Textarea input for message text */}
                <textarea name="messageText" rows="20" cols="60" value={formData.messageText} onChange={handleChange} placeholder="Type your message here..." required />
                
                {/*Submit Button*/}
                <button type="submit">send message</button>
                {statusMessage && <p>{statusMessage}</p>}
            </form>
        </div>
    );  
     
}

export default WriteMessage;