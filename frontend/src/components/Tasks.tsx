import React, { ReactElement, useState, useContext, useEffect } from 'react';
import styled from 'styled-components';
import { useQuery, gql } from '@apollo/client';
import { TaskConfig, UserConfig } from '../Types';
import { Task } from './Task';
import { UserContext } from '../util/UserContextWrapper';

export const GET_TASKS_QUERY = gql`
    query GET_TASKS($id: ID!) {
        User(where: { id: $id }) {
            id
            name
            currentTasks {
                id
                body
                tips(where: { pinnedBy_some: { id: $id } }) {
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
export const Tasks = (): ReactElement => {
    const user = useContext(UserContext);
    console.log(user);
    const { loading, data } = useQuery<{ User: UserConfig }>(GET_TASKS_QUERY, {
        variables: { id: user?.id },
    });
    const [focused, setFocused] = useState<string | null>(null);
    if (loading || data?.User?.currentTasks === undefined) {
        return <h2>loading</h2>;
    }
    return (
        <TaskListStyle>
            {data.User.currentTasks.map((task: TaskConfig) => (
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
`;
