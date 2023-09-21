import withHandler from "@lib/server/withHandler";
import { withApiSession } from "@lib/server/withSession";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse,
) => {

  const reponse = await (await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/images/v2/direct_upload`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`,
      }
    }
  )).json();

  console.log(reponse);

  res.json({
    ok: true,
    ...reponse.result,
  })
};

export default withApiSession(
  withHandler({
    handler,
    methods: ['GET'],
    isPrivate: false,
  })
)