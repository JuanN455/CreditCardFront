import React from 'react';
import { CreditCardForm } from './components/CreditCard';
import { Navbar, NavbarBrand, Container } from 'reactstrap';

const App: React.FC = () => (
  <div className="App">
    <Navbar color="dark" dark>
      <Container>
        <NavbarBrand href="/">Credit Card Management</NavbarBrand>
      </Container>
    </Navbar>
    <Container className="mt-4">
      <CreditCardForm />
    </Container>
  </div>
);

export default App;
