import ViewProject from "../../components/Projects/ViewProject";        
import { Container, Box } from "@mui/material";
import { IUser, Project } from "../types";

interface ProjectDetailsProps {
  managers: IUser[];
  projects: Project[];
  onProjectAdd: (project: Project) => void;
}

const ProjectAddView: React.FC<ProjectDetailsProps> = ({ managers, projects, onProjectAdd }) => {
  return (
    <Container sx={{ display: "flex", flexDirection: "row", height: "85vh" }}>
      <Box className="main-content">
        <ViewProject managers={managers} projects={projects} onProjectAdd={onProjectAdd} />
      </Box>
    </Container>
  );
};

export default ProjectAddView;
