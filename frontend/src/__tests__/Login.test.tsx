import { render, fireEvent, waitFor, screen, getByText, waitForElementToBeRemoved } from '@testing-library/react';
import React from 'react';
import { Tip } from '../components/Tip';
import { client } from '../Client';
import { mocks, randomTask, randomTip, testUser } from './Mocks';
import { MockedProvider } from '@apollo/client/testing';
import { UserContextWrapper } from '../util/UserContextWrapper';
import { Login } from '../components/Login';

test('loads and displays task list', async () => {
  const element = render(
     <MockedProvider  mocks={mocks}>
        <Login />
    </MockedProvider>,
  );
  const querySelector = (prop)=>element.container.querySelector(prop);
  expect(querySelector('#loginHeader')).toHaveTextContent('Login');
  let email =querySelector('[type="email"]');
  expect(email).not.toEqual(null);
  let password =querySelector('[type="password"]');
  expect(password).not.toEqual(null);
  expect(querySelector('#loginControl').childNodes[0]).toHaveTextContent('Sign Up');
  expect(querySelector('#loginControl').childNodes[1]).toHaveTextContent('Login');
  fireEvent.click(querySelector('#loginControl').childNodes[1]);
});
