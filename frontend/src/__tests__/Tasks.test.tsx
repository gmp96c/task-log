import { render, fireEvent, waitFor, screen, getByText, waitForElementToBeRemoved } from '@testing-library/react';
import React from 'react';
import { Tip } from '../components/Tip';
import { client } from '../Client';
import { mocks, randomTask, randomTip, testUser } from './Mocks';
import { MockedProvider } from '@apollo/client/testing';
import { Tasks } from '../components/Tasks';
import { UserContextWrapper } from '../util/UserContextWrapper';

test('loads and displays task list', async () => {
  const element = render(
     <MockedProvider  mocks={mocks}>
       <UserContextWrapper value={testUser}>
        <Tasks />
      </UserContextWrapper>
    </MockedProvider>,
  );
  await waitForElementToBeRemoved(element.container.querySelector('h2'));
  // await waitFor(()=>expect(element.container.firstChild).not.toHaveTextContent('loading'));
  testUser?.currentTasks?.forEach(task=>{
    element.getByText(task.body);
  });
});
