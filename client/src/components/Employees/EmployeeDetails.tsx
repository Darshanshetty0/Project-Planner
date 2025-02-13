import { useParams } from "react-router-dom";
import { Typography, Paper } from "@mui/material";
import { useEmployee } from "../../components/Employees/EmployeeContext";

const EmployeeDetails: React.FC = () => {
  const { id } = useParams();
  const { employees } = useEmployee();
  
  const employee = employees.find(emp => emp.id === id);

  if (!employee) {
    return <Typography variant="h5">Employee not found</Typography>;
  }

  return (
    <Paper sx={{ padding: 3, maxWidth: 600, margin: "20px auto" }}>
      <Typography variant="h4">{employee.name}</Typography>
      <Typography>ID: {employee.id}</Typography>
      <Typography>Created By: {employee.created_by_manager_email}</Typography>
      <Typography>Created Date: {employee.created_date}</Typography>
      <Typography>Holiday Calendar: {employee.holiday_calendar}</Typography>
      <Typography variant="h6">Managers:</Typography>
      {employee.manager_set.map((manager, index) => (
        <Typography key={index}>- {manager.manager_email}</Typography>
      ))}
    </Paper>
  );
};

export default EmployeeDetails;
