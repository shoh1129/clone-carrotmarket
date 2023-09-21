import withHandler from "@lib/server/withHandler";
import { withApiSession } from "@lib/server/withSession";
import { NextApiRequest, NextApiResponse } from "next";
import client from "@lib/server/client";

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse,
) => {
  const {
    query: { id },
    body,
    session: { user },
  } = req;

  const message = await client.message.create({
    data: {
      message: body.message,
      user: {
        connect: {
          id: user?.id
        }
      },
      stream: {
        connect: {
          id: Number(id),
        }
      }
    }
  });
  res.json({
    ok: true,
    message,
  })
};

export default withApiSession(
  withHandler({
    handler,
    methods: ['POST'],
    isPrivate: false,
  })
)