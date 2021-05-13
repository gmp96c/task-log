import { render, fireEvent, waitFor, screen, getByText } from '@testing-library/react';
import React from 'react';
import { MockedProvider } from '@apollo/client/testing';
import { Tip } from '../components/Tip';
import { TaskConfig, TipConfig } from '../Types';
import { randomTask, randomTip } from './dataMockFunctions';
import { TipDialog } from '../components/TipDialog';
import { GET_TIPS } from '../util/Queries';

test('loads and displays tips in order of most used', async () => {
    const testTask = randomTask('23',10);
    const mocks = [
      {
        request: {
          query: GET_TIPS,
          variables: {
            id: testTask.id
          }
        },
        result:{
          data:{
            Task: testTask
          }
        }
      }
    ];
    const element = render(
        <MockedProvider  mocks={mocks}>
            <TipDialog tipOpen={true} setTipOpen={()=>{}} task={testTask} selected={[testTask.tips[0],testTask.tips[2]]}/>
        </MockedProvider>,
    );
    //wait for query and first one to display
    await element.findByText(testTask.tips[0].body);
    //verify all tip bodies are being displayed
    testTask.tips.forEach(tip=>{
      element.getByText(tip.body);
    });
    //verify tips display in order of count
    let elementsInOrder = Array.from(document.querySelectorAll(".sc-bdfBwQ"));
    //Makes sure tip array is sorted high to low
    let tipArr = testTask.tips.sort((a,b)=>a._pinnedByMeta.count<b._pinnedByMeta.count?1:-1);
    //Makes sure each displayed tip is in the right order
    tipArr.forEach((tip,i)=>{
      expect(elementsInOrder[i].textContent).toEqual(tip.body);
    });
});

