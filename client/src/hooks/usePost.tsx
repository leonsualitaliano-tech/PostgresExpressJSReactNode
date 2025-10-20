import { useState } from 'react';
import axios from 'axios';

interface PostState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function usePost<T, D>() {
  const [state, setState] = useState<PostState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const postData = async (url: string, data: D) => {
    setState({ data: null, loading: true, error: null });
    try {
      const response = await axios.post<T>(url, data);
      setState({ data: response.data, loading: false, error: null });
      return response.data;
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setState({ data: null, loading: false, error: err.message });
      } else {
        setState({ data: null, loading: false, error: 'An unexpected error occurred.' });
      }
      throw err;
    }
  };

  return { ...state, postData };
}