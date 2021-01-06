import React from "react";
import { TaskConfig, TipConfig } from "../Types";

interface TProps {
  item: TaskConfig;
}

export const Task = ({ item }: TProps) => {
  return (
    <div>
      <h4>{item.body}</h4>
      <ul>
        {item.tips.map((tip: TipConfig) => {
          <li key={tip.id}>tip.body</li>;
        })}
      </ul>
    </div>
  );
};
