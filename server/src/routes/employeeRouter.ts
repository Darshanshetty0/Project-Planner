import { Router } from 'express';
import { add_employee, delete_employee, get_employee, get_employee_created, update_employee } from '../controllers/employeeController';
import { employeeValidation} from '../middleware/employeeValidation';
import ensureAuthenticated from '../middleware/auth';

const router = Router();

router.post('/addEmployee', employeeValidation, ensureAuthenticated, add_employee);
router.get('/getEmployee', ensureAuthenticated, get_employee);
router.get('/getEmployeeCreated', ensureAuthenticated, get_employee_created);
router.delete('/deleteEmployee', ensureAuthenticated, delete_employee);
router.put('/updateEmployee', ensureAuthenticated, update_employee);

export default router;
