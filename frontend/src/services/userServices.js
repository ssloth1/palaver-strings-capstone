import axios from "axios";

class UserService {
    static baseUrl = 'http://localhost:4000/api';

    static async request(method, endpoint, data = null) {
        const url = `${UserService.baseUrl}${endpoint}`;
        try {
            const response = await axios[method](url, data);
            return response.data;
        } catch (error) {
            console.error(`Error during ${method} request to ${url}:`, error.response ? error.response.data.error : error.message);
            throw error;
        }
    }

    // Fetch all instructors
    static async getInstructors() {
        return this.request('get', '/instructors');
    }

    // Fetch all students
    static async getStudents() {
        return this.request('get', '/students');
    }
}


export default UserService;
