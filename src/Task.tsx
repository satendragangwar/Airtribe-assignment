import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { TaskPayload, Task as TaskType } from "./utils/data-tasks";
import { useNavigate, useSearchParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

const Task = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const taskId = searchParams.get("taskId");
  const [formValues, setFormValues] = useState<TaskPayload>({
    title: "",
    status: "not-started",
    description: "",
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    if (taskId && taskId !== "new") {
      getTaskDetails(taskId);
    }
  }, [taskId]);

  const getTaskDetails = async (id: string) => {
    try {
      const res = await fetch(`https://serverjs-mauve.vercel.app/api/tasks/${id}`);
      const data: TaskType = await res.json();
      console.log(data);
      setFormValues({
        title: data.title,
        status: data.status,
        description: data.description,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const payload = {
      title: formValues.title,
      status: formValues.status,
      description: formValues.description,
    };

    if (taskId && taskId !== "new") {
      updateTask(taskId, payload);
    } else {
      createTask(payload);
    }
  };

  const updateTask = async (taskId: string, task: TaskPayload) => {
    try {
      await fetch(`https://serverjs-mauve.vercel.app/api/tasks/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(task),
      });
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  const createTask = async (task: TaskPayload) => {
    try {
      await fetch(`https://serverjs-mauve.vercel.app/api/tasks/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: uuidv4(),
          ...task,
        }),
      });

      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  const deleteTask = async () => {
    try {
      await fetch(`https://serverjs-mauve.vercel.app/api/tasks/${taskId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-sm mx-auto flex flex-col gap-6 mt-20"
    >
      <h1 className="text-2xl">
        {taskId && taskId === "new" ? "Create" : "Modify"} Task
      </h1>
      <div className="flex flex-col">
        <label htmlFor="" className="inputLabel">
          Title
        </label>
        <input
          type="text"
          placeholder="Enter title"
          name="title"
          id="title"
          value={formValues.title}
          onChange={handleChange}
          className="input"
          required
        />
      </div>

      <div className="flex flex-col">
        <label htmlFor="status" className="inputLabel">
          Status
        </label>
        <select
          name="status"
          id="status"
          value={formValues.status}
          onChange={handleChange}
          className="input"
          required
        >
          <option value="not-completed">Not completed</option>
          <option value="in-progress">In progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      <div className="flex flex-col">
        <label htmlFor="description" className="inputLabel">
          Description
        </label>
        <textarea
          name="description"
          id="description"
          value={formValues.description}
          onChange={handleChange}
          placeholder="Enter description"
          className="input"
          required
        />
      </div>

      <button
        type="submit"
        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center "
      >
        Submit
      </button>
      {taskId && taskId !== "new" ? (
        <button
          onClick={() => deleteTask()}
          className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2"
        >
          Delete
        </button>
      ) : null}
    </form>
  );
};

export default Task;
