export function Product({ data }: Readonly<{ children: React.ReactNode }>) {
  const { image, price, name, description, id } = data;

  return (
    <div>
      <img src={image} alt={name} />
      <p>{name}</p>
      <p>{price}</p>
      <button className="rounded-md bg-black px-6 py-2 text-white">
        Buy Now
      </button>
    </div>
  );
}
