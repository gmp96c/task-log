import React, { useState, useContext, useEffect } from 'react';
import IconButton from '@material-ui/core/IconButton';
import { gql, useMutation } from '@apollo/client';
import AddIcon from '@material-ui/icons/Add';
import { GET_TASKS_QUERY, GET_TIPS } from '../util/Queries';
import { convertToRaw, EditorState, ContentState, RichUtils, Modifier, convertFromRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import '../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import draftToMarkdown from 'draftjs-to-markdown';

import styled from 'styled-components';
import { UserContext } from '../util/UserContextWrapper';
import { LogConfig, TaskConfig, UserConfig } from '../Types';
import { GET_LOG } from './Logs';

export const ADD_LOG = gql`
    mutation ADD_LOG($body: String!, $taskId: ID!) {
        createLog(data: { body: $body, task: { connect: { id: $taskId } } }) {
            id
            body
            task {
                id
            }
            createdAt
        }
    }
`;

interface AddLogConfig {
    task: TaskConfig;
    mode: 'Log' | 'History';
    log?: LogConfig;
}

export const LogEditor: React.FC<AddLogConfig> = ({ task, mode, log, children }) => {
    const [editorState, setEditorState] = useState(EditorState.createEmpty());
    const [addLog, addLogRes] = useMutation(ADD_LOG, {
        variables: {
            body: JSON.stringify(convertToRaw(editorState.getCurrentContent())),
            taskId: task.id,
        },
        update: (cache, { data: { createLog: log } }) => {
            try {
                const oldLogs: { allLogs: LogConfig[] } | null = cache.readQuery({
                    query: GET_LOG,
                    variables: {
                        taskId: task.id,
                    },
                });
                cache.writeQuery({
                    query: GET_LOG,
                    data: {
                        allLogs: [...(oldLogs?.allLogs || []), log],
                    },
                    variables: {
                        taskId: task.id,
                    },
                });
            } catch (err) {
                console.log(err);
            }
        },
    });
    // function getMarkdownFromState(eState: EditorState): string {
    //     return draftToMarkdown(convertToRaw(eState.getCurrentContent()));
    // }
    function clearEditorState(): void {
        const removeSelectedBlocksStyle = (eState: EditorState): EditorState => {
            const newContentState = RichUtils.tryToRemoveBlockStyle(eState);
            if (newContentState) {
                return EditorState.push(eState, newContentState, 'change-block-type');
            }
            return eState;
        };
        const getResetEditorState = (eState: EditorState): EditorState => {
            const blocks = eState.getCurrentContent().getBlockMap().toList();
            const updatedSelection = eState.getSelection().merge({
                anchorKey: blocks.first().get('key'),
                anchorOffset: 0,
                focusKey: blocks.last().get('key'),
                focusOffset: blocks.last().getLength(),
            });
            const newContentState = Modifier.removeRange(eState.getCurrentContent(), updatedSelection, 'forward');

            const newState = EditorState.push(eState, newContentState, 'remove-range');
            return removeSelectedBlocksStyle(newState);
        };
        setEditorState(getResetEditorState(editorState));
    }
    useEffect(() => {
        console.log(log);
        clearEditorState();
        if (mode === 'History' && log?.body !== undefined) {
            setEditorState(EditorState.createWithContent(convertFromRaw(JSON.parse(log.body))));
        }
    }, [mode, log]);
    return (
        <EditorStyle>
            {mode === 'Log' && (
                <button
                    type="button"
                    onClick={() => {
                        addLog().then((res) => {
                            clearEditorState();
                        });
                    }}
                >
                    Save Log
                </button>
            )}
            <Editor
                editorState={editorState}
                readOnly={mode === 'History'}
                wrapperClassName="demo-wrapper"
                editorClassName="demo-editor"
                onEditorStateChange={setEditorState}
                toolbarHidden={mode === 'History'}
                toolbar={{
                    options: [
                        'blockType',
                        'fontSize',
                        'fontFamily',
                        'list',
                        'textAlign',
                        'colorPicker',
                        'link',
                        'embedded',
                        'emoji',
                        'image',
                    ],
                }}
            />
        </EditorStyle>
    );
};
const EditorStyle = styled.div`
    margin-top: 1rem;
    width: 100%;
    grid-column: 1 / 5;
`;
