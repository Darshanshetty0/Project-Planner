import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Calendar } from "../types";

interface CalendarDetailsProps {
  calendars: Calendar[];
}

const ViewCalendar: React.FC<CalendarDetailsProps> = ({calendars}) => {
  const Calendars = calendars;
  const navigate = useNavigate();

  return (
    <div>
      <h1 style={{paddingLeft:'15px', color: 'white'}}>Calendar</h1>
      <div className="lets-wrap">
        {Calendars.map((calendar, index) => (
          <div key={index} className="container-calendar">
            <h2>{calendar.title}</h2>
            <p style={{ paddingLeft: "10px", color: "GrayText" }}>Id: {calendar.id}</p>
            <div className="container_invert-calendar">
              <p>Year: {calendar.year}</p>
              <p>Created By: {calendar.created_by_manager_email}</p>
              <h3>Holidays: {calendar.holidays.length}</h3>
              <Button 
              className="HoverableButton" 
              onClick={() => navigate(`/home/calendar/${calendar.id}`)}
              >View</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ViewCalendar;
