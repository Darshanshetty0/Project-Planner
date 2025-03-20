import { useState, useEffect } from "react";
import { Modal, Box, Typography, Button, TextField, Autocomplete } from "@mui/material";
import { handleError, handleSuccess } from "../../../utils";
import { Employee, IUser } from "../../types";

interface EditEmployeeProps {
  managers: IUser[];
  open: boolean;
  onClose: () => void;
  employee: Employee | undefined;
  onEmployeeUpdate: (employee: Employee) => void;
}

const EditEmployeeModal: React.FC<EditEmployeeProps> = ({ managers, open, onClose, employee, onEmployeeUpdate }) => {
  const [name, setName] = useState("");
  const [selectedManager, setSelectedManager] = useState<IUser | null>(null);

  useEffect(() => {
    if (employee) {
      setName(employee.name);

      // Find the current manager using _id
      const currentManager = managers.find((mgr) => mgr._id === employee.created_by_manager);
      setSelectedManager(currentManager || null);
    }
  }, [employee, managers]);

  if (!employee) return null; // Prevents rendering if no employee is selected

  const handleSaveEmployee = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      handleError("No token found, authorization required.");
      return;
    }

    if (!selectedManager) {
      handleError("Please select a manager.");
      return;
    }

    const updatedEmployee: Employee = {
      ...employee,
      name,
      created_by_manager: selectedManager?._id ?? employee.created_by_manager, // ✅ Ensures a valid string
    };
    

    console.log(updatedEmployee)

    try {
      const response = await fetch(`http://localhost:8080/employees/updateEmployee?id=${employee.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
        body: JSON.stringify(updatedEmployee),
      });

      const responseData = await response.json();

      if (response.ok && responseData.success) {
        onEmployeeUpdate({ ...employee, ...updatedEmployee });
        handleSuccess("Employee updated successfully!");
        onClose();
      } else {
        handleError("Failed to update employee: " + responseData.message);
      }
    } catch (error) {
      handleError("Error updating employee: " + error);
    }
  };

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="edit-employee-modal">
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}
      >
        <Typography variant="h6">Edit Employee</Typography>
        <TextField 
          label="Name" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          fullWidth 
          sx={{ mt: 2 }} 
        />
        
        {/* Manager Dropdown */}
        <Autocomplete
          options={managers}
          getOptionLabel={(option) => option.name} // Show manager's name
          value={selectedManager}
          onChange={(_, newValue) => setSelectedManager(newValue)} // ✅ Update manager state
          renderInput={(params) => <TextField {...params} label="Created By Manager" required />}
          sx={{ mt: 2 }}
        />

        <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={handleSaveEmployee}>
          Save Changes
        </Button>
      </Box>
    </Modal>
  );
};

export default EditEmployeeModal;
