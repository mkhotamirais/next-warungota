import React, { useState } from "react";
import Image from "next/image";
import { FaTrash, FaTimes } from "react-icons/fa";
import Input from "@/components/form/Input";
import { Variant } from "@/types/types";

interface VariantRowProps {
  variant: Variant;
  index: number;
  onChange: (index: number, updatedVariant: Variant) => void;
  onRemove: (index: number) => void;
  errors:
    | { price?: { errors: string[] }; stock?: { errors: string[] }; variantImage?: { errors: string[] } }
    | undefined;
}

export default function VariantRow({ variant, index, onChange, onRemove, errors }: VariantRowProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(variant.variantImageUrl || null);

  const handleInputChange = (field: keyof Variant, value: string | File | null) => {
    onChange(index, { ...variant, [field]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }

    setImagePreview(URL.createObjectURL(file));
    handleInputChange("variantImageFile", file || null);
  };

  const optionTags = variant.options.map((opt, i) => (
    <span key={i} className="bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded">
      {opt.typeName}: {opt.optionValue}
    </span>
  ));

  return (
    <div className="border border-gray-300 p-4 rounded-lg mb-4 bg-white shadow-sm relative">
      <h4 className="font-semibold text-lg mb-3">Varian #{index + 1}</h4>

      <button
        aria-label="hapus"
        type="button"
        onClick={() => onRemove(index)}
        className="absolute right-3 top-3 text-red-500 hover:text-red-700"
      >
        <FaTrash />
      </button>

      <div className="flex flex-wrap gap-2 mb-3">{optionTags}</div>

      <div className="flex gap-4">
        <Input
          id={`variant-price-${index}`}
          label="Harga Varian"
          placeholder="Harga"
          value={String(variant.price)}
          onChange={(e) => handleInputChange("price", e.target.value)}
          error={errors?.price?.errors}
          className="w-1/3"
        />
        <Input
          id={`variant-stock-${index}`}
          label="Stok Varian"
          placeholder="Stok"
          value={String(variant.stock)}
          onChange={(e) => handleInputChange("stock", e.target.value)}
          error={errors?.stock?.errors}
          className="w-1/3"
        />

        <div className="w-1/3">
          <label htmlFor={`variant-image-${index}`} className="block text-sm font-medium text-gray-700">
            Gambar Varian
          </label>
          <input
            id={`variant-image-${index}`}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          {imagePreview && (
            <div className="relative mt-2 w-16 h-16">
              <Image src={imagePreview} alt="Varian Preview" fill className="object-cover rounded" />
              <button
                aria-label="hapus gambar"
                type="button"
                onClick={() => handleInputChange("variantImage", null)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
              >
                <FaTimes className="w-2 h-2" />
              </button>
            </div>
          )}
          {errors?.variantImage?.errors && <p className="mt-1 text-sm text-red-600">{errors.variantImage.errors[0]}</p>}
        </div>
      </div>
    </div>
  );
}
