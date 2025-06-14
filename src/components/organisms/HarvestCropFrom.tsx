import { Crop } from "@/types";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface Props {
  farmId: number;
  harvestId: number;
  availableCrops: Crop[];
  onCancel: () => void;
  onSubmit: (input: {
    cropId: number;
    farmId: number;
    harvestId: number;
  }) => Promise<void>;
}

export function HarvestCropFrom({
  availableCrops,
  onCancel,
  onSubmit,
  farmId,
  harvestId,
}: Props) {
  const [currentCropId, setCurrentCropId] = useState(0);
  const { toast } = useToast();

  const handleAddCrop = async () => {
    if (!currentCropId) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Selecione uma cultura.",
      });
      return;
    }

    await onSubmit({
      harvestId,
      farmId,
      cropId: currentCropId,
    });
  };

  return (
    <div className="mb-4 p-4 bg-muted rounded-lg">
      <h4 className="font-medium mb-3">Adicionar Nova Cultura</h4>
      <div className="flex gap-2 items-end">
        <div className="flex-1 space-y-1">
          <label className="text-sm font-medium">Cultura *</label>
          <Select
            value={currentCropId ? String(currentCropId) : ""}
            onValueChange={(value) => setCurrentCropId(Number(value))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione uma cultura" />
            </SelectTrigger>
            <SelectContent>
              {availableCrops.map((crop) => (
                <SelectItem key={crop.id} value={String(crop.id)}>
                  {crop.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button onClick={handleAddCrop} size="sm">
          Cadastrar
        </Button>
        <Button variant="outline" size="sm" onClick={onCancel}>
          Cancelar
        </Button>
      </div>
    </div>
  );
}
