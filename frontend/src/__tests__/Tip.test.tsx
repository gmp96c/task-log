import { render, fireEvent, waitFor, screen, getByText } from '@testing-library/react';
import React from 'react';
import { ApolloProvider } from '@apollo/client';
import { Tip } from '../components/Tip';
import { TaskConfig, TipConfig } from '../Types';
import { client } from '../Client';
import { randomTask, randomTip } from './dataMockFunctions';

test('loads and displays tip', async () => {
  const testTip = randomTip();
  const element = render(
    <ApolloProvider client={client}>
      <Tip tip={testTip} active task={randomTask(1)} />{' '}
    </ApolloProvider>,
  );
  expect(element.baseElement.innerHTML).toContain(testTip.body);
});

test('Active/inactive has different style', async () => {
  const testTip = randomTip();
  const Elements = render(
    <ApolloProvider client={client}>
      <Tip tip={testTip} active task={randomTask(1)} />
      <Tip tip={testTip} active={false} task={randomTask(1)} />
    </ApolloProvider>,
  );
  const [tip1, tip2] = Elements.getAllByText(testTip.body).map(el => el.getAttribute('class'));
  if (tip1 == null || tip2 == null) {
    throw new Error("Failed to create tips");
  }
  let [baseClass1, activeStateClass1] = tip1.split(' ');
  let [baseClass2, activeStateClass2] = tip2.split(' ');
  expect(baseClass1).toEqual(baseClass2);
  expect(activeStateClass1).not.toEqual(activeStateClass2);
});
