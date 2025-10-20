import { type PropsWithChildren } from "react";

import { useDelete } from "../hooks/useDelete.tsx";

import { type Goal } from "../types/Goal.tsx";

type CourseGoalProps = PropsWithChildren<{
  title: string;
  goal: Goal;
  onDeleteGoal: (id: string) => void;
}>;

export default function CourseGoal({
  title,
  goal,
  children,
  onDeleteGoal,
}: CourseGoalProps) {
  const { deleteGoal, loading, error } = useDelete();
  const handleDelete = async () => {
    try {
      const isSuccess = await deleteGoal(goal.id);
      if (isSuccess) {console.log("Success Delete")};
    } catch (err) {
      console.error("Failed to delete goal:", err);
    }
  };

  return (
    <article>
      <div>
        <h2>{title}</h2>
        {children}
      </div>
      <button onClick={handleDelete} disabled={loading}>
        {loading ? "Eliminando" : "Elimina"}
      </button>
      {error && <p>{error}</p>}
    </article>
  );
}
