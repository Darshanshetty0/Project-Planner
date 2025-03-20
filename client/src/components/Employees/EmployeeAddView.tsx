import View_Employee from '../../components/Employees/ViewEmployee';        
import { Container, Box} from '@mui/material'; // Fixed typo in the import       
import { Calendar, Employee, IUser } from '../types';
 
interface EmployeeDetailsProps {
  managers: IUser[];
  calendars: Calendar[];
  employees: Employee[];
  onEmployeeAdd: (employee: Employee) => void;
}
const EmployeeAddView: React.FC<EmployeeDetailsProps> = ({ managers, calendars, employees, onEmployeeAdd }) => {
    return (
    <Container sx={{ display: "flex", flexDirection: "row", height: "85vh" }}>
        <Box className="main-content" >
            <View_Employee employees={employees} managers={managers} calendars={calendars} onEmployeeAdd={onEmployeeAdd}/>
        </Box>
    </Container>
    );
  };
  
export default EmployeeAddView;
        