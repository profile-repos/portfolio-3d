import { useLoading } from "@/contexts/LoadingContext";
import { useCallback } from "react";

export const useApiWithLoading = () => {
  const { setLoading } = useLoading();

  const callWithLoading = useCallback(
    async <T,>(
      apiCall: () => Promise<T>,
      message: string = "Loading..."
    ): Promise<T> => {
      try {
        setLoading(true, message);
        const result = await apiCall();
        return result;
      } finally {
        setLoading(false);
      }
    },
    [setLoading]
  );

  return { callWithLoading };
};

