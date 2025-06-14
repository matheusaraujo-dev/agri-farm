import { Crop } from "@/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import Button from "../atoms/Button";
import { Check, Edit, Trash2, X } from "lucide-react";
import { useState } from "react";
import DeleteConfirmDialog from "../molecules/DeleteConfirmDialog";

interface Props {
  crop: Crop;
  availableCrops: Crop[];
  farmId: number;
  harvestId: number;
  onSubmit: (input: {
    farmId: number;
    harvestId: number;
    newCropId: number;
    oldCropId: number;
  }) => Promise<void>;

  onDelete: (input: {
    farmId: number;
    harvestId: number;
    cropId: number;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  }) => any;
}

export function HarvestCropListEdit({
  crop,
  availableCrops,
  farmId,
  harvestId,
  onSubmit,
  onDelete,
}: Props) {
  const [currentCropId, setCurrentCropId] = useState(crop.id);
  const [isEditing, setIsEditing] = useState(false);

  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean;
    item: Crop | null;
  }>({
    isOpen: false,
    item: null,
  });

  const onCancelEdit = () => {
    setCurrentCropId(crop.id);
    setIsEditing(false);
  };

  const handleUpdate = async () => {
    await onSubmit({
      farmId,
      harvestId,
      newCropId: currentCropId,
      oldCropId: crop.id,
    });
    setIsEditing(false);
  };

  const handleDelete = async () => {
    await onDelete({
      farmId,
      harvestId,
      cropId: crop.id,
    });
    setIsEditing(false);
  };

  return (
    <>
      <div
        key={crop.id}
        className="flex items-center justify-between bg-muted rounded p-2"
      >
        {isEditing ? (
          <div className="flex items-center gap-2 flex-1">
            <Select
              value={String(currentCropId)}
              onValueChange={(value) => setCurrentCropId(Number(value))}
            >
              <SelectTrigger className="h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[...availableCrops, crop].map((crop) => (
                  <SelectItem key={crop.id} value={String(crop.id)}>
                    {crop.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="ghost" size="sm" onClick={handleUpdate}>
              <Check className="h-3 w-3" />
            </Button>
            <Button variant="ghost" size="sm" onClick={onCancelEdit}>
              <X className="h-3 w-3" />
            </Button>
          </div>
        ) : (
          <>
            <span className="font-medium">{crop.name}</span>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing(true)}
              >
                <Edit className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setDeleteDialog({ isOpen: true, item: crop })}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </>
        )}
      </div>

      <DeleteConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={() => setDeleteDialog({ isOpen: false, item: null })}
        onConfirm={handleDelete}
        title={`Confirmar Exclusão da Cultura`}
        description={`Tem certeza que deseja excluir a Cultura`}
        itemName={deleteDialog.item?.name}
      />
    </>
  );
}
