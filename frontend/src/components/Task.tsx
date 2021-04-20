import React, { useState } from 'react';
import styled from 'styled-components';
import { gql, useLazyQuery, useMutation } from '@apollo/client';
import SettingsIcon from '@material-ui/icons/Settings';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import Button from '@material-ui/core/Button';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { useAuth } from '../hooks/useAuth';
import { TaskConfig, TipConfig, ModeType } from '../Types';
// eslint-disable-next-line import/no-cycle
import { Tips } from './Tips';

interface TaskProps {
    task: TaskConfig;
    userId: string;
    setFocused: {
        (focused?: boolean): void;
    };
    unfocused: boolean;
}

type FocusedWrapperType = {
    unfocused?: boolean;
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
                }
            }
        }
    }
`;
export const Task: React.FC<TaskProps> = ({ task, userId, setFocused, unfocused }: TaskProps) => {
    const [removeTask, removeTaskRes] = useMutation(REMOVE_TASK_MUTATION, {
        variables: {
            taskId: task.id,
            userId,
        },
    });
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [mode, setMode] = useState<ModeType>('Base');
    return (
        <TaskStyle unfocused={unfocused}>
            <h4>{task.body}</h4>
            <Tips task={task} mode={mode} />
            <div className="logControls">
                <button
                    type="button"
                    onClick={() => {
                        setMode('Log');
                    }}
                >
                    Add Log
                </button>
                <button
                    type="button"
                    onClick={() => {
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
                    className="settingsIcon"
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
            <Dialog open={confirmOpen} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                <DialogTitle id="alert-dialog-title">Remove task?</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Are you sure you would like to remove "{`${task.body}`}" from your tasks? Your logs will still
                        be saved and accessible.
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
    ul {
        padding: 0;
    }
    li {
        list-style-type: none;
    }
`;
