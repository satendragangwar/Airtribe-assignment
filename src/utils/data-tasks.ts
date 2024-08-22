export type Status = "not-started" | "in-progress" | "completed";
export type Task = {
  title: string;
  id: string;
  status: Status;
  description: string;
};

export type TaskPayload = {
  title: string;
  status: Status;
  description: string;
};

export const statuses: Status[] = ["not-started", "in-progress", "completed"];
