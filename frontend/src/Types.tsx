export interface TipConfig {
    readonly __typename: 'Tip';
    readonly id: string;
    readonly body: string;
}

export interface TaskConfig {
    readonly __typename: 'Task';
    readonly id: string;
    readonly body: string;
    tips: TipConfig[];
}

export interface UserConfig {
  readonly __typeName: "User";
  readonly id: string;
  readonly name: string;
  currentTasks: TaskConfig[];
}
