import ProductsCarousel from "../components/ProductsCarousel";

export default function Home() {
  return (
    <div>
      <h1 className="font-avenir-book text-[45px] text-center mt-16">
        Product List
      </h1>
      <ProductsCarousel />
    </div>
  );
}
