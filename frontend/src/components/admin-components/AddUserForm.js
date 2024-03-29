import React, { useState } from "react";
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';
import styles from './styles/AddUserForm.module.css';

import { GENDER, RACE_ETHNICITY, LANGUAGES, COUNTRIES, US_STATES, CANADIAN_PROVINCES, INSTRUMENTS, USER_TYPES } from '../../constants/formconstants';

/** This component renders a form for adding a new user to the database with roles.
 * NOTES:
 * - It checks if the user is logged in before allowing any submissions, although this is just a precaution.
 * - Right now there is some validation for the specific admin role, but it is not complete and we will need to do this with other roles. 
 */
function AddUserForm() {

    const { isLoggedIn } = useAuth(); // Checks if the user is actually logged in.
    const [statusMessage, setStatusMessage] = useState(""); // Just displays the submission status to the user.
    const [customInstrument, setCustomInstrument] = useState(""); // State to store the custom instrument name if the user selects "Other" as their instrument.

    // State to store the form data
    const [formData, setFormData] = useState({
        
        // Common field for all user roles
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "",
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
        secondaryEmail: "",
   
        // Instructor specific fields
        students: [],

        // Shared by admin and instructor.
        orgEmail: "",

        // Student specific fields
        instrument: "",
        age: "",
        dateOfBirth: "",
        school: "",
        grade: "",
        howHeardAboutProgram: "", // optional for now
        parentEmail: "",
        //Commenting the next three parameters out: these are optional in the model and probably best done through
        //an update process rather than the creation process.
        //primaryInstructor: "", // optional for now
        //mentor: "", // optional for now
        //mentees: [], // optional for now
        

        // Parent specific fields
        // .. TODO: add parent specific fields
        // At the moment, there are no parent-specific fields.
    });



    /**
     * Handles changes to the form inputs.
     * Specifically, it updates the form data based on the input's name and value.
     * It handles checkboxes, multi-select inputs, and other inputs differently.
     * @param {Event} event - The event object.
     * @returns {void}
     * NOTE: This function is incomplete and will need to be updated as we add more fields to the form.
     */
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
        if (formData.role === 'admin') {
            if (!formData.permissions.length || !formData.orgEmail) {
                console.error("Admins must have permissions and an organization email.")
                setStatusMessage("Please fill in all required fields for the admin role.");
                return false;
            }
        }

        // TODO: Student related validation
        if (formData.role === 'student'){
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
        
        // Prepare the form data for submission, 
        // including the custom instrument if the user selected "Other" as their instrument.
        const finalFormData = {
            ...formData,
            instrument: formData.instrument !== "Other" ? formData.instrument : undefined,
            ...(formData.instrument === "Other" && { customInstrument: customInstrument }),
        };
        
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
    
        // Prepare the data to be sent to the backend. 
        const submissionData = {
            ...finalFormData,
            address: {
                country: finalFormData.country,
                addressLine1: finalFormData.addressLine1,
                addressLine2: finalFormData.addressLine2,
                city: finalFormData.city,
                state: finalFormData.state,
                zipCode: finalFormData.zipCode,
            },
            hashedPassword: finalFormData.password, // Assuming backend hashes the password
        };
    
        // Remove confirmPassword before sending the form data to the backend
        delete submissionData.confirmPassword;
    
        console.log("Submitting Form");
        try {
            const response = await axios.post(endpoint, submissionData);
            setStatusMessage("Form submitted successfully!");
            console.log("Form submitted successfully!", response.data);
        } catch (error) {
            setStatusMessage("An error occurred while submitting the form.");
            console.error("Error submitting form", error);
        }
    };
 
    /**
     * This function renders the role-specific fields based on the selected role (admin, student, parent, or instructor).
     * @returns {JSX.Element} - Returns the role-specific fields based on the selected role.
     */
    const renderRoleSpecificFields = () => {
        
        // Constants for the admin permissions
        const PERMISSIONS = ['create', 'read', 'update', 'delete'];

        // Switch statement for the role-specific fields
        switch (formData.role) {
            
            // Admin specific fields
            case 'admin':
                return (
                    <div className={styles.checkboxWrapper}>
                        {PERMISSIONS.map((permission) => (
                            <label className={styles.checkboxLabel} key={permission}>
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
                );
            
            //Student specific fields
            case 'student':
                return(
                    <>
                        {/*Student specific fields */}
                        {/*Dropdown for instrument selection*/ }
                        <label className={styles["form-label"]} htmlFor="instrumentSelect">Instrument <span style={{color: "red"}}>*</span></label>
                        <select id="instrumentSelect" name="instrument" value={formData.instrument} onChange={handleChange} required>
                            <option value="">Select instrument</option>
                            {INSTRUMENTS.map(instrument => (
                                <option key={instrument} value={instrument}>{instrument}</option>
                            ))}
                        </select>
                        {formData.instrument === "Other" && (
                            <div>
                                <label className={styles["form-label"]} htmlFor="customInstrumentInput">Custom Instrument Name <span style={{color: "red"}}>*</span></label>
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

                        <label className={styles["form-label"]} htmlFor="dateOfBirthInput">Date of Birth <span style={{color: "red"}}>*</span></label>
                        <input id="dateOfBirthInput" type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} required />
                        
                        <label className={styles["form-label"]} htmlFor="schoolInput">School <span style={{color: "red"}}>*</span></label>
                        <input id="schoolInput" type="text" name="school" value={formData.school} onChange={handleChange} placeholder="School" required />
                        
                        <label className={styles["form-label"]} htmlFor="gradeInput">Grade <span style={{color: "red"}}>*</span></label>
                        <input id="gradeInput" type="number" name="grade" value={formData.grade} onChange={handleChange} placeholder="Grade" required />
                        
                        <label className={styles["form-label"]} htmlFor="howIHeadInput">How did you hear about the program?</label>
                        <input id="howIHeardInput" type="text" name="howHeardAboutProgram" value={formData.howHeardAboutProgram} onChange={handleChange} placeholder="How did you hear about the program?" /> 
                        
                        <label className={styles["form-label"]} htmlFor="parentEmailInput">Parent's Email <span style={{color: "red"}}>*</span></label>
                        <input id="howIHeadInput" type="text" name="parentEmail" value={formData.parentEmail} onChange={handleChange} placeholder="Parent's Email" required />
                    </>
                );
            // TODO: Parent specific fields
            case 'parent':
                return(
                    <>
                        {/*Parent specific fields*/}
                        {/*At this time, there are no parent-specific fields.*/}
                    </>
                )
            // Instructor specific fields
            case 'instructor':
                return (
                    <>
                        {/* Instructor specific fields */}
                        <label className={styles["form-label"]} htmlFor="orgEmailInput">Palaver Email <span style={{color: "red"}}>*</span></label>
                        <input id="orgEmailInput" type="email" name="orgEmail" value={formData.orgEmail} onChange={handleChange} placeholder="Organization Email" required />
                        
                        {/* Uncomment and complete the following select block when the students data is available */}
                        {/* <select multiple name="students" value={formData.students} onChange={handleChange}>
                            {students.map(student => (
                                <option key={student._id} value={student._id}>
                                    {student.firstName} {student.lastName}
                                </option>
                            ))}
                        </select> */}
                    </>
                );
            default:
                return null;
        }
    };
    

    return (
        
        <div className={styles.addUserForm}>
            <h1> add new user </h1>
            <form onSubmit={handleSubmit}>

            {/* Text input for the user's first name */}
            <label className={styles["form-label"]} htmlFor="firstNameInput">First Name <span style={{color: "red"}}>*</span></label>
            <input id="firstNameInput" type="text" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="First Name" required />
            
            {/* Text input for the user's last name */}
            <label className={styles["form-label"]} htmlFor="lastNameInput">Last Name <span style={{color: "red"}}>*</span></label>
            <input id="lastNameInput" type="text" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Last Name" required />
            
            {/* Text input for the user's email address */}
            <label className={styles["form-label"]} htmlFor="emailInput">Email <span style={{color: "red"}}>*</span></label>
            <input id="emailInput" type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" required />
            
            {/* Text input for the user's password */}
            <label className={styles["form-label"]} htmlFor="passwordInput">Password <span style={{color: "red"}}>*</span></label>
            <input id="passwordInput" type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password" required />
            
            {/* Text input for the user's password confirmation */}
            <label className={styles["form-label"]} htmlFor="confirmPasswordInput">Confirm Password <span style={{color: "red"}}>*</span></label>
            <input id="confirmPasswordInput" type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="Confirm Password" required />
            
            {/* Dropdown for the user's role */}
            <label className={styles["form-label"]} htmlFor="roleSelect">Role <span style={{color: "red"}}>*</span></label>
            <select id="roleSelect" name="role" value={formData.role} onChange={handleChange} required>
                <option value="" disabled>Select a Role</option>
                <option value="student">Student</option>
                <option value="parent">Parent</option>
                <option value="instructor">Instructor</option>
                <option value="admin">Admin</option>
            </select>
            
            {/* Dropdown for the user's gender */}
            <label className={styles["form-label"]} htmlFor="genderSelect">Gender <span style={{color: "red"}}>*</span></label>
            <select id="genderSelect" name="gender" value={formData.gender} onChange={handleChange} required>
                <option value="">Select Gender</option>
                {GENDER.map(gender => <option key={gender} value={gender}>{gender}</option>)}
            </select>

            {/* Dropwon for the user's race */}
            <label className={styles["form-label"]} htmlFor="raceEthnicitySelect">Race/Ethnicity <span style={{color: "red"}}>*</span></label>
            <select id="raceEthnicitySelect" name="raceEthnicity" value={formData.raceEthnicity} onChange={handleChange} required>
                <option value="">Select Race/Ethnicity</option>
                {RACE_ETHNICITY.map(race => <option key={race} value={race}>{race}</option>)}
            </select>

            {/* Dropdown for the user's primary language */}
            <label className={styles["form-label"]} htmlFor="primaryLanguageSelect">Primary Language <span style={{color: "red"}}>*</span></label>
            <select id="primaryLanguageSelect" name="primaryLanguage" value={formData.primaryLanguage} onChange={handleChange} required>
                <option value="">Select Primary Language</option>
                {LANGUAGES.map(language => <option key={language} value={language}>{language}</option>)}
            </select>

            {/* Dropdown for the user's country */}
            <label className={styles["form-label"]} htmlFor="countrySelect">Country <span style={{color: "red"}}>*</span></label>
            <select id="countrySelect" name="country" value={formData.country} onChange={handleChange} required>
                <option value="">Select Country</option>
                {COUNTRIES.map(country => <option key={country} value={country}>{country}</option>)}
            </select>

            {/* Text input for the user's address */}
            <label className={styles["form-label"]} htmlFor="addressLine1Input">Address Line 1 <span style={{color: "red"}}>*</span></label>
            <input id="addressLine1Input" type="text" name="addressLine1" value={formData.addressLine1} onChange={handleChange} placeholder="Address Line 1" required />

            {/* Text input for the user's address line 2 (not required) */}
            <label className={styles["form-label"]} htmlFor="addressLine2Input">Address Line 2</label>
            <input id="addressLine2Input" type="text" name="addressLine2" value={formData.addressLine2} onChange={handleChange} placeholder="Address Line 2" />

            {/* Text input for the user's city */}
            <label className={styles["form-label"]} htmlFor="cityInput">City <span style={{color: "red"}}>*</span></label>
            <input id="cityInput" type="text" name="city" value={formData.city} onChange={handleChange} placeholder="City" required />
            
            {/* Dropdown for the user's state/province */}
            <label className={styles["form-label"]} htmlFor="stateSelect">State/Province <span style={{color: "red"}}>*</span></label>
            <select id="stateSelect" name="state" value={formData.state} onChange={handleChange} required>
                <option value="">Select State/Province</option>
                {formData.country === 'United States' ? US_STATES.map(state => <option key={state} value={state}>{state}</option>) : null}
                {formData.country === 'Canada' ? CANADIAN_PROVINCES.map(province => <option key={province} value={province}>{province}</option>) : null}
            </select>

            {/* Text input for the user's zip code */}
            <label className={styles["form-label"]} htmlFor="zipCodeInput">Zip Code <span style={{color: "red"}}>*</span></label>
            <input id="zipCodeInput" type="text" name="zipCode" value={formData.zipCode} onChange={handleChange} placeholder="Zip Code" required={formData.country === 'United States'} />
            
            {/* Text input for the user's phone number */}
            <label className={styles["form-label"]} htmlFor="phoneNumberInput">Phone Number </label>
            <input id="phoneNumberInput" type="text" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} placeholder="Phone Number" />
            
            {/* Dropdown for the user's preferred communication method */}
            <label className={styles["form-label"]} htmlFor="preferredCommunicationSelect">Preferred Communication </label>
            <select id="preferredCommunicationSelect" name="preferredCommunication" value={formData.preferredCommunication} onChange={handleChange}>
                <option value="">Select Preferred Communication</option>
                <option value="email">Email</option>
                <option value="phone">Phone</option>
                <option value="text">Text</option>
                <option value="whatsapp">Whatsapp</option>
            </select>

            {/* Render role-specific fields based on the selected role */}
            {renderRoleSpecificFields()}

            {/* Submit button */}
            <button type="submit">add user</button>
            {statusMessage && <p>{statusMessage}</p>}

            </form>
        </div>
        );
    }

export default AddUserForm;