import React from "react";
import { ViewMode, Gantt } from "gantt-task-react";
import Layout from '../components/Layout'
import "gantt-task-react/dist/index.css";

export function initTasks() {
    const currentDate = new Date();
    const tasks = [
        {
            start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1),
            end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 25),
            name: "Some Project",
            id: "ProjectSample",
            type: "project",
            hideChildren: false
        },
        {
            start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1),
            end: new Date(
                currentDate.getFullYear(),
                currentDate.getMonth(),
                2,
                12,
                28
            ),
            name: "Idea",
            id: "Task 0",
            progress: 45,
            type: "task",
            project: "ProjectSample"
        },
        {
            start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 2),
            end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 4, 0, 0),
            name: "Research",
            id: "Task 1",
            progress: 25,
            dependencies: ["Task 0"],
            type: "task",
            project: "ProjectSample"
        },
        {
            start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 4),
            end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 8, 0, 0),
            name: "Discussion with team",
            id: "Task 2",
            progress: 10,
            dependencies: ["Task 1"],
            type: "task",
            project: "ProjectSample"
        },
        {
            start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 8),
            end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 9, 0, 0),
            name: "Developing",
            id: "Task 3",
            progress: 2,
            dependencies: ["Task 2"],
            type: "task",
            project: "ProjectSample"
        },
        {
            start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 8),
            end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 10),
            name: "Review",
            id: "Task 4",
            type: "task",
            progress: 70,
            dependencies: ["Task 2"],
            project: "ProjectSample"
        },
        {
            start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 22),
            end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 25),
            name: "Release",
            id: "Task 6",
            progress: currentDate.getMonth(),
            type: "task",
            dependencies: ["Task 4"],
            project: "ProjectSample"
        }
    ];
    return tasks;
}
export function getStartEndDateForProject(tasks, projectId) {
    const projectTasks = tasks.filter((t) => t.project === projectId);
    let start = projectTasks[0].start;
    let end = projectTasks[0].end;
    for (let i = 0; i < projectTasks.length; i++) {
        const task = projectTasks[i];
        if (start.getTime() > task.start.getTime()) {
            start = task.start;
        }
        if (end.getTime() < task.end.getTime()) {
            end = task.end;
        }
    }
    return [start, end];
}

const App = () => {
    const [tasks, setTasks] = React.useState(initTasks());
    const handleTaskChange = (task) => {
        let newTasks = tasks.map((t) => (t.id === task.id ? task : t));
        if (task.project) {
            const [start, end] = getStartEndDateForProject(newTasks, task.project);
            const project = newTasks[newTasks.findIndex((t) => t.id === task.project)];
            if (
                project.start.getTime() !== start.getTime() ||
                project.end.getTime() !== end.getTime()
            ) {
                const changedProject = { ...project, start, end };
                newTasks = newTasks.map((t) =>
                    t.id === task.project ? changedProject : t
                );
            }
        }
        setTasks(newTasks);
    };

    return (
        <Layout>
            <Gantt
                tasks={tasks}
                viewMode={ViewMode.Week}
                onDateChange={handleTaskChange}
                listCellWidth={""}
                columnWidth={200}
                barBackgroundColor="blue"
                rowHeight={40}
                fontSize={15}
            />
        </Layout>
    );
};
export default App;
