import View_Calendar from './ViewCalender';        
import { Container, Box} from '@mui/material';     
import AddCalendar from './AddCalendar';
        
const EmployeeAddView = () => {
    return (
    <Container sx={{display:"flex", flexDirection:"row"}}>
        <Box className="main-content" sx={{minWidth:600, maxWidth:700, maxHeight:"fit-content"}}>
            <View_Calendar />
        </Box>
        <Box className="main-content" sx={{maxWidth: 400,maxHeight:"fit-content"}}>
            <AddCalendar />
        </Box>
    </Container>
    );
  };
  
export default EmployeeAddView;
        