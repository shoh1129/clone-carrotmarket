import withHandler from "@lib/server/withHandler";
import { withApiSession } from "@lib/server/withSession";
import { NextApiRequest, NextApiResponse } from "next";
import client from "@lib/server/client";

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse,
) => {
  const {
    session: { user },
    body: {
      name,
      price,
      description,
      page,
    },
    method,
  } = req;

  if (method === 'GET') {
    const streams = await client.stream.findMany({
      take: 10,
      skip: 10
    });

    res.json({
      ok: true,
      streams,
    })
  }

  if (method === 'POST') {
    const stream = await client.stream.create({
      data: {
        name,
        price,
        description,
        user: {
          connect: {
            id: user?.id,
          }
        }
      }
    });


    res.json({
      ok: true,
      stream,
    })
  }
};

export default withApiSession(
  withHandler({
    handler,
    methods: ['GET', 'POST'],
    isPrivate: false,
  })
)