import { useState } from "react";
import { toast } from "sonner";

const useFetch = <T,>(
  cb: (...args: any[]) => Promise<T>,
  initialData: T
) => {
  const [data, setData] = useState<T>(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fn = async (...args: any[]): Promise<T> => {
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

  return { data, loading, error, fn, setData };
};

export default useFetch;
