import { Button, Card, CardContent, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

interface EmployeeCardProps {
  employee: {
    id: string;
    name: string;
    created_by_manager_email: string;
    created_date: string;
    holiday_calendar: string;
    manager_set: { manager_email: string }[];
  };
}

const EmployeeCard: React.FC<EmployeeCardProps> = ({ employee }) => {
  const navigate = useNavigate();

  return (
    <Card className="container-calendar" sx={{ marginBottom: 2, padding: 2 }}>
      <CardContent>
        <Typography variant="h6">{employee.name}</Typography>
        <Typography color="textSecondary">ID: {employee.id}</Typography>
        <Typography>Created By: {employee.created_by_manager_email}</Typography>
        <Typography>Created Date: {employee.created_date}</Typography>
        <Typography>Holiday Calendar: {employee.holiday_calendar}</Typography>
        <Typography>Managers: {employee.manager_set.length}</Typography>
        <Button
          className="HoverableButton"
          onClick={() => navigate(`/home/employees/${employee.id}`)}
          variant="contained"
          sx={{ marginTop: 1 }}
        >
          View
        </Button>
      </CardContent>
    </Card>
  );
};

export default EmployeeCard;
