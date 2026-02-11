import { useState } from "react";
import { toast } from "sonner";

const useFetch = <T, A extends unknown[] = unknown[]>(
  cb: (...args: A) => Promise<T>,
  initialData?: T
) => {
  const [data, setData] = useState<T | undefined>(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fn = async (...args: A): Promise<T> => {
    setLoading(true);
    setError(null);

    try {
      const response = await cb(...args);
      setData(response);
      return response;
    } catch (err: unknown) {
      const error =
        err instanceof Error ? err : new Error("Something went wrong");
      setError(error);
      toast.error(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };
  const reset = () => {
    setData(undefined);
    setError(null);
  };

  return { data, loading, error, fn, setData, reset };
};

export default useFetch;
