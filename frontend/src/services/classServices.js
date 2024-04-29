import axios from "axios";

class ClassService {
    static baseUrl = 'http://localhost:4000/api';

    static async request(method, endpoint, data = null) {
        const url = `${ClassService.baseUrl}${endpoint}`;
        try {
            const response = await axios[method](url, data);
            return response.data;
        } catch (error) {
            console.error(`Error during ${method} request to ${url}:`, error.response ? error.response.data.error: error.message);
            throw error;
        }
    }

    static async addClass(classData) {
        return this.request('post', '/classes', classData); 
    }

    static async getAllClasses() {
        return this.request('get', '/classes');
    }

    static async getClassById(classId) {
        return this.request('get', `/classes/${classId}`);
    }   

    static async updateClass(id, updateData) {
        return this.request('put', `/classes/${id}`, updateData);
    }

    static async deleteClass(id) {
        return this.request('delete', `/classes/${id}`);
    }

    static async getInstructors() {
        return this.request('get', '/instructors');
    }

}

export default ClassService;