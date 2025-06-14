import React, { useState } from "react";
import { Plus, Trash2, Calendar } from "lucide-react";
import Button from "../components/atoms/Button";
import Input from "../components/atoms/Input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/atoms/Card";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFarms } from "@/hooks/useFarms";
import { useHarvests } from "@/hooks/useHarvests";
import { useCrops } from "@/hooks/useCrops";
import { HarvestCropFrom } from "@/components/organisms/HarvestCropFrom";
import { HarvestCropListEdit } from "@/components/organisms/HarvestCropListEdit";
import DeleteConfirmDialog from "@/components/molecules/DeleteConfirmDialog";

const CropsPage: React.FC = () => {
  const { toast } = useToast();

  const { crops: allCrops } = useCrops();

  const { farms } = useFarms();
  const {
    harvests,
    deleteHarvestMutation,
    createHarvestMutation,
    addCropsToHarvestMutation,
    updateCropsHarvestMutation,
    deleteCropsHarvestMutation,
  } = useHarvests();

  const [showHarvestForm, setShowHarvestForm] = useState(false);
  const [showCropFormForHarvest, setShowCropFormForHarvest] = useState<
    number | null
  >(null);
  const [selectedFarmId, setSelectedFarmId] = useState<number | null>(null);
  const [harvestData, setHarvestData] = useState({
    year: new Date().getFullYear(),
    name: "",
  });

  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean;
    item: { id: number; name: string } | null;
  }>({ isOpen: false, item: null });

  const handleAddHarvest = async () => {
    if (!selectedFarmId || !harvestData.name || !harvestData.year) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Preencha todos os campos obrigatórios.",
      });
      return;
    }

    const form = {
      farmId: selectedFarmId,
      baseYear: harvestData.year,
      name: harvestData.name,
    };
    await createHarvestMutation.mutateAsync(form);

    toast({
      title: "Sucesso!",
      description: "Safra cadastrada com sucesso.",
    });

    setHarvestData({ year: new Date().getFullYear(), name: "" });
    setShowHarvestForm(false);
  };

  const handleUpdateCrop = async (input: {
    farmId: number;
    harvestId: number;
    newCropId: number;
    oldCropId: number;
  }) => {
    try {
      const { farmId, harvestId, newCropId, oldCropId } = input;
      await updateCropsHarvestMutation.mutateAsync({
        harvestId,
        farmId,
        newCropId,
        oldCropId,
      });
    } catch {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível atualizar a cultura.",
      });
    }
  };

  const handleAddCrop = async ({
    harvestId,
    cropId,
    farmId,
  }: {
    harvestId: number;
    farmId: number;
    cropId: number;
  }) => {
    try {
      await addCropsToHarvestMutation.mutateAsync({
        harvestId,
        farmId,
        cropId,
      });

      toast({
        title: "Sucesso!",
        description: "Cultura cadastrada com sucesso.",
      });

      setShowCropFormForHarvest(null);
    } catch {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível cadastrar a cultura.",
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Safras e Culturas</h1>
        <Button
          onClick={() => setShowHarvestForm(true)}
          disabled={farms.length === 0}
        >
          <Plus className="mr-2 h-4 w-4" />
          Nova Safra
        </Button>
      </div>

      {farms.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">
                Nenhuma fazenda cadastrada
              </h3>
              <p className="text-muted-foreground mb-4">
                Para cadastrar safras e culturas, você precisa ter pelo menos
                uma fazenda cadastrada
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Formulário de Nova Safra */}
          {showHarvestForm && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Nova Safra</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-sm font-medium">Fazenda *</label>
                    <Select
                      value={selectedFarmId ? String(selectedFarmId) : ""}
                      onValueChange={(v) => setSelectedFarmId(Number(v))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma fazenda" />
                      </SelectTrigger>
                      <SelectContent>
                        {farms.map((farm) => (
                          <SelectItem key={farm.id} value={String(farm.id)}>
                            {farm.name} - {farm.producer?.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Input
                    label="Ano da Safra"
                    type="number"
                    min="2000"
                    max="2030"
                    value={harvestData.year}
                    onChange={(e) =>
                      setHarvestData((prev) => ({
                        ...prev,
                        year: parseInt(e.target.value),
                      }))
                    }
                    required
                  />

                  <Input
                    label="Nome da Safra"
                    value={harvestData.name}
                    onChange={(e) =>
                      setHarvestData((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    placeholder="Ex: Safra 2024"
                    required
                  />
                </div>

                <div className="flex gap-2 mt-4">
                  <Button onClick={handleAddHarvest}>Cadastrar Safra</Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowHarvestForm(false)}
                  >
                    Cancelar
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Lista de Safras e Culturas */}
          <div className="space-y-6">
            {farms.map((farm) => {
              const farmHarvests = harvests.filter((h) => h.farmId === farm.id);

              if (farmHarvests.length === 0) return null;

              return (
                <Card key={farm.id}>
                  <CardHeader>
                    <CardTitle>
                      {farm.name} - {farm.producer?.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {farmHarvests.map((harvest) => {
                        const harvestCrops = harvest.crops || [];

                        const availableCrops = allCrops.filter(
                          (crop) =>
                            !harvestCrops.some((hc) => hc.id === crop.id)
                        );

                        return (
                          <div
                            key={harvest.id}
                            className="border rounded-lg p-4"
                          >
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <span className="font-medium">
                                  {harvest.name} ({harvest.baseYear})
                                </span>
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    setShowCropFormForHarvest(harvest.id)
                                  }
                                >
                                  <Plus className="mr-2 h-4 w-4" />
                                  Nova Cultura
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    setDeleteDialog({
                                      isOpen: true,
                                      item: {
                                        id: harvest.id,
                                        name: harvest.name,
                                      },
                                    })
                                  }
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>

                            {/* Formulário de Nova Cultura para esta safra */}
                            {showCropFormForHarvest === harvest.id && (
                              <HarvestCropFrom
                                farmId={farm.id}
                                harvestId={harvest.id}
                                availableCrops={availableCrops}
                                onCancel={() => {
                                  setShowCropFormForHarvest(null);
                                }}
                                onSubmit={handleAddCrop}
                              />
                            )}

                            {harvestCrops.length === 0 ? (
                              <p className="text-sm text-muted-foreground">
                                Nenhuma cultura cadastrada nesta safra
                              </p>
                            ) : (
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                                {harvestCrops.map((crop) => (
                                  <HarvestCropListEdit
                                    farmId={farm.id}
                                    harvestId={harvest.id}
                                    key={crop.id}
                                    availableCrops={availableCrops}
                                    crop={crop}
                                    onSubmit={handleUpdateCrop}
                                    onDelete={async () =>
                                      deleteCropsHarvestMutation.mutateAsync({
                                        farmId: farm.id,
                                        harvestId: harvest.id,
                                        cropId: crop.id,
                                      })
                                    }
                                  />
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </>
      )}
      <DeleteConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={() => setDeleteDialog({ isOpen: false, item: null })}
        onConfirm={() => {
          if (!deleteDialog.item) return;
          deleteHarvestMutation.mutateAsync({
            harvestId: deleteDialog.item.id,
          });
        }}
        title={`Confirmar Exclusão da Safra`}
        description={`Tem certeza que deseja excluir a Safra?`}
        itemName={deleteDialog.item?.name}
      />
    </div>
  );
};

export default CropsPage;
