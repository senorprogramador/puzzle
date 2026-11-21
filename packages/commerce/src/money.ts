export type CurrencyCode = string;

export interface CurrencyDefinition {
  readonly code: CurrencyCode;
  readonly minorUnit: number;
}

export interface CurrencyOptions {
  readonly currencyMinorUnits?: Readonly<Record<string, number>>;
  readonly currencies?: Readonly<Record<string, number | CurrencyDefinition>>;
  readonly allowUnknownCurrencies?: boolean;
}

const ISO_MINOR_UNITS: Readonly<Record<string, number>> = {
  AED: 2, AFN: 2, ALL: 2, AMD: 2, ANG: 2, AOA: 2, ARS: 2, AUD: 2,
  AWG: 2, AZN: 2, BAM: 2, BBD: 2, BDT: 2, BGN: 2, BHD: 3, BIF: 0,
  BMD: 2, BND: 2, BOB: 2, BOV: 2, BRL: 2, BSD: 2, BTN: 2, BWP: 2,
  BYN: 2, BZD: 2, CAD: 2, CDF: 2, CHE: 2, CHF: 2, CHW: 2, CLF: 4,
  CLP: 0, CNY: 2, COP: 2, COU: 2, CRC: 2, CUC: 2, CUP: 2, CVE: 2,
  CZK: 2, DJF: 0, DKK: 2, DOP: 2, DZD: 2, EGP: 2, ERN: 2, ETB: 2,
  EUR: 2, FJD: 2, FKP: 2, GBP: 2, GEL: 2, GHS: 2, GIP: 2, GMD: 2,
  GNF: 0, GTQ: 2, GYD: 2, HKD: 2, HNL: 2, HRK: 2, HTG: 2, HUF: 2,
  IDR: 2, ILS: 2, INR: 2, IQD: 3, IRR: 2, ISK: 0, JMD: 2, JOD: 3,
  JPY: 0, KES: 2, KGS: 2, KHR: 2, KMF: 0, KPW: 2, KRW: 0, KWD: 3,
  KYD: 2, KZT: 2, LAK: 2, LBP: 2, LKR: 2, LRD: 2, LSL: 2, LYD: 3,
  MAD: 2, MDL: 2, MGA: 2, MKD: 2, MMK: 2, MNT: 2, MOP: 2, MRU: 2,
  MUR: 2, MVR: 2, MWK: 2, MXN: 2, MXV: 2, MYR: 2, MZN: 2, NAD: 2,
  NGN: 2, NIO: 2, NOK: 2, NPR: 2, NZD: 2, OMR: 3, PAB: 2, PEN: 2,
  PGK: 2, PHP: 2, PKR: 2, PLN: 2, PYG: 0, QAR: 2, RON: 2, RSD: 2,
  RUB: 2, RWF: 0, SAR: 2, SBD: 2, SCR: 2, SDG: 2, SEK: 2, SGD: 2,
  SHP: 2, SLE: 2, SLL: 2, SOS: 2, SRD: 2, SSP: 2, STN: 2, SVC: 2,
  SYP: 2, SZL: 2, THB: 2, TJS: 2, TMT: 2, TND: 3, TOP: 2, TRY: 2,
  TTD: 2, TWD: 2, TZS: 2, UAH: 2, UGX: 0, USD: 2, USN: 2, UYI: 0,
  UYU: 2, UYW: 4, UZS: 2, VED: 2, VES: 2, VND: 0, VUV: 0, WST: 2,
  XAF: 0, XAG: 0, XAU: 0, XBA: 0, XBB: 0, XBC: 0, XBD: 0, XCD: 2,
  XDR: 0, XOF: 0, XPD: 0, XPF: 0, XPT: 0, XSU: 0, XTS: 0, XUA: 0,
  XXX: 0, YER: 2, ZAR: 2, ZMW: 2, ZWL: 2,
};

export const ISO_CURRENCY_MINOR_UNITS = ISO_MINOR_UNITS;

export class InvalidCurrencyError extends Error {
  readonly code = "INVALID_CURRENCY";
  readonly currency: string;

  constructor(currency: string, message = `Unsupported currency: ${currency}`) {
    super(message);
    this.name = "InvalidCurrencyError";
    this.currency = currency;
  }
}

export class MoneyValidationError extends Error {
  readonly code = "INVALID_MONEY";

  constructor(message: string) {
    super(message);
    this.name = "MoneyValidationError";
  }
}

function normalizedCode(currency: string): string {
  if (typeof currency !== "string" || !/^[A-Za-z]{3}$/.test(currency)) {
    throw new InvalidCurrencyError(currency);
  }
  return currency.toUpperCase();
}

function optionMinorUnit(code: string, options: CurrencyOptions): number | undefined {
  const override = options.currencyMinorUnits?.[code];
  if (override !== undefined) return override;
  const definition = options.currencies?.[code];
  return typeof definition === "number" ? definition : definition?.minorUnit;
}

export function getCurrencyMinorUnit(currency: string, options: CurrencyOptions = {}): number {
  const code = normalizedCode(currency);
  const minorUnit = optionMinorUnit(code, options) ?? ISO_MINOR_UNITS[code];
  if (minorUnit === undefined && !options.allowUnknownCurrencies) {
    throw new InvalidCurrencyError(code);
  }
  if (minorUnit === undefined) return 2;
  if (!Number.isInteger(minorUnit) || minorUnit < 0 || minorUnit > 9) {
    throw new InvalidCurrencyError(code, `Invalid minor unit for currency: ${code}`);
  }
  return minorUnit;
}

export function isCurrency(currency: string, options: CurrencyOptions = {}): boolean {
  try {
    getCurrencyMinorUnit(currency, options);
    return true;
  } catch {
    return false;
  }
}

export function assertCurrency(currency: string, options: CurrencyOptions = {}): CurrencyCode {
  const code = normalizedCode(currency);
  getCurrencyMinorUnit(code, options);
  return code;
}

export interface Money {
  readonly amount: number;
  readonly currency: CurrencyCode;
}

export type RoundingMode = "half-up" | "half-even" | "up" | "down" | "floor" | "ceil";

export interface RoundingOptions {
  readonly roundingMode?: RoundingMode;
}

function assertSafeAmount(amount: number): void {
  if (!Number.isSafeInteger(amount)) {
    throw new MoneyValidationError("Money amounts must be safe integer minor units");
  }
}

function assertMoney(value: Money): void {
  normalizedCode(value.currency);
  getCurrencyMinorUnit(value.currency, { allowUnknownCurrencies: true });
  assertSafeAmount(value.amount);
}

export function createMoney(
  amount: number,
  currency: string,
  options: CurrencyOptions = {},
): Money {
  const code = normalizedCode(currency);
  getCurrencyMinorUnit(code, options);
  assertSafeAmount(amount);
  return Object.freeze({ amount, currency: code });
}

export const money = createMoney;

export function zeroMoney(currency: string, options: CurrencyOptions = {}): Money {
  return createMoney(0, currency, options);
}

export function fromMajorUnits(
  amount: number,
  currency: string,
  options: CurrencyOptions & RoundingOptions = {},
): Money {
  if (!Number.isFinite(amount)) throw new MoneyValidationError("Major-unit amount must be finite");
  const minorUnit = getCurrencyMinorUnit(currency, options);
  return createMoney(roundInteger(amount * 10 ** minorUnit, options.roundingMode ?? "half-up"), currency, options);
}

export function toMajorUnits(value: Money): number {
  assertMoney(value);
  return value.amount / 10 ** getCurrencyMinorUnit(value.currency, { allowUnknownCurrencies: true });
}

function assertSameCurrency(left: Money, right: Money): void {
  assertMoney(left);
  assertMoney(right);
  if (left.currency !== right.currency) {
    throw new MoneyValidationError(`Cannot operate on ${left.currency} and ${right.currency} money`);
  }
}

function checkedResult(amount: number, currency: string): Money {
  assertSafeAmount(amount);
  return Object.freeze({ amount, currency });
}

export function addMoney(left: Money, right: Money): Money {
  assertSameCurrency(left, right);
  return checkedResult(left.amount + right.amount, left.currency);
}

export function subtractMoney(left: Money, right: Money): Money {
  assertSameCurrency(left, right);
  return checkedResult(left.amount - right.amount, left.currency);
}

function roundInteger(value: number, mode: RoundingMode): number {
  if (!Number.isFinite(value)) throw new MoneyValidationError("Cannot round a non-finite amount");
  switch (mode) {
    case "down": return value < 0 ? Math.ceil(value) : Math.floor(value);
    case "floor": return Math.floor(value);
    case "ceil": return Math.ceil(value);
    case "up": return value < 0 ? Math.floor(value) : Math.ceil(value);
    case "half-even": {
      const lower = Math.floor(value);
      const fraction = value - lower;
      if (fraction < 0.5) return lower;
      if (fraction > 0.5) return lower + 1;
      return lower % 2 === 0 ? lower : lower + 1;
    }
    case "half-up":
    default: {
      const epsilon = Number.EPSILON * Math.max(1, Math.abs(value)) * 4;
      return value < 0 ? Math.ceil(value - 0.5 - epsilon) : Math.floor(value + 0.5 + epsilon);
    }
  }
}

export function multiplyMoney(
  value: Money,
  multiplier: number,
  options: RoundingOptions = {},
): Money {
  assertMoney(value);
  if (!Number.isFinite(multiplier)) throw new MoneyValidationError("Multiplier must be finite");
  return checkedResult(roundInteger(value.amount * multiplier, options.roundingMode ?? "half-up"), value.currency);
}

export function divideMoney(
  value: Money,
  divisor: number,
  options: RoundingOptions = {},
): Money {
  assertMoney(value);
  if (!Number.isFinite(divisor) || divisor === 0) throw new MoneyValidationError("Divisor must be finite and non-zero");
  return checkedResult(roundInteger(value.amount / divisor, options.roundingMode ?? "half-up"), value.currency);
}

export function compareMoney(left: Money, right: Money): -1 | 0 | 1 {
  assertSameCurrency(left, right);
  return left.amount < right.amount ? -1 : left.amount > right.amount ? 1 : 0;
}

export function equalMoney(left: Money, right: Money): boolean {
  assertMoney(left);
  assertMoney(right);
  return left.currency === right.currency && left.amount === right.amount;
}

export function roundMoney(value: Money, options?: RoundingOptions): Money;
export function roundMoney(value: number, currency: string, options?: CurrencyOptions & RoundingOptions): Money;
export function roundMoney(
  value: Money | number,
  currencyOrOptions: string | (CurrencyOptions & RoundingOptions) = {},
  options: CurrencyOptions & RoundingOptions = {},
): Money {
  if (typeof value !== "number") {
    assertMoney(value);
    return createMoney(value.amount, value.currency, currencyOrOptions as CurrencyOptions);
  }
  if (typeof currencyOrOptions !== "string") {
    throw new MoneyValidationError("A currency is required when rounding a number");
  }
  return fromMajorUnits(value, currencyOrOptions, options);
}

export function formatMoney(
  value: Money,
  locale?: string,
  options: Intl.NumberFormatOptions & CurrencyOptions = {},
): string {
  assertMoney(value);
  const { currencyMinorUnits: _units, currencies: _currencies, allowUnknownCurrencies: _unknown, ...intlOptions } = options;
  const minorUnit = getCurrencyMinorUnit(value.currency, options);
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: value.currency,
    minimumFractionDigits: minorUnit,
    maximumFractionDigits: minorUnit,
    ...intlOptions,
  }).format(value.amount / 10 ** minorUnit);
}

export function allocateMoney(value: Money, ratios: readonly number[]): Money[] {
  assertMoney(value);
  if (ratios.length === 0 || ratios.some((ratio) => !Number.isFinite(ratio) || ratio < 0)) {
    throw new MoneyValidationError("Allocation ratios must be non-negative finite numbers");
  }
  const total = ratios.reduce((sum, ratio) => sum + ratio, 0);
  if (total <= 0) throw new MoneyValidationError("Allocation ratios must have a positive total");
  const sign = value.amount < 0 ? -1 : 1;
  const absoluteAmount = Math.abs(value.amount);
  const allocations = ratios.map((ratio) => Math.floor(absoluteAmount * ratio / total));
  let remainder = absoluteAmount - allocations.reduce((sum, amount) => sum + amount, 0);
  for (let index = 0; remainder > 0; index = (index + 1) % allocations.length) {
    allocations[index] = (allocations[index] ?? 0) + 1;
    remainder -= 1;
  }
  return allocations.map((amount) => createMoney(sign * amount, value.currency, { allowUnknownCurrencies: true }));
}
