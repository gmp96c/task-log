import faker from 'faker';
import { TaskConfig, TipConfig } from '../Types';


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
export function randomTask(id,tipCount = 1): TaskConfig {
  return {
      __typename: 'Task',
      id: id,
      body: faker.lorem.sentence(),
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
