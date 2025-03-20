import { useState } from "react";
import { Modal, Box, Typography, Button, TextField } from "@mui/material";
import { handleError, handleSuccess } from "../../../utils";
import { useNavigate } from "react-router-dom";
import { Employee } from "../../types";

interface DeleteEmployeeProps {
  open: boolean;
  onClose: () => void;
  employee: Employee | undefined;
  onEmployeeDelete: (id: string) => void;
}

const DeleteEmployeeModal: React.FC<DeleteEmployeeProps> = ({ open, onClose, employee, onEmployeeDelete }) => {
  const [confirmationText, setConfirmationText] = useState("");
  const navigate = useNavigate();
  
  if (!employee) return null; // Prevents rendering if no employee is selected

  const handleDeleteEmployee = async () => {
    if (confirmationText !== employee.name) {
      handleError("Employee name does not match. Please type the correct name to confirm deletion.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found, authorization required.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/employees/deleteEmployee?id=${employee.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          authorization: `${token}`,
        },
      });

      const responseData = await response.json();

      if (response.ok && responseData.success) {
        if (employee.id) {
          onEmployeeDelete(employee.id); // ✅ Only calls if `id` is defined
        } else {
          console.error("Employee ID is undefined, cannot delete.");
        }
        onClose();
        navigate("/home/employees");
        handleSuccess("Employee deleted successfully!");
      } else {
        handleError("Failed to delete employee: " + responseData.message);
      }
    } catch (error) {
      handleError("Error deleting employee: " + error);
    }
  };

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="delete-employee-modal">
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
        <Typography variant="h6" color="error">Confirm Employee Deletion</Typography>
        <Typography variant="body1" sx={{ mt: 2 }}>
          To confirm deletion, type <strong>{employee.name}</strong> in the box below:
        </Typography>
        <TextField
          label="Confirm Name"
          value={confirmationText}
          onChange={(e) => setConfirmationText(e.target.value)}
          fullWidth
          sx={{ mt: 2 }}
        />
        <Button
          variant="contained"
          color="error"
          sx={{ mt: 2 }}
          onClick={handleDeleteEmployee}
          disabled={confirmationText !== employee.name}
        >
          Delete Employee
        </Button>
      </Box>
    </Modal>
  );
};

export default DeleteEmployeeModal;