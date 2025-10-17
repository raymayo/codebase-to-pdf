import express from 'express';
import { removeExpiresAtOnLogin, getStudentByRegNo, getAllStudents, getRegisteredStudent, getAllStudentData, editStudent, deleteStudent } from '../controllers/studentController.js';

const router = express.Router();

router.post('/', removeExpiresAtOnLogin);
router.get('/', getAllStudentData);
router.get('/all', getAllStudents);
router.get('/registered', getRegisteredStudent);
router.get('/:regNo', getStudentByRegNo)
router.delete('/:regNo', deleteStudent)
router.put('/:regNo', editStudent);


export default router;
