import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useProjects } from "./ProjectContext";
import DeleteSharpIcon from "@mui/icons-material/DeleteSharp";
import EditSharpIcon from "@mui/icons-material/EditSharp";
import {
  Card, CardContent, Typography, IconButton, Stack, Divider,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Button, TextField
} from "@mui/material";
import { Project, Task } from "../types";

const ProjectDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { projects, addProject} = useProjects();
  const project = projects.find((proj) => proj.id === id);

  const [tasksSet, setTasksSet] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState<Task>({
    id: "",
    title: "",
    desc: "",
    hrs_alloted: "",
    created_date: new Date(),
    deadline_date: new Date(),
    isDone: false,
    working_employ_id: []
  });

  useEffect(() => {
    if (project) {
      setTasksSet(project.tasksSet);
    }
  }, [project]);

  if (!project) {
    return (
      <Card sx={{ p: 2, minWidth: "80vw", boxShadow: 3, borderRadius: 2 }}>
        <Stack direction="column" justifyContent="space-evenly">
          <Typography variant="h4">
            Project with ID: {id} does not exist!
          </Typography>
          <p>Please make sure that you have entered the right ID. There is also a possibility that the Project with ID {id} wasn't created by you.</p>
        </Stack>
      </Card>
    );
  }

  const handleAddTask = () => {
    if (newTask.title && newTask.deadline_date) {
      setTasksSet([...tasksSet, { ...newTask, id: Date.now().toString() }]);
      setNewTask({
        id: "",
        title: "",
        desc: "",
        hrs_alloted: "",
        created_date: new Date(),
        deadline_date: new Date(),
        isDone: false,
        working_employ_id: []
      });
    }
  };

  const handleSaveTasks = () => {
    if (project) {
      addProject(project as Project);
    }
  };

  return (
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
            <IconButton color="primary" size="small">
              <EditSharpIcon />
            </IconButton>
            <IconButton color="error" size="small">
              <DeleteSharpIcon />
            </IconButton>
          </Stack>
        </Stack>

        <Divider sx={{ my: 2 }} />
        <Typography variant="body2" color="text.secondary">
          <strong>Created By:</strong> {project.created_by_manager_email}
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
              {tasksSet.map((task, index) => (
                <TableRow key={index}>
                  <TableCell>{task.deadline_date.toDateString()}</TableCell>
                  <TableCell>{task.title}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        
        <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
          <TextField
            label="Deadline"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={newTask.deadline_date.toISOString().split('T')[0]}
            onChange={(e) => setNewTask({ ...newTask, deadline_date: new Date(e.target.value) })}
          />
          <TextField
            label="Task Title"
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
          />
          <Button variant="contained" color="primary" onClick={handleAddTask}>
            Add Task
          </Button>
        </Stack>
        <Button variant="contained" color="success" sx={{ mt: 2 }} onClick={handleSaveTasks}>
          Save Tasks
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProjectDetails;
