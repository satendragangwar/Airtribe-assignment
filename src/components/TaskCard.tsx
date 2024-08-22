import { Link } from "react-router-dom";
import { Task } from "../utils/data-tasks";

const TaskCard = ({
  task,
}: {
  task: Task;
  updateTask: (task: Task) => void;
}) => {
  return (
    <div
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData("id", task.id);
      }}
      className="px-2 m-2 border rounded-lg bg-gray-50 w-full"
    >
      <Link to={`/task?taskId=${task.id}`}>
        <div className="text-base font-base py-2">
          <div>{task.title}</div>
          <p className="mt-1 text-sm text-gray-500 line-clamp-1">
            {task.description}
          </p>
        </div>
      </Link>
    </div>
  );
};

export default TaskCard;
