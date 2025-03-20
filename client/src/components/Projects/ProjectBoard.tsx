import { Card, Stack, Typography, IconButton } from "@mui/material";
import React, { useEffect, useState } from "react";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { Draggable } from "../Projects/ProjectComponent/DraggableTask";
import { Droppable } from "../Projects/ProjectComponent/DroppableEmployeeRow";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";

// Employee Type
interface Employee {
  id: string;
  name: string;
}

// Task Type (Without Mongoose)
interface Task {
  id: string;
  title: string;
  desc?: string;
  hrs_alloted: number;
  date?: string;
  start_time?: number;
  isDone: boolean;
  working_employ_id: string[]; // Array of Employee IDs (not ObjectId)
}

// Sample Employees (Without Mongoose)
const Employees: Employee[] = [
  { id: "1", name: "Abel" },
  { id: "2", name: "Boman" },
  { id: "3", name: "Christan" },
];

// Sample Tasks (Without Mongoose)
const initialTasks: Task[] = [
  {
    id: "T1",
    title: "Task1",
    desc: "Task 1 description",
    hrs_alloted: 1,
    date: new Date().toISOString(),
    start_time: 9,
    isDone: false,
    working_employ_id: ["1"], // Assigned to Abel
  },
  {
    id: "T2",
    title: "Task2",
    desc: "Task 2 description",
    hrs_alloted: 3,
    date: new Date().toISOString(),
    start_time: 9,
    isDone: false,
    working_employ_id: ["2"], // Assigned to Boman
  },
  {
    id: "T3",
    title: "Task3",
    desc: "Task 3 description",
    hrs_alloted: 3,
    date: new Date().toISOString(),
    start_time: 10,
    isDone: false,
    working_employ_id: ["3"], // Assigned to Christan
  },
  {
    id: "T4",
    title: "Task4",
    desc: "Task 4 description",
    hrs_alloted: 4,
    date: '2025-03-11T12:07:19.380Z',
    start_time: 20,
    isDone: false,
    working_employ_id: ["3"],
  },
];

const ProjectInfo = {
  timings: [8, 24],
};

const ProjectDetails: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  // Function to get the date in ISO string format (without time)
  const formatDate = (date: Date) => {
    return date.toISOString().split("T")[0];
  };

  // Function to move to the previous or next date
  const moveDate = (direction: "left" | "right") => {
    const newDate = new Date(selectedDate);
    if (direction === "left") {
      newDate.setDate(newDate.getDate() - 1); // Move back by one day
    } else {
      newDate.setDate(newDate.getDate() + 1); // Move forward by one day
    }
    setSelectedDate(newDate);
  };

  const filteredTasks = tasks.filter((task) =>
    task.date?.startsWith(formatDate(selectedDate))
  );

  const mapNumbersBetween = (start: number, end: number): number[] =>
    Array.from({ length: end - start + 1 }, (_, i) => start + i);

  const mappedNumbers = mapNumbersBetween(
    ProjectInfo.timings[0],
    ProjectInfo.timings[1]
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === active.id
          ? { ...task, working_employ_id: [String(over.id)] }
          : task
      )
    );
  };
  console.log(new Date().toISOString())
  useEffect(() => {
    console.log(tasks);
  }, [tasks]);

  return (
    <div style={{display:'flex', flexDirection:'column'}}>
      {/* Date Navigation Bar */}
      <div style={{display:'flex', alignItems:'center', width:"100%"}}>
      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
        <IconButton onClick={() => moveDate("left")}>
          <ChevronLeft />
        </IconButton>
        <Typography variant="h6">{formatDate(selectedDate)}</Typography>
        <IconButton onClick={() => moveDate("right")}>
          <ChevronRight />
        </IconButton>
      </Stack>
      </div>
      <div style={{
        width: "100%",
        overflowX: "auto",
        whiteSpace: "nowrap",
        paddingBottom: "10px"
      }}>
      <div style={{ minWidth: `${(ProjectInfo.timings[1]-ProjectInfo.timings[0]+2)*80}px` }}>
      {/* Timeline Header */}
      <Stack direction="row">
        <Card sx={{ pl: 2, borderRadius: 2 }}>
          <Stack direction="row">
            <div style={{ minWidth: "100px", maxWidth: "100px" }}>
              <Typography variant="h6">Time:</Typography>
            </div>
            <Stack direction="row" sx={{ whiteSpace: "nowrap" }}>
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
        <div>
          {Employees.map((employee) => {
            const assignedTasks = filteredTasks.filter((task) =>
              task.working_employ_id.includes(employee.id)
            );

            return (
              <Droppable key={employee.id} id={employee.id} styles={{ padding: 0, borderTop: 1 }}>
                <Card
                  sx={{
                    pl: 2,
                    boxShadow: 0,
                    borderRadius: 0,
                    backgroundColor: "rgba(0, 0, 0, 0)", // Light background for visibility
                    zIndex: -1,
                  }}
                >
                  <Stack direction="row" alignItems="center">
                    <div style={{ minWidth: "100px", maxWidth: "100px" }}>
                      <Typography variant="h6">{employee.name}:</Typography>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        width: "100%",
                      }}
                    >
                      {/* Render Assigned Tasks */}
                      {assignedTasks.map((task) => (
                        <div style={{ display: "flex", flexDirection: "row" }} key={task.id}>
                          <div
                            style={{
                              width: `${mappedNumbers.indexOf(task.start_time || 0) * 80}px`,
                            }}
                          ></div>
                          <Draggable
                            id={task.id}
                            key={task.id}
                            forMargin={
                              mappedNumbers.indexOf(task.start_time || 0) * 80
                            }
                          >
                            <Card
                              sx={{
                                bgcolor: "green",
                                color: "white",
                                width: `${task.hrs_alloted * 80}px`,
                              }}
                            >
                              <Typography sx={{ pl: 0.5 }} variant="body1">
                                {task.title}
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
        </div>
      </DndContext>
      </div>
      </div>
    </div>
  );
};

export default ProjectDetails;
