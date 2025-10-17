import express from 'express';
import { examTakers, getStrandSummary, getExamStats, getQuestionStats, getSchoolStats, getPlacements, getStudentsWithScores } from '../controllers/reportController.js';

const router = express.Router();

router.get('/', examTakers)
router.get('/summary', getStrandSummary);
router.get("/subject-performance", getExamStats);
router.get("/question-stats", getQuestionStats);
router.get("/school-stats", getSchoolStats);
router.get("/students-with-scores", getStudentsWithScores)
router.get("/placements", getPlacements)


export default router;
