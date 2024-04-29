import React, { useEffect, useState } from "react";
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';
import './styles/AddUserForm.module.css';
import { useParams } from 'react-router-dom';
import Loader from '../general-components/Loader';



import { GENDER, RACE_ETHNICITY, LANGUAGES, COUNTRIES, US_STATES, CANADIAN_PROVINCES, INSTRUMENTS, USER_TYPES } from '../../constants/formconstants';

/** This component renders a form for adding a new user to the database with roles.
 * NOTES:
 * - It checks if the user is logged in before allowing any submissions, although this is just a precaution.
 * - Right now there is some validation for the specific admin role, but it is not complete and we will need to do this with other roles. 
 */
function EditUser() {

    const { isLoggedIn } = useAuth(); // Checks if the user is actually logged in.
    const [statusMessage, setStatusMessage] = useState(""); // Just displays the submission status to the user.
    const [customInstrument, setCustomInstrument] = useState(""); // State to store the custom instrument name if the user selects "Other" as their instrument.

    const PERMISSIONS = ['create', 'read', 'update', 'delete'];

    const { id } = useParams();
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState(null);

    // State to store the form data
    const [formData, setFormData] = useState({
        // Common field for all user roles
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
        roles: [],
        country: "",
        addressLine1: "",
        addressLine2: "",
        city: "",
        state: "",
        zipCode: "",
        phoneNumber: "",
        preferredCommunication: "",
        gender: "",
        raceEthnicity: "",
        primaryLanguage: "",

        // Admin specific fields
        permissions: [],

        // Student specific fields
        instrument: "",
        age: "",
        dateOfBirth: "",
        school: "",
        grade: "",
        howHeardAboutProgram: "", // optional for now
        parentEmail: "",
        mediaRelease: false,
    })      

    useEffect(() => {
        setLoading(true);
        fetch(`/api/users/${id}`)
        .then(response => response.json())
        .then(data => {
            setUser(data);
            setLoading(false);})
            .catch(error => {
                console.error('Fetch user error:', error);
                setStatusMessage(error.toString());
                setLoading(false);
            });
        }, [id]);

    useEffect(() => {
        if (user) {
            console.log(user);
            setFormData({
                firstName : user.firstName,
                lastName : user.lastName,
                email: user.email,
                roles : user.roles,
                country: user.address ? user.address.country : "",
                addressLine1: user.address ? user.address.addressLine1 : "",
                addressLine2: user.address ? user.address.addressLine2 : "",
                city: user.address ? user.address.city : "",
                state: user.address ? user.address.state: "",
                zipCode: user.address ? user.address.zipCode : "",
                phoneNumber: user.phoneNumber,
                preferredCommunication: user.preferredCommunication,
                gender: user.gender,
                raceEthnicity: user.raceEthnicity,
                primaryLanguage: user.primaryLanguage,

                // Admin specific fields
                permissions: user.permissions,

                // Student specific fields
                instrument: user.instrument,
                age: user.age,
                dateOfBirth: user.dateOfBirth,
                school: user.school,
                grade: user.grade,
                howHeardAboutProgram: user.howHeardAboutProgram, // optional for now
                parentEmail: user.parentEmail,
            })
        }
    }, [user])


    /**
     * Handler for the form input changes and updates the state of the form data as the user types
     * For checkboxes (permission), it adds or removes the permission from the array of permissions for the new admin.
     * For other inputs, it updates the value corresponding to the input name.
     */
    const handleRoleChange = (event) => {
        const { name, checked } = event.target;

        setFormData(prevFormData => ({
            ...prevFormData,
            roles: checked
                ? [...prevFormData.roles, name]
                : prevFormData.roles.filter(role => role !== name),
        }));
    };

    const handleChange = (event) => {
        const { name, value, type, checked } = event.target;

        if (type === "checkbox") {
            // Handle the permissions checkboxes differently, as they are an array of permissions
            setFormData(prevFormData => ({
                ...prevFormData,
                permissions: checked
                    ? [...prevFormData.permissions, name]
                    : prevFormData.permissions.filter(permission => permission !== name),
            }));
        } else if (name === "students") {
            // Handle the students select input differently, as it is a multi-select input
            const selectedOptions = Array.from(event.target.selectedOptions, option => option.value);
            setFormData(prevFormData => ({
                ...prevFormData,
                students: selectedOptions,
            }));
        } else if (name === "instrument") {
            // When "Other" is selected or any other instrument is selected
            // Directly set the instrument value and keep customInstrument as it is
            setFormData(prevFormData => ({
                ...prevFormData,
                instrument: value,
            }));
            // Additionally, if "Other" is no longer selected, clear the customInstrument
            if (value !== "Other") {
                setCustomInstrument("");
            }
        } else if (name === "customInstrument") {
            // Update the customInstrument state when the user types in the custom instrument field
            setCustomInstrument(value);
        } else {
            // Handle all other inputs normally
            setFormData(prevFormData => ({
                ...prevFormData,
                [name]: value,
            }));
        }
    };

    /**
     * This function validates the form data based on the user's role.
     * It is incomplete and will need to be updated as we add more fields to the form.
     * @returns {boolean} - Returns true if the form data is valid, otherwise false.
     */
    const validateForm = () => {
        // Admin related validation
        if (formData.roles.includes('admin')) {
            if (!formData.permissions.length) {
                console.error("Admins must have permissions")
                setStatusMessage("Please specify the permissions that this Admin will have.");
                return false;
            }
        }

        // TODO: Student related validation
        if (formData.roles.includes('student')) {
            if (!formData.parentEmail) {
                console.error("Student cannot be created without a parent.");
                setStatusMessage("Parent email must be entered.");
                return false;
            }

        }
        // TODO: Parent related validation
        // TODO: Instructor related validation
        return true;
    }

    /**
     * This function handles the form submission.
     * It checks if the user is logged in, validates the form data, and then submits the form.
     * It also checks if the passwords match before submitting the form.
     * It is incomplete and will need to be updated as we add more fields to the form.
     * @param {*} event 
     * @returns 
     */
    const handleSubmit = async (event) => {
        event.preventDefault();

        // Check if the user is logged in before submitting the form, if not, display an error message and return
        if (!isLoggedIn) {
            console.error("You need to be logged in to submit.");
            setStatusMessage("You need to be logged in to submit.");
            return;
        }

        // Check if the passwords match, if not, display an error message and return
        if (formData.password !== formData.confirmPassword) {
            setStatusMessage("Passwords do not match.");
            return;
        }

        // Validate the form before submitting
        if (!validateForm()) {
            setStatusMessage("Data did not validate.")
            return;
        }
        /**
         * Since I'm testing new unified user creation, commenting this out.
             
                let endpoint = "";
                switch (finalFormData.role) {
                    case 'admin':
                        endpoint = 'http://localhost:4000/api/admins';
                        break;
                    case 'instructor':
                        endpoint = 'http://localhost:4000/api/instructors';
                        break;
                    case 'student':
                        endpoint = 'http://localhost:4000/api/students';
                        break;
                    case 'parent':
                        endpoint = 'http://localhost:4000/api/parents';
                        break;
                    default:
                        break;
                }
         */
        // Prepares the form data by putting it in the necessary format for the backend
        const submissionData = {
            ...formData,
            address: {
                country: formData.country,
                addressLine1: formData.addressLine1,
                addressLine2: formData.addressLine2,
                city: formData.city,
                state: formData.state,
                zipCode: formData.zipCode,
            },
        };

        // Remove confirmPassword before sending the form data to the backend
        console.log("Submitting Form");
        console.log(submissionData);
        try {
            const response = await axios.patch(`http://localhost:4000/api/users/${id}`, submissionData);
            setStatusMessage("Form submitted successfully!");
            console.log("Form submitted successfully!", response.data);
        } catch (error) {
            setStatusMessage("An error occurred while submitting the form.");
            console.error("Error submitting form", error);
        }
    };

    if(loading){
        return <Loader />;
    }

    return (

        <div className="addUserForm">
            <h1> edit user </h1>
            <form onSubmit={handleSubmit}>

                {/* checkboxes for the user's role */}
                <div className="checkbox-wrapper">
                    {USER_TYPES.map((usertype) => (
                        <div className="checkbox-label" key={usertype}>
                            <input
                                type="checkbox"
                                id={usertype}
                                name={usertype}
                                checked={formData.roles.includes(usertype)}
                                onChange={handleRoleChange}
                            />
                            <label htmlFor={usertype}>{usertype.charAt(0).toUpperCase() + usertype.slice(1)}</label>
                        </div>
                    ))}
                </div>

                {/*
            <select name="role" value={formData.role} onChange={handleChange} required>
                <option value="" disabled>Select a Role</option>
                <option value="student">Student</option>
                <option value="parent">Parent</option>
                <option value="instructor">Instructor</option>
                <option value="admin">Admin</option>
            </select>
                */}

                {/* Text input for the user's first name */}
                <label className="form-label" htmlFor="firstNameInput">First Name <span style={{ color: "red" }}>*</span></label>
                <input id="firstNameInput" type="text" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="First Name" required />

                {/* Text input for the user's last name */}
                <label className="form-label" htmlFor="lastNameInput">Last Name <span style={{ color: "red" }}>*</span></label>
                <input id="lastNameInput" type="text" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Last Name" required />

                {/* Text input for the user's email address */}
                <label className="form-label" htmlFor="emailInput">Email <span style={{ color: "red" }}>*</span></label>
                <input id="emailInput" type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" required />

                {/* Dropdown for the user's gender */}
                <label className="form-label" htmlFor="genderSelect">Gender <span style={{ color: "red" }}>*</span></label>
                <select id="genderSelect" name="gender" value={formData.gender} onChange={handleChange} required>
                    <option value="">Select Gender</option>
                    {GENDER.map(gender => <option key={gender} value={gender}>{gender}</option>)}
                </select>

                {/* Dropdown for the user's race */}
                <label className="form-label" htmlFor="raceEthnicitySelect">Race/Ethnicity <span style={{ color: "red" }}>*</span></label>
                <select id="raceEthnicitySelect" name="raceEthnicity" value={formData.raceEthnicity} onChange={handleChange} required>
                    <option value="">Select Race/Ethnicity</option>
                    {RACE_ETHNICITY.map(race => <option key={race} value={race}>{race}</option>)}
                </select>

                {/* Dropdown for the user's primary language */}
                <label className="form-label" htmlFor="primaryLanguageSelect">Primary Language <span style={{ color: "red" }}>*</span></label>
                <select id="primaryLanguageSelect" name="primaryLanguage" value={formData.primaryLanguage} onChange={handleChange} required>
                    <option value="">Select Primary Language</option>
                    {LANGUAGES.map(language => <option key={language} value={language}>{language}</option>)}
                </select>

                {/* Only displays if admin role is selected */}
                {formData.roles.includes('admin') ?
                    <div class="checkbox">
                        {PERMISSIONS.map((permission) => (
                            <label key={permission}>
                                <input
                                    type="checkbox"
                                    name={permission}
                                    checked={formData.permissions.includes(permission)}
                                    onChange={handleChange}
                                />
                                {permission.charAt(0).toUpperCase() + permission.slice(1)}
                            </label>
                        ))}
                    </div>
                    : <></>
                }

                {/* Only displays if student or instructor role is checked */}
                {formData.roles.includes('student') || formData.roles.includes('instructor') ?
                    <>
                        {/*Student specific fields */}
                        <label className="form-label" htmlFor="instrumentSelect">Instrument <span style={{color: "red"}}>*</span></label>
                        <select id="instrumentSelect" name="instrument" value={formData.instrument} onChange={handleChange} required>
                            <option value="">Select instrument</option>
                            {INSTRUMENTS.map(instrument => (
                                <option key={instrument} value={instrument}>{instrument}</option>
                            ))}
                        </select>

                        {/* If the user selects "Other" as the instrument, show a text input for the custom instrument name */}
                        {formData.instrument === "Other" && (
                            <div>
                                <label className="form-label" htmlFor="customInstrumentInput">Custom Instrument Name <span style={{color: "red"}}>*</span></label>
                                <input
                                    id="customInstrumentInput"
                                    type="text" 
                                    name="customInstrument" 
                                    value={customInstrument} 
                                    onChange={handleChange} 
                                    placeholder="Enter Custom Instrument Name" 
                                    required 
                                />
                            </div>
                        )}
                    </>
                    : <></>}
                {formData.roles.includes('student') ?
                    <>
                        {/*<input type="number" name="age" value={formData.age} onChange={handleChange} placeholder="Student's Age" required/> Attempting to remove*/}
                        {<input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} required />}
                        {<input type="text" name="school" value={formData.school} onChange={handleChange} placeholder="School" required />}
                        {<input type="number" name="grade" value={formData.grade} onChange={handleChange} placeholder="Grade" required />}
                        {<input type="text" name="howHeardAboutProgram" value={formData.howHeardAboutProgram} onChange={handleChange} placeholder="How did you hear about the program?" />}
                        {<input type="text" name="parentEmail" value={formData.parentEmail} onChange={handleChange} placeholder="Parent's Email" required />}
                    </>
                    : <></>
                }

                {/* Text input for the user's address */}
                <label className="form-label" htmlFor="addressLine1Input">Address Line 1 <span style={{ color: "red" }}>*</span></label>
                <input id="addressLine1Input" type="text" name="addressLine1" value={formData.addressLine1} onChange={handleChange} placeholder="Address Line 1" required />

                {/* Text input for the user's address line 2 (not required) */}
                <label className="form-label" htmlFor="addressLine2Input">Address Line 2</label>
                <input id="addressLine2Input" type="text" name="addressLine2" value={formData.addressLine2} onChange={handleChange} placeholder="Address Line 2" />

                {/* Text input for the user's city */}
                <label className="form-label" htmlFor="cityInput">City <span style={{ color: "red" }}>*</span></label>
                <input id="cityInput" type="text" name="city" value={formData.city} onChange={handleChange} placeholder="City" required />

                {/* Dropdown for the user's state/province */}
                <label className="form-label" htmlFor="stateSelect">State/Province <span style={{ color: "red" }}>*</span></label>
                <select id="stateSelect" name="state" value={formData.state} onChange={handleChange} required>
                    <option value="">Select State/Province</option>
                    {US_STATES.map(state => <option key={state} value={state}>{state}</option>)}
                </select>

                {/* Text input for the user's zip code */}
                <label className="form-label" htmlFor="zipCodeInput">Zip Code <span style={{ color: "red" }}>*</span></label>
                <input id="zipCodeInput" type="text" name="zipCode" value={formData.zipCode} onChange={handleChange} placeholder="Zip Code" required={formData.country === 'United States'} />

                {/* Text input for the user's phone number */}
                <label className="form-label" htmlFor="phoneNumberInput">Phone Number </label>
                <input id="phoneNumberInput" type="text" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} placeholder="Phone Number" />

                {/* Dropdown for the user's preferred communication method */}
                <label className="form-label" htmlFor="preferredCommunicationSelect">Preferred Communication </label>
                <select id="preferredCommunicationSelect" name="preferredCommunication" value={formData.preferredCommunication} onChange={handleChange}>
                    <option value="">Select Preferred Communication</option>
                    <option value="email">Email</option>
                    <option value="phone">Phone</option>
                    <option value="text">Text</option>
                    <option value="whatsapp">Whatsapp</option>
                </select>

                {/* Submit button */}
                <button type="submit">submit edits</button>
                {statusMessage && <p>{statusMessage}</p>}

            </form>
        </div>
    );
}

export default EditUser;