import { TextField } from "@material-ui/core";
import React, { useState } from "react";
import { gql, useLazyQuery } from "@apollo/client";
import { useCombobox } from "downshift";
import debounce from "lodash.debounce";
import { TaskConfig } from "../Types";

const CREATE_TASK_MUTATION = gql`
  mutation CREATE_TASK_MUTATION($body: String!) {
    createTask(data: { body: $body }) {
      body
      id
    }
  }
`;

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
  const [body, setBody] = useState("");
  const [findTasks, { loading, data, error }] = useLazyQuery(
    SEARCH_TASKS_QUERY,
    {
      fetchPolicy: "no-cache",
    }
  );
  const tasks: [TaskConfig] = data?.results
    ? data.results
    : [{ body: "Add as new task", id: "-1", __typename: "Task" }];
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
    onInputValueChange: ({ inputValue }) => {
      if (inputValue) {
        debouncedFindTasks({ variables: { searchString: inputValue } });
      }
    },
  });

  return (
    <div>
      <label {...getLabelProps()}>Add a new task</label>
      <div {...getComboboxProps()}>
        <input {...getInputProps()} />
        <button
          type="button"
          {...getToggleButtonProps()}
          aria-label={"toggle menu"}
        >
          &#8595;
        </button>
      </div>
      <ul {...getMenuProps()}>
        {isOpen &&
          tasks.map((item, index) => (
            <li
              style={
                highlightedIndex === index ? { backgroundColor: "#bde4ff" } : {}
              }
              key={`${item.id}#${index}`}
              {...getItemProps({ item, index })}
            >
              {item.body}
            </li>
          ))}
      </ul>
    </div>
  );
};
