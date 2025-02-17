import View_Employee from '../../components/Employees/ViewEmployee';        
import { Container, Box} from '@mui/material'; // Fixed typo in the import       
import AddEmployee from './AddEmployee';
        
const EmployeeAddView = () => {
    return (
    <Container sx={{display:"flex", flexDirection:"row"}}>
        <Box className="main-content" sx={{minWidth:600, maxWidth:700, maxHeight:"fit-content"}}>
            <View_Employee />
        </Box>
        <Box className="main-content" sx={{maxHeight:"fit-content"}}>
            <AddEmployee />
        </Box>
    </Container>
    );
  };
  
export default EmployeeAddView;
        