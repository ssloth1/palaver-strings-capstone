const StudentDetails = ({ student }) => {
    return (
        <div className="student-details">
            <h4>{student.firstName} {student.lastName}</h4>
            <p><strong>Email: </strong>{student.email}</p>
            <p><strong>Password: </strong>{student.password}</p>
            <p><strong>Account Created: </strong>{student.createdAt}</p>
        </div>
    )
}

export default StudentDetails