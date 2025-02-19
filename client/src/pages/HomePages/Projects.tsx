import { ProjectProvider } from "../../components/Projects/ProjectContext";
import ProjectAddView from "../../components/Projects/ProjectAddView";
import ProjectDetails from "../../components/Projects/ProjectDetails";
import { Route, Routes } from "react-router-dom";

const Project = () => {
  return (
    <>
      <ProjectProvider>
        <Routes>
          <Route path="/:id" element={<ProjectDetails/>} />
          <Route path="/" element={<ProjectAddView/>} />
        </Routes>
      </ProjectProvider>
    </>
  );
};

export default Project;