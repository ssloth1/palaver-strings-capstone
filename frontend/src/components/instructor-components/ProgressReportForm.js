import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios'; 
import { useAuth } from '../../contexts/AuthContext';

const ProgressReportForm = () => {
    const { userId, isLoggedIn, instructorId } = useAuth();
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
        const totalScore = questions.reduce((acc, curr) => acc + Number(curr.score), 0);
        const finalScore = totalScore / questions.length;

        // Construct the payload
        const payload = {
            instructorId: userId, // Assuming you have the instructor's ID available
            studentId,
            questions,
            comments,
            finalScore
        };

        try {
            // Replace with your actual API endpoint
            const response = await axios.post('/api/progress-reports', payload);
            console.log('Progress Report Submitted:', response.data);
            // Navigate to another route or show success message
            navigate('/some-success-route');
        } catch (error) {
            console.error('Error submitting progress report:', error);
            // Handle error (e.g., show an error message)
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