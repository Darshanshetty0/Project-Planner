import { useState } from "react";
import { TextField, Button, Typography, Box } from "@mui/material";
import { handleError, handleSuccess } from '../../../utils';
import { Calendar } from "../../types";

interface CalendarDetailsProps {
  calendars: Calendar[];
  onCalendarAdd: (calendar: Calendar) => void;
}

const AddCalendar: React.FC<CalendarDetailsProps> = ({ onCalendarAdd }) => {
  const [title, setTitle] = useState("");
  const [year, setYear] = useState("");
  const token = localStorage.getItem("token");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newCalendar = {
      title,
      year : Number(year),
      holidays: [],
    };

    try {
      if(!Number(year)) {
        handleError("Year is not a")
        return
      }

      if(title.length<5) {
        handleError("Title Length less than 5")
        return
      }
      if(Number(year)<2000 || Number(year)>2050) {
        handleError("The year entered falls out of range, i.e, beyond the range of 2000-2050")
        return
      }
      try {
        const response = await fetch("http://localhost:8080/calendars/addCalendar", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "authorization": `${token}`
          },
          body: JSON.stringify(newCalendar),
        });
        console.log(newCalendar)
  
        const data = await response.json();
  
        if (response.ok) {
          console.log(data.calendar)
          onCalendarAdd(data.calendar); // Use onCalendarAdd instead of addCalendar
          handleSuccess("Calendar added successfully!");
          setTitle("");
          setYear("");
        } else {
          handleError(data.message);
        }
      } catch (error) {
        console.error("Error adding calendar:", error);
        handleError("Failed to add calendar");
      }
    } catch (error) {
      handleError("Unknown Error: "+ error)
    }
  };

  return (
    <Box sx={{ color: 'white', maxWidth: 400, margin: "0", padding: 3, alignContent: "flex-start" }}>
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
          sx={{ marginBottom: 2,
            "& label": { color: "white" }, // Label color
            "& label.Mui-focused": { color: "white" }, // Focused label color
            "& .MuiOutlinedInput-root": {
              "& fieldset": { borderColor: "white" }, // Default border color
              "&:hover fieldset": { borderColor: "white" }, // Hover border color
              "&.Mui-focused fieldset": { borderColor: "white" }, // Focused border color
            },
            "& .MuiInputBase-input": {
              color: "white", // Typed text color
              caretColor: "white", // Cursor color
            },
          }}
        />
        <TextField
          label="Year"
          variant="outlined"
          fullWidth
          value={year}
          onChange={(e) => setYear(e.target.value)}
          required
          sx={{ marginBottom: 2,
            "& label": { color: "white" }, // Label color
            "& label.Mui-focused": { color: "white" }, // Focused label color
            "& .MuiOutlinedInput-root": {
              "& fieldset": { borderColor: "white" }, // Default border color
              "&:hover fieldset": { borderColor: "white" }, // Hover border color
              "&.Mui-focused fieldset": { borderColor: "white" }, // Focused border color
            },
            "& .MuiInputBase-input": {
              color: "white", // Typed text color
              caretColor: "white", // Cursor color
            },
          }}
        />
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Add
        </Button>
      </form>
    </Box>
  );
};

export default AddCalendar;
