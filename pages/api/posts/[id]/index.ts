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
    session: { user }
  } = req;

  const post = await client?.post.findUnique({
    where: {
      id: Number(id)
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          avatar: true,
        }
      },
      answers: {
        select: {
          id: true,
          answer: true,
          user: {
            select: {
              id: true,
              name: true,
              avatar: true,
            }
          },
          createAt: true,
        }
      },
      _count: {
        select: {
          answers: true,
          wonderings: true,
        }
      }
    }
  });

  const isWondering = Boolean(
  await client?.wondering.findFirst({
    where: {
      postId: Number(id),
      userId: user?.id,
    },
    select: {
      id: true,
    }
  }));

  res.json({
    ok: true,
    post,
    isWondering,
  })
};

export default withApiSession(
  withHandler({
    handler,
    methods: ['GET'],
    isPrivate: false,
  })
)