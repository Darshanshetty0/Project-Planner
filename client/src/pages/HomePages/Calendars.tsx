import { CalendarProvider } from "../../components/Calendar/CalendarContext";
import AddCalendar from "../../components/Calendar/AddCalendar";
import View_Calendar from "../../components/Calendar/ViewCalender";
import { Box, Container } from "@mui/material";

const Calendar = () => {
  return (
    <>
      <CalendarProvider>
        <Container sx={{display:"flex", flexDirection:"row"}}>
          <Box className="main-content" sx={{minWidth:600, maxWidth:700, maxHeight:"fit-content"}}>
              <View_Calendar />
            </Box>
            <Box className="main-content" sx={{maxWidth: 400,maxHeight:"fit-content"}}>
              <AddCalendar />
            </Box>
        </Container>
      </CalendarProvider>
    </>
  );
};

export default Calendar;