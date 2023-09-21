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
    session: { user },
  } = req;

  const alreadyExist = await client?.wondering.findFirst({
    where: {
      userId: user?.id,
      postId: Number(id),
    }
  });

  if (alreadyExist) {
    await client?.wondering.delete({
      where: {
        id: alreadyExist.id,
      }
    })
  } else {
    await client?.wondering.create({
      data: {
        user: {
          connect: {
            id: user?.id,
          }
        },
        post:{
          connect: {
            id: Number(id)            
          }
        }
      }
    });
  }
};

export default withApiSession(
  withHandler({
    handler,
    methods: ['POST'],
    isPrivate: false,
  })
)