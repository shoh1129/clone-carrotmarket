import type { NextPage } from "next";
import Button from "../../components/button";
import Layout from "../../components/layout";
import { useRouter } from "next/router";
import useSWR, { useSWRConfig } from 'swr';
import { Product, User } from "@prisma/client";
import Link from "next/link";
import useMutation from "@lib/client/useMutation";
import { cls, getBulrImageURL, getImageURL } from "@lib/client/utils";
import Image from "next/image";

interface ProductWithUser extends Product {
  user: User;
}

interface ItemDetailResponese {
  ok: boolean;
  product: ProductWithUser;
  relatedProducts: Product[];
  isLiked: boolean;
}

const ItemDetail: NextPage = () => {
  const router = useRouter();
  const { query } = router;
  const { mutate } = useSWRConfig();
  const { data, mutate: boundMutate } = useSWR<ItemDetailResponese>(query.id ? `/api/products/${query.id}` : '');
  const [toggleFav, { loading: favLoading, data: favData, error: favError }] = useMutation(`/api/products/${query.id}/fav`);
  const onFavClick = () => {
    if (!data) return;
    if (favLoading) return;
    boundMutate((prev) => prev && { ...prev, isLiked: !prev.isLiked }, false);
    // mutate("/api/users/me", (prev: any) => ({ ok: !prev?.ok }), false);
    toggleFav({});
  }


  return (
    <Layout canGoBack>
      <div className="px-4  py-4">
        <div className="mb-8">
          {
            data && data.product && data.product.image ? (
              <div className="relative pb-80">
                <Image
                  alt="productItemImg"
                  src={getImageURL(data.product.image, 'product')}
                  className="h-96 object-cover"
                  layout="fill"
                  placeholder="blur"
                  blurDataURL={getBulrImageURL()}
                />
              </div>
            ) : (
              <div className="h-96 bg-slate-300" />
            )
          }
          <div className="flex cursor-pointer py-3 border-t border-b items-center space-x-3">
            {
              data && data.product && data.product.user && data.product.user.avatar ? (
                <Image
                  alt="profileImg"
                  width={48}
                  height={48}
                  src={getImageURL(data.product.user.avatar, 'avatar')}
                  className="w-12 h-12 rounded-full bg-slate-300"
                  placeholder="blur"
                  blurDataURL={getBulrImageURL()}
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-slate-300" />
              )
            }
            <div>
              <p className="text-sm font-medium text-gray-700">
                {data?.product?.user?.name}
              </p>
              <Link legacyBehavior href={`/users/profiles/${data?.product?.user?.id}`}>
                <a className="text-xs font-medium text-gray-500">
                  View profile &rarr;
                </a>
              </Link>
            </div>
          </div>
          <div className="mt-5">
            <h1 className="text-3xl font-bold text-gray-900">
              {data?.product?.name}
            </h1>
            <span className="text-2xl block mt-3 text-gray-900">
              ${data?.product?.price}
            </span>
            <p className=" my-6 text-gray-700">
              {data?.product?.description}
            </p>
            <div className="flex items-center justify-between space-x-2">
              <Button large text="Talk to seller" />
              <button
                onClick={onFavClick}
                className={cls(
                  'p-3 rounded-md flex items-center justify-center',
                  data?.isLiked ?
                  'text-red-500 hover:bg-red-100 hover:text-red-600' :
                  'text-gray-400 hover:bg-gray-100 hover:text-gray-500'
                )}>

              {
                data?.isLiked ? (
                  <svg
                  className="w-6 h-6"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  >
                    <path
                      d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25
                      8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739
                      9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z"
                    />
                  </svg>
                ) : (
                  <svg
                    className="h-6 w-6 "
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                )
              }
              </button>
            </div>
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Similar items</h2>
          <div className=" mt-6 grid grid-cols-2 gap-4">
            {data?.relatedProducts?.map((product: Product, i: number) => (
              <Link legacyBehavior href={`/products/${product.id}`} key={product.id}>
                <a>
                  <div key={product.id}>
                    <div className="h-56 w-full mb-4 bg-slate-300" />
                    <h3 className="text-gray-700 -mb-1">{product.name}</h3>
                    <span className="text-sm font-medium text-gray-900">${product.price}</span>
                  </div>
                </a>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ItemDetail;
