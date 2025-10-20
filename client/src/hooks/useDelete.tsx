import { useState } from 'react';
import axios from 'axios';

interface UseDeleteGoalReturn {
  deleteGoal: (id: string) => Promise<boolean>;
  loading: boolean;
  error: string | null;
}

export function useDelete(): UseDeleteGoalReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteGoal = async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      await axios.delete(`http://localhost:3000/api/goals/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': `Bearer ${token}`,
        },
      });

      setLoading(false);
      return true;
    } catch (err: unknown) {
      let message = 'Errore durante l\'eliminazione';

      if (axios.isAxiosError(err)) {
        message = err.response?.data?.message ?? err.message ?? message;
      } else if (err instanceof Error) {
        message = err.message;
      } else {
        message = String(err);
      }

      setError(message);
      setLoading(false);
      return false;
    }
  };

  return { deleteGoal, loading, error };
}