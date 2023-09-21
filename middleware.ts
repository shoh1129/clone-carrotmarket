import { NextRequest, NextFetchEvent, userAgent } from 'next/server';

export const middleware = (
  request: NextRequest,
  ev: NextFetchEvent,
) => {
  const ua = userAgent(request);
  console.log(ua);
  if (request.nextUrl.pathname.startsWith('/chats')) {
    console.log('*******************chat!************')
  }
 
  // if (request.nextUrl.pathname.startsWith('/dashboard')) {
  //   // This logic is only applied to /dashboard
  // }
}