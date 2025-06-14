
import React, { useState, useEffect } from 'react';
import Input from '../atoms/Input';
import { validateDocument, formatDocument, getDocumentType } from '../../utils/validation';

interface DocumentInputProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  error?: string;
  required?: boolean;
}

const DocumentInput: React.FC<DocumentInputProps> = ({
  value,
  onChange,
  label = "CPF/CNPJ",
  error,
  required = false,
}) => {
  const [formattedValue, setFormattedValue] = useState('');
  const [internalError, setInternalError] = useState('');

  useEffect(() => {
    setFormattedValue(formatDocument(value));
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, '');
    
    // Limita o tamanho máximo (CNPJ tem 14 dígitos)
    if (rawValue.length <= 14) {
      onChange(rawValue);
      setFormattedValue(formatDocument(rawValue));
      
      // Valida apenas se o campo estiver preenchido completamente
      if (rawValue.length === 11 || rawValue.length === 14) {
        if (!validateDocument(rawValue)) {
          const docType = getDocumentType(rawValue);
          setInternalError(`${docType} inválido`);
        } else {
          setInternalError('');
        }
      } else {
        setInternalError('');
      }
    }
  };

  const displayError = error || internalError;

  return (
    <Input
      label={label}
      value={formattedValue}
      onChange={handleChange}
      placeholder="Digite o CPF ou CNPJ"
      error={displayError}
      required={required}
      helperText={!displayError ? "Digite 11 dígitos para CPF ou 14 para CNPJ" : undefined}
    />
  );
};

export default DocumentInput;
