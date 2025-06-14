
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Input from '../atoms/Input';
import Button from '../atoms/Button';
import DocumentInput from '../molecules/DocumentInput';
import { Card, CardContent, CardHeader, CardTitle } from '../atoms/Card';
import { Producer } from '../../types';
import { validateDocument } from '../../utils/validation';
import { useToast } from '@/hooks/use-toast';

interface ProducerFormData {
  document: string;
  name: string;
}

interface ProducerFormProps {
  producer?: Producer;
  onSubmit: (data: ProducerFormData) => void;
  onCancel: () => void;
}

const ProducerForm: React.FC<ProducerFormProps> = ({
  producer,
  onSubmit,
  onCancel,
}) => {
  const { toast } = useToast();
  const [documentValue, setDocumentValue] = useState(producer?.document || '');
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<ProducerFormData>({
    defaultValues: {
      document: producer?.document || '',
      name: producer?.name || '',
    },
  });

  const watchedDocument = watch('document');

  useEffect(() => {
    setValue('document', documentValue);
  }, [documentValue, setValue]);

  const validateForm = (data: ProducerFormData) => {
    if (!validateDocument(data.document)) {
      toast({
        variant: "destructive",
        title: "Erro de validação",
        description: "CPF ou CNPJ inválido",
      });
      return false;
    }
    return true;
  };

  const handleFormSubmit = (data: ProducerFormData) => {
    if (validateForm(data)) {
      onSubmit(data);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>
          {producer ? 'Editar Produtor' : 'Novo Produtor'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <DocumentInput
            value={documentValue}
            onChange={setDocumentValue}
            label="CPF/CNPJ"
            error={errors.document?.message}
            required
          />
          
          <Input
            label="Nome do Produtor"
            {...register('name', {
              required: 'Nome é obrigatório',
              minLength: {
                value: 2,
                message: 'Nome deve ter pelo menos 2 caracteres',
              },
            })}
            error={errors.name?.message}
            placeholder="Digite o nome do produtor"
            required
          />

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
            >
              {producer ? 'Atualizar' : 'Cadastrar'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ProducerForm;
