import { useState, useEffect } from "react";
import { Modal, Box, Typography, Button, TextField } from "@mui/material";
import { Calendar } from "../../types"; // Adjust the import path if needed
import { handleError, handleSuccess } from "../../../utils";

interface EditCalendarProps {
  open: boolean;
  onClose: () => void;
  calendar: Calendar | null;
  onCalendarUpdate: (calendar: Calendar) => void;
}

const EditCalendarModal: React.FC<EditCalendarProps> = ({ open, onClose, calendar, onCalendarUpdate }) => {
  const [title, setTitle] = useState("");
  const [year, setYear] = useState(Number);
  const [createdBy, setCreatedBy] = useState("");

  useEffect(() => {
    if (calendar) {
      setTitle(calendar.title);
      setYear(calendar.year);
      setCreatedBy(calendar.created_by_manager_email);
    }
  }, [calendar]);

  if (!calendar) return null; // Prevents rendering if no calendar is selected

  const handleSaveCalendar = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found, authorization required.");
      return;
    }

    const updatedCalendar: Calendar = {
      ...calendar,
      title,
      year,
      created_by_manager_email: createdBy,
    };

    try {
      const response = await fetch(`http://localhost:8080/calendars/updateCalendar?id=${calendar.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: `${token}`,
        },
        body: JSON.stringify(updatedCalendar),
      });

      const responseData = await response.json();

      if (response.ok && responseData.success) {
        onCalendarUpdate(updatedCalendar); // Update parent state
        handleSuccess("Calendar updated successfully!");
        onClose();
      } else {
        handleError("Failed to update calendar: " + responseData.message);
      }
    } catch (error) {
      handleError("Error updating calendar: " + error);
    }
  };

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="edit-calendar-modal">
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
        <Typography variant="h6">Edit Calendar</Typography>
        <TextField label="Title" value={title} onChange={(e) => setTitle(e.target.value)} fullWidth sx={{ mt: 2 }} />
        <TextField label="Year" value={year} onChange={(e) => setYear(Number(e.target.value))} fullWidth sx={{ mt: 2 }} />
        <TextField
          label="Created By Manager Email"
          value={createdBy}
          onChange={(e) => setCreatedBy(e.target.value)}
          fullWidth
          sx={{ mt: 2 }}
        />
        <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={handleSaveCalendar}>
          Save Changes
        </Button>
      </Box>
    </Modal>
  );
};

export default EditCalendarModal;
