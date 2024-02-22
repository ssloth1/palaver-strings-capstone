const mongoose = require('mongoose');
const { Admin, Instructor, Student, Parent, ProgressReport } = require('../models/modelsIndex');

//Retrieves all progress reports
const getAllProgressReports = async (req, res) => {
    try {
        const progressReports = await ProgressReport.find({});
        res.status(200).json(progressReports);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

//Retrieves a specific progress report
const getProgressReport = async (req, res) => {
    try {
        const progressReport = await ProgressReport.findById(req.params.id);
        if(!progressReport) {
            return res.status(404).json({ message: 'Progress report not found.' });
        }
        res.status(200).json(progressReport);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

//Delete a progress report
//Should be locked to Admin users if fully implemented at all
const deleteProgressReport = async (req, res) => {
    try {
        const progressReport = await ProgressReport.findByIdAndDelete(req.params.id);
        if(!progressReport) {
            return res.status(404).json({ message: 'Progress report not found.' });
        }
        res.status(200).json(progressReport);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = {
    getAllProgressReports,
    getProgressReport,
    deleteProgressReport
}


