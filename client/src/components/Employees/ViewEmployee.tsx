import { useEmployee } from "../../components/Employees/EmployeeContext";
import EmployeeCard from "./EmployeeCard";

const View_Employees: React.FC = () => {
  const { employees } = useEmployee();

  return (
    <div style={{ minWidth: 600 }}>
      <div style={{ paddingLeft: "15px" }}>
        <h1>Employees</h1>
      </div>
      <div className="lets-wrap">
        {employees.map((employee) => (
          <EmployeeCard key={employee.id} employee={employee} />
        ))}
      </div>
    </div>
  );
};

export default View_Employees;
