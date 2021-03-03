import React from 'react';
import styled from 'styled-components';
import { useQuery, gql } from '@apollo/client';
import { TaskConfig } from '../Types';
import { Task } from './Task';

export const GET_TASKS = gql`
    query GET_TASKS($id: ID!) {
        User(where: { id: $id }) {
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

export const Tasks = (props: { user: string }) => {
    const { loading, data } = useQuery(GET_TASKS, {
        variables: { id: props.user },
    });
    if (loading) {
        return <h2>loading</h2>;
    }
    return (
        <TaskListStyle>
            {data.User.currentTasks.map((task: TaskConfig) => (
                <Task key={task.id} item={task} />
            ))}
        </TaskListStyle>
    );
};
const TaskListStyle = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`;
