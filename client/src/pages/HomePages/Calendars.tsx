import CalendarAddView from "../../components/Calendar/CalendarAddView";
import CalendarDetails from "../../components/Calendar/CalendarDetails";
import { Route, Routes } from "react-router-dom";
import { useState, useEffect} from "react";
import { Calendar } from "../../components/types";

const CalendarComponent = () => {
    const [calendars, setCalendars] = useState<Calendar[]>([]);
    const token = localStorage.getItem("token");
    useEffect(() => {
      const fetchCalendars = async () => {
        try {
          const response = await fetch(`http://localhost:8080/calendar/getCalendar?authorization=${token}`);
          if (!response.ok) throw new Error("Failed to fetch calendars");
          const data = await response.json();
  
          const formattedCalendars: Calendar[] = data.map((entry: Calendar) => ({
            title: entry.title,
            year: entry.year,
            created_by_manager_email: entry.created_by_manager_email,
            holidays: entry.holidays || [],
            id: entry.id,
          }));
  
          setCalendars(formattedCalendars);
        } catch (error) {
          console.error("Error fetching calendars:", error);
        }
      };
  
      fetchCalendars();
    }, [token]);

    const handleCalendarAdd = (calendar: Calendar) => {
      //write function to add a new calendar to calendars
  };
  return (
    <>
        <Routes>
          <Route path="/:id" element={<CalendarDetails calendars={calendars} onCalendarAdd={handleCalendarAdd}/>} />
          <Route path="/" element={<CalendarAddView/>} />
        </Routes>
    </>
  );
};

export default CalendarComponent;