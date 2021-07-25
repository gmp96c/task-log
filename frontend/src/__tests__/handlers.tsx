import { graphql } from 'msw';
import { randomTask } from './Mocks';

export const handlers = [
    graphql.query('GET_TIPS', (req, res, ctx) => {
        const { id } = req.variables;
        return res(
            ctx.data({
                data: { Task: randomTask(id, 10) },
            }),
        );
    }),
];
