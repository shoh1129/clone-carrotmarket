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

  const reviews = await client.review.findMany({
    where: {
      createdForId: user?.id,
    },
    include: {
      createdBy: {
        select: {
          id: true,
          name: true,
          avatar: true,
        }
      }
    }
  });

  res.json({
    ok: true,
    reviews,
  })
};

export default withApiSession(
  withHandler({
    handler,
    methods: ['GET'],
    isPrivate: false,
  })
);