import type { NextPage } from "next";
import Button from "../../components/button";
import Layout from "../../components/layout";
import TextArea from "../../components/textarea";
import { useForm } from "react-hook-form";
import useMutation from "@lib/client/useMutation";
import { useEffect } from "react";
import { Post } from "@prisma/client";
import { useRouter } from "next/router";
import useCoords from "@lib/client/useCoords";

interface WriteForm {
  question: string;
}

interface WriteResponse {
  ok: boolean,
  post: Post;
}

const Write: NextPage = () => {
  const { latitude, longitude } = useCoords();
  const router = useRouter();
  const { register, handleSubmit } = useForm<WriteForm>();
  const [ post, { loading, data, error } ] = useMutation<WriteResponse>('/api/posts');
  const onValid = (wirteData: WriteForm) => {
    if (loading) return;
    post({...wirteData, latitude, longitude});
  }

  useEffect(() => {
    if (data && data.ok) {
      router.push(`/community/${data.post.id}`);
    }
  }, [data, router]);
  return (
    <Layout canGoBack title="Write Post">
      <form className="p-4 space-y-4" onSubmit={handleSubmit(onValid)}>
        <TextArea register={register('question', {
          required: {
            value: true,
            message: ''
          },
          minLength: {
            value: 5,
            message: ''
          }
        })} required placeholder="Ask a question!" />
        <Button text={loading ? 'Loading...' : 'Submit'} />
      </form>
    </Layout>
  );
};

export default Write;
