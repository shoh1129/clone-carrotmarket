import { useState } from "react";

interface useMutationState<T> {
  loading: boolean;
  data?: T;
  error?: undefined | any;
}

type useMutationResult<T> = [(data: any) => void, useMutationState<T>];

export default function useMutation<T = any>(
  url: string
):useMutationResult<T> {
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<undefined | any>(undefined);
  const [error, setError] = useState<undefined | any>(undefined);
  function mutation(data: any) {
    setLoading(true);
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then((repsonse) => repsonse.json().catch(() => {}))
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }
  return [mutation, { loading, data, error }];
};