import { Card, Stack, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { Draggable } from "../Projects/ProjectComponent/DraggableTask";
import { Droppable } from "../Projects/ProjectComponent/DroppableEmployeeRow";

interface Employee {
  id: string;
  name: string;
}

interface Task {
  id: string;
  name: string;
  empID?: string;
  hrs: number;
  startTime: number;
}

const Employees: Employee[] = [
  { id: "1", name: "Abel" },
  { id: "2", name: "Boman" },
  { id: "3", name: "Christan" },
];

const initialTasks: Task[] = [
  { name: "Task1", id: "T1", empID: "1", hrs: 1, startTime: 9 },
  { name: "Task2", id: "T2", empID: "2", hrs: 3, startTime: 9 },
  { name: "Task3", id: "T3", empID: "3", hrs: 3, startTime: 10 },
  { name: "Task4", id: "T4", empID: "3", hrs: 5, startTime: 14 },
  { name: "Task7", id: "T7", empID: "2", hrs: 2, startTime: 18 },
  { name: "Task8", id: "T8", empID: "2", hrs: 3, startTime: 14 },
  { name: "Task9", id: "T9", hrs: 4, startTime: 10 },
  { name: "Task10", id: "T10", hrs: 3, startTime: 11 },
];

const ProjectInfo = {
  timings: [8, 24],
};

const ProjectDetails: React.FC = () => {
    const [tasks, setTasks] = useState<Task[]>(initialTasks);

    const mapNumbersBetween = (start: number, end: number): number[] =>
    Array.from({ length: end - start + 1 }, (_, i) => start + i);

    const mappedNumbers = mapNumbersBetween(ProjectInfo.timings[0], ProjectInfo.timings[1]);

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over) return;

        setTasks((prevTasks) =>
            prevTasks.map((task) =>
                task.id === active.id ? { ...task, empID: over.id as string } : task
            )
        );
    };

    useEffect(() => {
        console.log(tasks)
    }, [tasks]);

  return (
    <>
      {/* Timeline Header */}
      <Stack direction="row">
        <Card sx={{ pl: 2, minWidth: "80vw", borderRadius: 2 }}>
          <Stack direction="row">
            <div style={{ minWidth: "100px", maxWidth: "100px" }}>
              <Typography variant="h6">Time:</Typography>
            </div>
            <Stack direction="row">
              {mappedNumbers.map((hour) => (
                <Typography sx={{ minWidth: "80px", mb: 0 }} key={hour}>
                  {hour > 12 ? `${hour - 12}PM` : `${hour}AM`}
                </Typography>
              ))}
            </Stack>
          </Stack>
        </Card>
      </Stack>

      {/* Main DnD Context - Manages all rows */}
      <DndContext onDragEnd={handleDragEnd}>
        {Employees.map((employee) => {
          const assignedTasks = tasks.filter((task) => task.empID === employee.id);

          return (
            <Droppable key={employee.id} id={employee.id} styles={{padding:0, borderTop:1}}>
              <Card
                sx={{
                  pl: 2,
                  minWidth: "80vw",
                  boxShadow: 0,
                  borderRadius: 0,
                  backgroundColor: "rgba(0, 0, 0, 0.05)", // Light background for visibility
                }}
              >
                <Stack direction="row" alignItems="center">
                  <div style={{ minWidth: "100px", maxWidth: "100px" }}>
                    <Typography variant="h6">{employee.name}:</Typography>
                  </div>

                  <div style={{display:"flex", flexDirection: "column", width: "100%" }}>
                    {/* Render Assigned Tasks */}
                    {assignedTasks.map((task) => (
                     <div style={{display:'flex', flexDirection:'row'}}>
                      <div style={{width: `${mappedNumbers.indexOf(task.startTime) * 80}px`}}></div>
                      <Draggable id={task.id} key={task.id}>
                        <Card
                          sx={{
                            bgcolor: "green",
                            color: "white",
                            width: `${task.hrs * 80}px`,
                            //marginLeft: `${mappedNumbers.indexOf(task.startTime) * 80}px`, // Position task
                          }}
                        >
                          <Typography sx={{ pl: 0.5 }} variant="body1">
                            {task.name}
                          </Typography>
                        </Card>
                      </Draggable>
                      </div>
                    ))}
                  </div>
                </Stack>
              </Card>
            </Droppable>
          );
        })}
      </DndContext>
    </>
  );
};

export default ProjectDetails;
