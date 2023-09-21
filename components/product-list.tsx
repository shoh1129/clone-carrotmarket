import { ProductWithFav } from 'pages';
import useSWR from 'swr';
import Item from './item';

interface ProductListProps {
  kind: 'favs' | 'sales' | 'purchases';
}

interface Record {
  id: number;
  product: ProductWithFav;
}
interface ProductListResponse {
  [key: string]: Record[];
}

const ProductList = ({ kind }: ProductListProps) => {
  const { data } = useSWR<ProductListResponse>(`/api/users/me/${kind}`);
  return data ? data.items?.map((record, i) => (
    <Item
      id={record.product.id}
      key={record.id}
      title={record.product.name}
      price={record.product.price}
      hearts={record.product._count.favs}
    />
  ))
  : null
};

export default ProductList;