export interface TipConfig {
  readonly __typename: "Tip";
  readonly id: string;
  readonly body: string;
}

export interface TaskConfig {
  readonly __typename: "Task";
  readonly id: string;
  readonly body: string;
  tips: TipConfig[];
}
