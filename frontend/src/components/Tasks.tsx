import React, { ReactElement, useState, useContext, useEffect } from 'react';
import styled from 'styled-components';
import { useQuery, gql } from '@apollo/client';
import { TaskConfig, UserConfig } from '../Types';
import { Task } from './Task';
import { UserContext } from '../util/UserContextWrapper';
import { GET_TASKS_QUERY } from '../util/Queries';

export const Tasks = (): ReactElement => {
    const user = useContext(UserContext);
    const { loading, data } = useQuery<{ User: UserConfig }>(GET_TASKS_QUERY, {
        variables: { id: user?.id },
    });
    const [focused, setFocused] = useState<string | null>(null);
    if (loading || data?.User?.currentTasks === undefined) {
        return <h2>loading</h2>;
    }
    return (
        <TaskListStyle>
            {data.User.currentTasks
                .slice()
                .reverse()
                .map((task: TaskConfig) => (
                    <Task
                        key={task.id}
                        task={task}
                        setFocused={(focusing = true): void => {
                            if (focusing) {
                                setFocused(task.id);
                            } else {
                                setFocused(null);
                            }
                        }}
                        unfocused={focused === null ? false : focused !== task.id}
                    />
                ))}
        </TaskListStyle>
    );
};
const TaskListStyle = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 1rem;
    overflow-y: auto;
    flex-grow: 1;
    margin-bottom: 5rem;
    /* ::last-child {
        padding-bottom: 10rem;
    } */
    @media (max-width: 375px) {
        margin-top: 2rem;
    }
`;
