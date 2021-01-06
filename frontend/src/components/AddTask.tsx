import { TextField } from "@material-ui/core";
import React, { useState } from "react";
// const ADD_TASK_MUTATION = gql`
//   query {
//     authenticatedUser {
//       name
//       email
//       id
//     }
//   }
// `;
export const AddTask = () => {
  const [body, setBody] = useState("");
  return (
    <div>
      <TextField id="" label="newTask" variant="outlined" />
      {/* <button onClick={handleSubmit}>Submit</button> */}
    </div>
  );
};
