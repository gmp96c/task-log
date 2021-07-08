import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { gql, useLazyQuery, useMutation, useQuery } from '@apollo/client';
import SettingsIcon from '@material-ui/icons/Settings';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import Button from '@material-ui/core/Button';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { useAuth } from '../hooks/useAuth';
import { TaskConfig, TipConfig, ModeType, LogConfig } from '../Types';
// eslint-disable-next-line import/no-cycle
import { Tips } from './Tips';
import { UserContext } from '../util/UserContextWrapper';
import { LogEditor } from './LogEditor';
import { Logs } from './Logs';

interface TaskProps {
    task: TaskConfig;
    setFocused: {
        (focused?: boolean): void;
    };
    unfocused: boolean;
}

type FocusedWrapperType = {
    unfocused?: boolean;
    logViewState?: string;
};

const REMOVE_TASK_MUTATION = gql`
    mutation REMOVE_TASK_MUTATION($userId: ID!, $taskId: ID!) {
        updateUser(id: $userId, data: { currentTasks: { disconnect: [{ id: $taskId }] } }) {
            name
            id
            currentTasks {
                id
                body
                tips(where: { pinnedBy_some: { id: $userId } }) {
                    id
                    body
                    _pinnedByMeta {
                        count
                    }
                }
            }
        }
    }
`;
export const GET_LOG = gql`
    query GET_LOG($taskId: ID!, $index: Int) {
        allLogs(where: { task: { id: $taskId } }, first: 1, skip: $index, sortBy: createdAt_DESC) {
            id
            body
            task {
                id
            }
            createdAt
        }
    }
`;
export const Task: React.FC<TaskProps> = ({ task, setFocused, unfocused }: TaskProps) => {
    const user = useContext(UserContext);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [mode, setMode] = useState<ModeType>('Base');
    const [logIndex, setLogIndex] = useState(0);
    const [logViewState, setLogViewState] = useState<'first' | 'last' | 'norm'>('norm');
    const [lastIndex, setLastIndex] = useState<number>(-Infinity);
    const [removeTask, removeTaskRes] = useMutation(REMOVE_TASK_MUTATION, {
        variables: {
            taskId: task.id,
            userId: user?.id,
        },
    });
    const { loading, data: logData } = useQuery<{ allLogs: LogConfig[] }>(GET_LOG, {
        variables: {
            taskId: task.id,
            index: logIndex,
        },
    });
    useEffect(() => {
        if (logIndex === lastIndex) {
            setLogViewState('last');
        } else if (logData && logData.allLogs.length === 0 && logIndex > 0) {
            setLastIndex(logIndex - 1);
            setLogIndex(logIndex - 1);
        } else if (logIndex === 0) {
            setLogViewState('first');
        } else {
            setLogViewState('norm');
        }
    }, [logData, logIndex]);
    return (
        <TaskStyle unfocused={unfocused} logViewState={logViewState}>
            <h4>{task.body}</h4>
            <Tips task={task} mode={mode} />
            <div className="logControls">
                {mode !== 'Log' && (
                    <button
                        type="button"
                        onClick={() => {
                            setFocused();
                            setMode('Log');
                        }}
                    >
                        Add Log
                    </button>
                )}
                <button
                    type="button"
                    onClick={() => {
                        setFocused();
                        setMode('History');
                    }}
                >
                    View Logs
                </button>
                {mode === 'Settings' && (
                    <button
                        type="button"
                        onClick={() => {
                            setConfirmOpen(true);
                        }}
                    >
                        Remove Task
                    </button>
                )}
            </div>
            {mode !== 'Base' ? (
                <ArrowBackIcon
                    className="arrowIcon"
                    onClick={() => {
                        setFocused(false);
                        setMode('Base');
                    }}
                />
            ) : (
                <SettingsIcon
                    className="settingsIcon"
                    onClick={() => {
                        setFocused();
                        setMode('Settings');
                    }}
                />
            )}
            {mode === 'History' && !loading && logData?.allLogs[0]?.createdAt && (
                <>
                    <button
                        title="back a log"
                        type="button"
                        disabled={logViewState === 'last'}
                        className="logBack"
                        onClick={() => {
                            if (!loading) {
                                setLogIndex(logIndex + 1);
                            }
                        }}
                    >
                        back
                    </button>
                    <h5>{`${new Date(logData?.allLogs[0]?.createdAt).toLocaleDateString()} ${new Date(
                        logData?.allLogs[0]?.createdAt,
                    ).toLocaleTimeString()}`}</h5>
                    <button
                        title="back a log"
                        type="button"
                        disabled={logViewState === 'first'}
                        className="logForward"
                        onClick={() => {
                            if (!loading) {
                                setLogIndex(logIndex - 1);
                            }
                        }}
                    >
                        forward
                    </button>
                </>
            )}
            {['Log', 'History'].includes(mode) && !loading && (
                <LogEditor task={task} mode={mode === 'Log' ? 'Log' : 'History'} log={logData?.allLogs[0]} />
            )}
            <Dialog open={confirmOpen} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                <DialogTitle id="alert-dialog-title">Remove task?</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Are you sure you would like to remove &quot;{`${task.body}`}&quot; from your tasks? Your logs
                        will still be saved and accessible.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => {
                            setConfirmOpen(false);
                        }}
                        color="primary"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={() => {
                            removeTask().then(() => {
                                setFocused(false);
                            });
                        }}
                        color="primary"
                        autoFocus
                    >
                        Remove
                    </Button>
                </DialogActions>
            </Dialog>
        </TaskStyle>
    );
};

const TaskStyle = styled.div<FocusedWrapperType>`
    max-width: 800px;
    width: 90%;
    text-align: center;
    display: ${(props) => (props.unfocused ? 'none' : 'grid')};
    grid-template-columns: 1fr 0.8fr 0.3fr auto;
    border: 1px solid black;
    border-radius: 2px;
    padding: 0.7rem;
    margin: 0.5rem;
    .logControls {
        display: flex;
        flex-direction: column;
    }
    button {
        padding: 0.2rem;
        margin: 0.2rem;
        cursor: pointer;
    }
    h4 {
        margin: 0;
        padding: 0;
        text-align: left;
    }
    h5 {
        font-size: 1rem;
        width: 100%;
        margin: 0;
        padding: 0;
    }

    header {
        margin: 0;
        padding: 0;
        width: 100%;
    }
    .settingsIcon {
        cursor: pointer;
    }
    .arrowIcon {
        cursor: pointer;
    }
    ul {
        padding: 0;
    }
    li {
        list-style-type: none;
    }
`;
