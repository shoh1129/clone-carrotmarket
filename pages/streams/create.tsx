import type { NextPage } from "next";
import Button from "../../components/button";
import Input from "../../components/input";
import Layout from "../../components/layout";
import TextArea from "../../components/textarea";
import { useForm } from "react-hook-form";
import useMutation from "@lib/client/useMutation";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { Stream } from "@prisma/client";

interface CreateForm {
  name: string;
  price: number;
  description: string;
}

interface CreateResponse {
  ok: boolean;
  stream: Stream;
}

const Create: NextPage = () => {
  const router = useRouter();
  const [createStream, { loading, data }] =
    useMutation<CreateResponse>('/api/streams');
  const { register, handleSubmit } = useForm<CreateForm>();
  
  const onValid = (form: CreateForm) => {
    if (loading) return;
    createStream(form);
  };

  useEffect(() => {
    if (data && data.ok) {
      router.push(`/streams/${data.stream.id}`);
    }
  }, [data, router])
  return (
    <Layout canGoBack title="Go Live">
      <form className=" space-y-4 py-10 px-4" onSubmit={handleSubmit(onValid)}>
        <Input
          register={register('name', {
            required: {
              value: true,
              message: '',
            },
            minLength: {
              value: 5,
              message: '',
            },
          })}
          required
          label="Name"
          name="name"
          type="text"
        />
        <Input
          register={register('price', {
            required: {
              value: true,
              message: '',
            },
            valueAsNumber: true,
          })}
          required
          label="Price"
          // placeholder="0.00"
          name="price"
          type="text"
          kind="price"
        />
        <TextArea
          register={register('description', {
            required: {
              value: true,
              message: '',
            },
            minLength: {
              value: 5,
              message: '',
            },
          })}
          name="description"
          label="Description"
        />
        <Button text={loading ? 'Loading...' : 'Go live'} />
      </form>
    </Layout>
  );
};

export default Create;
