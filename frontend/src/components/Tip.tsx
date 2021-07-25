import React, { useContext } from 'react';
import styled from 'styled-components';
import { useMutation, gql, MutationUpdaterFn } from '@apollo/client';
import Loader from 'react-loader-spinner';
import { IconButton } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import { TaskConfig, TipConfig } from '../Types';
import { UserContext } from '../util/UserContextWrapper';

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
    const user = useContext(UserContext);
    const tipCacheUpdater: MutationUpdaterFn<void> = (cache, { data }) => {
        try {
            cache.modify({
                id: cache.identify(task),
                fields: {
                    tips(existingTipRefs, { readField, storeFieldName }) {
                        if (storeFieldName.includes('where')) {
                            // for currently selected tips
                            if (active) {
                                return existingTipRefs.filter((tipRef) => {
                                    return tip.id !== readField('id', tipRef);
                                });
                            }
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
                        }
                        return existingTipRefs;
                    },
                },
            });
        } catch (err) {
            console.error(err);
        }
    };
    const [disconnectTip, disconnectTipRes] = useMutation(TIP_DISCONNECT_MUTATION, {
        variables: {
            tipId: tip.id,
            userId: user?.id,
        },
        update: (cache, { data }) => {
            tipCacheUpdater(cache, { data });
        },
    });
    const [connectTip, connectTipRes] = useMutation(TIP_CONNECT_MUTATION, {
        variables: {
            tipId: tip.id,
            userId: user?.id,
        },
        update: (cache, { data }) => {
            tipCacheUpdater(cache, { data });
        },
    });
    function handleTipToggle(): void {
        if (active) {
            disconnectTip();
        } else {
            connectTip();
        }
    }
    return (
        <TipStyle className="tip" active={active} onClick={handleTipToggle}>
            <p>{tip.body}</p>
            {active ? <RemoveIcon /> : <AddIcon />}
        </TipStyle>
    );
};
const TipStyle = styled.div<ActiveWrapperType>`
    font-size: 0.9rem;
    background: ${({ active }) => (active ? 'white' : 'var(--base-grey-bright)')};
    border: 1px solid var(--base-grey);
    border-radius: 4px;
    margin: 0.5rem;
    padding: 0.5rem;
    cursor: pointer;
    user-select: none;
    display: flex;
    align-items: center;
    justify-content: center;
    line-height: 120%;
    word-break: break-word;
    p {
        flex-grow: 1;
        margin: 0;
        padding: 0;
        height: 100%;
    }
`;
