import { useState } from "react";
import { TextField, Button, Typography, Box } from "@mui/material";
import { useCalendar } from "../../components/Calendar/CalendarContext";
import { handleError, handleSuccess } from '../../utils';
import { ToastContainer } from "react-toastify";

const AddCalendar: React.FC = () => {
  const { addCalendar } = useCalendar();
  const [title, setTitle] = useState("");
  const [year, setYear] = useState("");
  const [id, setId] = useState("");
  const token = localStorage.getItem("token");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newCalendar = {
      title,
      year,
      created_by_manager_email: "", 
      holidays: [],
      id: Number(id),
    };

    const response = await fetch("http://localhost:8080/calendar/addCalendar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, year, id, authorization: token }),
    });

    const data = await response.json();
    if (response.ok) {
      addCalendar(newCalendar);
      handleSuccess("Calendar added successfully!")
      setTitle("");
      setYear("");
      setId("");

    } else {
      handleError(data.message);
    }
  };

  return (
    <Box sx={{ maxWidth: 400, margin: "0", padding: 3, alignContent: "flex-start" }}>
      <Typography variant="h5" gutterBottom>
        Add Calendar
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Title"
          variant="outlined"
          fullWidth
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          sx={{ marginBottom: 2 }}
        />
        <TextField
          label="Year"
          variant="outlined"
          fullWidth
          value={year}
          onChange={(e) => setYear(e.target.value)}
          required
          sx={{ marginBottom: 2 }}
        />
        <TextField
          label="ID"
          variant="outlined"
          fullWidth
          value={id}
          onChange={(e) => setId(e.target.value)}
          required
          sx={{ marginBottom: 2 }}
        />
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Add
        </Button>
      </form>
      <ToastContainer/>
    </Box>
  );
};

export default AddCalendar;
