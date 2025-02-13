import { Router } from 'express';
import { add_calendar, get_calendar, update_calendar} from '../controllers/calendarController';
import { calendarValidation } from '../middleware/calendarValidation';
import ensureAuthenticated from '../middleware/auth';

const router = Router();

router.post('/addCalendar', calendarValidation, ensureAuthenticated, add_calendar);
router.get('/getCalendar', ensureAuthenticated, get_calendar); 
router.put('/updateCalendar', ensureAuthenticated, update_calendar); 
export default router;
