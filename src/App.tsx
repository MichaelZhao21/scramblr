import { useEffect, useState } from "react";
import "./App.css";
import Task from "./Task";

const MSPF = 1000 / 2; // MILLISECONDS PER FRAME (denom = fps)
const tasks = [
    "Fill out onboarding form",
    "Respond to man on discord",
    "Respond to that email",
    "Make spreadsheet for another man",
    "Send utilities to roommates",
    "Apply for graduation",
    "Get groceries",
    "Do laundry",
    "Clean room",
    "Take out trash",
    "Get gas",
    "Pay bills",
    "Open the door for the cat",
    "Eat a lot of good and healthy food",
    "Exercise for 30 minutes at least by running",
];

// Generate random nubmer (min can be negative)
function randInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function App() {
    const [taskList, setTaskList] = useState<Task[]>([]);

    useEffect(() => {
        // Get bounds of screen
        const minX = 0;
        const minY = 0;
        const maxX = window.innerWidth - 200;
        const maxY = window.innerHeight - 50;

        setTaskList(
            tasks.map(
                (task, index) =>
                    new Task(
                        index,
                        task,
                        randInt(minX, maxX),
                        randInt(minY, maxY)
                    )
            )
        );

        // Set timer to update task positions
        const timer = setInterval(() => {
            setTaskList((prevTaskList) =>
                prevTaskList.map((task) => {
                    if (task.grabbed) {
                        return task;
                    }
                    // 10% chance to move
                    if (Math.random() < 0.05) {
                        task.x += randInt(-200, 200);
                        task.y += randInt(-200, 200);
                        if (task.x < minX) task.x = minX + 20;
                        if (task.x > maxX) task.x = maxX - 20;
                        if (task.y < minY) task.y = minY + 20;
                        if (task.y > maxY) task.y = maxY - 20;
                    }
                    return task;
                })
            );
        }, MSPF);

        return () => clearInterval(timer);
    }, []);

    const onMouseDown = (
        e: React.MouseEvent<HTMLDivElement, MouseEvent>,
        i: number
    ) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setTaskList((prevTaskList) =>
            prevTaskList.map((task) => {
                if (task.id === i) {
                    task.grabbed = true;
                    // Calculate offset of moving object
                    task.grabOffsetX = e.clientX - rect.left;
                    task.grabOffsetY = e.clientY - rect.top;
                }
                return task;
            })
        );
    };

    const onMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        setTaskList((prevTaskList) =>
            prevTaskList.map((task) => {
                if (task.grabbed) {
                    task.x = e.clientX - task.grabOffsetX;
                    task.y = e.clientY - task.grabOffsetY;
                }
                return task;
            })
        );
    };

    const onMouseUp = () => {
        setTaskList((prevTaskList) =>
            prevTaskList.map((task) => {
                task.grabbed = false;
                return task;
            })
        );
    };

    const onTouchDown = (
        e: React.TouchEvent<HTMLDivElement>,
        i: number
    ) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setTaskList((prevTaskList) =>
            prevTaskList.map((task) => {
                if (task.id === i) {
                    task.grabbed = true;
                    // Calculate offset of moving object
                    task.grabOffsetX = e.touches[0].clientX - rect.left;
                    task.grabOffsetY = e.touches[0].clientY - rect.top;
                }
                return task;
            })
        );
    }

    const onTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
        setTaskList((prevTaskList) =>
            prevTaskList.map((task) => {
                if (task.grabbed) {
                    task.x = e.touches[0].clientX - task.grabOffsetX;
                    task.y = e.touches[0].clientY - task.grabOffsetY;
                }
                return task;
            })
        );
    }

    return (
        <div className="container" onMouseMove={onMouseMove} onMouseUp={onMouseUp} onTouchMove={onTouchMove} onTouchEnd={onMouseUp}>
            {taskList.map((task) => (
                <div
                    key={task.id}
                    className={"task" + (task.grabbed ? " task-move" : "")}
                    style={{
                        transform: `translate(${task.x}px, ${task.y}px)`,
                    }}
                    onMouseDown={(e) => onMouseDown(e, task.id)}
                    onTouchStart={(e) => onTouchDown(e, task.id)}
                >
                    {task.name}
                </div>
            ))}
        </div>
    );
}

export default App;
