import { render, fireEvent, waitFor, screen, getByText, waitForElementToBeRemoved } from '@testing-library/react';
import React from 'react';
import { Tip } from '../components/Tip';
import { client } from '../Client';
import { mocks, randomTask, randomTip, testTask, testUser } from './Mocks';
import { MockedProvider } from '@apollo/client/testing';
import { Tasks } from '../components/Tasks';
import { UserContextWrapper } from '../util/UserContextWrapper';
import { Task } from '../components/Task';

test('loads and displays task', async () => {
  let focused = false;
  const element = render(
     <MockedProvider  mocks={mocks}>
       <UserContextWrapper value={testUser}>
        <Task task={testTask} setFocused={()=>{focused= !focused}} unfocused={focused}/>
      </UserContextWrapper>
    </MockedProvider>,
  );
  //base mode
  function runBasicTests(){
  expect(element.container.querySelector('h4')?.textContent).toEqual(testTask.body);
  expect(element.container.querySelector('#logControls')?.children.length).toEqual(2);
  let addLogButton = element.container.querySelector('#logControls')?.childNodes[0];
  let viewLogsButton = element.container.querySelector('#logControls')?.childNodes[1];
  expect(addLogButton).toHaveTextContent('Add Log');
  expect(viewLogsButton).toHaveTextContent('View Logs');
  expect(element.container.querySelector('#logControls')?.lastChild).not.toHaveTextContent('Remove Task');
  element.getByText('settingsIcon');
  }
  // await waitFor(()=>expect(element.container.firstChild).not.toHaveTextContent('loading'));

});
