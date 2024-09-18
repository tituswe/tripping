import { useEffect } from "react";

export function useData<T>(
  action: () => Promise<T>,
  setData: (data: T) => void
) {
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await action();
        setData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [action, setData]);
}
