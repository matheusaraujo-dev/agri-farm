import React, { useState } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";
import Button from "../components/atoms/Button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/atoms/Card";
import ProducerForm from "../components/organisms/ProducerForm";
import DeleteConfirmDialog from "../components/molecules/DeleteConfirmDialog";
import { Producer } from "../types";
import { formatDocument } from "../utils/validation";
import { useToast } from "@/hooks/use-toast";
import { useProducers } from "@/hooks/useProducers";
import { useFarms } from "@/hooks/useFarms";

const ProducersPage: React.FC = () => {
  const { toast } = useToast();

  const {
    producers,
    createProducerMutation,
    updateProducerMutation,
    deleteProducerMutation,
  } = useProducers();

  const { farms } = useFarms();

  const [showForm, setShowForm] = useState(false);
  const [editingProducer, setEditingProducer] = useState<Producer | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean;
    producer: Producer | null;
  }>({ isOpen: false, producer: null });

  const handleSubmit = async (data: { document: string; name: string }) => {
    try {
      if (editingProducer) {
        updateProducerMutation.mutateAsync({
          ...data,
          producerId: editingProducer.id,
        });
        toast({
          title: "Sucesso!",
          description: "Produtor atualizado com sucesso.",
        });
      } else {
        await createProducerMutation.mutateAsync(data);
        toast({
          title: "Sucesso!",
          description: "Produtor cadastrado com sucesso.",
        });
      }
      setShowForm(false);
      setEditingProducer(null);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Ocorreu um erro ao salvar o produtor.",
      });
    }
  };

  const handleEdit = (producer: Producer) => {
    setEditingProducer(producer);
    setShowForm(true);
  };

  const handleDelete = (producer: Producer) => {
    setDeleteDialog({ isOpen: true, producer });
  };

  const confirmDelete = async () => {
    if (deleteDialog.producer) {
      await deleteProducerMutation.mutateAsync(deleteDialog.producer.id);
      toast({
        title: "Sucesso!",
        description: "Produtor excluído com sucesso.",
      });
    }
    setDeleteDialog({ isOpen: false, producer: null });
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingProducer(null);
  };

  if (showForm) {
    return (
      <div className="container mx-auto px-4 py-8">
        <ProducerForm
          producer={editingProducer || undefined}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Produtores Rurais</h1>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Produtor
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
                Comece cadastrando seu primeiro produtor rural
              </p>
              <Button onClick={() => setShowForm(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Cadastrar Primeiro Produtor
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {producers.map((producer) => {
            const farmsByProducer = farms.filter(
              (farm) => farm.producerId === producer.id
            );
            return (
              <Card key={producer.id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="truncate">{producer.name}</span>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(producer)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(producer)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Documento:</span>
                      <span className="font-mono">
                        {formatDocument(producer.document)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Fazendas:</span>
                      <span>{farmsByProducer.length}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        Cadastrado em:
                      </span>
                      <span>
                        {new Date(producer.createdAt).toLocaleDateString(
                          "pt-BR"
                        )}
                      </span>
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
        onClose={() => setDeleteDialog({ isOpen: false, producer: null })}
        onConfirm={confirmDelete}
        title="Confirmar Exclusão"
        description="Tem certeza que deseja excluir o produtor"
        itemName={deleteDialog.producer?.name}
      />
    </div>
  );
};

export default ProducersPage;
