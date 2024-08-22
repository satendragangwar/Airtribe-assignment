import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import TaskCard from "./components/TaskCard";
import { Status, statuses, Task } from "./utils/data-tasks";

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const columns = statuses.map((status) => {
    const tasksInColumn = tasks.filter((task) => task.status === status);
    return {
      status,
      tasks: tasksInColumn,
    };
  });

  useEffect(() => {
    fetch("https://serverjs-mauve.vercel.app/api/tasks")
      .then((res) => res.json())
      .then((data) => {
        setTasks(data);
      });
  }, []);

  const updateTask = (task: Task) => {
    fetch(`https://serverjs-mauve.vercel.app/api/tasks/${task.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(task),
    });
    const updatedTasks = tasks.map((t) => {
      return t.id === task.id ? task : t;
    });
    setTasks(updatedTasks);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, status: Status) => {
    e.preventDefault();
    setCurrentlyHoveringOver(null);
    const id = e.dataTransfer.getData("id");
    const task = tasks.find((task) => task.id === id);
    if (task) {
      updateTask({ ...task, status });
    }
  };

  const [currentlyHoveringOver, setCurrentlyHoveringOver] =
    useState<Status | null>(null);
  const handleDragEnter = (status: Status) => {
    setCurrentlyHoveringOver(status);
  };

  return (
    <div className="grid grid-cols-3 divide-x justify-center mt-10 min-h-[85vh]">
      {columns.map((column) => (
        <div
          onDrop={(e) => handleDrop(e, column.status)}
          onDragOver={(e) => e.preventDefault()}
          onDragEnter={() => handleDragEnter(column.status)}
          className="px-10 h-full"
          key={column.status}
        >
          <div className="flex justify-between text-lg p-2">
            {column.status === "not-started" ? (
              <h2 className="bg-red-100 py-1 px-2 rounded-md">Not started</h2>
            ) : null}
            {column.status === "in-progress" ? (
              <h2 className="bg-yellow-100 py-1 px-2 rounded-md">
                In progress
              </h2>
            ) : null}
            {column.status === "completed" ? (
              <h2 className="bg-green-100 py-1 px-2 rounded-md">Completed</h2>
            ) : null}
            {column.tasks.length}
          </div>
          <div
            className={`h-full ${
              currentlyHoveringOver === column.status ? "bg-gray-200" : ""
            }`}
          >
            {column.tasks.map((task) => (
              <TaskCard key={task.id} task={task} updateTask={updateTask} />
            ))}
            <Link to="/task?taskId=new" className="px-2 m-2">
              + New
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}

export default App;
