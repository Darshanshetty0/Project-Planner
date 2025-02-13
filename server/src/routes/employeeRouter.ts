import { Router } from 'express';
import { add_employee, get_employee, get_employee_created } from '../controllers/employeeController';
import { employeeValidation} from '../middleware/employeeValidation';
import ensureAuthenticated from '../middleware/auth';

const router = Router();

router.post('/addEmployee', employeeValidation, ensureAuthenticated, add_employee);
router.get('/getEmployee', ensureAuthenticated, get_employee);
router.get('/getEmployeeCreated', ensureAuthenticated, get_employee_created);
export default router;
