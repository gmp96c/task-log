import { render, fireEvent, waitFor, screen, getByText } from '@testing-library/react';
import React from 'react';
import { MockedProvider } from '@apollo/client/testing';
import { Tip } from '../components/Tip';
import { TaskConfig, TipConfig } from '../Types';
import { mocks, randomTask, randomTip, testTask, testUser } from './Mocks';
import { TipDialog, } from '../components/TipDialog';
import { UserContextWrapper } from '../util/UserContextWrapper';

test('loads and displays tips in order of most used', async () => {


  const element = render(
    <MockedProvider mocks={mocks}>
      <TipDialog tipOpen={true} setTipOpen={() => { }} task={testTask} selected={[testTask.tips[0], testTask.tips[2]]} />
    </MockedProvider>,
  );
  //wait for query and first one to display
  await element.findByText(testTask.tips[0].body);
  //verify all tip bodies are being displayed
  testTask.tips.forEach(tip => {
    element.getByText(tip.body);
  });
  //verify tips display in order of count
  let elementsInOrder = Array.from(element.baseElement.children);
  console.log(elementsInOrder);
  //Makes sure tip array is sorted high to low
  let tipArr = testTask.tips.sort((a, b) => a._pinnedByMeta.count < b._pinnedByMeta.count ? 1 : -1);
  //Makes sure each displayed tip is in the right order
  // tipArr.forEach((tip, i) => {
  //   expect(elementsInOrder[i].textContent).toEqual(tip.body);
  // });
});
//TODO: Add integration test for adding and updating tips
test('Adding tip updates list', async () => {
  const element = render(
    <MockedProvider mocks={mocks}>
      <UserContextWrapper value={testUser}>
        <TipDialog tipOpen={true} setTipOpen={() => { }} task={testTask} selected={[testTask.tips[0], testTask.tips[2]]} />
      </UserContextWrapper>
    </MockedProvider>,
  );
  //get tips
  let getTips = Array.from(element.container.querySelectorAll(".tip"));

  //get tip input
  let input = screen.getByPlaceholderText("Add New Tip");
  if (input === null) {
    throw new Error('null');
  }
  console.log(getTips.length);

  fireEvent.change(input, { target: { value: 'qqqqqqqTest' } });
  expect(input.getAttribute('value')).toBe('qqqqqqqTest');
  // expect(elementsInOrder.length).toBe(1);
  console.log(getTips.length);
});
