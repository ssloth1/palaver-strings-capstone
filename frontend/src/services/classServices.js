import axios from "axios";

class ClassService {
    constructor(baseUrl = 'http://localhost:4000/api/classes'){
        this.baseUrl = baseUrl;
    }

    async addClass(classData) {
        try {
            const response = await axios.post(this.baseUrl, classData);
            console.log("Class added:", response.data);
            return response.data;
        } catch (error) {
            console.error("Error adding class:", error.response.data.error);
            throw error;
        }
    }

    async getAllClasses() {
        try {
            const response = await axios.get(this.baseUrl);
            console.log("Classes fetched:", response.data);
            return response.data;
        } catch (error) {
            console.error("Error fetching classes:", error.response.data.error);
            throw error;
        }
    }

    async getClassById(classId) {
        try {
            const response = await axios.get(`${this.baseUrl}/${classId}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching class by ID:", error);
            throw error;
        }
    }   

    async updateClass(id, updateData) {
        try {
            const response = await axios.put(`${this.baseUrl}/${id}`, updateData);
            return response.data;
        } catch (error) {
            console.error("Error updating class:", error.response.data.error);
            throw error;
        }
    }

    async deleteClass(id) {
        try{
            await axios.delete(`${this.baseUrl}/${id}`);
            console.log("Class deleted successfully");
            return { message: 'Class deleted successfully'};
        } catch (error) {
            console.error("Error deleting class:", error.response.data.error);
            throw error;
        }
    }
}

const classService = new ClassService();
export default classService;