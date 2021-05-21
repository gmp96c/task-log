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
    useEffect(()=>{
      setTipInput('');
    },[data?.Task?.tips])
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
                <AddTip task={task} tipInput={tipInput}>
                   <input
                placeholder="Add New Tip"
                aria-label="add new tip"
                value={tipInput}
                onChange={(e) => {
                    setTipInput(e.target.value);
                }}
            ></input>
            </AddTip>
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
                        {processedData.map((tip: TipConfig) => (
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
                    color=  "primary"
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

const DialogStyled = styled(Dialog)`
    Paper {
        display: flex;
        InputBase {
            flex-grow: 1;
        }
    }
`;
