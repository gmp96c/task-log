import React, { useState, useContext } from 'react';
import IconButton from '@material-ui/core/IconButton';
import { gql, useMutation } from '@apollo/client';
import AddIcon from '@material-ui/icons/Add';
import styled from 'styled-components';
import { TaskConfig, TipConfig, UserConfig } from '../Types';
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
    tipInput: string;
    setError: React.Dispatch<React.SetStateAction<string>>;
}

export const AddTip: React.FC<AddTipConfig> = ({ task, tipInput, setError, children }) => {
    const user = useContext(UserContext);
    const [addTip, addTipRes] = useMutation(ADD_TIP, {
        variables: {
            body: tipInput,
            taskId: task.id,
            userId: user?.id,
        },
        update: (cache, { data: { createTip: tip } }) => {
            try {
                cache.modify({
                    id: cache.identify(task),
                    fields: {
                        tips(existingTipRefs, { readField, storeFieldName }) {
                            const newTipRef = cache.writeFragment({
                                data: tip,
                                fragment: gql`
                                    fragment NewTip on Tips {
                                        id
                                        body
                                        _pinnedByMeta {
                                            count
                                        }
                                    }
                                `,
                            });
                            if (existingTipRefs.some((ref) => readField('id', ref) === tip.id)) {
                                return existingTipRefs;
                            }
                            return [...existingTipRefs, newTipRef];
                        },
                    },
                });
            } catch (err) {
                console.log(err);
            }
        },
    });
    function handleSubmit(e): void {
        if (tipInput.length < 4) {
            setError('Tips must be at least 4 characters.');
            return;
        }
        if (tipInput.length >= 120) {
            setError('Tips must be below 120 characters');
            return;
        }
        e.preventDefault();
        addTip();
    }
    return (
        <TipInputStyle>
            {children}
            <IconButton type="submit" aria-label="add" onClick={handleSubmit}>
                <AddIcon />
            </IconButton>
        </TipInputStyle>
    );
};
const TipInputStyle = styled.div`
    border: 1px solid var(--base-grey);
    font-size: 0.9rem;
    margin: 0.5rem;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    .MuiButtonBase-root {
        padding: 0.5rem;
    }
    *,
    *:focus,
    *:hover {
        outline: none;
    }
`;
