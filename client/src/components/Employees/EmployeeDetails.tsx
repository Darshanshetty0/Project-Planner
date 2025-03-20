import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import DeleteSharpIcon from "@mui/icons-material/DeleteSharp";
import EditSharpIcon from "@mui/icons-material/EditSharp";
import EditEmployeeModal from "./Modals/EditEmployeeModal";
import DeleteEmployeeModal from "./Modals/DeleteEmployeeModal";
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Stack,
  Divider,
  Chip,
  Button,
} from "@mui/material";
import { Calendar, Employee, IUser } from "../types";

interface EmployeeDetailsProps {
  managers: IUser[],
  calendars: Calendar[],
  employees: Employee[],
  onEmployeeUpdate: (employee: Employee) => void;
  onEmployeeDelete: (id: string) => void;
}

const EmployeeDetails: React.FC<EmployeeDetailsProps> = ({
  managers,
  calendars,
  employees,
  onEmployeeUpdate,
  onEmployeeDelete,
}) => {
  const { id } = useParams();
  const employee = employees?.find((emp) => emp.id === id);
  const calendar = employee ? calendars?.find((cal) => cal.id === employee.holiday_calendar) : undefined;
  const manager = employee ? managers?.find((manager) => manager._id === employee.created_by_manager) : undefined;
  console.log(calendar)
  const [open, setOpen] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | undefined>();
  const token = localStorage.getItem('token');
  const [managerSet, setManagerSet] = useState<Employee[]>()

  useEffect(() => {
    const fetchManagerSet = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No token found, authorization required.");
          return;
        }
        console.log(employee?.manager_set)
  
        const response = await fetch("http://localhost:8080/employees/getEmployeeManagerSet", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            authorization: token,
          },
          body: JSON.stringify(employee?.manager_set)
        });
  
        if (!response.ok) throw new Error("Failed to fetch employees");
  
        const data = await response.json();
        setManagerSet(data.manager_set);
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };
    fetchManagerSet();
  }, [token]);

  const handleOpenModal = (employee: Employee) => {
    setSelectedEmployee(employee);
    setOpen(true);
  };

  const handleCloseModal = () => {
    setOpen(false);
  };

  const handleOpenDeleteModal = (employee: Employee) => {
    setSelectedEmployee(employee);
    setOpenDelete(true);
  };

  const handleCloseDeleteModal = () => {
    setOpenDelete(false);
  };

  if (!employee) {
    return (
      <Card sx={{ p: 2, minWidth: "80vw", boxShadow: 3, borderRadius: 2 }}>
        <Stack direction="column" justifyContent="space-evenly">
          <Typography variant="h4">
            Employee with ID: {id} does not exist!
          </Typography>
          <p>
            Please make sure that you have entered the right ID. There is also a
            possibility that the employee with ID {id} isn't assigned to you.
          </p>
        </Stack>
      </Card>
    );
  }

  return (
    <>
      <Card sx={{ p: 2, minWidth: "80vw", boxShadow: 3, borderRadius: 2 }}>
        <CardContent>
          <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
            <Stack direction="row" alignItems="baseline" spacing={1}>
              <Typography variant="h4" fontWeight={600}>
                {employee.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                ID: {employee.id}
              </Typography>
            </Stack>
            <Stack direction="row" spacing={1}>
              <IconButton color="primary" size="small" onClick={() => handleOpenModal(employee)}>
                <EditSharpIcon />
              </IconButton>
              <IconButton color="error" size="small" onClick={() => handleOpenDeleteModal(employee)}>
                <DeleteSharpIcon />
              </IconButton>
            </Stack>
          </Stack>

          <Divider sx={{ my: 2 }} />
          <Stack direction="row" spacing={30}>
            <Typography variant="body2" color="text.secondary">
              <strong>Created By:</strong> {manager?.name}
            </Typography>
          </Stack>

          <Divider sx={{ my: 2 }} />
          <Typography variant="body2" color="text.secondary">
            <strong>Holiday Calendar:</strong> {calendar?.title}
          </Typography>

          <Divider sx={{ my: 2 }} />
          <Stack direction="row" sx={{ justifyContent: "space-between" }}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Managers:
            </Typography>
            <Button>+Add</Button>
          </Stack>
          {managerSet?.map((manager, index) => (
            <Chip key={index} label={manager.name} sx={{ marginRight: "10px" }} />
          ))}
        </CardContent>
      </Card>
      <EditEmployeeModal
        managers={managers}
        open={open}
        onClose={handleCloseModal}
        employee={selectedEmployee}
        onEmployeeUpdate={onEmployeeUpdate}
      />
      <DeleteEmployeeModal
        open={openDelete}
        onClose={handleCloseDeleteModal}
        employee={selectedEmployee}
        onEmployeeDelete={onEmployeeDelete}
      />
    </>
  );
};

export default EmployeeDetails;
