import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Input from "../atoms/Input";
import Button from "../atoms/Button";
import { Card, CardContent, CardHeader, CardTitle } from "../atoms/Card";
import { Farm } from "../../types";
import { validateAreaConstraints } from "../../utils/validation";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FarmFormData {
  name: string;
  city: string;
  state: string;
  address: string;
  totalArea: number;
  cultivatedArea: number;
  vegetationArea: number;
  producerId: number;
}

interface FarmFormProps {
  farm?: Farm;
  producerId?: number;
  onSubmit: (data: FarmFormData) => void;
  onCancel: () => void;
  producers: Array<{ id: number; name: string; document: string }>;
}

const brazilianStates = [
  "AC",
  "AL",
  "AP",
  "AM",
  "BA",
  "CE",
  "DF",
  "ES",
  "GO",
  "MA",
  "MT",
  "MS",
  "MG",
  "PA",
  "PB",
  "PR",
  "PE",
  "PI",
  "RJ",
  "RN",
  "RS",
  "RO",
  "RR",
  "SC",
  "SP",
  "SE",
  "TO",
];

const FarmForm: React.FC<FarmFormProps> = ({
  farm,
  producerId,
  onSubmit,
  onCancel,
  producers,
}) => {
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
  } = useForm<FarmFormData>({
    defaultValues: {
      name: farm?.name || "",
      city: farm?.city || "",
      state: farm?.state || "",
      address: farm?.address || "",
      totalArea: farm?.totalArea || 0,
      cultivatedArea: farm?.cultivatedArea || 0,
      vegetationArea: farm?.vegetationArea || 0,
      producerId: producerId || farm?.producerId || 0,
    },
  });

  const watchedTotalArea = watch("totalArea");
  const watchedArableArea = watch("cultivatedArea");
  const watchedVegetationArea = watch("vegetationArea");
  const watchedProducerId = watch("producerId");

  // Registrar o campo producerId para validação
  React.useEffect(() => {
    register("producerId", { required: "Selecione um produtor" });
  }, [register]);

  const validateForm = (data: FarmFormData) => {
    if (
      !validateAreaConstraints(
        data.totalArea,
        data.cultivatedArea,
        data.vegetationArea
      )
    ) {
      toast({
        variant: "destructive",
        title: "Erro de validação",
        description:
          "A soma das áreas agricultável e de vegetação não pode ultrapassar a área total",
      });
      return false;
    }

    return true;
  };

  const handleFormSubmit = (data: FarmFormData) => {
    if (validateForm(data)) {
      onSubmit(data);
    }
  };

  const handleProducerChange = (value: number) => {
    setValue("producerId", value);
  };

  const usedArea =
    Number(watchedArableArea || 0) + Number(watchedVegetationArea || 0);
  const remainingArea = Number(watchedTotalArea || 0) - usedArea;

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{farm ? "Editar Fazenda" : "Nova Fazenda"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          {!producerId && (
            <div className="space-y-1">
              <label className="text-sm font-medium text-foreground">
                Produtor *
              </label>
              <Select
                value={watchedProducerId ? String(watchedProducerId) : ""}
                onValueChange={(v) => handleProducerChange(Number(v))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um produtor" />
                </SelectTrigger>
                <SelectContent>
                  {producers.map((producer) => (
                    <SelectItem key={producer.id} value={String(producer.id)}>
                      {producer.name} - {producer.document}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.producerId && (
                <p className="text-sm text-red-500">
                  {errors.producerId.message}
                </p>
              )}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Nome da Fazenda"
              {...register("name", {
                required: "Nome da fazenda é obrigatório",
                minLength: {
                  value: 2,
                  message: "Nome deve ter pelo menos 2 caracteres",
                },
              })}
              error={errors.name?.message}
              placeholder="Digite o nome da fazenda"
              required
            />

            <Input
              label="Cidade"
              {...register("city", {
                required: "Cidade é obrigatória",
              })}
              error={errors.city?.message}
              placeholder="Digite a cidade"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-foreground">
                Estado *
              </label>
              <Select
                value={watch("state")}
                onValueChange={(value) => setValue("state", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o estado" />
                </SelectTrigger>
                <SelectContent>
                  {brazilianStates.map((state) => (
                    <SelectItem key={state} value={state}>
                      {state}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.state && (
                <p className="text-sm text-red-500">{errors.state.message}</p>
              )}
            </div>

            <Input
              label="Endereço"
              {...register("address", {
                required: "Endereço é obrigatório",
              })}
              error={errors.address?.message}
              placeholder="Digite o endereço completo"
              required
            />
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">
              Informações de Área (hectares)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="Área Total"
                type="number"
                step="0.01"
                min="0"
                {...register("totalArea", {
                  required: "Área total é obrigatória",
                  min: {
                    value: 0.01,
                    message: "Área deve ser maior que zero",
                  },
                  valueAsNumber: true,
                })}
                error={errors.totalArea?.message}
                placeholder="0.00"
                required
              />

              <Input
                label="Área Agricultável"
                type="number"
                step="0.01"
                min="0"
                {...register("cultivatedArea", {
                  required: "Área agricultável é obrigatória",
                  min: {
                    value: 0,
                    message: "Área não pode ser negativa",
                  },
                  valueAsNumber: true,
                })}
                error={errors.cultivatedArea?.message}
                placeholder="0.00"
                required
              />

              <Input
                label="Área de Vegetação"
                type="number"
                step="0.01"
                min="0"
                {...register("vegetationArea", {
                  required: "Área de vegetação é obrigatória",
                  min: {
                    value: 0,
                    message: "Área não pode ser negativa",
                  },
                  valueAsNumber: true,
                })}
                error={errors.vegetationArea?.message}
                placeholder="0.00"
                required
              />
            </div>

            {watchedTotalArea > 0 && (
              <div className="p-3 bg-muted rounded-md">
                <div className="text-sm space-y-1">
                  <div className="flex justify-between">
                    <span>Área utilizada:</span>
                    <span
                      className={
                        usedArea > watchedTotalArea
                          ? "text-red-600 font-semibold"
                          : ""
                      }
                    >
                      {usedArea.toFixed(2)} ha
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Área restante:</span>
                    <span
                      className={
                        remainingArea < 0
                          ? "text-red-600 font-semibold"
                          : "text-green-600"
                      }
                    >
                      {remainingArea.toFixed(2)} ha
                    </span>
                  </div>
                  {remainingArea < 0 && (
                    <p className="text-red-600 text-xs mt-2">
                      ⚠️ A soma das áreas ultrapassa a área total!
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              loading={isSubmitting}
              className="flex-1"
              disabled={remainingArea < 0}
            >
              {farm ? "Atualizar" : "Cadastrar"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default FarmForm;
