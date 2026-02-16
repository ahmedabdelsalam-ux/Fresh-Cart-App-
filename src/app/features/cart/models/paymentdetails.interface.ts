export interface PaymentdetailsRespons {
  status: string;
  session: Paymentdetails;
}

export interface Paymentdetails {
  url: string;
  success_url: string;
  cancel_url: string;
}
