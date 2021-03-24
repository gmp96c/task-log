/* eslint-disable react/jsx-props-no-spreading */
import { TextField } from '@material-ui/core';
import React, { ReactElement, useState } from 'react';
import { gql, useLazyQuery, useMutation } from '@apollo/client';
import { useCombobox } from 'downshift';
import debounce from 'lodash.debounce';
import styled from 'styled-components';
import { TaskConfig } from '../Types';
import { GET_TASKS } from './Tasks';
import { client } from '../Index';

const CREATE_TASK_MUTATION = gql`
    mutation CREATE_TASK_MUTATION($body: String!) {
        createTask(data: { body: $body }) {
            body
            id
        }
    }
`;
interface NewTaskConfig {
    body: string;
}

const ADD_TASK_MUTATION = gql`
    mutation ADD_TASK_MUTATION($userId: ID!, $taskId: ID!) {
        updateUser(id: $userId, data: { currentTasks: { connect: [{ id: $taskId }] } }) {
            currentTasks {
                body
            }
        }
    }
`;

const SEARCH_TASKS_QUERY = gql`
    query SEARCH_TASKS_QUERY($searchString: String!) {
        results: allTasks(where: { body_contains_i: $searchString }) {
            body
            id
        }
    }
`;

function isNewTask(selectedTask: TaskConfig | NewTaskConfig): selectedTask is NewTaskConfig{
  console.log(selectedTask);
  console.log((selectedTask as TaskConfig).id );
  return (selectedTask as TaskConfig).id === undefined;
}
export const AddTask = (props: { user: string }) : ReactElement => {
    const [selectedTask, setSelectedTask] = useState<TaskConfig | NewTaskConfig>({
        body: '',
    });
    const [addTask, addTaskRes] = useMutation(ADD_TASK_MUTATION, {
        variables: {
            taskId: selectedTask.id,
            userId: props.user,
        },
        update: (cache, {data})=>{
          console.log(data);
          const existingTasks = cache.readQuery({query:GET_TASKS, variables:{
            id: props.user
          }});
          console.log(existingTasks);
          cache.writeQuery({
            query: ADD_TASK_MUTATION,
            data,
            variables:{
              id: props.user
            }
          });
        }
    });
    const [createTask, createTaskRes] = useMutation(CREATE_TASK_MUTATION, {
        variables: {
            body: selectedTask.body,
        },
        update: (cache, {data})=>{
          console.log(data);
          const existingTasks = cache.readQuery({query:GET_TASKS, variables:{
            id: props.user
          }});
          console.log(existingTasks);
          cache.writeQuery({
            query: CREATE_TASK_MUTATION,
            data,
            variables:{
              id: props.user
            }
          });
        }
    });
    const [findTasks, findTasksRes] = useLazyQuery(SEARCH_TASKS_QUERY, {
        fetchPolicy: 'no-cache',
    });
    const tasks: [TaskConfig] = findTasksRes?.data?.results ? findTasksRes?.data.results : [];
    const debouncedFindTasks = debounce(findTasks, 200);
    const {
        isOpen,
        selectedItem,
        getToggleButtonProps,
        getLabelProps,
        getMenuProps,
        getInputProps,
        getComboboxProps,
        highlightedIndex,
        getItemProps,
    } = useCombobox({
        items: tasks,
        itemToString: (item: TaskConfig | null) => item.body,
        onInputValueChange: ({ inputValue }) => {
          console.log('running change');
            if (inputValue || inputValue == '') {
                setSelectedTask({ body: inputValue, isNew: true });
                if (inputValue.length > 2) {
                    debouncedFindTasks({
                        variables: { searchString: inputValue },
                    });
                }
            }
        },
        onSelectedItemChange: ({ selectedItem: item }) => {
          console.log('running selected')
            if (item) {
                setSelectedTask(item);
            }
        },
    });
    async function handleSubmit(e):Promise<void>{
      e.preventDefault();
      console.log(`isNew Task ${isNewTask(selectedTask)}`);
        const res = await (isNewTask(selectedTask)? createTask() : addTask());
        console.log(res);
        setSelectedTask({ body: '' });
    };
    return (
        <AddTaskStyle>
            <label {...getLabelProps()}>Add a new task</label>
            <div {...getComboboxProps({ id: 'combobox' })}>
                <input {...getInputProps({ value: selectedTask.body })} />
                {/* <button
          type="button"
          {...getToggleButtonProps({ id: "comboButton" })}
          aria-label={"toggle menu"}
        >
          &#8595;
        </button> */}
                <button type="submit" onClick={handleSubmit}>Add</button>
            </div>
            <ul {...getMenuProps()}>
                {isOpen &&
                    tasks.map((item, index) => (
                        <li
                            style={highlightedIndex === index ? { backgroundColor: '#bde4ff' } : {}}
                            key={`${item.id}`}
                            {...getItemProps({ item, index })}
                        >
                            {item.body}
                        </li>
                    ))}
            </ul>
        </AddTaskStyle>
    );
};

const AddTaskStyle = styled.div`
    width: 600px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    align-items: center;

    #combobox {
        width: auto;
        display: flex;
    }
    button {
        width: 25%;
        max-width: 200px;
    }
`;
