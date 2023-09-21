import withHandler from "@lib/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import client from '@lib/server/client';
import { withApiSession } from '@lib/server/withSession';

async function handler
(
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<any> {
  const {
    query: { id },
    session: { user }
  } = req
  const alreadyExist = await client.fav.findFirst({
    where: {
      AND: {
        productId: Number(id),
        userId: user?.id, 
      }
    }
  });

  if (alreadyExist) {
    await client.fav.delete({
      where: {
        id: alreadyExist.id,
      }
    })
  } else {
    await client.fav.create({
      data: {
        user: {
          connect: {
            id: user?.id,
          }
        },
        product: {
          connect: {
            id: Number(id),
          }
        }
      }
    });
  }

  res.json({
    ok: true,
    message: 'fav'
  })
}
export default withApiSession(withHandler({
  methods: ['POST'],
  handler,
  isPrivate: true,
}));
