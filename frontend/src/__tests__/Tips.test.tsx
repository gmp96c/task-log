import { render, fireEvent, waitFor, screen, getByText } from '@testing-library/react';
import React from 'react';
import { MockedProvider } from '@apollo/client/testing';
import { Tip } from '../components/Tip';
import { TaskConfig, TipConfig } from '../Types';
import { randomTask, randomTip } from './Mocks';
import { TipDialog } from '../components/TipDialog';
import { GET_TIPS } from '../util/Queries';
import { Tips } from '../components/Tips';

describe("Tip works in mode ", ()=>{
  const testTask = randomTask('23',10, null);
  const testTiplessTask = randomTask('23',0, null)
test('Base',  () => {
    const element = render(
            <Tips task={testTask} mode="Base"/>
    );
    //verify all tips display as expected
    testTask.tips.forEach(tip=>{
    element.getByText(tip.body);
    });
    //Verify header appears
    expect(element.container.querySelector('header')?.innerHTML).toEqual('<h5>Tips</h5>');
    //Verify settings not appearing
    expect(element.container.lastChild?.lastChild).not.toHaveClass('openTipDialog');
    // test Base mode with 0 tasks, header should be hidden
    const tiplessElement = render(
            <Tips task={testTiplessTask} mode="Base"/>
    );
    expect(tiplessElement.container.querySelector('header')?.innerHTML).not.toEqual('<h5>Tips</h5>');

    });

test('Settings', ()=>{
  const element = render(
    <Tips task={testTask} mode="Settings"/>);
    expect(element.container.querySelector('header')?.innerHTML).toEqual('<h5>Tips</h5>');
    expect(element.container.lastChild?.lastChild).toHaveClass('openTipDialog');
  }
);

// const elementLog = render(
//   <Tips task={testTask} mode="Log"/>
// );
// const elementHistory = render(
//   <Tips task={testTask} mode="History"/>
// );
});


