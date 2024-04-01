import React, { useState } from "react";
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';
import styles from './styles/AddUserForm.module.css';

import { // Constants/dropdown options for the form
    GENDER,
    RACE_ETHNICITY,
    LANGUAGES,
    COUNTRIES,
    US_STATES,
    CANADIAN_PROVINCES,
    INSTRUMENTS,
    USER_TYPES,
} from '../../constants/formconstants';

/** This component renders a form for adding a new user to the database with roles.
 * NOTES:
 * - It checks if the user is logged in before allowing any submissions, although this is just a precaution.
 * - Right now there is some validation for the specific admin role, but it is not complete and we will need to do this with other roles. 
 */
function AddUserForm() {

    const { isLoggedIn } = useAuth(); // Checks if the user is actually logged in.
    const [statusMessage, setStatusMessage] = useState(""); // Just displays the submission status to the user.

    const PERMISSIONS = ['create', 'read', 'update', 'delete'];

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
     * Handler for the form input changes and updates the state of the form data as the user types
     * For checkboxes (permission), it adds or removes the permission from the array of permissions for the new admin.
     * For other inputs, it updates the value corresponding to the input name.
     */
    const handleRoleChange = (event) => {
        const { name, value, type, checked } = event.target;

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
            setFormData(prevFormData => ({
                ...prevFormData,
                permissions: checked
                    ? [...prevFormData.permissions, name]
                    : prevFormData.permissions.filter(permission => permission !== name),
            }));
        } else {
            setFormData(prevFormData => ({
                ...prevFormData,
                [name]: value,
            }));
        }
    };

    /** 
     * Validates the form before submission.
     * NOTE: This is not complete and we will need to add more validation for other roles.
     *      Right now it only includes validation for the admin role, but we will ned to extend it for other roles. 
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
        if (formData.roles.includes('student')){
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
     * Handles the form submission.
     * It prevents the default form submission behavior and then sends the form data to the backend.
     * Validates the form, and then makes a POST request with the form data. 
     */
    const handleSubmit = async (event) => {
        event.preventDefault();
    
        if (!isLoggedIn) {
            console.error("You need to be logged in to submit.");
            setStatusMessage("You need to be logged in to submit.");
            return;
        }
    
        if (formData.password !== formData.confirmPassword) {
            setStatusMessage("Passwords do not match.");
            return;
        }
    
        if (!validateForm()) {
            setStatusMessage("Data did not validate.")
            return;
        }
/**
 * Since I'm testing new unified user creation, commenting this out.
     
        let endpoint = "";
        switch (formData.role) {
            case 'admin':
                endpoint = 'http://localhost:4000/api/admins';
                console.log("You're trying to make an admin", formData);
                break;
            case 'instructor':
                endpoint = 'http://localhost:4000/api/instructors';
                console.log("You're trying to make an instructor", formData);
                break;
            case 'student':
                endpoint = 'http://localhost:4000/api/students';
                console.log("You're trying to make a student", formData);
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
            
            // The entered form password will be hashed before being sent to the database
            // the password hashing is handled within the userModel.js file in the backend directory
            hashedPassword: formData.password,
        };

        // Remove confirmPassword before sending the form data to the backend
        // This was only necessary
        delete submissionData.confirmPassword; 
    

        // Make a POST request to the backend with the form data for the selected role
        console.log("Submitting Form");
        console.log(submissionData);
        try {
            const response = await axios.post('http://localhost:4000/api/users', submissionData);
            setStatusMessage("Form submitted successfully!");
            console.log("Form submitted successfully!", response.data);
        } catch (error) {
            setStatusMessage("An error occurred while submitting the form.");
            console.error("Error submitting form", error);
        }
    };    

    return (
        
        <div className={styles.addUserForm}>
            <h1> add user </h1>
            <form onSubmit={handleSubmit}>

            {/* checkboxes for the user's role */}
            <div class="checkbox">
                {USER_TYPES.map((usertype) => (
                    <label key={usertype}>
                        <input
                            type="checkbox"
                            name={usertype}
                            checked={formData.roles.includes(usertype)}
                            onChange={handleRoleChange}
                        />
                        {usertype.charAt(0).toUpperCase() + usertype.slice(1)}
                    </label>
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
            <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="First Name" required />
            
            {/* Text input for the user's last name */}
            <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Last Name" required />
            
            {/* Text input for the user's email address */}
            <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" required />
            
            {/* Text input for the user's password */}
            <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password" required />
            
            {/* Text input for the user's password confirmation */}
            <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="Confirm Password" required />
            
            {/* Dropdown for the user's gender */}
            <select name="gender" value={formData.gender} onChange={handleChange} required>
                <option value="">Select Gender</option>
                {GENDER.map(gender => <option key={gender} value={gender}>{gender}</option>)}
            </select>

            {/* Dropdown for the user's race */}
            <select name="raceEthnicity" value={formData.raceEthnicity} onChange={handleChange} required>
                <option value="">Select Race/Ethnicity</option>
                {RACE_ETHNICITY.map(race => <option key={race} value={race}>{race}</option>)}
            </select>

            {/* Dropdown for the user's primary language */}
            <select name="primaryLanguage" value={formData.primaryLanguage} onChange={handleChange} required>
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
                    {/*Dropdown for instrument selection*/ }
                    <label for="instrument">instrument</label>
                    <select name="instrument" value={formData.instrument} onChange={handleChange} required>
                        <option value="">select instrument</option>
                        {INSTRUMENTS.map(instrument => <option key={instrument} value={instrument}>{instrument}</option>)}
                    </select>
                </>
                :<></>}
            {formData.roles.includes('student') ?
                <>
                    {/*<input type="number" name="age" value={formData.age} onChange={handleChange} placeholder="Student's Age" required/> Attempting to remove*/}
                    {<input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} required />}
                    {<input type="text" name="school" value={formData.school} onChange={handleChange} placeholder="School" required />}
                    {<input type="number" name="grade" value={formData.grade} onChange={handleChange} placeholder="Grade" required />}
                    {<input type="text" name="howHeardAboutProgram" value={formData.howHeardAboutProgram} onChange={handleChange} placeholder="How did you hear about the program?" /> }
                    {<input type="text" name="parentEmail" value={formData.parentEmail} onChange={handleChange} placeholder="Parent's Email" required />}
                </>
                :<></>
            }

            {/* Text input for the user's address */}
            <input type="text" name="addressLine1" value={formData.addressLine1} onChange={handleChange} placeholder="Address Line 1" required />
            <input type="text" name="addressLine2" value={formData.addressLine2} onChange={handleChange} placeholder="Address Line 2" />
            <input type="text" name="city" value={formData.city} onChange={handleChange} placeholder="City" required />
            
            {/* Dropdown for the user's state/province */}
            <select name="state" value={formData.state} onChange={handleChange} required>
                <option value="">Select State/Province</option>
                {US_STATES.map(state => <option key={state} value={state}>{state}</option>)}
            </select>

            {/* Text input for the user's zip code */}
            <input type="text" name="zipCode" value={formData.zipCode} onChange={handleChange} placeholder="Zip Code" required={formData.country === 'United States'} />
            
            {/* Text input for the user's phone number */}
            <input type="text" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} placeholder="Phone Number" />
            
            {/* Dropdown for the user's preferred communication method */}
            <select name="preferredCommunication" value={formData.preferredCommunication} onChange={handleChange}>
                <option value="">Select Preferred Communication</option>
                <option value="email">Email</option>
                <option value="phone">Phone</option>
                <option value="text">Text</option>
                <option value="whatsapp">Whatsapp</option>
            </select>

            {/* Submit button */}
            <button type="submit">add user</button>
            {statusMessage && <p>{statusMessage}</p>}

            </form>
        </div>
        );
    }

export default AddUserForm;