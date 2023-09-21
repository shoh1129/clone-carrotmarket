import withHandler from "@lib/server/withHandler";
import { withApiSession } from "@lib/server/withSession";
import { NextApiRequest, NextApiResponse } from "next";
import client from "@lib/server/client";

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse,
) => {
  const  {
    query: { id },
    session: { user },
    body: { answer }
  } = req;
  const post = await client.post.findUnique({
    where: {
      id: Number(id),
    }
  });

  if (!post) return res.status(404).json({ok: false});

  const newAnswer = await client.answer.create({
    data: {
      answer,
      user: {
        connect: {
          id: user?.id,
        }
      },
      post: {
        connect: {
          id: Number(id),
        }
      }
    },
  })

  console.log(newAnswer);
  res.json({
    ok: true,
    newAnswer,
  });
};

export default withApiSession(
  withHandler({
    handler,
    methods: ['POST'],
    isPrivate: false,
  })
)