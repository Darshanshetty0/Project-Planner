import { Router } from 'express';
import { add_employee, delete_employee, get_employee, update_employee, get_employee_manager_set, get_managers} from '../controllers/employeeController';
import { employeeValidation} from '../middleware/employeeValidation';
import ensureAuthenticated from '../middleware/auth';

const router = Router();

router.post('/addEmployee', employeeValidation, ensureAuthenticated, add_employee);
router.get('/getEmployee', ensureAuthenticated, get_employee);
router.get('/getManagers', ensureAuthenticated, get_managers);
router.put('/getEmployeeManagerSet', ensureAuthenticated, get_employee_manager_set)
router.delete('/deleteEmployee', ensureAuthenticated, delete_employee);
router.put('/updateEmployee', ensureAuthenticated, update_employee);

export default router;
