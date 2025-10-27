import React from "react";
import Input from "@/components/form/Input";
import Button from "@/components/ui/Button";
import { FaTrash, FaPlus, FaTimes } from "react-icons/fa";
import { VariationTypeState } from "@/types/types";

interface VariationManagerProps {
  variationTypes: VariationTypeState[];
  setVariationTypes: React.Dispatch<React.SetStateAction<VariationTypeState[]>>;
}

export default function VariationManager({ variationTypes, setVariationTypes }: VariationManagerProps) {
  const handleAddType = () => {
    setVariationTypes((prev) => [...prev, { name: "", options: [""] }]);
  };

  const handleRemoveType = (index: number) => {
    setVariationTypes((prev) => prev.filter((_, i) => i !== index));
  };

  const handleTypeChange = (index: number, newName: string) => {
    setVariationTypes((prev) => prev.map((type, i) => (i === index ? { ...type, name: newName } : type)));
  };

  const handleAddOption = (typeIndex: number) => {
    setVariationTypes((prev) =>
      prev.map((type, i) => (i === typeIndex ? { ...type, options: [...type.options, ""] } : type))
    );
  };

  const handleRemoveOption = (typeIndex: number, optionIndex: number) => {
    setVariationTypes((prev) =>
      prev.map((type, i) =>
        i === typeIndex ? { ...type, options: type.options.filter((_, j) => j !== optionIndex) } : type
      )
    );
  };

  const handleOptionChange = (typeIndex: number, optionIndex: number, newValue: string) => {
    setVariationTypes((prev) =>
      prev.map((type, i) => {
        if (i === typeIndex) {
          const newOptions = type.options.map((option, j) => (j === optionIndex ? newValue : option));
          return { ...type, options: newOptions };
        }
        return type;
      })
    );
  };

  return (
    <div className="space-y-4">
      {variationTypes.map((type, typeIndex) => (
        <div key={typeIndex} className="p-4 border border-gray-200 rounded-lg bg-gray-50">
          <div className="flex justify-between items-center mb-3">
            <Input
              id={`type-name-${typeIndex}`}
              label="Nama Tipe Variasi (e.g., Warna)"
              placeholder="Warna"
              value={type.name}
              onChange={(e) => handleTypeChange(typeIndex, e.target.value)}
            />
            <button
              type="button"
              onClick={() => handleRemoveType(typeIndex)}
              className="text-red-500 hover:text-red-700 p-2 ml-4 self-end"
              aria-label="Remove Variation Type"
            >
              <FaTrash />
            </button>
          </div>

          <label className="block text-sm font-medium text-gray-700 mt-4">
            Opsi Varian ({type.name || "Tipe Ini"})
          </label>
          <div className="space-y-2 pl-4 border-l-2 border-gray-200 mt-2">
            {type.options.map((option, optionIndex) => (
              <div key={optionIndex} className="flex gap-2 items-center">
                <Input
                  id={`option-value-${typeIndex}-${optionIndex}`}
                  label=""
                  placeholder="Nilai Opsi (e.g., Merah, S)"
                  value={option}
                  onChange={(e) => handleOptionChange(typeIndex, optionIndex, e.target.value)}
                  className="flex-grow"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveOption(typeIndex, optionIndex)}
                  className="text-red-500 hover:text-red-700 p-2"
                  aria-label="Remove Option"
                >
                  <FaTimes />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => handleAddOption(typeIndex)}
              className="text-blue-500 hover:text-blue-700 text-sm flex items-center gap-1 mt-2"
            >
              <FaPlus className="w-3 h-3" /> Tambah Opsi
            </button>
          </div>
        </div>
      ))}

      <Button type="button" onClick={handleAddType} className="bg-green-500 hover:bg-green-600">
        <FaPlus className="w-4 h-4 mr-2" /> Tambah Tipe Variasi
      </Button>
    </div>
  );
}
