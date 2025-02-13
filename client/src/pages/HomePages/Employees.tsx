import { EmployeeProvider } from "../../components/Employees/EmployeeContext";
import AddEmployee from '../../components/Employees/AddEmployee';
import View_Employee from '../../components/Employees/ViewEmployee';
import EmployeeDetails from "../../components/Employees/EmployeeDetails";

import { Container, Box} from '@mui/material'; // Fixed typo in the import
import { Routes, Route} from "react-router-dom";

const Employees = () => {
  return (
    <>
      <EmployeeProvider>
      <Routes>
        <Route path="/:id" element={<EmployeeDetails/>} />
      </Routes>
        <Container sx={{display:"flex", flexDirection:"row"}}>
          <Box className="main-content" sx={{minWidth:600, maxWidth:700, maxHeight:"fit-content"}}>
              <View_Employee />
            </Box>
            <Box className="main-content" sx={{maxHeight:"fit-content"}}>
              <AddEmployee />
            </Box>
        </Container>
      </EmployeeProvider>
    </>
  );
};

export default Employees;
