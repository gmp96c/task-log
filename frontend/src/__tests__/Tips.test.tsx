import { render, fireEvent, waitFor, screen, getByText } from '@testing-library/react';
import React from 'react';
import { MockedProvider } from '@apollo/client/testing';
import { Tip } from '../components/Tip';
import { TaskConfig, TipConfig } from '../Types';
import { randomTask, randomTip } from './dataMockFunctions';
import { TipDialog } from '../components/TipDialog';
import { GET_TIPS } from '../util/Queries';
import { Tips } from '../components/Tips';

test('Tips display and controls pop up on settings mode', async () => {
    const testTask = randomTask('23',10);
    const element = render(
            <Tips task={testTask} mode="Base"/>
    );

    //run tests in all modes
    //verify all tips display as expected

    //verify settings display or not

});

