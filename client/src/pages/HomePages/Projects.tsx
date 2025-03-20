import { useState, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import ProjectAddView from "../../components/Projects/ProjectAddView";
import ProjectDetails from "../../components/Projects/ProjectDetails";
import { Project, IUser } from "../../components/types";


const Projects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const token = localStorage.getItem("token");
  const [managers, setManagers] = useState<IUser[]>([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        if (!token) {
          console.error("No token found, authorization required.");
          return;
        }

        const response = await fetch("http://localhost:8080/projects/getProjects", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: token, // ✅ Moved token to headers
          },
        });

        if (!response.ok) throw new Error("Failed to fetch projects");

        const data = await response.json();
        console.log(data)

        const formattedProjects: Project[] = data.data.map((entry: Project) => ({
          title: entry.title,
          desc: entry.desc,
          created_date: entry.created_date,
          deadline_date: entry.deadline_date,
          created_by_manager: entry.created_by_manager,
          id: entry._id, // ✅ Use `_id` if MongoDB-generated
          tasksSet: entry.tasksSet || [],
          employeeSet: entry.employeeSet || [],
          managerSet: entry.managerSet || [],
        }));

        setProjects(formattedProjects);
        console.log(formattedProjects)
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    fetchProjects();
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

  // ✅ Function to add a project
  const handleProjectAdd = (newProject: Project) => {
    setProjects((prevProjects) => [...prevProjects, newProject]);
  };

  // ✅ Function to update a project
  const handleProjectUpdate = (updatedProject: Project) => {
    setProjects((prevProjects) =>
      prevProjects.map((project) => (project.id === updatedProject.id ? updatedProject : project))
    );
  };

  // ✅ Function to delete a project
  const handleProjectDelete = (id: string) => {
    setProjects((prevProjects) => prevProjects.filter((project) => project.id !== id));
  };

  return (
    <>
      <Routes>
        <Route
          path="/:id"
          element={
            <ProjectDetails
              managers={managers}
              projects={projects}
              onProjectDelete={handleProjectDelete}
              onProjectUpdate={handleProjectUpdate}
            />
          }
        />
        <Route
          path="/"
          element={<ProjectAddView managers={managers} projects={projects} onProjectAdd={handleProjectAdd} />}
        />
      </Routes>
    </>
  );
};

export default Projects;
