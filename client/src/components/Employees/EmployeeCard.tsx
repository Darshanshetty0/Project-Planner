import { Button} from "@mui/material";
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
    <div>
      <div className="lets-wrap">
        <div className="container-calendar">
          <h2>{employee.name}</h2>
          <p style={{ paddingLeft: "10px", color: "GrayText" }}>ID: {employee.id}</p>
          <div className="container_invert-calendar">
            <p>Created By: {employee.created_by_manager_email}</p>
            <p>Created Date: {employee.created_date}</p>
            <p>Holiday Calendar: {employee.holiday_calendar}</p>
            <h3>Managers: {employee.manager_set.length}</h3>
            <Button 
              className="HoverableButton" 
              onClick={() => navigate(`/home/employees/${employee.id}`)}
            >
              View
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeCard;
