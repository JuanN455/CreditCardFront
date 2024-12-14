import { useState, useEffect } from 'react';
import { FormData, FormErrors, CreditCard } from '../types/Card';
import Swal from 'sweetalert2';
import { appsettings } from '../appsettings.cs';

export const useCreditCard = () => {
  const [formData, setFormData] = useState<FormData>({
    cardNumber: '',
    expiryDate: '',
    cardholderName: '',
    cvv: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [savedCards, setSavedCards] = useState<CreditCard[]>([]);

  useEffect(() => {
    fetchCards();
  }, []);

  const fetchCards = async () => {
    try {
      const response = await fetch(`${appsettings.apiUrl}CreditCard/CardList`);
      if (response.ok) {
        const data = await response.json();
        setSavedCards(data);
      } else {
        throw new Error('Error fetching cards');
      }
    } catch (error) {
      console.error('Error fetching cards:', error);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'No se pudieron cargar las tarjetas guardadas.',
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!/^\d{16}$/.test(formData.cardNumber.replace(/\s/g, ''))) {
      newErrors.cardNumber = 'Número de tarjeta debe tener 16 dígitos';
    }
    if (!/^(0[1-9]|1[0-2])\/([0-9]{2})$/.test(formData.expiryDate)) {
      newErrors.expiryDate = 'Formato inválido (MM/YY)';
    }
    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{1,20}$/.test(formData.cardholderName)) {
      newErrors.cardholderName = 'Nombre inválido (máx. 20 caracteres, solo letras)';
    }
    if (!/^\d{3}$/.test(formData.cvv)) {
      newErrors.cvv = 'CVV debe tener 3 dígitos';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      Swal.fire({
        icon: 'error',
        title: 'Error de validación',
        text: 'Por favor, corrija los errores en el formulario.',
      });
      return;
    }

    try {
      formData.cardNumber = formData.cardNumber.replace(/(?!^)\s+(?!$)/g, '');
      const response = await fetch(`${appsettings.apiUrl}CreditCard/New`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const newCard = await response.json();
        console.log(newCard)
        setSavedCards([...savedCards, newCard]);
        handleCancel();
        Swal.fire({
          icon: 'success',
          title: '¡Éxito!',
          text: 'La tarjeta ha sido agregada correctamente.',
        });
      } else {
        throw new Error('Error saving card');
      }
    } catch (error) {
      console.error('Error saving card:', error);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Hubo un error al guardar la tarjeta.',
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let formattedValue = value;

    switch (name) {
      case 'cardNumber':
        formattedValue = value.replace(/\D/g, '').replace(/(\d{4})/g, '$1 ').trim().slice(0, 19);
        break;
      case 'expiryDate':
        formattedValue = value.replace(/\D/g, '').replace(/(\d{2})(\d{0,2})/, '$1/$2').slice(0, 5);
        break;
      case 'cardholderName':
        formattedValue = value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '').slice(0, 20);
        break;
      case 'cvv':
        formattedValue = value.replace(/\D/g, '').slice(0, 3);
        break;
    }

    setFormData(prev => ({ ...prev, [name]: formattedValue }));
  };

  const handleCancel = () => {
    setFormData({ cardNumber: '', expiryDate: '', cardholderName: '', cvv: '' });
    setErrors({});
  };

  const handleDeleteCard = async (cardId: string) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: 'No podrás revertir esta acción',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(`${appsettings.apiUrl}CreditCard/Delete/${cardId}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          setSavedCards(savedCards.filter(card => card.id !== cardId));
          Swal.fire('¡Eliminada!', 'La tarjeta ha sido eliminada.', 'success');
        } else {
          throw new Error('Error deleting card');
        }
      } catch (error) {
        console.error('Error deleting card:', error);
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Hubo un error al eliminar la tarjeta.',
        });
      }
    }
  };

  return { formData, errors, savedCards, handleSubmit, handleInputChange, handleCancel, handleDeleteCard };
};
