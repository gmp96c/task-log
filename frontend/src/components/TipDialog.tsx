import React, { useState, useEffect, Dispatch, SetStateAction, useContext } from 'react';
import Button from '@material-ui/core/Button';
import styled from 'styled-components';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import DirectionsIcon from '@material-ui/icons/Directions';
import { useQuery, gql, useMutation } from '@apollo/client';
import Loader from 'react-loader-spinner';
import AddIcon from '@material-ui/icons/Add';
import { TipConfig, TaskConfig } from '../Types';
import { Tip } from './Tip';
import { UserContext } from '../util/UserContextWrapper';
import { AddTip } from './AddTip';
import { GET_TIPS } from '../util/Queries';
import { useSearch } from '../hooks/useSearch';

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
    const [tipInput, setTipInput] = useState<string>('');
    const [error, setError] = useState('');
    const processedData = useSearch<TipConfig>({
        data: data ? [...data.Task.tips] : [],
        keys: ['body'],
        query: tipInput,
        sorter: (el: TipConfig[]): TipConfig[] =>
            el.sort((a, b) => (a._pinnedByMeta.count < b._pinnedByMeta.count ? 1 : -1)),
    });
    useEffect(() => {
        if (tipOpen) {
            refetch();
        }
    }, [tipOpen]);
    useEffect(() => {
        setTipInput('');
    }, [data?.Task?.tips]);
    return (
        <DialogStyled
            open={tipOpen}
            onClose={() => {
                setTipOpen(false);
            }}
            aria-labelledby="form-dialog-title"
            fullWidth
            maxWidth="sm"
        >
            <DialogTitle className="form-dialog-title">Tips</DialogTitle>
            <DialogContent>
                <AddTip task={task} tipInput={tipInput} setError={setError}>
                    <input
                        placeholder="Add New Tip"
                        aria-label="add new tip"
                        className="tipInput"
                        value={tipInput}
                        onChange={(e) => {
                            if (error) {
                                setError('');
                            }
                            setTipInput(e.target.value);
                        }}
                    />
                </AddTip>
                {processedData.length > 0 && <hr />}
                {!loading && error && <h1>{error}</h1>}
                {!loading && !error && (
                    <>
                        {processedData
                            .sort((a, b) => {
                                const tipSet = new Set(task.tips.map((el) => el.id));
                                if (tipSet.has(a.id) && tipSet.has(b.id)) {
                                    return a._pinnedByMeta.count > b._pinnedByMeta.count ? 1 : -1;
                                }
                                if (!tipSet.has(a.id) && !tipSet.has(b.id)) {
                                    return a._pinnedByMeta.count > b._pinnedByMeta.count ? 1 : -1;
                                }
                                if (tipSet.has(a.id)) {
                                    return -1;
                                }
                                return 1;
                            })
                            .map((tip: TipConfig) => (
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
            </DialogActions>
        </DialogStyled>
    );
};

const DialogStyled = styled(Dialog)`
    Paper {
        display: flex;
        InputBase {
            flex-grow: 1;
        }
    }
    hr {
        margin: 0 0.5rem;
        height: 0.1rem;
        background: var(--base-grey-dark);
        border: none;
    }
    .MuiPaper-root {
        min-height: 30rem;
        max-height: 50rem;
    }
    .form-dialog-title {
        text-align: center;
    }
    .tipInput {
        border: none;
        height: 100%;
        margin: 0;
        padding: 0.5rem;
        flex-grow: 1;
    }
`;
