import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useQuery, gql } from '@apollo/client';
import { TaskConfig } from '../Types';
import { Task } from './Task';

export const GET_TASKS = gql`
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
                }
            }
        }
    }
`;
interface TsProps {
    user: string;
}
export const Tasks: React.FC<TsProps> = ({ user }: TsProps) => {
    const { loading, data } = useQuery(GET_TASKS, {
        variables: { id: user },
    });
    const [focused, setFocused] = useState<string | null>(null);
    // just for testing
    useEffect(() => {
        console.log(data);
    }, [data]);
    if (loading) {
        return <h2>loading</h2>;
    }
    return (
        <TaskListStyle>
            {data.User.currentTasks.map((task: TaskConfig) => (
                <Task
                    key={task.id}
                    item={task}
                    userId={user}
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
