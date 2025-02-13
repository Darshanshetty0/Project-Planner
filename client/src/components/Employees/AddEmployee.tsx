import { useState, useEffect } from "react";
import { TextField, Button, Typography, Box, FormControlLabel, Checkbox, Autocomplete } from "@mui/material";
import { useEmployee } from "../../components/Employees/EmployeeContext";

interface Holiday {
  date: string;
  name: string;
}

interface Calendar {
  title: string;
  year: string;
  created_by_manager_email: string;
  holidays: Holiday[];
  id: number;
}

const AddEmployee: React.FC = () => {
  const [name, setName] = useState("");
  const token = localStorage.getItem('token');
  const [id, setId] = useState("");
  const [holidayCalendar, setCalendar] = useState("");
  const [managerSet, setManagerSet] = useState<string>("");
  const [shiftFrom, setShiftFrom] = useState("");
  const [shiftTo, setShiftTo] = useState("");
  const [message, setMessage] = useState("");
  const [isChecked, setIsChecked] = useState(false);

  const [calendars, setCalendarList] = useState<string[]>([]);

  const {addEmployee} = useEmployee();

  useEffect(() => {
    const fetchEmails = async () => {
      try {
        const response = await fetch(`http://localhost:8080/calendar/getCalendar?authorization=${token}`); // Replace with your API
        if (!response.ok) throw new Error("Failed to fetch emails");
        const data = await response.json();
        const calendar_list: string[] = data.map((entry: Calendar) => entry.id);
        setCalendarList(calendar_list);
      } catch (error) {
        console.error("Error fetching emails:", error);
      }
    };

    fetchEmails();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const managerSetArray = managerSet.split(",").map((email) => ({
      manager_email: email.trim(),
    }));

    const createdDate = new Date().toISOString();
    const LocaleDate =  new Date(createdDate).toLocaleDateString()

    const requestBody = {
      name,
      authorization: token,
      created_date: createdDate,
      id,
      holiday_calendar: holidayCalendar,
      manager_set: managerSetArray,
      shift_from: shiftFrom,
      shift_to: shiftTo,
      selfManage: isChecked,
    };

    const employeedata = {
      name: requestBody.name,
      id: requestBody.id,
      created_by_manager_email: "",
      created_date: LocaleDate,
      holiday_calendar: requestBody.holiday_calendar,
      manager_set: requestBody.manager_set
    }; 

    const response = await fetch("http://localhost:8080/employees/addEmployee", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    });

    const data = await response.json();
    if (response.ok) {
      setMessage("Employee added successfully!");
      employeedata.created_by_manager_email = data.created_by_manager_email;
      addEmployee(employeedata);
    } else {
      setMessage(`Error: ${data.message}`);
    }
  };

  return (
    <Box sx={{ maxWidth: 800, margin: "0 auto", padding: 3 }}>
      <Typography variant="h5" gutterBottom>
        Add Employee
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Name"
          variant="outlined"
          fullWidth
          value={name}
          onChange={(e) => setName(e.target.value)}
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
        <Autocomplete
          options={calendars}
          value={holidayCalendar}
          onChange={(_, newValue) => setCalendar(newValue || "")}
          renderInput={(params) => <TextField {...params} label="Select Calendar" variant="outlined" />}
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={isChecked}
              onChange={(e) => setIsChecked(e.target.checked)}
            />
          }
          label="I will be managing this employee."
          sx={{ marginBottom: 2 }}
        />
        <TextField
          label="Manager Emails (comma-separated)"
          variant="outlined"
          fullWidth
          value={managerSet}
          onChange={(e) => setManagerSet(e.target.value)}
          sx={{ marginBottom: 2 }}
          helperText="Enter multiple manager emails separated by commas"
        />
        <TextField
          label="Shift From (HH:MM)"
          type="time"
          variant="outlined"
          fullWidth
          value={shiftFrom}
          onChange={(e) => setShiftFrom(e.target.value)}
          required
          sx={{ marginBottom: 2 }}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="Shift To (HH:MM)"
          type="time"
          variant="outlined"
          fullWidth
          value={shiftTo}
          onChange={(e) => setShiftTo(e.target.value)}
          required
          sx={{ marginBottom: 2 }}
          InputLabelProps={{ shrink: true }}
        />
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Add Employee
        </Button>
      </form>
      {message && <Typography variant="body2" sx={{ marginTop: 2 }}>{message}</Typography>}
    </Box>
  );
};

export default AddEmployee;
