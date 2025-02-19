import { useProjects } from "../../components/Projects/ProjectContext";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const ViewProject: React.FC = () => {
  const { projects } = useProjects();
  const navigate = useNavigate();

  return (
    <div>
      <h1 style={{ paddingLeft: "15px" }}>Projects</h1>
      <div className="lets-wrap">
        {projects.map((project, index) => (
          <div key={index} className="container-calendar">
            <h2>{project.title}</h2>
            <p style={{ paddingLeft: "10px", color: "GrayText" }}>Id: {project.id}</p>
            <div className="container_invert-calendar">
              <p>Description: {project.desc}</p>
              <p>Created Date: {project.created_date.toString()}</p>
              <p>Deadline: {project.deadline_date.toString()}</p>
              <p>Created By: {project.created_by_manager_email}</p>
              <Button 
                className="HoverableButton" 
                onClick={() => navigate(`/home/projects/${project.id}`)}
              >
                View
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ViewProject;