import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import EmployeeAddView from "../../components/Employees/EmployeeAddView";
import EmployeeDetails from "../../components/Employees/EmployeeDetails";
import { Employee, Calendar, IUser } from "../../components/types";

const Employees = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const token = localStorage.getItem("token");
  const [calendars, setCalendars] = useState<Calendar[]>([]);
  const [managers, setManagers] = useState<IUser[]>([]);

  useEffect(() => {
      const fetchCalendars = async () => {
        try {
          const response = await fetch(`http://localhost:8080/calendars/getCalendar?authorization=${token}`);
          if (!response.ok) throw new Error("Failed to fetch calendars");
          const data = await response.json();
  
          const formattedCalendars: Calendar[] = data.calendars.map((entry: Calendar) => ({
            title: entry.title,
            year: entry.year,
            created_by_manager_email: data.userInfo.email,
            holidays: entry.holidays || [],
            id: entry._id,
          }));
  
          setCalendars(formattedCalendars);
        } catch (error) {
          console.error("Error fetching calendars:", error);
        }
      };
  
      fetchCalendars();
    }, [token]);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No token found, authorization required.");
          return;
        }
  
        const response = await fetch("http://localhost:8080/employees/getEmployee", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        });
  
        if (!response.ok) throw new Error("Failed to fetch employees");

        const data = await response.json();

        const formattedEmployees: Employee[] = data.data.map((entry: Employee) => ({
          name: entry.name,
          holiday_calendar: entry.holiday_calendar,
          created_by_manager: entry.created_by_manager,
          created_date: entry.created_date,
          id: entry._id,
          manager_set: entry.manager_set,
          shift_from: entry.shift_from,
          shift_to: entry.shift_to
        }));
        setEmployees(formattedEmployees);
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };
    fetchEmployees();
  }, [token]);

  useEffect(() => {
    const fetchManagers = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No token found, authorization required.");
          return;
        }
  
        const response = await fetch("http://localhost:8080/employees/getManagers", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        });
  
        if (!response.ok) throw new Error("Failed to fetch managers");
  
        const data = await response.json();
  
        const formattedManagers: IUser[] = data.managers.map((entry: IUser) => ({
          _id: entry._id,
          name: entry.name,
          email: entry.email,
        }));
  
        setManagers(formattedManagers);
      } catch (error) {
        console.error("Error fetching managers:", error);
      }
    };
  
    fetchManagers();
  }, [token]);

  const handleEmployeeAdd = (newEmployee: Employee) => {
    setEmployees((prevEmployees) => [...prevEmployees, newEmployee]);
  };

  const handleEmployeeUpdate = (updatedEmployee: Employee) => {
    setEmployees((prevEmployees) =>
      prevEmployees.map((employee) =>
        employee.id === updatedEmployee.id ? updatedEmployee : employee
      )
    );
  };

  const handleEmployeeDelete = (id: string) => {
    setEmployees((prevEmployees) =>
      prevEmployees.filter((employee) => employee.id !== id)
    );
  };
  console.log(employees);

  return (
    <>
      <Routes>
        <Route
          path="/:id"
          element={
            <EmployeeDetails
              employees={employees}
              calendars = {calendars}
              managers = {managers}
              onEmployeeDelete={handleEmployeeDelete}
              onEmployeeUpdate={handleEmployeeUpdate}/>
          }
        />
        <Route
          path="/"
          element={<EmployeeAddView employees={employees} calendars={calendars} managers={managers} onEmployeeAdd={handleEmployeeAdd} />}
        />
      </Routes>
    </>
  );
};

export default Employees;