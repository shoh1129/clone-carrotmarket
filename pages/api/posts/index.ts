import withHandler from "@lib/server/withHandler";
import { withApiSession } from "@lib/server/withSession";
import { NextApiRequest, NextApiResponse } from "next";
import client from '@lib/server/client';

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse,
) => {
  const {
    body: { question, latitude, longitude },
    session: { user },
    method, query
  } = req;

  if (method === 'POST') {
    const post = await client.post.create({
      data: {
        question,
        latitude,
        longitude,
        user: {
          connect: {
            id: user?.id,
          }
        }
      }
    });
  
    res.json({
      ok: true,
      post,
    });
  }

  if (method === 'GET') {
    const { latitude, longitude } = query;
    const parseLatitude = parseFloat(latitude as string);
    const parseLongitude = parseFloat(longitude as string);
    const posts = await client.post.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
          }
        },
        _count: {
          select: {
            answers: true,
            wonderings: true,
          }
        }
      },
      where: {
        latitude: {
          gte: parseLatitude - 0.01,
          lte: parseLatitude + 0.01,
        },
        longitude: {
          gte: parseLongitude - 0.01,
          lte: parseLongitude + 0.01,

        }
      }
    });
    res.json({
      ok: true,
      posts,
    })
  }
};

export default withApiSession(withHandler({
  handler,
  methods: ['GET', 'POST'],
  isPrivate: false,
}));