import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { gql, useLazyQuery, useMutation, useQuery } from '@apollo/client';
import SettingsIcon from '@material-ui/icons/Settings';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import Button from '@material-ui/core/Button';
import { Select } from '@material-ui/core';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import MenuItem from '@material-ui/core/MenuItem';
import { useAuth } from '../hooks/useAuth';
import { TaskConfig, TipConfig, ModeType, LogConfig } from '../Types';
// eslint-disable-next-line import/no-cycle
import { Tips } from './Tips';
import { UserContext } from '../util/UserContextWrapper';
import { LogEditor } from './LogEditor';
import { GET_LOGS_FOR_TASK } from '../util/Queries';

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

export const Task: React.FC<TaskProps> = ({ task, setFocused, unfocused }: TaskProps) => {
    const user = useContext(UserContext);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [mode, setMode] = useState<ModeType>('Base');
    const [logIndex, setLogIndex] = useState(0);
    const [logViewState, setLogViewState] = useState<'first' | 'last' | 'norm' | 'single'>('norm');
    const [removeTask, removeTaskRes] = useMutation(REMOVE_TASK_MUTATION, {
        variables: {
            taskId: task.id,
            userId: user?.id,
        },
    });
    const { loading, data: logData } = useQuery<{ allLogs: LogConfig[] }>(GET_LOGS_FOR_TASK, {
        variables: {
            taskId: task.id,
            userId: user?.id,
        },
    });
    console.log(logData);
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
                {mode !== 'History' && (loading || (logData?.allLogs && logData.allLogs.length > 0)) && (
                    <button
                        type="button"
                        onClick={() => {
                            setFocused();
                            setMode('History');
                        }}
                    >
                        View Logs
                    </button>
                )}
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
                <div className="historyControls">
                    <button
                        title="back a log"
                        type="button"
                        disabled={logIndex === logData?.allLogs.length - 1}
                        className="logBack"
                        onClick={() => {
                            if (!loading) {
                                setLogIndex(logIndex + 1);
                            }
                        }}
                    >
                        Previous
                    </button>

                    <Select value={logIndex} onChange={(e) => setLogIndex(e.target.value as number)}>
                        {logData?.allLogs.map((el, i) => (
                            <MenuItem value={i} key={el.id}>{`${new Date(
                                el?.createdAt,
                            ).toLocaleDateString()} ${new Date(el?.createdAt).toLocaleTimeString()}`}</MenuItem>
                        ))}
                    </Select>

                    <button
                        title="back a log"
                        type="button"
                        disabled={logIndex === 0}
                        className="logForward"
                        onClick={() => {
                            if (!loading) {
                                setLogIndex(logIndex - 1);
                            }
                        }}
                    >
                        Next
                    </button>
                </div>
            )}
            {['Log', 'History'].includes(mode) && !loading && (
                <LogEditor
                    task={task}
                    mode={mode === 'Log' ? 'Log' : 'History'}
                    log={logData?.allLogs[logIndex]}
                    setToHistory={() => {
                        setLogIndex(0);
                        setMode('History');
                    }}
                />
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
    grid-template-columns: 1fr 25% 10% auto;
    grid-gap: 0.5rem;
    border: 1px solid grey;
    :hover {
        border: 1px solid black;
        background: var(--base-white-bright);
    }
    border-radius: 2px;
    padding: 0.7rem;
    margin: 0.5rem;
    background: var(--base-white);
    box-shadow: var(--box-shadow);
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
        flex-grow: 4;
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
    .historyControls {
        grid-column: 1 / 5;
        align-items: center;
        button {
            margin: 0 1rem;
            padding: 0.2rem;
        }
    }
`;
