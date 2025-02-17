import { CalendarProvider } from "../../components/Calendar/CalendarContext";
import CalendarAddView from "../../components/Calendar/CalendarAddView";
import CalendarDetails from "../../components/Calendar/CalendarDetails";
import { Route, Routes } from "react-router-dom";

const Calendar = () => {
  return (
    <>
      <CalendarProvider>
        <Routes>
          <Route path="/:id" element={<CalendarDetails/>} />
          <Route path="/" element={<CalendarAddView/>} />
        </Routes>
      </CalendarProvider>
    </>
  );
};

export default Calendar;