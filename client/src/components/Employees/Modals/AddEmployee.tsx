import { useState } from "react";
import { TextField, Button, Typography, Box, FormControlLabel, Checkbox, Autocomplete, Chip } from "@mui/material";
import { Calendar, Employee, IUser } from "../../types";
import { handleError, handleSuccess } from "../../../utils";

interface AddEmployeeProps {
  managers: IUser[];
  calendars: Calendar[];
  employees: Employee[]; // Required for manager_set validation
  onEmployeeAdd: (employee: Employee) => void;
}

const AddEmployee: React.FC<AddEmployeeProps> = ({ managers, calendars, onEmployeeAdd }) => {
  const [name, setName] = useState("");
  const [holidayCalendar, setHolidayCalendar] = useState<Calendar | null>(null);
  const [managerSet, setManagerSet] = useState<IUser[]>([]);
  const [shiftFrom, setShiftFrom] = useState("");
  const [shiftTo, setShiftTo] = useState("");
  const [isChecked, setIsChecked] = useState(false);

  const token = localStorage.getItem("token");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if required fields exist
    if (!holidayCalendar) {
      handleError("Please select a holiday calendar.");
      return;
    }

    if (!token) {
      handleError("User not authenticated.");
      return;
    }

    // Convert selected managers into an array of manager IDs
    const selectedManagerIds: string[] = managerSet
    .map((manager) => manager._id)
    .filter((id): id is string => Boolean(id));

    // Check for duplicates in manager_set
    const hasDuplicateManagers = selectedManagerIds.some(
      (id, index) => selectedManagerIds.indexOf(id) !== index
    );

    if (hasDuplicateManagers) {
      handleError("Duplicate managers selected.");
      return;
    }

    const created_date = new Date();
    const requestBody: Employee = {
      name,
      created_date,
      holiday_calendar: holidayCalendar.id,
      manager_set: selectedManagerIds, // Array of manager IDs
      shift_from: shiftFrom,
      shift_to: shiftTo,
    };

    try {
      const response = await fetch("http://localhost:8080/employees/addEmployee", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (response.ok) {
        onEmployeeAdd({
          ...requestBody,
          _id: data._id, // Assign MongoDB-generated _id
        });
        handleSuccess("Employee added successfully!");

        // Reset form
        setName("");
        setManagerSet([]);
        setHolidayCalendar(null);
        setShiftFrom("");
        setShiftTo("");
        setIsChecked(false);
      } else {
        handleError(`Error: ${data.message}`);
      }
    } catch (error) {
      handleError("Failed to add employee: " + error);
    }
  };

  return (
    <Box sx={{ maxWidth: 800, margin: "0 auto", padding: 3, backgroundColor: "white" }}>
      <Typography variant="h5" gutterBottom>
        Add Employee
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Name"
          fullWidth
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          sx={{ mb: 2 }}
        />
        <Autocomplete
          options={calendars}
          getOptionLabel={(option) => option.title}
          value={holidayCalendar}
          onChange={(_, newValue) => setHolidayCalendar(newValue)}
          renderInput={(params) => <TextField {...params} label="Select Calendar" required />}
          sx={{ mb: 2 }}
        />
        <FormControlLabel
          control={<Checkbox checked={isChecked} onChange={(e) => setIsChecked(e.target.checked)} />}
          label="I will be managing this employee."
          sx={{ mb: 2 }}
        />
        
        {/* Multi-Select Dropdown for Managers */}
        <Autocomplete
          multiple
          options={managers}
          getOptionLabel={(option) => option.name} // Show manager's name
          value={managerSet}
          onChange={(_, newValue) => setManagerSet(newValue)}
          renderTags={(tagValue, getTagProps) =>
            tagValue.map((option, index) => (
              <Chip label={option.name} {...getTagProps({ index })} /> // ✅ Fix applied
            ))
          }
          renderInput={(params) => <TextField {...params} label="Select Managers" />}
          sx={{ mb: 2 }}
        />
        <TextField
          label="Shift From"
          type="time"
          fullWidth
          value={shiftFrom}
          onChange={(e) => setShiftFrom(e.target.value)}
          required
          sx={{ mb: 2 }}
        />
        <TextField
          label="Shift To"
          type="time"
          fullWidth
          value={shiftTo}
          onChange={(e) => setShiftTo(e.target.value)}
          required
          sx={{ mb: 2 }}
        />
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Add Employee
        </Button>
      </form>
    </Box>
  );
};

export default AddEmployee;
