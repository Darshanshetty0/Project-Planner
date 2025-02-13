import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface Holiday {
  date: Date;
  name: string;
}

interface Calendar {
  title: string;
  year: string;
  created_by_manager_email: string;
  holidays: Holiday[];
  id: number;
}

interface CalendarContextType {
  calendars: Calendar[];
  addCalendar: (newCalendar: Calendar) => void;
}

const CalendarContext = createContext<CalendarContextType | undefined>(undefined);

export const CalendarProvider = ({ children }: { children: ReactNode }) => {
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
          year: entry.year.toString(),
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

  //STATE UPDATE GENERAL FORMAT
  const addCalendar = (newCalendar: Calendar) => {
    setCalendars((prevCalendars) => [...prevCalendars, newCalendar]);
  };

  return (
    <CalendarContext.Provider value={{ calendars, addCalendar }}>
      {children}
    </CalendarContext.Provider>
  );
};

export const useCalendar = () => {
    const context = useContext(CalendarContext);
    if (!context) throw new Error("useCalendar must be used within a CalendarProvider");
    return context;
};
