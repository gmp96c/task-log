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
            <header>{!!(task.tips.length > 0 || mode !== 'Base') && <h5>Tips</h5>}</header>
            <ul>
                {[...task.tips]
                    .sort((a, b) => (a._pinnedByMeta.count > b._pinnedByMeta.count ? 1 : -1))
                    .map((tip: TipConfig) => (
                        <li key={tip.id}>{tip.body}</li>
                    ))}
            </ul>
            {mode === 'Settings' && (
                <button
                    type="button"
                    onClick={() => {
                        setTipOpen(true);
                    }}
                    className="addTipButton"
                >
                    Edit Tips
                </button>
            )}
            <TipDialog selected={task.tips} tipOpen={tipOpen} setTipOpen={setTipOpen} task={task} />
            {/* //TODO:Add/search tip input */}
        </TipStyle>
    );
};
const TipStyle = styled.div`
    display: flex;
    flex-direction: column;
    text-align: center;
    .addTipButton {
        margin-top: 1rem;
    }
`;
