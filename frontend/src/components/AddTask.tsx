import { TextField } from "@material-ui/core";
import React, { useState } from "react";
import { gql, useLazyQuery, useMutation } from "@apollo/client";
import { useCombobox } from "downshift";
import debounce from "lodash.debounce";
import { TaskConfig } from "../Types";
import styled from "styled-components";
import { GET_TASKS } from "./Tasks";

const CREATE_TASK_MUTATION = gql`
  mutation CREATE_TASK_MUTATION($body: String!) {
    createTask(data: { body: $body }) {
      body
      id
    }
  }
`;
interface newTask {
  body: string;
  isNew: true;
}

const ADD_TASK_MUTATION = gql`
  mutation ADD_TASK_MUTATION($userId: ID!, $taskId: ID!) {
    updateUser(
      id: $userId
      data: { currentTasks: { connect: [{ id: $taskId }] } }
    ) {
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
export const AddTask = (props: { user: string }) => {
  const [selectedTask, setSelectedTask] = useState<TaskConfig | newTask>({
    body: "",
    isNew: true,
  });
  const [addTask, addTaskRes] = useMutation(ADD_TASK_MUTATION, {
    variables: {
      taskId: selectedTask.id,
      userId: props.user,
    },
    refetchQueries: [{ query: GET_TASKS }],
  });
  const [createTask, createTaskRes] = useMutation(CREATE_TASK_MUTATION, {
    variables: {
      body: selectedTask.body,
    },
    refetchQueries: [{ query: GET_TASKS }],
  });
  const [findTasks, findTasksRes] = useLazyQuery(SEARCH_TASKS_QUERY, {
    fetchPolicy: "no-cache",
  });
  const tasks: [TaskConfig] = findTasksRes?.data?.results
    ? findTasksRes?.data.results
    : [];
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
      if (inputValue || inputValue == "") {
        setSelectedTask({ body: inputValue, isNew: true });
        if (inputValue.length > 2) {
          debouncedFindTasks({ variables: { searchString: inputValue } });
        }
      }
    },
    onSelectedItemChange: ({ selectedItem }) => {
      console.log(selectedItem);
      if (selectedItem) {
        setSelectedTask(selectedItem);
      }
    },
  });
  const handleSubmit = async () => {
    let res;
    if (selectedTask?.isNew) {
      res = await createTask();
    } else {
      res = await addTask();
    }
    console.log(res);
    setSelectedTask({ body: "", isNew: true });
  };
  return (
    <AddTaskStyle>
      <label {...getLabelProps()}>Add a new task</label>
      <div {...getComboboxProps({ id: "combobox" })}>
        <input {...getInputProps({ value: selectedTask.body })} />
        {/* <button
          type="button"
          {...getToggleButtonProps({ id: "comboButton" })}
          aria-label={"toggle menu"}
        >
          &#8595;
        </button> */}
        <button onClick={handleSubmit}>Add</button>
      </div>
      <ul {...getMenuProps()}>
        {isOpen &&
          tasks.map((item, index) => (
            <li
              style={
                highlightedIndex === index ? { backgroundColor: "#bde4ff" } : {}
              }
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
