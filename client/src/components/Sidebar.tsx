import { Stack, Button} from "@mui/material";
import { NavLink } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AssignmentIcon from '@mui/icons-material/Assignment';
import HailIcon from '@mui/icons-material/Hail';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

const Sidebar = () => {
  return (
    <Stack direction="column" spacing={3} className='sidebar' sx={{ flexGrow: 1 , justifyContent: 'top'}}>
      <div>
        <DashboardIcon/>
        <Button
          component={NavLink}
          to="/home/dashboard"
          sx={{ color: 'inherit', textTransform: 'Capitalize'}}
        >
          Dashboard
        </Button>
      </div>
      <div>
      <AssignmentIcon/>
        <Button
          component={NavLink}
          to="/home/projects"
          sx={{ color: 'inherit', textTransform: 'none' }}
        >
          Projects
        </Button>
      </div>
      <div>
        <HailIcon/>
        <Button
          component={NavLink}
          to="/home/employees"
          sx={{ color: 'inherit', textTransform: 'none' }}
        >
          Employees
        </Button>
      </div>
      <div>
        <CalendarMonthIcon/>
        <Button
          component={NavLink}
          to="/home/calendar"
          sx={{ color: 'inherit', textTransform: 'none' }}
        >
          Calendars
        </Button>
      </div>
    </Stack>
  );
};

export default Sidebar;
