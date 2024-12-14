export interface CreditCard {
    id: string;
    cardNumber: string;
    expiryDate: string;
    cardholderName: string;
  }
  
  export interface FormData {
    cardNumber: string;
    expiryDate: string;
    cardholderName: string;
    cvv: string;
  }
  
  export interface FormErrors {
    cardNumber?: string;
    expiryDate?: string;
    cardholderName?: string;
    cvv?: string;
  }