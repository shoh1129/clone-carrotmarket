import withHandler from "@lib/server/withHandler";
import { withApiSession } from "@lib/server/withSession";
import { NextApiRequest, NextApiResponse } from "next";
import client from "@lib/server/client";

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse,
) => {
  const {
    session: { user }
  } = req;

  const items = await client.purchase.findMany({
    where: {
      userId: user?.id,
    },
    include: {
      product: {
        include: {
          _count: {
            select: {
              favs: true,
            }
          }
        }
      },
    },
  });
  
  res.json({
    ok: true,
    items,
  })
};

export default withApiSession(
  withHandler({
    handler,
    methods: ['GET'],
    isPrivate: false,
  })
)