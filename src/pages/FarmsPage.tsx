/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { Plus, Edit, Trash2, MapPin } from "lucide-react";
import Button from "../components/atoms/Button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/atoms/Card";
import FarmForm from "../components/organisms/FarmForm";
import DeleteConfirmDialog from "../components/molecules/DeleteConfirmDialog";
import { Farm } from "../types";
import { useToast } from "@/hooks/use-toast";
import { formatDocument } from "../utils/validation";
import { useProducers } from "@/hooks/useProducers";
import { useFarms } from "@/hooks/useFarms";

const FarmsPage: React.FC = () => {
  const { toast } = useToast();

  const { producers } = useProducers();
  const { farms, createFarmMutation, updateFarmMutation, deleteFarmMutation } =
    useFarms();

  const [showForm, setShowForm] = useState(false);
  const [editingFarm, setEditingFarm] = useState<Farm | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean;
    farm: Farm | null;
  }>({ isOpen: false, farm: null });

  const handleSubmit = async (data: any) => {
    try {
      if (editingFarm) {
        await updateFarmMutation.mutateAsync({
          ...data,
          farmId: editingFarm.id,
        });
        toast({
          title: "Sucesso!",
          description: "Fazenda atualizada com sucesso.",
        });
      } else {
        await createFarmMutation.mutateAsync(data);
        toast({
          title: "Sucesso!",
          description: "Fazenda cadastrada com sucesso.",
        });
      }
      setShowForm(false);
      setEditingFarm(null);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Ocorreu um erro ao salvar a fazenda.",
      });
    }
  };

  const handleEdit = (farm: Farm) => {
    setEditingFarm(farm);
    setShowForm(true);
  };

  const handleDelete = (farm: Farm) => {
    setDeleteDialog({ isOpen: true, farm });
  };

  const confirmDelete = async () => {
    if (deleteDialog.farm) {
      await deleteFarmMutation.mutateAsync(deleteDialog.farm.id);
      toast({
        title: "Sucesso!",
        description: "Fazenda excluída com sucesso.",
      });
    }
    setDeleteDialog({ isOpen: false, farm: null });
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingFarm(null);
  };

  const producersForSelect = producers.map((p) => ({
    id: p.id,
    name: p.name,
    document: formatDocument(p.document),
  }));

  if (showForm) {
    return (
      <div className="container mx-auto px-4 py-8">
        <FarmForm
          farm={editingFarm || undefined}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          producers={producersForSelect}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Fazendas</h1>
        <Button
          onClick={() => setShowForm(true)}
          disabled={producers.length === 0}
        >
          <Plus className="mr-2 h-4 w-4" />
          Nova Fazenda
        </Button>
      </div>

      {producers.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">
                Nenhum produtor cadastrado
              </h3>
              <p className="text-muted-foreground mb-4">
                Para cadastrar fazendas, você precisa ter pelo menos um produtor
                cadastrado
              </p>
            </div>
          </CardContent>
        </Card>
      ) : farms.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">
                Nenhuma fazenda cadastrada
              </h3>
              <p className="text-muted-foreground mb-4">
                Comece cadastrando sua primeira fazenda
              </p>
              <Button onClick={() => setShowForm(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Cadastrar Primeira Fazenda
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {farms.map((farm) => {
            return (
              <Card key={farm.id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="truncate">{farm.name}</span>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(farm)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(farm)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {farm.city}, {farm.state}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Produtor:</span>
                      <span className="truncate ml-2">
                        {farm.producer?.name}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Área Total:</span>
                      <span>{farm.totalArea.toFixed(2)} ha</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        Agricultável:
                      </span>
                      <span>{farm.cultivatedArea.toFixed(2)} ha</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Vegetação:</span>
                      <span>{farm.vegetationArea.toFixed(2)} ha</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <DeleteConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={() => setDeleteDialog({ isOpen: false, farm: null })}
        onConfirm={confirmDelete}
        title="Confirmar Exclusão"
        description="Tem certeza que deseja excluir a fazenda"
        itemName={deleteDialog.farm?.name}
      />
    </div>
  );
};

export default FarmsPage;
