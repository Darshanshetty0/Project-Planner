import { Router } from 'express';
import { add_project, get_projects, delete_project, update_project } from '../controllers/projectController';
import validateProject from '../middleware/projectValidation';
import ensureAuthenticated from '../middleware/auth';

const router = Router();

router.post('/addProject', validateProject, ensureAuthenticated, add_project);
router.get('/getProjects', ensureAuthenticated, get_projects);
router.delete('/deleteProject', ensureAuthenticated, delete_project);
router.put('/updateProject', ensureAuthenticated, update_project);

export default router;
