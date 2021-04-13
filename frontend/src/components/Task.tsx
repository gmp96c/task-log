import React, {useState} from 'react';
import styled from 'styled-components';
import { gql, useLazyQuery, useMutation } from '@apollo/client';
import SettingsIcon from '@material-ui/icons/Settings';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { TaskConfig, TipConfig } from '../Types';
import { useAuth } from '../hooks/useAuth';

interface TProps {
    item: TaskConfig;
    userId: string;
    setFocused: {
        (focused?:boolean ): void;
    };
    unfocused: boolean;
}
type FocusedWrapperType = {
  unfocused?: boolean;
}
enum TaskModeEnum {
  'Base',
  'Tip',
  'Log'
}
const REMOVE_TASK_MUTATION = gql`
    mutation REMOVE_TASK_MUTATION($userId: ID!, $taskId: ID!) {
        updateUser(id: $userId, data: { currentTasks: { disconnect: [{ id: $taskId }] } }) {
            name
            id
            currentTasks {
                id
                body
                tips(where: { pinnedBy_some: { id: $userId } }) {
                    id
                    body
                }
            }
        }
    }
`;
export const Task: React.FC<TProps> = ({ item, userId, setFocused, unfocused }: TProps) => {
    const [removeTask, removeTaskRes] = useMutation(REMOVE_TASK_MUTATION, {
        variables: {
            taskId: item.id,
            userId,
        },
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
    const [mode, setMode] = useState<'Base'|'Settings'|'Log'|'History'>('Base');
    return (
        <TaskStyle unfocused={unfocused}>
            <h4>{item.body}</h4>
            <div className="tipContainer">
                <header>
                    <h5>Tips</h5>

                </header>
                <ul>
                    {item.tips.map((tip: TipConfig) => (
                        <li key={tip.id}>{tip.body}</li>
                    ))}
                </ul>

                {/* //TODO:Add/search tip input */}
            </div>
            <div className="logControls">
              <button type="button" onClick={()=>{setMode('Log')}}>
              Add Log
              </button>
              <button type="button" onClick={()=>{setMode('History')}}>
              View Logs
              </button>
            </div>
            {mode!=='Base'?
            <ArrowBackIcon className="settingsIcon" onClick={()=>{setFocused(false); setMode('Base')}} />
            :
            <SettingsIcon className="settingsIcon" onClick={()=>{setFocused(); setMode('Settings')}}/>
            }
            {/* <button
                type="button"
                onClick={() => {
                    removeTask();
                }}
            >
                Delete
            </button> */}
        </TaskStyle>
    );
};

const TaskStyle = styled.div<FocusedWrapperType>`
    max-width: 800px;
    width: 90%;
    text-align: center;
    display: ${(props) => (props.unfocused ? 'none' : 'grid')};
    grid-template-columns: 1fr  .8fr .3fr auto;
    border: 1px solid black;
    border-radius: 2px;
    padding: 0.7rem;
    margin: 0.5rem;
    .logControls{
      display:flex;
      flex-direction:column;
      button{
        padding:.2rem;
        margin:.2rem;
        cursor:pointer;

      }
    }
    h4 {
        margin: 0;
        padding: 0;
        text-align: left;
    }
    h5 {
        font-size: 1rem;
        width: 100%;
        margin: 0;
        padding: 0;
    }
    header {
        margin: 0;
        padding: 0;
    }
    .tipContainer {
        display: flex;
        flex-direction: column;
        text-align: center;
    }
    .settingsIcon{
      cursor:pointer;
    }
`;
