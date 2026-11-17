"use client";

import Image from "next/image";
import { useState } from "react";

export default function ProductGallery({
  images,
  productName,
}: {
  images: string[];
  productName: string;
}) {
  const [selectedImage, setSelectedImage] = useState(images[0] ?? "");
  const selectedIndex = images.indexOf(selectedImage);

  if (!selectedImage) {
    return <div className="product-detail-image-empty" aria-hidden="true" />;
  }

  return (
    <div className="product-detail-gallery">
      <div className="product-detail-image">
        <Image
          alt={`${productName} - image ${selectedIndex + 1}`}
          fill
          priority
          sizes="(max-width: 760px) 100vw, 55vw"
          src={selectedImage}
        />
      </div>
      {images.length > 1 && (
        <div className="product-detail-thumbnails" role="group" aria-label={`${productName} photos`}>
          {images.map((image, index) => (
            <button
              aria-label={`Show product image ${index + 1}`}
              aria-pressed={selectedImage === image}
              className={selectedImage === image ? "is-selected" : ""}
              key={`${image}-${index}`}
              onClick={() => setSelectedImage(image)}
              type="button"
            >
              <Image alt="" fill sizes="100px" src={image} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
