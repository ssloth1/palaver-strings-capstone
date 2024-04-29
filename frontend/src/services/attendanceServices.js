import axios from 'axios';

class AttendanceService {
    static baseUrl = 'http://localhost:4000/api/attendance';

    static async request (method, endpoint, data = null) {
        const url = `${AttendanceService.baseUrl}${endpoint}`;
        try {
            const response = await axios[method](url, data); 
            return response.data;
        } catch (error) {
            console.error(`Error during ${method} request to ${url}:`, error.response ? error.response.data.error : error.message);
            throw error;
        }
    }

    static async getAllAttendance() {
        return AttendanceService.request('get', '/');
    }

    static async getAttendanceByClassDate(classId, date) {
        return AttendanceService.request('get', `/${classId}/${date}`);
    }
    
    static async getAttendanceDates(classId) {
        return AttendanceService.request('get', `/dates/${classId}`);
    }

    static async createAttendance(data) {
        return AttendanceService.request('post', '/', data);
    }

    static async updateAttendance(id, data) {
        return AttendanceService.request('patch', `/${id}`, data);
    }
}

export default AttendanceService;