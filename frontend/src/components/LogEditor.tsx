import React, { useState, useContext, useEffect } from 'react';
import IconButton from '@material-ui/core/IconButton';
import { gql, useMutation } from '@apollo/client';
import AddIcon from '@material-ui/icons/Add';

import '../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import draftToMarkdown from 'draftjs-to-markdown';

import styled from 'styled-components';
import { Editor } from 'react-draft-wysiwyg';
import { convertToRaw, EditorState, ContentState, RichUtils, Modifier, convertFromRaw } from 'draft-js';
import { GET_TASKS_QUERY, GET_TIPS } from '../util/Queries';

import { UserContext } from '../util/UserContextWrapper';
import { LogConfig, TaskConfig, UserConfig } from '../Types';
import { GET_LOGS_FOR_TASK } from './Task';

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
    setToHistory: () => void;
}

export const LogEditor: React.FC<AddLogConfig> = ({ task, mode, log, setToHistory, children }) => {
    const [editorState, setEditorState] = useState(EditorState.createEmpty());
    const user = useContext(UserContext);
    const [addLog, { loading: addLoading, error: addError }] = useMutation(ADD_LOG, {
        variables: {
            body: JSON.stringify(convertToRaw(editorState.getCurrentContent())),
            taskId: task.id,
        },
        update: (cache, { data: { createLog: newLog } }) => {
            try {
                const oldLogs: { allLogs: LogConfig[] } | null = cache.readQuery({
                    query: GET_LOGS_FOR_TASK,
                    variables: {
                        taskId: task.id,
                        user: user?.id,
                    },
                });
                cache.writeQuery({
                    query: GET_LOGS_FOR_TASK,
                    data: {
                        allLogs: [newLog, ...(oldLogs?.allLogs || [])],
                    },
                    variables: {
                        taskId: task.id,
                        user: user?.id,
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
    useEffect(() => {
        if (addError !== undefined) {
            console.log(JSON.stringify(addError));
            console.log('hi');
            console.log(Object.values(addError?.networkError));
            if (addError.networkError && Object.values(addError.networkError).includes(413)) {
                alert('Log exceeds maximum length, please shorten or use multiple logs. ');
            }
        }
    }, [addError]);
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
            <Editor
                editorState={editorState}
                readOnly={mode === 'History'}
                wrapperClassName="draft-wrapper"
                editorClassName="draft-editor"
                onEditorStateChange={setEditorState}
                toolbarHidden={mode === 'History'}
                stripPastedStyles
                toolbar={{
                    options: ['blockType', 'fontSize', 'fontFamily', 'list', 'textAlign', 'link', 'image'],
                }}
            />
            {mode === 'Log' && (
                <button
                    className="saveButton"
                    type="button"
                    onClick={() => {
                        if (editorState.getCurrentContent().getPlainText()) {
                            addLog().then((res) => {
                                clearEditorState();
                                setToHistory();
                            });
                        }
                    }}
                >
                    Save Log
                </button>
            )}
        </EditorStyle>
    );
};
const EditorStyle = styled.div`
    margin-top: 1rem;
    width: 100%;
    grid-column: 1 / 5;
    .draft-wrapper {
        background: white;
        border: 1px solid black;
    }
    .draft-editor {
        min-height: 10rem;
        padding: 1rem;
    }
    .saveButton {
        padding: 0.5rem;
        margin-top: 0.5rem;
    }
`;
