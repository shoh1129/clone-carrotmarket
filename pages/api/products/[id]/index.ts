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
  } = req;
  const product = await client.product.findUnique({
    where: {
      id: Number(id),
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          avatar: true,
        }
      },
    }
  });
  const terms = product?.name.split(' ').map(word => ({
    name: {
      contains: word,
    }
  }));
  const relatedProducts = await client.product.findMany({
    where: {
      OR: terms,
      AND: {
        id: {
          not: product?.id,
        }
      }
    }
  });
  const isLiked = Boolean
    (await client.fav.findFirst({
      where: {
        userId: user?.id,
        productId: Number(id),
      },
      select: {
        id: true,
      }
  }));
  res.json({
    ok: true,
    product,
    relatedProducts,
    isLiked,
  });
}
export default withApiSession(withHandler({
  methods: ['GET'],
  handler,
  isPrivate: true,
}));
