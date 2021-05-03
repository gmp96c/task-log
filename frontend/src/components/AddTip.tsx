import React, { useState, useContext } from 'react';
import IconButton from '@material-ui/core/IconButton';
import { gql, useMutation } from '@apollo/client';
import AddIcon from '@material-ui/icons/Add';
import { TaskConfig, UserConfig } from '../Types';
import { UserContext } from '../util/UserContextWrapper';
import { GET_TASKS_QUERY, GET_TIPS } from '../util/Queries';

export const ADD_TIP = gql`
    mutation CREATE_TIP($body: String!, $taskId: ID!, $userId: ID!) {
        createTip(data: { body: $body, task: { connect: { id: $taskId } }, pinnedBy: { connect: { id: $userId } } }) {
            body
            id
            pinnedBy {
                id
                name
            }
            _pinnedByMeta {
                count
            }
        }
    }
`;

interface AddTipConfig {
    task: TaskConfig;
    tips: TipConfig[];
}

export const AddTip: React.FC<AddTipConfig> = ({ task, tips }) => {
    const user = useContext(UserContext);
    const [taskInput, setTaskInput] = useState<string>('');
    const [addTip, addTipRes] = useMutation(ADD_TIP, {
        variables: {
            body: taskInput,
            taskId: task.id,
            userId: user?.id,
        },
        update: (cache, { data: { addTip: tip } }) => {
            // Edit cache on task view for tips, this works.
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
                        currentTasks: [
                            ...User.currentTasks.filter((taskItem) => taskItem.id !== task.id),
                            { ...task, tips: [...task.tips, tip] },
                        ],
                    },
                });
            }
            // TODO: edit cache on TipDialog tip display, in progress
            cache.writeQuery({
                query: GET_TIPS,
                data: {
                    task: { tips: [...tips, tip] },
                    variables: {
                        id: task.id,
                    },
                },
            });
        },
    });
    function handleSubmit(e): void {
        e.preventDefault();
        addTip();
    }
    return (
        <div>
            <input
                placeholder="Add New Tip"
                aria-label="add new tip"
                value={taskInput}
                onChange={(e) => {
                    setTaskInput(e.target.value);
                }}
            />
            <IconButton type="submit" aria-label="add" onClick={handleSubmit}>
                <AddIcon />
            </IconButton>
        </div>
    );
};
