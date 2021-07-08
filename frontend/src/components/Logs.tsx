import React, { useState, useContext, useEffect } from 'react';
import IconButton from '@material-ui/core/IconButton';
import { gql, useMutation, useQuery } from '@apollo/client';
import AddIcon from '@material-ui/icons/Add';
import { GET_TASKS_QUERY, GET_TIPS } from '../util/Queries';
import { convertToRaw, EditorState, ContentState, RichUtils, Modifier } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import '../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import draftToMarkdown from 'draftjs-to-markdown';

import styled from 'styled-components';
import { UserContext } from '../util/UserContextWrapper';
import { TaskConfig, LogConfig, UserConfig } from '../Types';

export const GET_LOG = gql`
    query GET_LOG($taskId: ID!, $index: Int) {
        allLogs(where: { task: { id: $taskId } }, first: 1, skip: $index, orderBy: "createdAt") {
            id
            body
            task {
                id
            }
        }
    }
`;

interface AddLogConfig {
    task: TaskConfig;
}

export const Logs: React.FC<AddLogConfig> = ({ task, children }) => {
    const [editorState, setEditorState] = useState(EditorState.createEmpty());
    const { loading, data } = useQuery<{ allLogs: LogConfig[] }>(GET_LOG, {
        variables: {
            taskId: task.id,
        },
    });
    if (loading) {
        return <h2>loading</h2>;
    }
    return (
        <LogsStyle>
            {data!.allLogs.map((item) => (
                <li key={item.id}>{item.body}</li>
            ))}
        </LogsStyle>
    );
};
const LogsStyle = styled.ul`
    margin-top: 1rem;
    width: 100%;
    grid-column: 1 / 5;
`;
