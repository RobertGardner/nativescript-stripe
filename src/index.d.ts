import { Page } from "ui/page";
import { CreditCardViewBase } from "./common";

// ****** Custom Integration components

export declare class Stripe {
  constructor(apiKey: string);
  createToken(card: CardCommon, cb: (error: Error, token: Token) => void): void;
}
export declare type CardBrand = "Visa" | "Amex" | "MasterCard" | "Discover" | "JCB" | "DinersClub" | "Unknown";
export declare interface CardCommon {
  readonly native: any;
  readonly number: string;
  readonly cvc: string;
  readonly expMonth: number;
  readonly expYear: number;
  readonly last4: string;
  readonly fingerprint: string;
  readonly brand: CardBrand;
  readonly funding: string;
  name: string;
  addressLine1: string;
  addressLine2: string;
  addressCity: string;
  addressZip: string;
  addressState: string;
  addressCountry: string;
  currency: string;

  validateNumber(): boolean;
  validateCVC(): boolean;
  validateCard(): boolean;
  validateExpMonth(): boolean;
  validateExpiryDate(): boolean;
}
export declare class Card implements CardCommon {
  readonly native: any;
  readonly number: string;
  readonly cvc: string;
  readonly expMonth: number;
  readonly expYear: number;
  readonly last4: string;
  readonly fingerprint: string;
  readonly brand: CardBrand;
  readonly funding: string;
  name: string;
  addressLine1: string;
  addressLine2: string;
  addressCity: string;
  addressZip: string;
  addressState: string;
  addressCountry: string;
  currency: string;

  static fromNative(card: any): Card;
  constructor(cardNumber: string, expMonth: number, expYear: number, cardCVC: string);
  validateNumber(): boolean;
  validateCVC(): boolean;
  validateCard(): boolean;
  validateExpMonth(): boolean;
  validateExpiryDate(): boolean;
}
export declare interface Token {
  id: string;
  bankAccount: any;
  card: CardCommon;
  created: Date;
  ios: any;
  android: any;
  livemode: boolean;
}
export declare class CreditCardView extends CreditCardViewBase {
  readonly android: any;
  readonly card: Card;
  createNativeView(): Object;

}

// ***** Standard Integration components

export declare class StripeConfigCommon {
  backendAPI: StripeBackendAPI;
  publishableKey: string;
  appleMerchantID: string;
  companyName: string;
  requiredBillingAddressFields: StripeBillingAddressFields;
  requiredShippingAddressFields: StripeShippingAddressField[];
  verifyPrefilledShippingAddress: boolean;
  createCardSources: boolean;
}
export declare class StripeConfig extends StripeConfigCommon {
  native: any;
  private toNative(): any;
  static shared(): StripeConfig;
}
export declare interface StripeBackendAPI {
  /**
   * Calls the client-implemented Stripe backend to retrieve a Customer Key
   * (ephemeral key).
   *
   * @param apiVersion The API Version to send to the backend.
   * @returns a Promise with a response containing the ephemeral key as
   *     returned by the Stripe backend. For example, response.content.toJSON().
   *     Any error should be reported as a string that can be displayed to the user.
   */
  createCustomerKey(apiVersion: string): Promise<any>;

  /**
   * Calls the client-implemented Stripe backend to complete a charge.
   *
   * @param sourceID The Stripe Source ID to send to the backend.
   * @param amount  The amount to charge, in pennies.
   * @param shippingMethod The shipping method to use.
   * @param shippingAddress The address to ship to.
   * @returns a Promise that resolves on success and rejects on failure.
   *     Any error should be reported as a string that can be displayed to the user.
   */
  completeCharge(sourceID: string, amount: number, shippingMethod: StripeShippingMethod, shippingAddress: StripeAddress): Promise<void>;
}
/**
 * Called during event processing when status changes. On Angular apps, be sure to
 * trigger change detection when these are called since they are called in a background thread.
 */
export declare interface StripePaymentListener {
  /**
   * Called when communication with Stripe service changes. Currently only called on Android.
   * Check StripePaymentSession.loading for current communication state on both platforms.
   */
  onCommunicatingStateChanged(isCommunicating: boolean): void;
  onPaymentDataChanged(data: StripePaymentData): void;
  onPaymentSuccess(): void;
  onError(errorCode: number, message: string): void;
  provideShippingMethods(address: StripeAddress): StripeShippingMethods;
}
export declare class StripeCustomerSession {
  native: any;
  constructor();
}
export declare class StripePaymentSession {
  native: any;
  constructor(page: Page,
    customerSession: StripeCustomerSession,
    amount: number,
    currency: string,
    listener: StripePaymentListener);
  /** Is the native component loading? */
  readonly loading: boolean;
  /** Has user entered enough info that a charge can be made? */
  readonly isPaymentReady: boolean;
  readonly paymentInProgress: boolean;
  /** Total amount (including shipping) in pennies. */
  readonly amount: number;
  readonly selectedPaymentMethod: StripePaymentMethod;
  readonly selectedShippingMethod: StripeShippingMethod;
  requestPayment(): void;
  presentPaymentMethods(): void;
  presentShipping(): void;
}
export declare interface StripePaymentMethod {
  image: any; // TODO: UIImage marshals to ??? (number on Android)
  label: string;
  templateImage: any;
}
export declare interface StripeShippingMethod {
  /** Cost of shipping in pennies. */
  amount: number;
  detail: string;
  label: string;
  identifier: string;
}
export declare interface StripePaymentData {
  /** Has user entered all necessary information to allow a charge to proceed? */
  isReadyToCharge: boolean;
  /** The selected payment method, if any. */
  paymentMethod: StripePaymentMethod;
  /** The selected shipping method, if any. */
  shippingInfo: StripeShippingMethod;
}
export declare interface StripeAddress {
  name: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
  email: string;
}
export declare interface StripeShippingMethods {
  /** Is shipping to the address valid? */
  isValid: boolean;
  /** If not valid, an error describing the issue with the address */
  validationError: string;
  /** The shipping methods available for the address. */
  shippingMethods: StripeShippingMethod[];
  /** The pre-selected (default) shipping method for the address. */
  selectedShippingMethod: StripeShippingMethod;
}
export declare const enum StripeBillingAddressFields {
  None = 0,
  Zip = 1,
  Full = 2,
  Name = 3
}
/** Available shipping address fields. */
export const enum StripeShippingAddressField {
  Name = "name",
  PostalAddress = "address",
  Phone = "phone",
  Email = "email"
}
