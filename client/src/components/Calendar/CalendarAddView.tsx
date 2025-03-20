import React from 'react';
import View_Calendar from './ViewCalender';        
import { Container, Box } from '@mui/material';     
import { Calendar } from "../../components/types";

interface CalendarDetailsProps {
  calendars: Calendar[];
  onCalendarAdd: (calendar: Calendar) => void;
}

const CalendarAddView: React.FC<CalendarDetailsProps> = ({ calendars, onCalendarAdd }) => {
    return (
        <Container sx={{ display: "flex", flexDirection: "row", height: "85vh" }}>
            {/* Scrollable Calendar View */}
            <Box className="main-content" >
                <View_Calendar calendars={calendars} onCalendarAdd={onCalendarAdd} />
            </Box>
        </Container>
    );
};

export default CalendarAddView;
