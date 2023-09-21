import withHandler from "@lib/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import client from '@lib/server/client';
import { withApiSession } from '@lib/server/withSession';

// declare module 'iron-session' {
//   interface IronSessionData {
//     user?: {
//       id: number;
//     }
//   }
// }

async function handler
(
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<any> {
  const { token } = req.body;
  const foundToken = await client.token.findUnique({
    where: {
      payload: token,
    },
    // include: { user: true }
  })
  if (!foundToken) return res.status(404).end();
  req.session.user = {
    id: foundToken?.userId,
  };
  await req.session.save();
  await client.token.deleteMany({
    where: {
      userId: foundToken.userId,
    }
  });
  res.json({
    ok: true,
  })
}

export default withApiSession(withHandler({
  methods: ['POST'],
  handler,
}));
