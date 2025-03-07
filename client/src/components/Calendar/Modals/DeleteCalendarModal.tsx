import { useState } from "react";
import { Modal, Box, Typography, Button, TextField } from "@mui/material";
import { Calendar } from "../../types"; // Adjust the import path if needed
import { handleError, handleSuccess } from "../../../utils";
import { useNavigate } from "react-router-dom";

interface DeleteCalendarProps {
  open: boolean;
  onClose: () => void;
  calendar: Calendar | null;
  onCalendarDelete: (id: string) => void;
}

const DeleteCalendarModal: React.FC<DeleteCalendarProps> = ({ open, onClose, calendar, onCalendarDelete }) => {
  const [confirmationText, setConfirmationText] = useState("");
  const navigate = useNavigate();
  
  if (!calendar) return null; // Prevents rendering if no calendar is selected

  const handleDeleteCalendar = async () => {
    if (confirmationText !== calendar.title) {
      handleError("Calendar title does not match. Please type the correct title to confirm deletion.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found, authorization required.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/calendar/deleteCalendar?id=${calendar.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: `${token}`,
        },
      });

      const responseData = await response.json();

      if (response.ok && responseData.success) {
        onCalendarDelete(calendar.id); // Update parent state
        onClose();
        navigate('/home/calendar');
        handleSuccess("Calendar deleted successfully!");
      } else {
        handleError("Failed to delete calendar: " + responseData.message);
      }
    } catch (error) {
      handleError("Error deleting calendar: " + error);
    }
  };

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="delete-calendar-modal">
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
        <Typography variant="h6" color="error">Confirm Calendar Deletion</Typography>
        <Typography variant="body1" sx={{ mt: 2 }}>
          To confirm deletion, type <strong>{calendar.title}</strong> in the box below:
        </Typography>
        <TextField
          label="Confirm Title"
          value={confirmationText}
          onChange={(e) => setConfirmationText(e.target.value)}
          fullWidth
          sx={{ mt: 2 }}
        />
        <Button
          variant="contained"
          color="error"
          sx={{ mt: 2 }}
          onClick={handleDeleteCalendar}
          disabled={confirmationText !== calendar.title}
        >
          Delete Calendar
        </Button>
      </Box>
    </Modal>
  );
};

export default DeleteCalendarModal;
