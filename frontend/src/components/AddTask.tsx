/* eslint-disable react/jsx-props-no-spreading */
import { TextField } from '@material-ui/core';
import React, { ReactElement, useState, useContext } from 'react';
import { gql, useLazyQuery, useMutation } from '@apollo/client';
import { useCombobox } from 'downshift';
import debounce from 'lodash.debounce';
import styled from 'styled-components';
import { TaskConfig, UserConfig } from '../Types';
import { GET_TASKS_QUERY } from '../util/Queries';
import { UserContext } from '../util/UserContextWrapper';

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
    id?: string;
    __typename?: "Task";
}

const ADD_TASK_MUTATION = gql`
    mutation ADD_TASK_MUTATION($userId: ID!, $taskId: ID!) {
        updateUser(id: $userId, data: { currentTasks: { connect: [{ id: $taskId }] } }) {
            name
            id
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

function isNewTask(selectedTask: TaskConfig | NewTaskConfig): selectedTask is NewTaskConfig {
    return (selectedTask as TaskConfig).id === undefined;
}
export const AddTask = (): ReactElement => {
    const [selectedTask, setSelectedTask] = useState<NewTaskConfig>({
        body: '',
    });
    const user = useContext(UserContext);
    const [addTask, addTaskRes] = useMutation<TaskConfig>(ADD_TASK_MUTATION, {
        variables: {
            taskId: selectedTask.id,
            userId: user?.id,
        },
    });
    const [createTask, createTaskRes] = useMutation(CREATE_TASK_MUTATION, {
        variables: {
            body: selectedTask.body,
        },
        update: (cache, { data: { createTask: task } }) => {
            const cachedData: { User: UserConfig } | null = cache.readQuery({
                query: GET_TASKS_QUERY,
                variables: {
                    id: user?.id,
                },
            });
            if (cachedData === null) {
                return;
            }
            const { User } = cachedData;
            if (Array.isArray(User.currentTasks)) {
                cache.writeFragment({
                    id: `User:${user?.id}`,
                    fragment: gql`
                        fragment TaskUpdate on User {
                            currentTasks
                        }
                    `,
                    data: {
                        currentTasks: [...User.currentTasks, { ...task, tips: [] }],
                    },
                });
            }
        },
    });
    const [findTasks, findTasksRes] = useLazyQuery(SEARCH_TASKS_QUERY, {
        fetchPolicy: 'no-cache',
    });
    const tasks: [TaskConfig] = findTasksRes?.data?.results ? findTasksRes?.data.results : [];
    const debouncedFindTasks = debounce(findTasks, 200);
    function getDuplicateTask(list, input): false | TaskConfig {
        const dupes = list.filter(
            (el) => el.body.split(' ').join('').toLowerCase() === input.split(' ').join('').toLowerCase(),
        );
        if (dupes.length === 0) {
            return false;
        }
        return dupes[0];
    }
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
        itemToString: (item: TaskConfig | null) => item?.body || '',
        onStateChange: ({ inputValue, type, ...val }) => {
            if ((type === '__input_change__' && inputValue) || inputValue === '') {
                const dupe = getDuplicateTask(tasks, inputValue);
                if (dupe) {
                    setSelectedTask(dupe);
                    debouncedFindTasks({
                        variables: { searchString: inputValue },
                    });
                    return;
                }
                setSelectedTask({ body: inputValue });
                if (inputValue.length > 2) {
                    debouncedFindTasks({
                        variables: { searchString: inputValue },
                    });
                }
            }
        },
        onSelectedItemChange: ({ selectedItem: item }) => {
            console.log('running selected');
            if (item) {
                setSelectedTask(item);
            }
        },
    });
    async function handleSubmit(e): Promise<void> {
        e.preventDefault();
        try{
          console.log(`Is new task:${isNewTask(selectedTask)}`);
          console.log(selectedTask);
        const res = await (isNewTask(selectedTask) ? createTask() : addTask());

        console.log(res);
        }catch(err){
          console.error(err);
        }
        setSelectedTask({ body: '' });
    }
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
                <button type="submit" onClick={handleSubmit}>
                    Add
                </button>
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
