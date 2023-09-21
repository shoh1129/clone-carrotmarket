import twilio from "twilio";
import client from "@lib/server/client";
import withHandler, { ResponseType } from "@lib/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import smtpTransport from "@lib/server/email";
import { error } from "console";

const twilioClient = twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN)

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>,
) {
  const { phone, email } = req.body;
  const user = phone ? { phone } : email ? { email } : null;
  if (!user) return res.status(400).json({ ok: false });
  const payload = Math.floor(100000 + Math.random() * 900000) + '';
  const token = await client.token.create({
    data: {
      payload,
      user: {
        connectOrCreate: {
          where: {
            ...user,
          },
          create: {
            name: 'Anonymous',
            ...user,
          },
        },
      },
    },
  });

  console.log(token);

  // if (email) {
  //   user = await client.user.findUnique({
  //     where: {
  //       email
  //     }
  //   });
  //   if (user) console.log('found it');
  //   if (!user) {
  //     console.log('Did not found. Will create!');
  //     user = await client.user.create({
  //       data: {
  //         name: 'Anonymonus',
  //         email,
  //       }
  //     })
  //   }
  //   console.log(user)
  // }
  
  // if (phone) {
  //   user = await client.user.findUnique({
  //     where: {
  //       phone: +phone
  //     }
  //   });
  //   if (user) console.log('found it');
  //   if (!user) {
  //     console.log('Did not found. Will create!');
  //     user = await client.user.create({
  //       data: {
  //         name: 'Anonymonus',
  //         phone: +phone,
  //       }
  //     })
  //   }
  //   console.log(user)
  // }
  if (phone) {
    const message = await twilioClient.messages.create({
      messagingServiceSid: process.env.MESSAGING_SERVICE_SID,
      to: process.env.MY_PHONE!,
      body: `your login token is ${payload}.`,
    });
  }
  if (email) {
    const result = await smtpTransport.sendMail({
      from: process.env.MAIL_ID,
      to: email,
      subject: 'send Email--!!',
      text: `send Email Token --> ${payload}`,
    },
    (error, response) => {
      if (error) {
        console.log(error);
        return null;
      } else {
        console.log(response);
      }
    });
    smtpTransport.close();
    console.log(result);
  }
  return res.json({
    ok: true
  });
}

export default withHandler({
  methods: ['POST'],
  handler,
});