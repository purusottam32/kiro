"use client";

import React from "react";
import Image, { StaticImageData } from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import companies from "@/data/companies.json";

type Company = {
  id: number | string;
  name: string;
  path: string | StaticImageData;
};

const CompanyCarousel: React.FC = () => {
  const items: Company[] = companies;

  return (
    <Carousel
      plugins={[
        Autoplay({
          delay: 2000,
          stopOnInteraction: false,
        }),
      ]}
      className="w-full py-10"
    >
      <CarouselContent className="flex items-center gap-5 sm:gap-20">
        {items.map(({ id, name, path }) => (
          <CarouselItem
            key={id}
            className="basis-1/3 sm:basis-1/4 md:basis-1/5 lg:basis-1/6"
          >
            <div className="relative h-9 sm:h-14 w-full">
              <Image
                src={path}
                alt={name}
                fill
                className="object-contain"
                sizes="(max-width: 640px) 33vw,
                       (max-width: 768px) 25vw,
                       (max-width: 1024px) 20vw,
                       16vw"
                priority={false}
              />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
};

export default CompanyCarousel;
