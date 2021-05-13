import { graphql } from 'msw';
import { randomTask } from './dataMockFunctions';

export const handlers = [
  graphql.query('GET_TIPS', (req, res, ctx) => {
    const {id} = req.variables;

    console.log("memeeee", req, res, ctx);
    return res(ctx.data({
        data:{Task: randomTask(id,10)}
    }));
}),
];
// graphql.mutation('TIP_CONNECT_MUTATION', (req,res,ctx)=>{
//   console.log(req,res,ctx);
// return res(ctx.data({
//   updateTip:{
//   "id": "6",
//   "__typename":"Tip"
//   }
// }));
// }),
// {"data":{"Task":{"id":"3","tips":[{"body":"Whats the deal with","id":"6","_pinnedByMeta":{"count":1,"__typename":"_QueryMeta"},"__typename":"Tip"},{"body":"Have you ever considered","id":"8","_pinnedByMeta":{"count":1,"__typename":"_QueryMeta"},"__typename":"Tip"},{"body":"Dicta et id distinctio recusandae ratione omnis ipsam possimus.","id":"14","_pinnedByMeta":{"count":1,"__typename":"_QueryMeta"},"__typename":"Tip"}],"__typename":"Task"}},"extensions":{"tracing":{"version":1,"startTime":"2021-05-13T02:05:43.394Z","endTime":"2021-05-13T02:05:43.569Z","duration":175422500,"execution":{"resolvers":[{"path":["Task"],"parentType":"Query","fieldName":"Task","returnType":"Task","startOffset":213400,"duration":53151400},{"path":["Task","id"],"parentType":"Task","fieldName":"id","returnType":"ID!","startOffset":53417300,"duration":192500},{"path":["Task","tips"],"parentType":"Task","fieldName":"tips","returnType":"[Tip!]!","startOffset":53469900,"duration":53815000},{"path":["Task","tips",0,"body"],"parentType":"Tip","fieldName":"body","returnType":"String","startOffset":107345000,"duration":199500},{"path":["Task","tips",0,"id"],"parentType":"Tip","fieldName":"id","returnType":"ID!","startOffset":107398000,"duration":148600},{"path":["Task","tips",0,"_pinnedByMeta"],"parentType":"Tip","fieldName":"_pinnedByMeta","returnType":"_QueryMeta","startOffset":107416800,"duration":138100},{"path":["Task","tips",1,"body"],"parentType":"Tip","fieldName":"body","returnType":"String","startOffset":107448100,"duration":100500},{"path":["Task","tips",1,"id"],"parentType":"Tip","fieldName":"id","returnType":"ID!","startOffset":107460000,"duration":90100},{"path":["Task","tips",1,"_pinnedByMeta"],"parentType":"Tip","fieldName":"_pinnedByMeta","returnType":"_QueryMeta","startOffset":107471900,"duration":126100},{"path":["Task","tips",2,"body"],"parentType":"Tip","fieldName":"body","returnType":"String","startOffset":107489200,"duration":62300},{"path":["Task","tips",2,"id"],"parentType":"Tip","fieldName":"id","returnType":"ID!","startOffset":107505400,"duration":47500},{"path":["Task","tips",2,"_pinnedByMeta"],"parentType":"Tip","fieldName":"_pinnedByMeta","returnType":"_QueryMeta","startOffset":107517400,"duration":103500},{"path":["Task","tips",0,"_pinnedByMeta","count"],"parentType":"_QueryMeta","fieldName":"count","returnType":"Int","startOffset":107564300,"duration":52345500},{"path":["Task","tips",1,"_pinnedByMeta","count"],"parentType":"_QueryMeta","fieldName":"count","returnType":"Int","startOffset":107602900,"duration":67785000},{"path":["Task","tips",2,"_pinnedByMeta","count"],"parentType":"_QueryMeta","fieldName":"count","returnType":"Int","startOffset":107627200,"duration":67688800}]}}}}
