import { useParams } from "react-router-dom";
import { useState } from "react";
import { useCalendar } from "./CalendarContext";
import DeleteSharpIcon from "@mui/icons-material/DeleteSharp";
import EditSharpIcon from "@mui/icons-material/EditSharp";
import { 
  Card, CardContent, Typography, IconButton, Stack, Divider, 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TextField
} from "@mui/material";

interface Holiday {
  date: Date;
  name: string;
}

const CalendarDetails: React.FC = () => {
  const { id } = useParams();
  const { calendars } = useCalendar();
  const calendar = calendars.find((cal) => cal.id === id as unknown);
  
  const [holidays, setHolidays] = useState<Holiday[]>(calendar?.holidays || []);
  const [newHoliday, setNewHoliday] = useState<Holiday>({ date: new Date(), name: "" });

  if (!calendar) {
    return (
      <Card sx={{ p: 2, minWidth: "80vw", boxShadow: 3, borderRadius: 2 }}>
        <Stack direction="column" justifyContent="space-evenly">
          <Typography variant="h4">
            Calendar with ID: {id} does not exist!
          </Typography>
          <p>Please make sure that you have entered the right ID. There is also a possibility that the Calendar with ID {id} wasn't created by you.</p>
        </Stack>
      </Card>
    );
  }

  const handleAddHoliday = () => {
    if (newHoliday.date && newHoliday.name) {
      setHolidays([...holidays, newHoliday]);
      setNewHoliday({ date: new Date(), name: "" });
    }
  };

  const handleSaveHolidays = () => {
    console.log("Saving holidays:", holidays);
    // Implement state update logic here
  };

  return (
    <Card sx={{ p: 2, minWidth: "80vw", boxShadow: 3, borderRadius: 2 }}>
      <CardContent>
        <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
          <Stack direction="row" alignItems="baseline" spacing={1}>
            <Typography variant="h4" fontWeight={600}>
              {calendar.title} ({calendar.year})
            </Typography>
            <Typography variant="body2" color="text.secondary">
              ID: {calendar.id}
            </Typography>
          </Stack>
          <Stack direction="row" spacing={1}>
            <IconButton color="primary" size="small">
              <EditSharpIcon />
            </IconButton>
            <IconButton color="error" size="small">
              <DeleteSharpIcon />
            </IconButton>
          </Stack>
        </Stack>

        <Divider sx={{ my: 2 }} />
        <Typography variant="body2" color="text.secondary">
          <strong>Created By:</strong> {calendar.created_by_manager_email}
        </Typography>
        
        <Divider sx={{ my: 2 }} />
        <Typography variant="h6" gutterBottom>
          Holidays
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Name</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {holidays.map((holiday, index) => (
                <TableRow key={index}>
                  <TableCell>{holiday.date.toDateString()}</TableCell>
                  <TableCell>{holiday.name}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        
        <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
          <TextField
            label="Date"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={newHoliday.date.toISOString().split('T')[0]}
            onChange={(e) => setNewHoliday({ ...newHoliday, date: new Date(e.target.value) })}
          />
          <TextField
            label="Holiday Name"
            value={newHoliday.name}
            onChange={(e) => setNewHoliday({ ...newHoliday, name: e.target.value })}
          />
          <Button variant="contained" color="primary" onClick={handleAddHoliday}>
            Add Holiday
          </Button>
        </Stack>
        <Button variant="contained" color="success" sx={{ mt: 2 }} onClick={handleSaveHolidays}>
          Save Holidays
        </Button>
      </CardContent>
    </Card>
  );
};

export default CalendarDetails;