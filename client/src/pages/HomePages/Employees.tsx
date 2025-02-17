import { EmployeeProvider } from "../../components/Employees/EmployeeContext";
import EmployeeAddView from '../../components/Employees/EmployeeAddView';
import EmployeeDetails from "../../components/Employees/EmployeeDetails";

import { Routes, Route} from "react-router-dom";

const Employees = () => {
  return (
    <>
      <EmployeeProvider>
      <Routes>
        <Route path="/:id" element={<EmployeeDetails/>} />
        <Route path="/" element={<EmployeeAddView/>} />
      </Routes>
      </EmployeeProvider>
    </>
  );
};

export default Employees;
