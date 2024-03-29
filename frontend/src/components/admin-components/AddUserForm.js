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
     * Handler for the form input changes and updates the state of the form data as the user types
     * For checkboxes (permission), it adds or removes the permission from the array of permissions for the new admin.
     * For other inputs, it updates the value corresponding to the input name.
     */
    const handleChange = (event) => {
        const { name, value, type, checked } = event.target;
    
        if (type === "checkbox") {
            setFormData(prevFormData => ({
                ...prevFormData,
                permissions: checked
                    ? [...prevFormData.permissions, name]
                    : prevFormData.permissions.filter(permission => permission !== name),
            }));
        } else if (name === "students") {
            // Handling multi-select for the 'students' field
            const selectedOptions = Array.from(event.target.selectedOptions, option => option.value);
            setFormData(prevFormData => ({
                ...prevFormData,
                students: selectedOptions,
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
     * Renders form fields that are specific to the selected role.
     * @returns {JSX} The JSX for the role-specific fields
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
                        <label className={styles["form-label"]} for="instrument">Instrument <span style={{color: "red"}}>*</span></label>
                        <select name="instrument" value={formData.instrument} onChange={handleChange} required>
                            <option value="">select instrument</option>
                            {INSTRUMENTS.map(instrument => <option key={instrument} value={instrument}>{instrument}</option>)}
                        </select>
                        {/*<input type="number" name="age" value={formData.age} onChange={handleChange} placeholder="Student's Age" required/> Attempting to remove*/}
                        <label className={styles["form-label"]} for="dateOfBirth">Date of Birth <span style={{color: "red"}}>*</span></label>
                        <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} required />
                        <label className={styles["form-label"]} for="school">School <span style={{color: "red"}}>*</span></label>
                        <input type="text" name="school" value={formData.school} onChange={handleChange} placeholder="School" required />
                        <label className={styles["form-label"]} for="grade">Grade <span style={{color: "red"}}>*</span></label>
                        <input type="number" name="grade" value={formData.grade} onChange={handleChange} placeholder="Grade" required />
                        <label className={styles["form-label"]} for="howHeardAboutProgram">How did you hear about the program?</label>
                        <input type="text" name="howHeardAboutProgram" value={formData.howHeardAboutProgram} onChange={handleChange} placeholder="How did you hear about the program?" /> 
                        <label className={styles["form-label"]} for="parentEmail">Parent's Email <span style={{color: "red"}}>*</span></label>
                        <input type="text" name="parentEmail" value={formData.parentEmail} onChange={handleChange} placeholder="Parent's Email" required />
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
                        <label className={styles["form-label"]} for="orgEmail">Palaver Email <span style={{color: "red"}}>*</span></label>
                        <input type="email" name="orgEmail" value={formData.orgEmail} onChange={handleChange} placeholder="Organization Email" required />
                        
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
            <h1> Add User </h1>
            <form onSubmit={handleSubmit}>

            {/* Text input for the user's first name */}
            <label className={styles["form-label"]} for="firstName">First Name <span style={{color: "red"}}>*</span></label>
            <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="First Name" required />
            
            {/* Text input for the user's last name */}
            <label className={styles["form-label"]} for="lastName">Last Name <span style={{color: "red"}}>*</span></label>
            <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Last Name" required />
            
            {/* Text input for the user's email address */}
            <label className={styles["form-label"]} for="email">Email <span style={{color: "red"}}>*</span></label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" required />
            
            {/* Text input for the user's password */}
            <label className={styles["form-label"]} for="password">Password <span style={{color: "red"}}>*</span></label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password" required />
            
            {/* Text input for the user's password confirmation */}
            <label className={styles["form-label"]} for="confirmPassword">Confirm Password <span style={{color: "red"}}>*</span></label>
            <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="Confirm Password" required />
            
            {/* Dropdown for the user's role */}
            <label className={styles["form-label"]} for="role">Role <span style={{color: "red"}}>*</span></label>
            <select name="role" value={formData.role} onChange={handleChange} required>
                <option value="" disabled>Select a Role</option>
                <option value="student">Student</option>
                <option value="parent">Parent</option>
                <option value="instructor">Instructor</option>
                <option value="admin">Admin</option>
            </select>
            
            {/* Dropdown for the user's gender */}
            <label className={styles["form-label"]} for="gender">Gender <span style={{color: "red"}}>*</span></label>
            <select name="gender" value={formData.gender} onChange={handleChange} required>
                <option value="">Select Gender</option>
                {GENDER.map(gender => <option key={gender} value={gender}>{gender}</option>)}
            </select>

            {/* Dropwon for the user's race */}
            <label className={styles["form-label"]} for="raceEthnicity">Race/Ethnicity <span style={{color: "red"}}>*</span></label>
            <select name="raceEthnicity" value={formData.raceEthnicity} onChange={handleChange} required>
                <option value="">Select Race/Ethnicity</option>
                {RACE_ETHNICITY.map(race => <option key={race} value={race}>{race}</option>)}
            </select>

            {/* Dropdown for the user's primary language */}
            <label className={styles["form-label"]} for="primaryLanguage">Primary Language <span style={{color: "red"}}>*</span></label>
            <select name="primaryLanguage" value={formData.primaryLanguage} onChange={handleChange} required>
                <option value="">Select Primary Language</option>
                {LANGUAGES.map(language => <option key={language} value={language}>{language}</option>)}
            </select>

            {/* Dropdown for the user's country */}
            <label className={styles["form-label"]} for="country">Country <span style={{color: "red"}}>*</span></label>
            <select name="country" value={formData.country} onChange={handleChange} required>
                <option value="">Select Country</option>
                {COUNTRIES.map(country => <option key={country} value={country}>{country}</option>)}
            </select>

            {/* Text input for the user's address */}
            <label className={styles["form-label"]} for="addressLine1">Address Line 1 <span style={{color: "red"}}>*</span></label>
            <input type="text" name="addressLine1" value={formData.addressLine1} onChange={handleChange} placeholder="Address Line 1" required />

            {/* Text input for the user's address line 2 (not required) */}
            <label className={styles["form-label"]} for="addressLine2">Address Line 2</label>
            <input type="text" name="addressLine2" value={formData.addressLine2} onChange={handleChange} placeholder="Address Line 2" />

            {/* Text input for the user's city */}
            <label className={styles["form-label"]} for="city">City <span style={{color: "red"}}>*</span></label>
            <input type="text" name="city" value={formData.city} onChange={handleChange} placeholder="City" required />
            
            {/* Dropdown for the user's state/province */}
            <label className={styles["form-label"]} for="state">State/Province <span style={{color: "red"}}>*</span></label>
            <select name="state" value={formData.state} onChange={handleChange} required>
                <option value="">Select State/Province</option>
                {formData.country === 'United States' ? US_STATES.map(state => <option key={state} value={state}>{state}</option>) : null}
                {formData.country === 'Canada' ? CANADIAN_PROVINCES.map(province => <option key={province} value={province}>{province}</option>) : null}
            </select>

            {/* Text input for the user's zip code */}
            <label className={styles["form-label"]} for="zipCode">Zip Code <span style={{color: "red"}}>*</span></label>
            <input type="text" name="zipCode" value={formData.zipCode} onChange={handleChange} placeholder="Zip Code" required={formData.country === 'United States'} />
            
            {/* Text input for the user's phone number */}
            <label className={styles["form-label"]} for="phoneNumber">Phone Number </label>
            <input type="text" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} placeholder="Phone Number" />
            
            {/* Dropdown for the user's preferred communication method */}
            <label className={styles["form-label"]} for="preferredCommunication">Preferred Communication </label>
            <select name="preferredCommunication" value={formData.preferredCommunication} onChange={handleChange}>
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