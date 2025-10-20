import { useState, useRef, type FormEvent } from "react";
import { usePost } from "../hooks/usePost.tsx";
import { type Goal } from "../types/Goal";

interface PostResponse {
  message: string;
  goal: Goal;
}

interface GoalPayload {
  goal: string;
  summary: string;
}

interface NewGoalProps {
  onNewGoal: ( newGoal: Goal ) => void
}

export default function NewGoal({ onNewGoal }: NewGoalProps) {
  const { loading, error, postData } = usePost<PostResponse, GoalPayload>();
  const goalInputRef = useRef<HTMLInputElement>(null);
  const summaryInputRef = useRef<HTMLInputElement>(null);
  const [success, setSuccess] = useState<string>("");

   const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSuccess('');

    if (!goalInputRef || !summaryInputRef) {
      return;
    }

    const goal = goalInputRef.current!.value || "";
    const summary = summaryInputRef.current!.value || "";

    try {
      if (!goal || !summary) {
        throw new Error("All fields are required.");
      }
      const response = await postData("http://localhost:3000/api/goals", {
        goal,
        summary,
      });
      setSuccess(response.message);
      onNewGoal(response.goal);
      if (goalInputRef.current) goalInputRef.current.value = "";
      if (summaryInputRef.current) summaryInputRef.current.value = "";
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Add a New Goal</h2>
      {success && <p style={{ color: "green" }}>{success}</p>}
      {error && <p style={{ color: "red" }}>Error: {error}</p>}
      <p>
        <label htmlFor="goal">Your Goal</label>
        <input id="goal" type="text" ref={goalInputRef} />
      </p>
      <p>
        <label htmlFor="summary">Your Summary</label>
        <input id="summary" type="text" ref={summaryInputRef} />
      </p>
      <button type="submit" disabled={loading}>
        {loading ? "Adding..." : "Add Goal"}
      </button>
    </form>
  );
}
