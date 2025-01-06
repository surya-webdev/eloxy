import axios from "axios";
import { useEffect, useState } from "react";
import { Product } from "../components/Product";

export function Home() {
  const [product, setProduct] = useState();

  async function getData() {
    const response = await axios.get("http://localhost:3000/api/v1/product/");
    console.log(response?.data.response);
    setProduct(response?.data.response);
  }

  useEffect(() => {
    getData();
  }, []);

  console.log(product);

  if (!product) return <p>...Loading</p>;

  return (
    <>
      <div className="mx-2 my-4">
        {product?.map((item) => <Product data={item} />)}
      </div>
    </>
  );
}
