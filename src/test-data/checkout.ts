export interface CheckoutInfo {
  firstName: string;
  lastName: string;
  postalCode: string;
}

export const defaultCheckoutInfo: CheckoutInfo = {
  firstName: 'John',
  lastName: 'Doe',
  postalCode: '12345',
};
