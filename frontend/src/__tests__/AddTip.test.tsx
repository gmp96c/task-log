import { render, fireEvent, waitFor, screen, getByText, waitForElementToBeRemoved, getByPlaceholderText } from '@testing-library/react';
import React from 'react';
import { Tip } from '../components/Tip';
import { client } from '../Client';
import { mocks, randomTask, randomTip, testTask, testUser } from './Mocks';
import { MockedProvider } from '@apollo/client/testing';
import { UserContextWrapper } from '../util/UserContextWrapper';
import { Login } from '../components/Login';
import { AddTip } from '../components/AddTip';
import userEvent from '@testing-library/user-event'

test('loads and displays task list', async () => {
  let focused = false;
  let tipInput = '';
  const setSearch = jest.fn((value) => {})
  const element  = render(
     <MockedProvider  mocks={mocks}>
        <AddTip task={testTask} tipInput={tipInput}
/>
    </MockedProvider>,
  );
  const querySelector = (prop)=>element.container.querySelector(prop);
  let button = element.container.querySelector('button');

  // expect(querySelector('#loginHeader')).toHaveTextContent('Login');
  // let email =querySelector('[type="email"]');
  // expect(email).not.toEqual(null);
  // let password =querySelector('[type="password"]');
  // expect(password).not.toEqual(null);
  // expect(querySelector('#loginControl').childNodes[0]).toHaveTextContent('Sign Up');
  // expect(querySelector('#loginControl').childNodes[1]).toHaveTextContent('Login');
  // fireEvent.click(querySelector('#loginControl').childNodes[1]);
});
