import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios'; 
import { useAuth } from '../../contexts/AuthContext';


// Note: for now I just went with the simplest possible implementation of the ProgressReportForm component,
// using the 1-5 scale for each question and tallying a score, they might not care to use it but I figured
// it could be a good idea to add a tally score for each form incase we want to track individual student progress over time.

// Conor mentioned that Matt might want to just have this in a yes or no format, so I can change it to that if needed.
// I also added a comments section for the instructor to leave feedback for the student.

// I'm also unsure if this will be internal (only viewed by instructors and admins) or if it will be visible to students and parents as well. 
// Having multiple views for the same form would be a bit more complicated, but I can do it if needed.

// - Jim 2/21/2024

const ProgressReportForm = () => {
    const { userId, isLoggedIn, isInstructor } = useAuth();
    const { studentId } = useParams();
    const navigate = useNavigate(); 

    const initializeQuestion = [
        { question: "Question 1 blah blah blah", score: 0 },
        { question: "Question 2 blah blah blah", score: 0 },
        { question: "Question 3 blah blah blah", score: 0 },
        { question: "Question 4 blah blah blah", score: 0 },
        { question: "Question 5 blah blah blah", score: 0 },
    ];

    const [questions, setQuestions] = useState(initializeQuestion);
    const [comments, setComments] = useState("");

    useEffect(() => {

        // Redirect users who are not logged in or who are not instructors
        if (!isLoggedIn) {
            console.error('You must be logged in to view this page.');
            navigate('/login');
        }

        // Redirect users who are not instructors
        if (!isInstructor) {
            console.error('You must be an instructor to view this page.');
            navigate('/login');
        }


    }, [isLoggedIn, isInstructor, navigate]);


    const handleQuestionChange = (index, event) => {
        const values = [...questions];
        values[index].score = Number(event.target.value);
        setQuestions(values);
    };

    const handleCommentsChange = (event) => {
        setComments(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        
        // Calculate the average score
        const totalScore = questions.reduce((acc, curr) => acc + curr.score, 0);
        const finalScore = totalScore / questions.length;

        // Construct the payload
        const payload = {
            studentId,
            questions,
            comments,
            finalScore
        };

        try {
            // Update the endpoint to include the instructorId in the URL
            const response = await axios.post(`/api/instructors/${userId}/submitProgressReport`, payload);
            console.log('Progress Report Submitted:', response.data);
            navigate('/home');
        } catch (error) {
            console.error('Error submitting progress report:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h1>Progress Report Form</h1>
            {questions.map((item, index) => (
                <div key={index}>
                    <label>{item.question}</label>
                    {[1, 2, 3, 4, 5].map(score => (
                        <label key={score}>
                            <input
                                type="radio"
                                name={`question-${index}`}
                                value={score}
                                checked={item.score == score}
                                onChange={(event) => handleQuestionChange(index, event)}
                            />
                            {score}
                        </label>
                    ))}
                </div>
            ))}
            <div>
                <label>Comments:</label>
                <textarea
                    value={comments}
                    onChange={handleCommentsChange}
                />
            </div>
            <button type="submit">Submit Report</button>
        </form>
    );
};

export default ProgressReportForm;