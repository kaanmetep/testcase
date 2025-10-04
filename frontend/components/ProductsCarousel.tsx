"use client";

import { useState, useEffect } from "react";

const COLORS = [
  {
    value: "yellow",
    hex: "#E6CA97",
  },
  {
    value: "white",
    hex: "#D9D9D9",
  },
  {
    value: "rose",
    hex: "#E1A4A9",
  },
];

interface Product {
  name: string;
  popularityScore: number;
  weight: number;
  images: {
    yellow: string;
    rose: string;
    white: string;
  };
  price: number;
  priceCurrency: string;
  calculatedAt: string;
}

export default function ProductsCarousel() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedColors, setSelectedColors] = useState<{
    [key: number]: string;
  }>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(4);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setVisibleCount(2); // sm: show 2 product
      } else if (window.innerWidth < 1024) {
        setVisibleCount(3); // md: show 3 product
      } else {
        setVisibleCount(4); // lg: show 4 product
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch("http://localhost:5001/api/products");
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleColorClick = (productIndex: number, colorValue: string) => {
    setSelectedColors((prev) => ({
      ...prev,
      [productIndex]: colorValue,
    }));
  };

  const getProductImage = (product: Product, productIndex: number) => {
    const selectedColor = selectedColors[productIndex] || "yellow";
    return product.images[selectedColor as keyof typeof product.images];
  };

  const getColorName = (colorValue: string) => {
    const colorMap: { [key: string]: string } = {
      yellow: "Yellow Gold",
      white: "White Gold",
      rose: "Rose Gold",
    };
    return colorMap[colorValue] || "Yellow Gold";
  };

  const calculateRating = (popularityScore: number) => {
    return Math.round(popularityScore * 10) / 2;
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center py-20">
        <div className="flex space-x-2 mb-4">
          <div
            className="w-3 h-3 rounded-full animate-pulse"
            style={{ backgroundColor: "#E6CA97", animationDelay: "0s" }}
          ></div>
          <div
            className="w-3 h-3 rounded-full animate-pulse"
            style={{ backgroundColor: "#D9D9D9", animationDelay: "0.2s" }}
          ></div>
          <div
            className="w-3 h-3 rounded-full animate-pulse"
            style={{ backgroundColor: "#E1A4A9", animationDelay: "0.4s" }}
          ></div>
        </div>
        <p className="text-gray-500 font-avenir-medium">Loading</p>
      </div>
    );
  }

  return (
    <div className="relative p-8">
      <div className="overflow-x-auto px-12 w-full max-w-6xl mx-auto pb-12 custom-scrollbar">
        <div
          className="flex gap-16 transition-transform duration-500 ease-in-out"
          style={{
            transform: `translateX(-${currentIndex * (100 / visibleCount)}%)`,
          }}
        >
          {products.map((product, index) => {
            return (
              <div
                key={index}
                className="flex-shrink-0"
                style={{ width: `calc(${100 / visibleCount}% - 32px)` }}
              >
                <img
                  src={getProductImage(product, index)}
                  alt={product.name}
                  className="rounded-xl w-full  object-cover"
                />
                <p className="text-sm text-gray-500 mt-3 font-montserrat-medium text-[15px]">
                  {product.name}
                </p>
                <p className="text-sm text-gray-500 mt-3 font-montserrat-regular text-[15px]">
                  ${product.price} USD
                </p>
                <div className="mt-4 flex gap-2">
                  {COLORS.map((color) => (
                    <div
                      key={color.hex}
                      className="w-4 h-4 rounded-full cursor-pointer"
                      style={{
                        backgroundColor: color.hex,
                        boxShadow:
                          (selectedColors[index] || "yellow") === color.value
                            ? "0 0 0 2px white, 0 0 0 3px #6b7280"
                            : "none",
                      }}
                      onClick={() => handleColorClick(index, color.value)}
                    ></div>
                  ))}
                </div>
                <p className="font-avenir-book text-[12px] mt-3">
                  {getColorName(selectedColors[index] || "yellow")}
                </p>

                <div className="flex items-center gap-1 mt-2">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => {
                      const rating = calculateRating(product.popularityScore);
                      const isHalfStar = rating % 1 >= 0.5 && rating % 1 < 1;
                      const isFullStar =
                        star <= Math.floor(rating) ||
                        (star === Math.ceil(rating) && !isHalfStar);

                      return (
                        <div key={star} className="relative">
                          <svg
                            className="w-4 h-4 text-gray-300"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          {isFullStar && (
                            <svg
                              className="w-4 h-4 absolute top-0 left-0"
                              fill="#F6D6A8"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          )}
                          {isHalfStar && star === Math.ceil(rating) && (
                            <svg
                              className="w-4 h-4 absolute top-0 left-0"
                              fill="#F6D6A8"
                              viewBox="0 0 20 20"
                              style={{ clipPath: "inset(0 50% 0 0)" }}
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  <span className="font-avenir-book text-[14px] ml-1">
                    {calculateRating(product.popularityScore).toFixed(1)}/5
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
