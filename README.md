This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## Just In Time Compiler
tailwindcss 3.0부터 도입
코드를 실시간으로 감시하면서 필요한 클래스를 생성하는 기능을 한다.
class명을 생성하면 컴파일러가 그것을 찾아낸 다음 내가 원한느 클래스를 생성
즉, tailwindcss를 사용한 코드만 컴파일러에서 가져와서 생성하여 사용함.
(이전에는 모든 코드를 불러와야 했고, 배포할때 불필요한 코드들은 삭제해야하는 작업이 있었음)

## Prisma
1. Node.js and Typescript ORM(Object Relational Mapping)
=> JS or TS 와 데이터베이스 사이에 다리를 놓아줌 (기본적으로 번역기의 역할을 한다고 생각하면 됨)

2. Prisma를 사용하기 위해서는 먼저 Prisma에게 DB가 어떻게 생겼는지, 데이터의 모양을 설명해줘야 함 => schema.prisma

3. Prisma가 이런 타입에 관한 정보를 알고 있으면 client를 생성해줄 수 있음. client를 이용하면 TS로 DB와 직접 상호작용 가능, 자동완성 제공.

4. Prisma Studio : Visual Database Browser, DB를 위한 관리자 패널같은 것

## PlanteScale
MySQL과 호환되는 serverless데이터베이스 플랫폼 (serverless: server를 우리가 관리하고 유지보수할 필요가 없다.)

## Vitess
가장 scaliing이 뛰어난 오픈소스 데이터베이스
Scalability에 특화되어 있음.
데이터베이스를 잘게 쪼게서 여러 서버에 분산시키는데에 특화
foreign key제약을 지원하지 않음 -> 이부분을 prisma가 체크함(다른 두 객체를 조회할때 한쪽이 존재하는지의 연결상태)

## iron session
서명, 암호화된 쿠키를 사용하는 Nodejs무상태 세션도구
payload - 암호화 -> 쿠키 -> 유저가 백엔드에 요청 -> 복호화 후 확인

## todo schema.prisma의 모댈 분리할 수 있는지


## Next/Image 사용이유
- lazy loading 기능으로 더 빠르게 페이지 로딩이 됨
- 로딩이 느릴경우 흐릿한 이미지로 대체하여 다운될때까지 보여줌
## lazy loading
스크롤을 내리기 전에는 이미지를 다운받지 않고, 스크롤 내리는것이 끝날때 이미지 다운