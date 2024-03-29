import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { TaskConfig, TipConfig, ModeType } from '../Types';
import { TipDialog } from './TipDialog';

interface TipProps {
    task: TaskConfig;
    mode: ModeType;
}
export const Tips: React.FC<TipProps> = ({ task, mode }: TipProps) => {
    const [tipOpen, setTipOpen] = useState(false);
    return (
        <TipStyle className="tipContainer">
            <header>{!(task.tips.length === 0 && ['Base', 'History'].includes(mode)) && <h5>Tips</h5>}</header>
            <ul>
                {[...task.tips]
                    .sort((a, b) => (a._pinnedByMeta.count > b._pinnedByMeta.count ? 1 : -1))
                    .map((tip: TipConfig) => (
                        <li className="tipBody" key={tip.id}>
                            {tip.body}
                        </li>
                    ))}
                {task.tips.length < 1 && ['Settings', 'Log'].includes(mode) && (
                    <li className="tipBody">
                        You have no tips selected, try editing tips to see what other people have found useful.
                    </li>
                )}
            </ul>
            {['Settings', 'Log'].includes(mode) && (
                <button
                    type="button"
                    onClick={() => {
                        setTipOpen(true);
                    }}
                    className="openTipDialog"
                >
                    Edit Tips
                </button>
            )}
            {tipOpen && <TipDialog selected={task.tips} tipOpen={tipOpen} setTipOpen={setTipOpen} task={task} />}
        </TipStyle>
    );
};
const TipStyle = styled.div`
    display: flex;
    flex-direction: column;
    word-break: break-word;
    width: 100%;

    /* max-width: 35%;
    min-width: 25%; */
    .tipBody {
        text-align: left;
        margin-bottom: 0.2rem;
    }
    .addTipButton {
        margin-top: 1rem;
    }
`;
