import React, { useState, useContext, useEffect } from 'react';
import IconButton from '@material-ui/core/IconButton';
import { gql, useMutation } from '@apollo/client';
import AddIcon from '@material-ui/icons/Add';
import { TaskConfig, LogConfig, UserConfig } from '../Types';
import { UserContext } from '../util/UserContextWrapper';
import { GET_TASKS_QUERY, GET_TIPS } from '../util/Queries';
import { convertToRaw, EditorState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import '../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import draftToMarkdown from 'draftjs-to-markdown';

import styled from 'styled-components';
export const ADD_LOG = gql`
mutation  ADD_LOG($body: String!, $taskId: String!){
  createLog(data:{body:$body, task:{connect:{id:$taskId}}}){
    body
    creator{
      name
    }
  }
}
`;

interface AddLogConfig {
    task: TaskConfig;
}

export const AddLog: React.FC<AddLogConfig> = ({ task, children}) => {
    const user = useContext(UserContext);
    const [editorState, setEditorState] = useState(EditorState.createEmpty())
    const [addLog, addLogRes] = useMutation(ADD_LOG, {
        variables: {
            body: editorState,
            taskId: task.id,
            userId: user?.id,
        },
        // update: (cache, { data: { createLog: tip } }) => {
        //     try {
        //         cache.modify({
        //             id: cache.identify(task),
        //             fields: {
        //                 tips(existingLogRefs, { readField, storeFieldName }) {
        //                     const newLogRef = cache.writeFragment({
        //                         data: tip,
        //                         fragment: gql`
        //                             fragment NewLog on Logs {
        //                                 id
        //                                 body
        //                                 _pinnedByMeta {
        //                                     count
        //                                 }
        //                             }
        //                         `,
        //                     });
        //                     if (existingLogRefs.some((ref) => readField('id', ref) === tip.id)) {
        //                         return existingLogRefs;
        //                     }
        //                     return [...existingLogRefs, newLogRef];
        //                 },
        //             },
        //         });
        //     } catch (err) {
        //         console.log(err);
        //     }
        // },
    });
    function handleSubmit(e): void {
        if (tipInput.length < 3) {
            //TODO: add error message for bad task names
            return;
        }
        e.preventDefault();
        addLog();
    }
    useEffect(()=>{
      function getMarkdownFromState(){
        return draftToMarkdown(convertToRaw(editorState.getCurrentContent()));
      }
    },
    [editorState])
    return (
        <EditorStyle>
    <Editor
        editorState={editorState}
        wrapperClassName="demo-wrapper"
        editorClassName="demo-editor"
        onEditorStateChange={setEditorState}
      />
        </EditorStyle>
    );
};
const EditorStyle = styled.div`
width:100%;
`;
