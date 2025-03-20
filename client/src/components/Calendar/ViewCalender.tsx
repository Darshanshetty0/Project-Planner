import { Button, Chip, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Calendar } from "../types";
import { useState } from "react";
import AddCalendar from "./Modals/AddCalendar";
import { Modal, Box } from "@mui/material";

interface CalendarDetailsProps {
  calendars: Calendar[];
  onCalendarAdd: (calendar: Calendar) => void;
}

const ViewCalendar: React.FC<CalendarDetailsProps> = ({ calendars, onCalendarAdd }) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Filter calendars based on the search query
  const filteredCalendars = calendars.filter(calendar =>
    calendar.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    calendar.id.toString().includes(searchQuery) ||
    calendar.year.toString().includes(searchQuery) ||
    calendar.created_by_manager_email.toString().includes(searchQuery.toLocaleLowerCase())
  );

  return (
    <div style={{minWidth:'80vw'}}>
      {/* Header with Search Bar and Add Button */}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
          padding: "10px",
        }}
      >
        <h1 style={{ paddingLeft: "15px", color: "white" }}>Calendar</h1>
        
        {/* Search Bar */}
        <TextField
          variant="outlined"
          size="small"
          placeholder="Search Calendar..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ backgroundColor: "white", borderRadius: 1, width: "40%" }}
        />

        {/* Add Calendar Button */}
        <Button
          variant="contained"
          color="primary"
          sx={{ padding: 1, maxWidth: "120px", maxHeight: "50px" }}
          onClick={() => setOpen(true)}
        >
          <p style={{ fontSize: "10px" }}>Add Calendar</p>
        </Button>
      </div>

      {/* Calendar List */}
      <div
        className="lets-wrap"
        style={{
          minWidth: "100%",
          maxHeight: "70vh",
          overflow: "auto",
          flexGrow: 1,
        }}
      >
        {filteredCalendars.length > 0 ? (
          filteredCalendars.map((calendar, index) => (
            <div key={index} className="container-calendar">
              <h2>{calendar.title}</h2>
              <p style={{ paddingLeft: "10px", color: "GrayText" }}>Id: <Chip label={calendar.id}/></p>
              <div className="container_invert-calendar">
                <p>Year: <Chip label={calendar.year}/></p>
                <p>Created By: <Chip label={calendar.created_by_manager_email}/></p>
                <div style={{display:'flex', flexDirection:'row', alignItems:'center', gap:'10px'}}><h3>Holidays:</h3><Chip label={calendar.holidays.length}/></div>
                <Button
                  className="HoverableButton"
                  onClick={() => navigate(`/home/calendar/${calendar.id}`)}
                >
                  View
                </Button>
              </div>
            </div>
          ))
        ) : (
          <p style={{ textAlign: "center", color: "gray" }}>No calendars found</p>
        )}
      </div>

      {/* Modal for AddCalendar */}
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "black",
            p: 4,
            boxShadow: 24,
            borderRadius: 2,
          }}
        >
          <AddCalendar calendars={calendars} onCalendarAdd={onCalendarAdd} />
          <Button onClick={() => setOpen(false)} sx={{ mt: 2 }} variant="outlined">
            Close
          </Button>
        </Box>
      </Modal>
    </div>
  );
};

export default ViewCalendar;
