export interface TipConfig {
    readonly __typename: 'Tip';
    readonly id: string;
    readonly body: string;
    _pinnedByMeta: {
        count: number;
        __typename: '_QueryMeta';
    };
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

export interface LogConfig {
    readonly id: string;
    readonly __typename: 'Log';
    body: string;
    createdAt: string;
}

export type ModeType = 'Base' | 'Settings' | 'Log' | 'History';
