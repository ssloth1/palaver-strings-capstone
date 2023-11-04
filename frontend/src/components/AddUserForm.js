import React, { useState } from "react";
import { useAuth } from '../contexts/AuthContext';

import { // Constants/dropdown options for the form
    GENDER,
    RACE_ETHNICITY,
    LANGUAGES,
    COUNTRIES,
    US_STATES,
    CANADIAN_PROVINCES,
    INSTRUMENTS,
} from '../constants/formconstants';

// Responsible for rendering the form for adding a new user
function AddUserForm() {

    // Access the isLoggedIn state variable and login function from the AuthContext to check if the user is logged in
    const { isLoggedIn } = useAuth(); 

    // Stores the form data for each input field
    const [formData, setFormData] = useState({
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
        instrument: "",
    });

    // Handler for input changes
    const handleChange = (event) => {
        const { name, value } = event.target;
        // Updates the formData state with the new value when an input field changes
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    }

    // TODO: will handle form submissions. 
    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!isLoggedIn) {
            // TODO: 
        }

        // TODO: add validation for the form data

        // TODO: implement the logic for submitting the form data to the database
        console.log('Form submitted!', formData);

    };

    return (
        <form onSubmit={handleSubmit}>

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
            
            {/* Dropdown for the user's role */}
            <select name="role" value={formData.role} onChange={handleChange} required>
                <option value="" disabled>Select a Role</option>
                <option value="student">Student</option>
                <option value="parent">Parent</option>
                <option value="instructor">Instructor</option>
                <option value="admin">Admin</option>
            </select>
            
            {/* Dropdown for the user's gender */}
            <select name="gender" value={formData.gender} onChange={handleChange} required>
                <option value="">Select Gender</option>
                {GENDER.map(gender => <option key={gender} value={gender}>{gender}</option>)}
            </select>

            {/* Dropwon for the user's race */}
            <select name="raceEthnicity" value={formData.raceEthnicity} onChange={handleChange} required>
                <option value="">Select Race/Ethnicity</option>
                {RACE_ETHNICITY.map(race => <option key={race} value={race}>{race}</option>)}
            </select>

            {/* Dropdown for the user's primary language */}
            <select name="primaryLanguage" value={formData.primaryLanguage} onChange={handleChange} required>
                <option value="">Select Primary Language</option>
                {LANGUAGES.map(language => <option key={language} value={language}>{language}</option>)}
            </select>

            {/* Dropdown for the user's country */}
            <select name="country" value={formData.country} onChange={handleChange} required>
                <option value="">Select Country</option>
                {COUNTRIES.map(country => <option key={country} value={country}>{country}</option>)}
            </select>

            {/* Text input for the user's address */}
            <input type="text" name="addressLine1" value={formData.addressLine1} onChange={handleChange} placeholder="Address Line 1" required />
            <input type="text" name="addressLine2" value={formData.addressLine2} onChange={handleChange} placeholder="Address Line 2" />
            <input type="text" name="city" value={formData.city} onChange={handleChange} placeholder="City" required />
            
            {/* Dropdown for the user's state/province */}
            <select name="state" value={formData.state} onChange={handleChange} required>
                <option value="">Select State/Province</option>
                {formData.country === 'United States' ? US_STATES.map(state => <option key={state} value={state}>{state}</option>) : null}
                {formData.country === 'Canada' ? CANADIAN_PROVINCES.map(province => <option key={province} value={province}>{province}</option>) : null}
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
            </select>

            {/* Dropdown for the user's instrument */}
            <select name="instrument" value={formData.instrument} onChange={handleChange} required={formData.role === 'student'}>
                <option value="">Select Instrument</option>
                {INSTRUMENTS.map(instrument => <option key={instrument} value={instrument}>{instrument}</option>)}
            </select>

            {/* Submit button */}
            <button type="submit">Add User</button>

        </form>
    );
}
export default AddUserForm;