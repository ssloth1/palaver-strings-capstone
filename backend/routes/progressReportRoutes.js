const express = require('express');
const auth = require('../middleware/auth');

const {

    getAllProgressReports,
    getProgressReport,
    deleteProgressReport

} = require('../controllers/progressReportController');

const router = express.Router({ mergeParams: true });

//progress report-specific routes
router.get('/',getAllProgressReports);
router.get('/:id', getProgressReport);
router.delete('/:id', deleteProgressReport);

module.exports = router;
