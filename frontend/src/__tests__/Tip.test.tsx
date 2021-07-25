import { render, fireEvent, waitFor, screen, getByText } from '@testing-library/react';
import React from 'react';
import { MockedProvider } from '@apollo/client/testing';
import { Tip } from '../components/Tip';
import { client } from '../Client';
import { mocks, randomTask, randomTip } from './Mocks';

test('loads and displays tip', async () => {
    const testTip = randomTip();
    const element = render(
        <MockedProvider mocks={mocks}>
            <Tip tip={testTip} active task={randomTask(null, 1, null)} />
        </MockedProvider>,
    );
    expect(element.baseElement.innerHTML).toContain(testTip.body);
});

test('Active/inactive has different style', async () => {
    const testTip = randomTip();
    const Elements = render(
        <MockedProvider mocks={mocks}>
            <>
                <Tip tip={testTip} active task={randomTask(null, 1, null)} />p
                <Tip tip={testTip} active={false} task={randomTask(null, 1, null)} />
            </>
        </MockedProvider>,
    );
    const [tip1, tip2] = Elements.getAllByText(testTip.body).map((el) => el.getAttribute('class'));
    if (tip1 == null || tip2 == null) {
        throw new Error('Failed to create tips');
    }
    const [baseClass1, activeStateClass1] = tip1.split(' ');
    const [baseClass2, activeStateClass2] = tip2.split(' ');
    expect(baseClass1).toEqual(baseClass2);
    expect(activeStateClass1).not.toEqual(activeStateClass2);
});
