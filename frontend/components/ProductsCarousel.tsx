"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronRightIcon, ChevronLeftIcon } from "lucide-react";

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
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => {
      let newVisibleCount;
      if (window.innerWidth < 768) {
        newVisibleCount = 2; // sm: show 2 product
      } else if (window.innerWidth < 1024) {
        newVisibleCount = 3; // md: show 3 product
      } else {
        newVisibleCount = 4; // lg: show 4 product
      }

      setVisibleCount(newVisibleCount);

      setCurrentIndex((prev) => {
        const maxIndex = products.length - newVisibleCount;
        return Math.min(prev, maxIndex);
      });
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [products.length]);

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

  const nextProducts = () => {
    if (scrollRef.current) {
      const containerWidth = scrollRef.current.clientWidth;
      const itemWidth = containerWidth / visibleCount;
      const currentScroll = scrollRef.current.scrollLeft;
      const nextScroll = currentScroll + itemWidth;

      scrollRef.current.scrollTo({
        left: nextScroll,
        behavior: "smooth",
      });
    }
  };

  const prevProducts = () => {
    if (scrollRef.current) {
      const containerWidth = scrollRef.current.clientWidth;
      const itemWidth = containerWidth / visibleCount;
      const currentScroll = scrollRef.current.scrollLeft;
      const prevScroll = currentScroll - itemWidth;

      scrollRef.current.scrollTo({
        left: Math.max(0, prevScroll),
        behavior: "smooth",
      });
    }
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
    <div className="relative p-4 md:p-8 mx-auto max-w-[1600px]">
      <div
        ref={scrollRef}
        className="overflow-x-auto pl-4 pr-4 md:pl-16 md:pr-16 w-full max-w-6xl mx-auto pb-4 md:pb-12 custom-scrollbar"
      >
        <div className="flex gap-4 md:gap-16">
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
                  className="rounded-xl w-full h-32 sm:h-40 md:h-44 lg:h-48 object-cover"
                />
                <p className="text-xs sm:text-sm text-gray-500 mt-2 sm:mt-3 font-montserrat-medium">
                  {product.name}
                </p>
                <p className="text-xs sm:text-sm text-gray-500 mt-2 sm:mt-3 font-montserrat-regular">
                  ${product.price} USD
                </p>
                <div className="mt-2 sm:mt-4 flex gap-1 sm:gap-2">
                  {COLORS.map((color) => (
                    <div
                      key={color.hex}
                      className="w-3 h-3 sm:w-4 sm:h-4 rounded-full cursor-pointer"
                      style={{
                        backgroundColor: color.hex,
                        boxShadow:
                          (selectedColors[index] || "yellow") === color.value
                            ? "0 0 0 1px white, 0 0 0 2px #6b7280"
                            : "none",
                      }}
                      onClick={() => handleColorClick(index, color.value)}
                    ></div>
                  ))}
                </div>
                <p className="font-avenir-book text-[10px] sm:text-[12px] mt-2 sm:mt-3">
                  {getColorName(selectedColors[index] || "yellow")}
                </p>

                <div className="flex items-center gap-1 mt-1 sm:mt-2">
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
                            className="w-3 h-3 sm:w-4 sm:h-4 text-gray-300"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          {isFullStar && (
                            <svg
                              className="w-3 h-3 sm:w-4 sm:h-4 absolute top-0 left-0"
                              fill="#F6D6A8"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          )}
                          {isHalfStar && star === Math.ceil(rating) && (
                            <svg
                              className="w-3 h-3 sm:w-4 sm:h-4 absolute top-0 left-0"
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
                  <span className="font-avenir-book text-[12px] sm:text-[14px] ml-1">
                    {calculateRating(product.popularityScore).toFixed(1)}/5
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <button
        onClick={nextProducts}
        className="hidden md:block absolute right-1 md:right-2 lg:right-8 xl:right-14 top-1/2 transform -translate-y-1/2 z-10 p-2 md:p-3 opacity-80 hover:opacity-100 cursor-pointer transition-opacity duration-200 "
      >
        <ChevronRightIcon className="w-6 h-6 md:w-8 md:h-8" strokeWidth={1} />
      </button>
      <button
        onClick={prevProducts}
        className="hidden md:block absolute left-1 md:left-2 lg:left-8 xl:left-14 top-1/2 transform -translate-y-1/2 z-10 p-2 md:p-3 opacity-80 hover:opacity-100 cursor-pointer transition-opacity duration-200"
      >
        <ChevronLeftIcon className="w-6 h-6 md:w-8 md:h-8" strokeWidth={1} />
      </button>
    </div>
  );
}
