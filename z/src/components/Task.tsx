import React from 'react';
import styled from 'styled-components';
import { TaskConfig, TipConfig } from '../Types';

interface TProps {
    item: TaskConfig;
}

export const Task = ({ item }: TProps) => (
    <TaskStyle>
        <h4>{item.body}</h4>
        <ul>
            {item.tips.map((tip: TipConfig) => {
                <li key={tip.id}>tip.body</li>;
            })}
        </ul>
    </TaskStyle>
);

const TaskStyle = styled.div`
    max-width: 800px;
    width: 90%;
    text-align: center;
`;
