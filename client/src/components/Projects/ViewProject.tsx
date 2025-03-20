import { useState } from "react";
import { Button, Chip, TextField, Modal, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { IUser, Project } from "../types";
import AddProject from "./AddProject";

interface ProjectDetailsProps {
  managers: IUser[];
  projects: Project[];
  onProjectAdd: (project: Project) => void;
}

const ViewProject: React.FC<ProjectDetailsProps> = ({ managers, projects, onProjectAdd }) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Filter projects based on search query
  const filteredProjects = (Array.isArray(projects) ? projects : []).filter(
    (project) =>
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.id?.toString().includes(searchQuery)
  );

  return (
    <div>
      {/* Header with Search Bar and Add Button */}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
          padding: "10px",
        }}
      >
        <h1 style={{ paddingLeft: "15px", color: "white" }}>Projects</h1>

        {/* Search Bar */}
        <TextField
          variant="outlined"
          size="small"
          placeholder="Search Project..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ backgroundColor: "white", borderRadius: 1, width: "40%" }}
        />

        {/* Add Project Button */}
        <Button
          variant="contained"
          color="primary"
          sx={{ padding: 1, maxWidth: "120px", maxHeight: "50px" }}
          onClick={() => setOpen(true)}
        >
          <p style={{ fontSize: "10px" }}>Add Project</p>
        </Button>
      </div>

      {/* Project List */}
      <div
        className="lets-wrap"
        style={{
          minWidth: "100%",
          maxHeight: "70vh",
          overflow: "auto",
          flexGrow: 1,
        }}
      >
        {filteredProjects.length > 0 ? (
          filteredProjects.map((project, index) => (
            <div key={index} className="container-calendar">
              <h2>{project.title}</h2>
              <p style={{ paddingLeft: "10px", color: "GrayText" }}>
                Id: <Chip label={project.id} />
              </p>
              <div className="container_invert-employee">
                <p>Description: {project.desc}</p>
                <p>Created Date: {new Date(project.created_date).toDateString()}</p>
                <p>Deadline: {new Date(project.deadline_date).toDateString()}</p>
                <p>Created By: {project.created_by_manager}</p>
                <Button className="HoverableButton" onClick={() => navigate(`/home/projects/${project.id}`)}>
                  View
                </Button>
              </div>
            </div>
          ))
        ) : (
          <p style={{ textAlign: "center", color: "gray" }}>No projects found</p>
        )}
      </div>

      {/* Modal for AddProject */}
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "black",
            p: 4,
            boxShadow: 24,
            borderRadius: 2,
          }}
        >
          <AddProject managers={managers} onProjectAdd={onProjectAdd} />
          <Button onClick={() => setOpen(false)} sx={{ mt: 2 }} variant="outlined">
            Close
          </Button>
        </Box>
      </Modal>
    </div>
  );
};

export default ViewProject;
