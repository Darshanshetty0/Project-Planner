import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import DeleteSharpIcon from "@mui/icons-material/DeleteSharp";
import EditSharpIcon from "@mui/icons-material/EditSharp";
import EditProjectModal from "./Modals/EditProjectModal";
import DeleteProjectModal from "./Modals/DeleteProjectModal";
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Stack,
  Divider,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { Project, IUser } from "../types";

interface ProjectDetailsProps {
  managers: IUser[];
  projects: Project[];
  onProjectUpdate: (project: Project) => void;
  onProjectDelete: (id: string) => void;
}

const ProjectDetails: React.FC<ProjectDetailsProps> = ({
  managers,
  projects,
  onProjectUpdate,
  onProjectDelete,
}) => {
  const { id } = useParams();
  const project = projects?.find((proj) => proj.id === id);
  const manager = project ? managers?.find((mgr) => mgr._id === project.created_by_manager) : undefined;

  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | undefined>();

  useEffect(() => {
    if (project) {
      setSelectedProject(project);
    }
  }, [project]);

  if (!project) {
    return (
      <Card sx={{ p: 2, minWidth: "80vw", boxShadow: 3, borderRadius: 2 }}>
        <Stack direction="column" justifyContent="space-evenly">
          <Typography variant="h4">
            Project with ID: {id} does not exist!
          </Typography>
          <p>
            Please make sure you have entered the right ID. There is also a
            possibility that the project with ID {id} isn't assigned to you.
          </p>
        </Stack>
      </Card>
    );
  }

  return (
    <>
      <Card sx={{ p: 2, minWidth: "80vw", boxShadow: 3, borderRadius: 2 }}>
        <CardContent>
          <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
            <Stack direction="row" alignItems="baseline" spacing={1}>
              <Typography variant="h4" fontWeight={600}>
                {project.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                ID: {project.id}
              </Typography>
            </Stack>
            <Stack direction="row" spacing={1}>
              <IconButton color="primary" size="small" onClick={() => setOpenEdit(true)}>
                <EditSharpIcon />
              </IconButton>
              <IconButton color="error" size="small" onClick={() => setOpenDelete(true)}>
                <DeleteSharpIcon />
              </IconButton>
            </Stack>
          </Stack>

          <Divider sx={{ my: 2 }} />
          <Typography variant="body2" color="text.secondary">
            <strong>Created By:</strong> {manager?.name}
          </Typography>

          <Divider sx={{ my: 2 }} />
          <Typography variant="h6" gutterBottom>
            Tasks
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Deadline</TableCell>
                  <TableCell>Title</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {project.tasksSet.map((task, index) => (
                  <TableRow key={index}>
                    <TableCell>{new Date(task.deadline_date).toDateString()}</TableCell>
                    <TableCell>{task.title}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Divider sx={{ my: 2 }} />
          <Stack direction="row" sx={{ justifyContent: "space-between" }}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Assigned Managers:
            </Typography>
          </Stack>
          {project.managerSet.map((mgrId, index) => {
            const assignedManager = managers.find((mgr) => mgr._id === mgrId);
            return (
              assignedManager && <Chip key={index} label={assignedManager.name} sx={{ marginRight: "10px" }} />
            );
          })}
        </CardContent>
      </Card>

      {/* Modals for Edit and Delete */}
      <EditProjectModal
        managers={managers}
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        project={selectedProject}
        onProjectUpdate={onProjectUpdate}
      />
      <DeleteProjectModal
        open={openDelete}
        onClose={() => setOpenDelete(false)}
        project={selectedProject}
        onProjectDelete={onProjectDelete}
      />
    </>
  );
};

export default ProjectDetails;
