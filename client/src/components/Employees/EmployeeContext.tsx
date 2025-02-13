import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface Manager {
    manager_email: string;
}
  
interface Employee {
    name: string;
    id: string;
    created_by_manager_email: string;
    created_date: string;
    holiday_calendar: string;
    manager_set: Manager[];
}

interface EmployeeContextType {
    employees: Employee[];
    addEmployee: (newEmployee: Employee) => void;
  }

const EmployeeContext = createContext<EmployeeContextType | undefined>(undefined);

export const EmployeeProvider = ({ children }: { children: ReactNode }) => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const token = localStorage.getItem("token");
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/employees/getEmployee?authorization=${token}`
        );
        if (!response.ok) throw new Error("Failed to fetch employees");
        const data = await response.json();

        // Transforming API response to match expected structure
        const formattedEmployees: Employee[] = data.data.map((entry: Employee) => ({
          name: entry.name,
          id: entry.id,
          created_by_manager_email: entry.created_by_manager_email,
          created_date: new Date(entry.created_date).toLocaleDateString(), // Format date
          holiday_calendar: entry.holiday_calendar,
          manager_set: entry.manager_set || [], // Handle missing array
        }));

        setEmployees(formattedEmployees);
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };

    fetchEmployees();
  }, [token]);

  //STATE UPDATE GENERAL FORMAT
  const addEmployee = (newEmployee: Employee) => {
    setEmployees((prevEmployees) => [...prevEmployees, newEmployee]);
  };

  return (
    <EmployeeContext.Provider value={{ employees, addEmployee }}>
      {children}
    </EmployeeContext.Provider>
  );
};

export const useEmployee = () => {
    const context = useContext(EmployeeContext);
    if (!context) throw new Error("useEmployee must be used within a EmployeeProvider");
    return context;
};
