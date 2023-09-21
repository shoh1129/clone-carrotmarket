import withHandler from "@lib/server/withHandler";
import { withApiSession } from "@lib/server/withSession";
import { NextApiRequest, NextApiResponse } from "next";
import client from "@lib/server/client";

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse,
) => {
  const {
    query: { id }
  } = req;
  const stream = await client.stream.findUnique({
    where: {
      id: Number(id),
    },
    include: {
      messges: {
        select: {
          id: true,
          message: true,
          user: {
            select: {
              avatar: true,
              id: true,
            }
          }
        }
      }
    }
  })
  res.json({
    ok: true,
    stream,
  })
};

export default withApiSession(
  withHandler({
    handler,
    methods: ['GET'],
    isPrivate: false,
  })
)