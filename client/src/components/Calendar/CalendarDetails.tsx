import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { handleError, handleSuccess } from '../../utils';
import DeleteSharpIcon from "@mui/icons-material/DeleteSharp";
import EditSharpIcon from "@mui/icons-material/EditSharp";
import EditCalendarModal from "./Modals/EditCalendarModal";
import DeleteCalendarModal from "./Modals/DeleteCalendarModal";
import { 
  Card, CardContent, Typography, IconButton, Stack, Divider, Button, TextField
} from "@mui/material";

import { Calendar, Holiday } from "../../components/types";
import DataTable from "../../components/Calendar/HolidayTable";

interface CalendarDetailsProps {
  calendars: Calendar[];
  onCalendarUpdate: (calendar: Calendar) => void;
  onCalendarDelete: (id: string) => void;
}

const CalendarDetails: React.FC<CalendarDetailsProps> = ({calendars, onCalendarUpdate, onCalendarDelete}) => {
  const { id } = useParams();
  const calendar = calendars.find((cal) => cal.id === id as unknown);
  const [holidays, setHolidays] = useState<Holiday[]>(calendar?.holidays || []);
  const [newHoliday, setNewHoliday] = useState<{ date: Date; title: string }>({ 
    date: new Date(), 
    title: "" 
  });
  
  const [open, setOpen] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedCalendar, setSelectedCalendar] = useState<Calendar | null>(null);

  const handleOpenDeleteModal = (calendar: Calendar) => {
    setSelectedCalendar(calendar); // Set the selected calendar to edit
    setOpenDelete(true);
  };

  const handleCloseDeleteModal = () => {
    setOpenDelete(false);
    setSelectedCalendar(null);
  };

  const handleOpenModal = (calendar: Calendar) => {
    setSelectedCalendar(calendar); // Set the selected calendar to edit
    setOpen(true);
  };

  const handleCloseModal = () => {
    setOpen(false);
    setSelectedCalendar(null);
  };

  useEffect(() => {
    if (calendar?.holidays && calendar.holidays.length > 0) {
      setHolidays(calendar.holidays);
    }
  
    // Only set the initial newHoliday state when the component mounts
    setNewHoliday((prev) => ({
      ...prev,
      date: new Date(`${calendar?.year}-01-01`),
    }));
  }, [calendar]);

  if (!calendar) {
    return (
      <>
      <Card sx={{ p: 2, minWidth: "80vw", boxShadow: 3, borderRadius: 2 }}>
        <Stack direction="column" justifyContent="space-evenly">
          <Typography variant="h4">
            Calendar with ID: {id} does not exist!
          </Typography>
          <p>Please make sure that you have entered the right ID. There is also a possibility that the Calendar with ID {id} wasn't created by you.</p>
        </Stack>
      </Card>
      </>
    );
  }

  const handleDelete = (holidayId: string) => {
    setHolidays((prev) => prev.filter((h) => `${h.title}-${h.date}` !== holidayId));
  };

  const handleAddHoliday = () => {
    if(newHoliday.date.getFullYear()!=calendar.year){
      handleError('The entered year is different in comparision to the calendar year')
      setNewHoliday({ date: new Date(`${calendar?.year}-01-01`), title: "" });
      return
    }
    if (newHoliday.date && newHoliday.title) {
      setHolidays([...holidays, newHoliday]);
      setNewHoliday({ date: new Date(`${calendar?.year}-01-01`), title: "" });
    }
  };

  const handleSaveHolidays = async () => {
    if (!calendar) return;

    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found, authorization required.");
      return;
    }
  
    const updatedCalendar: Calendar = {
      ...calendar,
      holidays: holidays, // Use the updated holidays from state
    };
  
    try {
      const response = await fetch(`http://localhost:8080/calendars/updateCalendar?id=${calendar.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "authorization": `${token}`,
        },
        body: JSON.stringify(updatedCalendar),
      });
      console.log(updatedCalendar)
  
      const responseData = await response.json();
  
      if (response.ok && responseData.success) {
        // Update calendars state in parent using onCalendarUpdate
        onCalendarUpdate(updatedCalendar);
        console.log("Holidays updated successfully!");
        handleSuccess("Holiday has been added")
      } else {
        handleError("Failed to update holidays:" + responseData.message);
      }
    } catch (error) {
      handleError("Error saving holidays:" + error);
      console.log(error);
    }
  };
  

  return (
    <>
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
          <IconButton color="primary" size="small" onClick={() => handleOpenModal(calendar)}>
            <EditSharpIcon />
          </IconButton>
            <IconButton color="error" size="small" onClick={() => handleOpenDeleteModal(calendar)}>
              <DeleteSharpIcon />
            </IconButton>
          </Stack>
        </Stack>

        <Divider sx={{ my: 2 }} />
        <Typography variant="body2" color="text.secondary">
          <strong>Created By:</strong> {calendar.created_by_manager_email}
        </Typography>

        <h2 style={{paddingLeft:'15px'}}>Holidays</h2>
        <DataTable holidays={holidays} onDelete={handleDelete}/>
        <Divider sx={{ my: 2 }} />
        
        <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
          <TextField
            label="Date"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={newHoliday.date.toISOString().split("T")[0]} // Ensure proper formatting
            onChange={(e) => {
              const selectedDate = e.target.value; // Get the selected date as a string
              setNewHoliday((prev) => ({
                ...prev,
                date: new Date(selectedDate + "T00:00:00"), // Avoids time zone shifts
              }));
            }}
          />
          <TextField
            label="Holiday Name"
            value={newHoliday.title}
            onChange={(e) => setNewHoliday((prev) => ({ ...prev, title: e.target.value }))}
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
    <EditCalendarModal open={open} onClose={handleCloseModal} calendar={selectedCalendar} onCalendarUpdate={onCalendarUpdate}/>
    <DeleteCalendarModal open={openDelete} onClose={handleCloseDeleteModal} calendar={selectedCalendar} onCalendarDelete={onCalendarDelete}/>
    </>
  );
};

export default CalendarDetails;