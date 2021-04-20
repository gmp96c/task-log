import React, { useState, useContext } from 'react';
import styled from 'styled-components';
import { useMutation, gql, MutationResult } from '@apollo/client';
import Loader from 'react-loader-spinner';
import { TaskConfig, TipConfig, UserConfig } from '../Types';
import { UserContext } from '../App';
import { GET_TASKS_QUERY } from './Tasks';

interface TipProps {
    tip: TipConfig;
    active: boolean;
    task: TaskConfig;
}
type ActiveWrapperType = {
    active: boolean;
};
const TIP_DISCONNECT_MUTATION = gql`
    mutation TIP_DISCONNECT($tipId: ID!, $userId: ID!) {
        updateTip(id: $tipId, data: { pinnedBy: { disconnect: [{ id: $userId }] } }) {
            id
        }
    }
`;
const TIP_CONNECT_MUTATION = gql`
    mutation TIP_CONNECT($tipId: ID!, $userId: ID!) {
        updateTip(id: $tipId, data: { pinnedBy: { connect: [{ id: $userId }] } }) {
            id
        }
    }
`;
export const Tip: React.FC<TipProps> = ({ tip, active, task }: TipProps) => {
    const tipCacheUpdater = (cache, { data }) => {
        cache.modify({
            id: cache.identify(task),
            fields: {
                tips(existingTipRefs, { readField }) {
                    if (active) {
                        return existingTipRefs.filter((tipRef) => tip.id !== readField('id', tipRef));
                    }
                    const newTipRef = cache.writeFragment({
                        data: tip,
                        fragment: gql`
                            fragment NewTip on Tips {
                                id
                                body
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
    };
    const user = useContext(UserContext);
    const [disconnectTip, disconnectTipRes] = useMutation(TIP_DISCONNECT_MUTATION, {
        variables: {
            tipId: tip.id,
            userId: user?.id,
        },
        update: tipCacheUpdater,
    });
    const [connectTip, connectTipRes] = useMutation(TIP_CONNECT_MUTATION, {
        variables: {
            tipId: tip.id,
            userId: user?.id,
        },
        update: tipCacheUpdater,
    });
    function handleTipToggle(): void {
        if (active) {
            disconnectTip();
        } else {
            connectTip();
        }
    }
    return (
        <TipStyle active={active} onClick={handleTipToggle}>
            {tip.body}
        </TipStyle>
    );
};
const TipStyle = styled.div<ActiveWrapperType>`
    font-size: 1rem;
    background: ${({ active }) => (active ? 'white' : 'grey')};
    cursor: pointer;
    user-select: none;
`;
