import { useCalendar } from "../../components/Calendar/CalendarContext";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const View_Calendar: React.FC = () => {
  const { calendars } = useCalendar();
  const navigate = useNavigate();

  return (
    <div>
      <h1 style={{paddingLeft:'15px'}}>Calendar</h1>
      <div className="lets-wrap">
        {calendars.map((calendar, index) => (
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

export default View_Calendar;
