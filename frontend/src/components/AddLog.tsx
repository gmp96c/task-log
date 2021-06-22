import React, { useState, useContext, useEffect } from 'react';
import IconButton from '@material-ui/core/IconButton';
import { gql, useMutation } from '@apollo/client';
import AddIcon from '@material-ui/icons/Add';
import { TaskConfig, LogConfig, UserConfig } from '../Types';
import { UserContext } from '../util/UserContextWrapper';
import { GET_TASKS_QUERY, GET_TIPS } from '../util/Queries';
import { convertToRaw, EditorState, ContentState, RichUtils, Modifier } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import '../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import draftToMarkdown from 'draftjs-to-markdown';

import styled from 'styled-components';
export const ADD_LOG = gql`
mutation  ADD_LOG($body: String!, $taskId: ID!){
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
    const [editorState, setEditorState] = useState(EditorState.createEmpty())
    const [addLog, addLogRes] = useMutation(ADD_LOG, {
        variables: {
            body: getMarkdownFromState(editorState),
            taskId: task.id,
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
    function getMarkdownFromState(eState: EditorState){
      return draftToMarkdown(convertToRaw(eState.getCurrentContent()));
    }
    function clearEditorState(){
      const removeSelectedBlocksStyle = (editorState: EditorState)  => {
        const newContentState = RichUtils.tryToRemoveBlockStyle(editorState);
        if (newContentState) {
            return EditorState.push(editorState, newContentState, 'change-block-type');
        }
        return editorState;
    }

    // https://github.com/jpuri/draftjs-utils/blob/master/js/block.js
   const getResetEditorState = (editorState: EditorState) => {
        const blocks = editorState
            .getCurrentContent()
            .getBlockMap()
            .toList();
        const updatedSelection = editorState.getSelection().merge({
            anchorKey: blocks.first().get('key'),
            anchorOffset: 0,
            focusKey: blocks.last().get('key'),
            focusOffset: blocks.last().getLength(),
        });
        const newContentState = Modifier.removeRange(
            editorState.getCurrentContent(),
            updatedSelection,
            'forward'
        );

        const newState = EditorState.push(editorState, newContentState, 'remove-range');
        return removeSelectedBlocksStyle(newState)
    }
    setEditorState(getResetEditorState(editorState));
    }
    return (
        <EditorStyle>
          <button
                type="button"
                onClick={() => {
                  addLog().then(res=>{

                    clearEditorState();
                  });
                }}
            >
                Save Log
            </button>
    <Editor
        editorState={editorState}
        wrapperClassName="demo-wrapper"
        editorClassName="demo-editor"
        onEditorStateChange={setEditorState}
        toolbar={{
          options: ['blockType', 'fontSize', 'fontFamily', 'list', 'textAlign', 'colorPicker', 'link', 'embedded', 'emoji', 'image'],
        }}
      />
        </EditorStyle>
    );
};
const EditorStyle = styled.div`
margin-top:1rem;
width:100%;
grid-column:1 / 5;
`;
