import faker, { fake } from 'faker';
import { TaskConfig, TipConfig, UserConfig } from '../Types';
import { GET_TASKS_QUERY, GET_TIPS } from '../util/Queries';
export const testTask = randomTask('23',10, null);
export const testUser = randomUser();
export const mocks = [
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
  },
  {
    request: {
      query: GET_TASKS_QUERY,
      variables: {
        id: testUser.id
      }
    },
    result:{
      "data": {
        "User": testUser
      },
      "loading": false,
      "networkStatus": 7
    }
  }
];
export function randomTip(): TipConfig{
  return {
      __typename: 'Tip',
      id: faker.random.alphaNumeric(8),
      body: faker.lorem.sentence(),
      _pinnedByMeta: {
          count: faker.datatype.number(50),
          __typename:"_QueryMeta"
      },
  };
}
export function randomTask(id,tipCount = 1, body): TaskConfig {
  return {
      __typename: 'Task',
      id: id || faker.datatype.number(100).toString(),
      body: body || faker.lorem.sentence(),
      tips: bulkTips(tipCount),
  };
}
function bulkTips(num){
  let res: TipConfig[] = [];
  for(let i = 0; i<num; i++){
    res.push(randomTip())
  }
  return res;
}
function randomUser(): UserConfig{
  return{
    __typeName: 'User',
    id: faker.datatype.number(25).toString(),
    name: faker.name.firstName(),
    email: faker.internet.email(),
    currentTasks: Array.from(new Set(Array(10).fill(faker.lorem.sentence()))).map(el=>randomTask(null, Math.floor(Math.random()*8),el))
  }
}
