import React from 'react';
import styled from 'styled-components';
import { gql, useLazyQuery, useMutation } from '@apollo/client';
import { TaskConfig, TipConfig } from '../Types';

interface TProps {
    item: TaskConfig;
}
const REMOVE_TASK_MUTATION = gql`
mutation REMOVE_TASK_MUTATION($userId: ID!, $taskId: ID!) {
  updateUser(id: $userId, data: { currentTasks: { disconnect: [{ id: $taskId }] } }) {
      currentTasks {
          body
      }
  }
}
`;
export const Task = ({ item }: TProps) => {
    const [removeTask, removeTaskRes] = useMutation(REMOVE_TASK_MUTATION, {
      variables: {
          taskId: item.id,
      }
      // update: (cache, {data})=>{
      //   console.log(data);
      //   const existingTasks = cache.readQuery({query:GET_TASKS, variables:{
      //     id: props.user
      //   }});
      //   console.log(existingTasks);
      //   cache.writeQuery({
      //     query: REMOVE_TASK_MUTATION,
      //     data,
      //     variables:{
      //       id: props.user
      //     }
      //   });
      // }
  });
return(
    <TaskStyle>
        <h4>{item.body}</h4>

        <button type="button" onClick={()=>{removeTask()}}>Delete</button>;
        <ul>
            {item.tips.map((tip: TipConfig) => {

                <li key={tip.id}>tip.body </li>

            })}
        </ul>
    </TaskStyle>
);
          }

const TaskStyle = styled.div`
    max-width: 800px;
    width: 90%;
    text-align: center;
`;
const TaskBody = styled.li`

`;
