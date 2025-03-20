import { Button, Chip, TextField, Modal, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Calendar, Employee, IUser } from "../types";
import AddEmployee from "./Modals/AddEmployee";

interface EmployeeDetailsProps {
  managers: IUser[];
  calendars: Calendar[];
  employees: Employee[];
  onEmployeeAdd: (employee: Employee) => void;
}

const ViewEmployee: React.FC<EmployeeDetailsProps> = ({ managers, calendars, employees, onEmployeeAdd }) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Filter employees based on search query
  const filteredEmployees = (Array.isArray(employees) ? employees : []).filter(employee =>
    employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    employee.id?.toString().includes(searchQuery)
  );
  

  return (
    <div>
      {/* Header with Search Bar and Add Button */}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
          padding: "10px",
        }}
      >
        <h1 style={{ paddingLeft: "15px", color: "white" }}>Employees</h1>

        {/* Search Bar */}
        <TextField
          variant="outlined"
          size="small"
          placeholder="Search Employee..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ backgroundColor: "white", borderRadius: 1, width: "40%" }}
        />

        {/* Add Employee Button */}
        <Button
          variant="contained"
          color="primary"
          sx={{ padding: 1, maxWidth: "120px", maxHeight: "50px" }}
          onClick={() => setOpen(true)}
        >
          <p style={{ fontSize: "10px" }}>Add Employee</p>
        </Button>
      </div>

      {/* Employee List */}
      <div
        className="lets-wrap"
        style={{
          minWidth: "100%",
          maxHeight: "70vh",
          overflow: "auto",
          flexGrow: 1,
        }}
      >
        {filteredEmployees.length > 0 ? (
          filteredEmployees.map((employee, index) => (
            <div key={index} className="container-calendar">
              <h2>{employee.name}</h2>
              <p style={{ paddingLeft: "10px", color: "GrayText" }}>
                Id: <Chip label={employee.id} />
              </p>
              <div className="container_invert-employee">
                <Button
                  className="HoverableButton"
                  onClick={() => navigate(`/home/employees/${employee.id}`)}
                >
                  View
                </Button>
              </div>
            </div>
          ))
        ) : (
          <p style={{ textAlign: "center", color: "gray" }}>No employees found</p>
        )}
      </div>

      {/* Modal for AddEmployee */}
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "black",
            p: 4,
            boxShadow: 24,
            borderRadius: 2,
          }}
        >
          <AddEmployee managers={managers} employees={employees} calendars={calendars} onEmployeeAdd={onEmployeeAdd} />
          <Button onClick={() => setOpen(false)} sx={{ mt: 2 }} variant="outlined">
            Close
          </Button>
        </Box>
      </Modal>
    </div>
  );
};

export default ViewEmployee;
