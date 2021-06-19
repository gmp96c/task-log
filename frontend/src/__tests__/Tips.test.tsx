import { render, fireEvent, waitFor, screen, getByText } from '@testing-library/react';
import React from 'react';
import { MockedProvider } from '@apollo/client/testing';
import { Tip } from '../components/Tip';
import { TaskConfig, TipConfig } from '../Types';
import { mocks, randomTask, randomTip, testUser, tiplessTask } from './Mocks';
import { TipDialog } from '../components/TipDialog';
import { GET_TIPS } from '../util/Queries';
import { Tips } from '../components/Tips';
import { UserContextWrapper } from '../util/UserContextWrapper';

describe("Tip works in mode ", () => {
  const testTask = randomTask('23', 10, null);
  const testTiplessTask = randomTask('23', 0, null)
  test('Base', () => {
    const element = render(
      <Tips task={testTask} mode="Base" />
    );
    //verify all tips display as expected
    testTask.tips.forEach(tip => {
      element.getByText(tip.body);
    });
    //Verify header appears
    expect(element.container.querySelector('.tipContainer')).toContainHTML('<h5>Tips</h5>');
    //Verify settings not appearing
    expect(element.container.lastChild?.lastChild).not.toHaveClass('openTipDialog');
    // test Base mode with 0 tasks, header should be hidden
    const tiplessElement = render(
      <Tips task={tiplessTask} mode="Base" />
    );
    expect(tiplessElement.container.querySelector('.tipContainer')).not.toContainHTML('<h5>Tips</h5>');
    //button to open tip dialog not present
    expect(element.container.querySelector('.openTipDialog')).toBeNull();
  });

  test('Settings', () => {
    const element = render(

     <MockedProvider  mocks={mocks}>
     <UserContextWrapper value={testUser}>
      <Tips task={testTask} mode="Settings" />
      </UserContextWrapper>
    </MockedProvider>,
  );
    expect(element.container.querySelector('.tipContainer')).toContainHTML('<h5>Tips</h5>');
    expect(element.container.lastChild?.lastChild).toHaveClass('openTipDialog');
    let openTipDialogButton = element.container.querySelector('.openTipDialog');
    expect(openTipDialogButton).not.toBeNull();

    const tiplessElement = render(
      <Tips task={tiplessTask} mode="Settings" />
    );
    //Verify header shows up w/ tipless tasks
    expect(tiplessElement.container.querySelector('.tipContainer')).toContainHTML('<h5>Tips</h5>');

    //verify dialog opens
    fireEvent.click(openTipDialogButton as Element);
    element.findByPlaceholderText('Add New Tip');
  }
  );

  // const elementLog = render(
  //   <Tips task={testTask} mode="Log"/>
  // );
  // const elementHistory = render(
  //   <Tips task={testTask} mode="History"/>
  // );
});


