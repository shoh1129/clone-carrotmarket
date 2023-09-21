import withHandler from "@lib/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import client from '@lib/server/client';
import { withApiSession } from '@lib/server/withSession';

async function handler
(
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<any> {
  if (req.method === 'GET') {
    const products = await client.product.findMany({
      include: {
        _count: {
          select: {
            favs: true,
          }
        }
      }
    });
    res.json({
      ok: true,
      products,
    })
  }

  if (req.method === 'POST') {
    const {
      body: { name, price, description, photoId },
      session: { user },
    } = req;
  
    const product = await client.product.create({
      data: {
        name : name + '',
        price: +price,
        description: description + '',
        image: photoId ? photoId : '',
        user: {
          connect: {
            id: user?.id,
          }
        },
      }
    });

    res.json({
      ok: true,
      product,
    });
  }
}

export default withApiSession(withHandler({
  methods: ['GET', 'POST'],
  handler,
  isPrivate: true,
}));
