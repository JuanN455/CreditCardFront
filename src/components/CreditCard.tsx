import React from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Card,
  CardBody,
  FormGroup,
  Label,
  Input,
  FormFeedback,
} from "reactstrap";
import { useCreditCard } from "../hooks/useCreditCard";
import { CreditCard } from "../types/Card";
import "./CreditCard.css";

const FormInput: React.FC<{
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  error?: string;
  type?: string;
}> = ({ label, name, value, onChange, placeholder, error, type = "text" }) => (
  <FormGroup>
    <Label for={name}>{label}</Label>
    <Input
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      type={type}
      invalid={!!error}
    />
    {error && <FormFeedback>{error}</FormFeedback>}
  </FormGroup>
);

export const CreditCardForm: React.FC = () => {
  const {
    formData,
    errors,
    savedCards,
    handleSubmit,
    handleInputChange,
    handleCancel,
    handleDeleteCard,
  } = useCreditCard();

  return (
    <Container className="mt-5">
      <Row>
        <Col md={7} className="mx-auto">
          <Card className="credit-card-preview">
            <CardBody>
              <div className="card-header">
                <div>
                  <span className="bank-name">monobank</span>
                  <span className="bank-type ml-2">|</span>
                  <span className="bank-type ml-2">Universal Bank</span>
                </div>
                <div className="boxW d-flex">
                  <img
                    className="wifi d-flex"
                    src="../../public/wifi.svg"
                    alt="Wigi Image"
                  />
                </div>
              </div>
              <div className="card-chip"></div>
              <p className="card-number">
                {formData.cardNumber || "5375 4411 4540 0954"}
              </p>
              <div className="card-details">
                <div>
                  <p className="card-holder-name">
                    {formData.cardholderName || "DONALD FLINCH CORTEZ"}
                  </p>
                </div>
                <div className="text-end">
                  <p className="card-valid-thru">VALID THRU</p>
                  <p className="card-exp">{formData.expiryDate || "06/24"}</p>
                  <div className="card-logo">
                    <div className="card-logo-circle"></div>
                    <div className="card-logo-circle"></div>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>

          <Form onSubmit={handleSubmit} className="form-container">
            <FormInput
              label="Número de Tarjeta"
              name="cardNumber"
              value={formData.cardNumber}
              onChange={handleInputChange}
              placeholder="0000 0000 0000 0000"
              error={errors.cardNumber}
            />
            <Row>
              <Col md={6}>
                <FormInput
                  label="Fecha Vencimiento"
                  name="expiryDate"
                  value={formData.expiryDate}
                  onChange={handleInputChange}
                  placeholder="MM/YY"
                  error={errors.expiryDate}
                />
              </Col>
              <Col md={6}>
                <FormInput
                  label="CVV"
                  name="cvv"
                  value={formData.cvv}
                  onChange={handleInputChange}
                  placeholder="123"
                  type="password"
                  error={errors.cvv}
                />
              </Col>
            </Row>
            <FormInput
              label="Nombre Titular"
              name="cardholderName"
              value={formData.cardholderName}
              onChange={handleInputChange}
              placeholder="NOMBRE COMPLETO"
              error={errors.cardholderName}
            />
            <div className="d-flex gap-2 mt-3">
              <Button className="button-add" type="submit">
                Agregar Tarjeta
              </Button>
              <Button className="button-clean" onClick={handleCancel}>
                Cancelar
              </Button>
            </div>
          </Form>
        </Col>
      </Row>

      <Row className="saved-cards-container mt-5">
        <Col>
          <h2 className="mb-4">Tarjetas Guardadas</h2>
          {savedCards.map((card: CreditCard) => (
            <Card key={card.id} className="saved-card mb-3">
              <CardBody>
                <p className="mb-1">
                  Número:{" "}
                  {card.cardNumber.replace(
                    /(\d{4})(\d{8})(\d{4})/,
                    "$1********$3"
                  )}
                </p>
                <p className="mb-1">Nombre: {card.cardholderName}</p>
                <p className="mb-2">Vencimiento: {card.expiryDate}</p>
                <Button
                  color="danger"
                  size="sm"
                  onClick={() => handleDeleteCard(card.id)}
                >
                  Eliminar
                </Button>
              </CardBody>
            </Card>
          ))}
        </Col>
      </Row>
    </Container>
  );
};
