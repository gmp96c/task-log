import { render, fireEvent, waitFor, screen, getByText } from '@testing-library/react';
import React from 'react';
import faker from 'faker';
import { ApolloProvider } from '@apollo/client';
import { Tip } from '../components/Tip';
import { TaskConfig, TipConfig } from '../Types';
import { client } from '../Client';

function randomTip(): TipConfig {
    return {
        __typename: 'Tip',
        id: faker.random.alphaNumeric(8),
        body: faker.lorem.sentence(),
        _pinnedByMeta: {
            count: faker.datatype.number(50),
        },
    };
}
function randomTask(tip: TipConfig): TaskConfig {
    return {
        __typename: 'Task',
        id: faker.random.alphaNumeric(8),
        body: faker.lorem.sentence(),
        tips: [tip],
    };
}
test('loads and displays tip', async () => {
    const testTip = randomTip();
    const element = render(
        <ApolloProvider client={client}>
            <Tip tip={testTip} active task={randomTask(testTip)} />{' '}
        </ApolloProvider>,
    );
    expect(element.baseElement.innerHTML).toContain(testTip.body);
});
