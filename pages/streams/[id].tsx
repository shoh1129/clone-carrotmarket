import type { NextPage } from "next";
import Layout from "../../components/layout";
import Message from "../../components/message";
import useSWR from 'swr';
import { useRouter } from "next/router";
import { Stream } from "@prisma/client";
import { useForm } from "react-hook-form";
import useMutation from "@lib/client/useMutation";
import { useUser } from "@lib/client/useUSer";
import { useEffect } from "react";

interface StreamWithMessages {
  message: string;
  id: number;
  user: {
    avatar?: string;
    id: number;
  }
}

interface StreamMessage extends Stream {
  messges: StreamWithMessages[];
}


interface StreamResponse {
  ok: boolean;
  stream: StreamMessage;
}

interface MessageForm {
  message: string;
}

const StreamPage: NextPage = () => {
  const { user } = useUser();
  const router = useRouter();
  const { data, mutate } = useSWR<StreamResponse>(
    router.query.id ?
    `/api/streams/${router.query.id}` : 
    null,
    { refreshInterval: 1000 },
  );
  const [sendMessage, { loading, data: sendMessageData }] = useMutation(`/api/streams/${router.query.id}/messages`);
  const { register, handleSubmit, reset } = useForm<MessageForm>();

  const onValid = (form: MessageForm) => {
    reset();
    mutate(prev => prev && ({
      ...prev, stream: {
        ...prev.stream,
        messges: [
          ...prev.stream.messges,
          {
            id: Date.now(),
            message: form.message,
            user: {
              ...user,
            }
          }
        ]
      } as any
    }), false);
    // sendMessage(form);
  };

  return (
    <Layout canGoBack>
      <div className="py-10 px-4  space-y-4">
        <div className="w-full rounded-md shadow-sm bg-slate-300 aspect-video" />
        <div className="mt-5">
          <h1 className="text-3xl font-bold text-gray-900">{data?.stream?.name}</h1>
          <span className="text-2xl block mt-3 text-gray-900">${data?.stream?.price}</span>
          <p className=" my-6 text-gray-700">
            {data?.stream?.description}
          </p>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Live Chat</h2>
          <div className="py-10 pb-16 h-[50vh] overflow-y-scroll  px-4 space-y-4">
            {
              data?.stream?.messges?.map((message) =>
              <Message key={message.id} message={message.message} reversed={user?.id === message.user.id}/>)
            }
            {/* <Message message="Hi how much are you selling them for?" />
            <Message message="I want ￦20,000" reversed />
            <Message message="미쳤어" /> */}
          </div>
          <div className="fixed py-2 bg-white  bottom-0 inset-x-0">
            <form onSubmit={handleSubmit(onValid)} className="flex relative max-w-md items-center  w-full mx-auto">
              <input
                {...register("message", {
                  required: true,
                })}
                type="text"
                className="shadow-sm rounded-full w-full border-gray-300 focus:ring-orange-500 focus:outline-none pr-12 focus:border-orange-500"
              />
              <div className="absolute inset-y-0 flex py-1.5 pr-1.5 right-0">
                <button className="flex focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 items-center bg-orange-500 rounded-full px-3 hover:bg-orange-600 text-sm text-white">
                  &rarr;
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default StreamPage;
