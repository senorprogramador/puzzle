import {
  addMoney,
  createMoney,
  multiplyMoney,
  subtractMoney,
  type Money,
} from "./money";

export interface Address {
  readonly name?: string;
  readonly company?: string;
  readonly line1: string;
  readonly line2?: string;
  readonly city: string;
  readonly region?: string;
  readonly postalCode: string;
  readonly country: string;
  readonly phone?: string;
}

export interface Customer {
  readonly id?: string;
  readonly email: string;
  readonly name?: string;
  readonly phone?: string;
  readonly billingAddress?: Address;
  readonly shippingAddress?: Address;
  readonly metadata?: Readonly<Record<string, string>>;
}

export interface OrderLineItem {
  readonly id: string;
  readonly productId?: string;
  readonly sku?: string;
  readonly name: string;
  readonly quantity: number;
  readonly unitPrice: Money;
  readonly discount?: Money;
  readonly tax?: Money;
  readonly metadata?: Readonly<Record<string, string>>;
}

export interface OrderTotals {
  readonly subtotal: Money;
  readonly discount: Money;
  readonly tax: Money;
  readonly shipping: Money;
  readonly total: Money;
}

export type LineItem = OrderLineItem;
export type Totals = OrderTotals;

export interface Order {
  readonly id: string;
  readonly customer: Customer;
  readonly lineItems: readonly OrderLineItem[];
  readonly totals: OrderTotals;
  readonly currency: string;
  readonly status?: OrderStatus;
  readonly billingAddress?: Address;
  readonly shippingAddress?: Address;
  readonly metadata?: Readonly<Record<string, string>>;
  readonly createdAt?: Date;
  readonly updatedAt?: Date;
}

export type OrderStatus = "pending" | "confirmed" | "paid" | "fulfilled" | "cancelled" | "refunded";

export interface OrderTotalsInput {
  readonly lineItems: readonly OrderLineItem[];
  readonly shipping?: Money;
}

function assertQuantity(quantity: number): void {
  if (!Number.isSafeInteger(quantity) || quantity <= 0) {
    throw new Error("Line-item quantity must be a positive safe integer");
  }
}

export function calculateOrderTotals(input: OrderTotalsInput): OrderTotals {
  if (input.lineItems.length === 0) throw new Error("An order must contain at least one line item");
  const first = input.lineItems[0];
  if (!first) throw new Error("An order must contain at least one line item");
  let subtotal = createMoney(0, first.unitPrice.currency, { allowUnknownCurrencies: true });
  let discount = createMoney(0, first.unitPrice.currency, { allowUnknownCurrencies: true });
  let tax = createMoney(0, first.unitPrice.currency, { allowUnknownCurrencies: true });
  for (const item of input.lineItems) {
    assertQuantity(item.quantity);
    subtotal = addMoney(subtotal, multiplyMoney(item.unitPrice, item.quantity));
    if (item.discount) discount = addMoney(discount, item.discount);
    if (item.tax) tax = addMoney(tax, item.tax);
  }
  const shipping = input.shipping ?? createMoney(0, subtotal.currency, { allowUnknownCurrencies: true });
  const total = addMoney(subtractMoney(addMoney(subtotal, tax), discount), shipping);
  return Object.freeze({ subtotal, discount, tax, shipping, total });
}

export function createOrder(
  input: Omit<Order, "totals" | "currency"> & { shipping?: Money },
): Order {
  const totals = calculateOrderTotals({ lineItems: input.lineItems, shipping: input.shipping });
  return Object.freeze({
    ...input,
    currency: totals.total.currency,
    totals,
  });
}
