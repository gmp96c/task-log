/* eslint-disable react/jsx-props-no-spreading */
import { Button, InputAdornment, TextField } from '@material-ui/core';
import React, { ReactElement, useState, useContext, useEffect } from 'react';
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
    __typename?: 'Task';
}

const ADD_TASK_MUTATION = gql`
    mutation ADD_TASK_MUTATION($userId: ID!, $taskId: ID!) {
        updateUser(id: $userId, data: { currentTasks: { connect: [{ id: $taskId }] } }) {
            name
            id
            currentTasks {
                id
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

interface StyleProps {
    textEntered: boolean;
    open: boolean;
}

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
        update: (cache, { data: task }) => {
            const cachedData: { User: UserConfig } | null | undefined = cache.readQuery({
                query: GET_TASKS_QUERY,
                variables: {
                    id: user?.id,
                },
            });
            if (cachedData === null || cachedData === undefined) {
                return;
            }
            const {
                User: { currentTasks },
            } = cachedData;
            if (Array.isArray(currentTasks) && task) {
                cache.writeFragment({
                    id: `User:${user?.id}`,
                    fragment: gql`
                        fragment TaskUpdate on User {
                            currentTasks
                        }
                    `,
                    data: {
                        currentTasks: [
                            ...currentTasks.map((el) => ({ __ref: `Task:${el.id}` })),
                            { __ref: `Task:${task.id}` },
                        ],
                    },
                });
            }
        },
    });
    const [taskDisplay, setTaskDisplay] = useState<TaskConfig[]>([]);
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
    const [findTasks, { variables }] = useLazyQuery(SEARCH_TASKS_QUERY, {
        fetchPolicy: 'no-cache',
        onCompleted: (data) => {
            const taskSet = new Set(user?.currentTasks?.map((el) => el.id));
            setTaskDisplay(data.results.filter((i: TaskConfig) => !taskSet.has(i.id)));
        },
        pollInterval: 0,
    });
    const debouncedFindTasks = debounce(findTasks, 300);
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
        reset,
        setInputValue,
    } = useCombobox({
        items: taskDisplay,
        itemToString: (item: TaskConfig | null) => item?.body || '',
        onStateChange: ({ inputValue, type, ...val }) => {
            console.log('stateChange', inputValue, val);
            if ((type === '__input_change__' && inputValue) || inputValue === '') {
                if (inputValue === variables?.searchString) {
                    return;
                }
                const dupe = getDuplicateTask(taskDisplay, inputValue);
                debouncedFindTasks.cancel();
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
            if (item) {
                setSelectedTask(item);
            }
        },
    });
    useEffect(() => {
        setInputValue(selectedTask.body);
    }, [selectedTask.body]);
    async function handleSubmit(e): Promise<void> {
        e.preventDefault();
        try {
            if (selectedTask.body) {
                const res = await (isNewTask(selectedTask) ? createTask() : addTask());
                console.log(res);
            }
        } catch (err) {
            console.error(err);
        }
        setSelectedTask({ body: '' });
        reset();
    }
    console.log(selectedTask.body);
    return (
        <AddTaskStyle textEntered={!!selectedTask.body} open={isOpen && taskDisplay.length > 0}>
            <div
                {...getComboboxProps({
                    id: 'combobox',
                })}
            >
                <TextField
                    id="taskInput"
                    fullWidth
                    variant="outlined"
                    {...getInputProps({ refKey: 'inputRef' })}
                    onChange={(e) => {
                        setSelectedTask({ body: e.target.value });
                    }}
                    placeholder="Add a new task"
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <Button className="addAdornment" type="submit" onClick={handleSubmit}>
                                    Save
                                </Button>
                            </InputAdornment>
                        ),
                    }}
                />
            </div>
            <ul {...getMenuProps()}>
                {isOpen &&
                    taskDisplay.map((item, index) => (
                        <li
                            style={highlightedIndex === index ? { backgroundColor: '#bde4ff' } : {}}
                            key={`${item.id}`}
                            {...getItemProps({ item, index })}
                        >
                            {item.body}
                        </li>
                    ))}
                {isOpen && taskDisplay.length > 0 && (
                    <li id="existingTitle">
                        <h4>Existing Items</h4>
                    </li>
                )}
            </ul>
        </AddTaskStyle>
    );
};

const AddTaskStyle = styled.div<StyleProps>`
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    /* position: fixed; */
    top: 3rem;
    width: 100%;
    h4 {
        font-size: 1.1rem;
        color: var(--base-white);
        text-align: center;
    }
    #existingTitle {
        width: calc(100% - 0.4rem);
        margin-left: -0.1rem;
        margin-bottom: -0.3rem;
        padding: 0.2rem;
        background: #3f51b5;
        border-radius: 0 0 4px 4px;
        border: 0.1rem solid #3f51b5;
    }
    li {
        padding: 0.3rem;
    }
    ul {
        width: 60%;
        max-width: 35rem;
        margin: 0;
        padding: 0;
        position: fixed;
        list-style-type: none;
        z-index: 11;
        background: var(--base-white);
        border: ${(props) => (props.open ? '.15rem solid #3f51b5' : 'none')};
        border-top: none;
        transform: translateY(3.375rem);
        border-radius: 0 0 4px 4px;
    }
    #taskInput {
        background: white;
    }
    @media (max-width: 375px) {
        top: 4.5rem;
    }
    @media (max-width: 440px) {
        left: 1rem;
        right: 1rem;
        transform: none;
        width: 100%;
    }
    #combobox {
        width: auto;
        display: flex;
        max-width: 100rem;
        min-width: 250px;
        width: 80%;
        .MuiTextField-root {
            background: var(--base-white);
            box-shadow: var(--box-shadow);
            border-radius: 4px;
        }
    }
    #taskInput {
        width: 100%;
        /* * {
            background: white;
        } */
    }
    .addAdornment {
        width: 100%;
        max-width: 200px;
        z-index: ${(props) => (props.textEntered ? 10 : -10)};
        background: var(--submit-color);
        color: white;
    }
`;
