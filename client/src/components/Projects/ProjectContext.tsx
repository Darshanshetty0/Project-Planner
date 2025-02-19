import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Project } from "../types";

interface ProjectContextType {
  projects: Project[];
  addProject: (newProject: Project) => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider = ({ children }: { children: ReactNode }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch(`http://localhost:8080/projects/getProjects?authorization=${token}`);
        if (!response.ok) throw new Error("Failed to fetch projects");
        const data = await response.json();

        const formattedProjects: Project[] = data.map((entry: Project) => ({
          title: entry.title,
          desc: entry.desc,
          created_date: entry.created_date,
          deadline_date: entry.deadline_date,
          created_by_manager_email: entry.created_by_manager_email,
          id: entry.id,
          tasksSet: entry.tasksSet,
          employeeSet: entry.employeeSet,
          managerSet: entry.managerSet
        }));

        setProjects(formattedProjects);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    fetchProjects();
  }, [token]);

  const addProject = (newProject: Project) => {
    setProjects((prevProjects) => [...prevProjects, newProject]);
  };

  return (
    <ProjectContext.Provider value={{ projects, addProject }}>
      {children}
    </ProjectContext.Provider>
  );
};

export const useProjects = () => {
    const context = useContext(ProjectContext);
    if (!context) throw new Error("useProjects must be used within a ProjectProvider");
    return context;
};
