export interface TipConfig {
    readonly __typename: 'Tip';
    readonly id: string;
    readonly body: string;
    readonly pinnedByCount: number;
    pinnedBy?: [UserConfig];
}

export interface TaskConfig {
    readonly __typename: 'Task';
    readonly id: string;
    readonly body: string;
    tips: TipConfig[];
    [key: string]: any;
}

export interface UserConfig {
    readonly __typeName: 'User';
    readonly id: string;
    readonly name: string;
    readonly email?: string;
    currentTasks?: TaskConfig[];
}

export type ModeType = 'Base' | 'Settings' | 'Log' | 'History';
