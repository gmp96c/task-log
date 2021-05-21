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
  const element  = render(
     <MockedProvider  mocks={mocks}>
       <UserContextWrapper value={testUser}>
        <Task task={testTask} setFocused={()=>{focused= !focused}} unfocused={focused}/>
      </UserContextWrapper>
    </MockedProvider>,
  );
  const querySelector = (prop)=>element.container.querySelector(prop);
  expect(querySelector('h4')?.textContent).toEqual(testTask.body);
  expect(querySelector('.logControls')?.children.length).toEqual(2);
  let addLogButtonB = querySelector('.logControls')?.childNodes[0];
  let viewLogsButtonB = querySelector('.logControls')?.childNodes[1];
  expect(addLogButtonB).toHaveTextContent('Add Log');
  expect(viewLogsButtonB).toHaveTextContent('View Logs');
  expect(querySelector('.logControls')?.lastChild).not.toHaveTextContent('Remove Task');
  expect(querySelector('.settingsIcon')).not.toEqual(null);
  expect(querySelector('.arrowIcon')).toEqual(null);
   expect(()=>element.getByText('Are you sure you would like to remove')).toThrowError();
  //switch to settings mode
  // let val = querySelector('.settingsIcon');
  fireEvent.click(querySelector('.settingsIcon') as Element);

  //settings mode
  expect(querySelector('h4')?.textContent).toEqual(testTask.body);
  expect(querySelector('.logControls')?.children.length).toEqual(3);
  let addLogButtonS = querySelector('.logControls')?.childNodes[0];
  let viewLogsButtonS = querySelector('.logControls')?.childNodes[1];
  let removeTaskButtonS = querySelector('.logControls')?.childNodes[2];
  expect(addLogButtonS).toHaveTextContent('Add Log');
  expect(viewLogsButtonS).toHaveTextContent('View Logs');
  expect(removeTaskButtonS).toHaveTextContent('Remove Task');
  expect(querySelector('.settingsIcon')).toEqual(null);
  expect(querySelector('.arrowIcon')).not.toEqual(null);
  expect(()=>element.getByText('Are you sure you would like to remove')).toThrowError();
});
