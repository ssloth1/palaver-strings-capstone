import React, { useEffect, useContext, useState } from "react";
import Loader from "../../general-components/Loader";
import { AuthContext } from '../../../contexts/AuthContext';
import axios from 'axios';




function GetEmails() {

    const [statusMessage, setStatusMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [selectedClasses, setSelectedClasses] = useState(new Array());
    const [emailsToDisplay, setEmailsToDisplay] = useState(new Array());
    const [studentsWanted, setStudentsWanted] = useState("false");
    const [parentsWanted, setParentsWanted] = useState("false");
    const [classesExpanded, setClassesExpanded] = useState('false');

    const {
        isLoggedIn,
        isAdmin,
        isInstructor
    } = useContext(AuthContext);

    useEffect(() => {
        setStatusMessage("");
        setSelectedClasses([]);
        setEmailsToDisplay([]);
        setStudentsWanted("false");
        setParentsWanted("false");
        setClassesExpanded("false");
        console.log(selectedClasses);
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
                const selectedData = new Array();
                for (const item of data) {
                    selectedData.push({item, selected:"false"});
                }
                setSelectedClasses(selectedData);
                for (const item of selectedClasses) {
                    console.log(item);
                }
            } else {
                console.warn('received data is not in an array');
                setSelectedClasses([]);
            }
        })
        .catch(error => {
            console.error('fetch error:', error);
            setStatusMessage(error.toString());
        })
        .finally(() => setLoading(false)); // Stop loading (purely cosmetic)
    }, []);

    const checkAll = () => {
        const newSelectedClasses = selectedClasses.map((item) => {
            return {
                ...item,
                selected : 'true'
            }});

        setSelectedClasses(newSelectedClasses);
    }

    const checkMine = () => {
        const newSelectedClasses = selectedClasses.map((item) => {
            if (item.item.instructor._id === localStorage.getItem("userId")) {
                return {
                    ...item,
                    selected : 'true'
                }
            } else {
                return {
                    ...item,
                    selected: 'false'
                }
            }
        });

        setSelectedClasses(newSelectedClasses);
    }

    const deselectAll = () => {
        const newSelectedClasses = selectedClasses.map((item) => {
            return {
                ...item, 
                selected: 'false'
            }
        })

        setSelectedClasses(newSelectedClasses);
    }

    const changeStudents = (event) => {
        var change = 'false';

        if (studentsWanted === 'false') {
            change = 'true';
        }

        setStudentsWanted(change);
    }

    const changeParents = (event) => {
        var change = 'false';

        if (parentsWanted === 'false') {
            change = 'true';
        } 

        setParentsWanted(change);
    }

    const checkClass = (event) => {
        const { name } = event.target;

        const updatedClasses = selectedClasses.map((item) => {
            if (item.item.name === name) {
                return {
                    ...item,
                    selected: item.selected === 'true' ? 'false' : 'true'
                };
            }
            return item;
        });
    
        setSelectedClasses(updatedClasses);
     
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        console.log(selectedClasses);

        try {
            const response = await axios.get(`/api/users/${localStorage.getItem("userId")}`)
            const you = response.data;

            if (!(you.roles.includes('admin') || you.roles.includes('instructor'))) {
                setStatusMessage("Only instructors or admins can retrieve student emails");
                return;
            }
        } catch (error) {
            console.log(error);
            setStatusMessage(error.message);
            return;
        }



        const users = new Set();
        const emails = [];
        if (studentsWanted === 'false' && parentsWanted === 'false') {
            setStatusMessage("You must select either parent or student emails (or both.)");
            return;
        }

        for (const item of selectedClasses) {
            if (item.selected === "true") {
                for (const student of item.item.students) {
                    if (studentsWanted === 'true') {
                        users.add(student);
                    }
                    if (parentsWanted === 'true') {
                        users.add(student.parent);
                    }
                }
            }
        }

        console.log(users);

        for (const user of users) {
            if (user) {
                if (!user.email) {
                    console.log("getting a parent's email");
                    try {
                        var parent = await axios.get(`/api/users/${user}`)
                        console.log(parent);
                        emails.push(parent.data.email);
                    } catch (error) {
                        setStatusMessage(error.toString());
                    }
                    
                } else {
                    emails.push(user.email);
                    console.log(user.email);
                }
            }              
        }    
        setEmailsToDisplay(emails);
        navigator.clipboard.writeText(emails);
        setStatusMessage("Emails Copied!")

        setClassesExpanded("false");
    }

    if (loading) {
        return <Loader />;
    }

    return (
        <div>
            {statusMessage && <p>{statusMessage}</p>}
        <div id='emails'>
            {emailsToDisplay.length > 0 ? (
                emailsToDisplay.map((email) =>
                    (<div>{email}</div>)
                )
            )
                
                :<></>}
        </div>

        <button type='button' onClick={checkAll}>All Students</button>

        <button type="button" onClick={checkMine}>My Students Only</button>

        <button type="button" onClick={deselectAll}>Deselect All</button>

        <form onSubmit={handleSubmit}>

            <div class="checkbox">
                <label key="students">
                    <input
                        type = "checkbox"
                        name = "students"
                        onChange = {changeStudents}
                    />
                    Student Emails
                </label>
            
                <label key="parents">
                    <input
                        type = "checkbox"
                        name = "parents"
                        onChange = {changeParents}
                    />
                    Parent Emails
                </label>
            </div>

            <div className="section-header" onClick={() => {if (classesExpanded === 'false') {
                setClassesExpanded('true');
            } else {
                setClassesExpanded('false');
            }}}>
                {(classesExpanded === 'true') ? '▼' : '➤'} Class List
            </div>
            {(classesExpanded === 'true') ? (
                selectedClasses.map((item) => (
                    <div class="checkbox">
                    <label key={item.item.name}>
                        <input
                            type="checkbox"
                            name={item.item.name}
                            onChange={checkClass}
                            checked={item.selected === 'true'}
                        />
                        {item.item.name}
                    </label>
                    </div>
                )))
                :<></>
            }

            <button type="submit">get emails</button>
            

        </form>
        </div>
    )
}

export default GetEmails;