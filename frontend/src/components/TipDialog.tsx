import React, { useState, useEffect, Dispatch, SetStateAction } from 'react';
import Button from '@material-ui/core/Button';
import styled from 'styled-components';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { useQuery, gql } from '@apollo/client';
import Loader from 'react-loader-spinner';
import { TipConfig, TaskConfig } from '../Types';
import { Tip } from './Tip';

export const GET_TIPS = gql`
    query GET_TIPS($id: ID!) {
        Task(where: { id: $id }) {
            tips {
                body
                id
                pinnedBy {
                    id
                    name
                }
                pinnedByCount
            }
        }
    }
`;
interface TipDialogConfig {
    tipOpen: boolean;
    setTipOpen: Dispatch<SetStateAction<boolean>>;
    task: TaskConfig;
    selected: TipConfig[];
}
export const TipDialog: React.FC<TipDialogConfig> = ({ tipOpen, setTipOpen, task, selected }: TipDialogConfig) => {
    const { loading, data, refetch } = useQuery<{ Task: TaskConfig }>(GET_TIPS, {
        variables: { id: task.id },
    });
    useEffect(() => {
        if (tipOpen) {
            refetch();
        }
    }, [tipOpen]);
    if (loading || data === undefined) {
        return <></>;
    }
    console.log(data);
    return (
        <DialogStyled
            open={tipOpen}
            onClose={() => {
                setTipOpen(false);
            }}
            aria-labelledby="form-dialog-title"
        >
            <DialogTitle className="form-dialog-title">Tips</DialogTitle>
            <DialogContent>
                {loading ? (
                    <Loader
                        type="Puff"
                        color="#00BFFF"
                        height={100}
                        width={100}
                        timeout={3000} // 3 secs
                    />
                ) : (
                    <>
                        {data.Task.tips.map((tip: TipConfig) => (
                            <Tip
                                key={tip.id}
                                tip={tip}
                                active={!!selected.map((el) => el.id).includes(tip.id)}
                                task={task}
                            />
                        ))}
                    </>
                )}
            </DialogContent>
            <DialogActions>
                <Button
                    onClick={() => {
                        setTipOpen(false);
                    }}
                    color="primary"
                >
                    Cancel
                </Button>
                <Button
                    onClick={() => {
                        setTipOpen(false);
                    }}
                    color="primary"
                >
                    Subscribe
                </Button>
            </DialogActions>
        </DialogStyled>
    );
};

const DialogStyled = styled(Dialog)``;
