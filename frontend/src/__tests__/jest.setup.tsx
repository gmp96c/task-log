import { setupServer } from 'msw/node';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import { handlers } from './handlers';
try{
const server = setupServer(...handlers);
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test('1 + 1 = 2', ()=>{
  expect(1+1).toEqual(2);
})

}catch(err){
  console.error(err);
}
