import View_Calendar from './ViewCalender';        
import { Container, Box} from '@mui/material';     
import AddCalendar from './AddCalendar';

import { Calendar} from "../../components/types";

interface CalendarDetailsProps {
  calendars: Calendar[];
  onCalendarAdd: (calendar: Calendar) => void;
}
        
const EmployeeAddView: React.FC<CalendarDetailsProps> = ({calendars, onCalendarAdd}) => {
    return (
    <Container sx={{display:"flex", flexDirection:"row"}}>
        <Box className="main-content" sx={{minWidth:600, maxWidth:700, maxHeight:"fit-content"}}>
            <View_Calendar calendars={calendars}/>
        </Box>
        <Box className="main-content" sx={{maxWidth: 400,maxHeight:"fit-content"}}>
            <AddCalendar calendars={calendars} onCalendarAdd={onCalendarAdd} />
        </Box>
    </Container>
    );
  };
  
export default EmployeeAddView;
        