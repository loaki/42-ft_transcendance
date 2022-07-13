import { useState } from "react";

//用在比赛分数增加减少
export function useCount() {
  const [count, setCount] = useState<number>(0);
  const decrease = () => {
    setCount(count - 1);
  };

  const increase = () => {
    setCount(count + 1);
  };

  const reset = () => {
    setCount(0);
  };
  return { count, decrease, increase, reset };
}
