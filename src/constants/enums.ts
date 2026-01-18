export const AccountType = {
  CHECKING: "CHECKING",
  SAVINGS: "SAVINGS",
  CASH: "CASH",
  LOAN: "LOAN",
  BROKERAGE: "BROKERAGE",
  INVESTMENT: "INVESTMENT",
  MOBILE_MONEY: "MOBILE_MONEY",
  PENSION: "PENSION",
  CREDIT_CARD: "CREDIT_CARD",
  REAL_ESTATE: "REAL_ESTATE",
  CRYPTO: "CRYPTO",
  VEHICLE: "VEHICLE",
  OTHER: "OTHER",
} as const;

export type AccountType = (typeof AccountType)[keyof typeof AccountType];

export const TransactionKind = {
  PAYMENT: "PAYMENT",
  FEE: "FEE",
  BUY: "BUY",
  SELL: "SELL",
  TRANSFER: "TRANSFER",
  ADJUSTMENT: "ADJUSTMENT",
  INCOME: "INCOME",
  BILL_PAYMENT: "BILL_PAYMENT",
  WITHDRAWAL: "WITHDRAWAL",
  DEPOSIT: "DEPOSIT",
  INTEREST: "INTEREST",
  DIVIDEND: "DIVIDEND",
  REFUND: "REFUND",
  LOAN_PAYMENT: "LOAN_PAYMENT",
  RENTAL_INCOME: "RENTAL_INCOME",
} as const;

export type TransactionKind = (typeof TransactionKind)[keyof typeof TransactionKind];

export const TransactionStatus = {
  UNCLEARED: "UNCLEARED",
  CLEARED: "CLEARED",
  RECONCILED: "RECONCILED",
} as const;

export type TransactionStatus = (typeof TransactionStatus)[keyof typeof TransactionStatus];

export const FlagColor = {
  RED: "RED",
  ORANGE: "ORANGE",
  YELLOW: "YELLOW",
  GREEN: "GREEN",
  BLUE: "BLUE",
  PURPLE: "PURPLE",
} as const;

export type FlagColor = (typeof FlagColor)[keyof typeof FlagColor];

export const EntityType = {
  BANK: "BANK",
  MNO: "MNO",
  BROKER: "BROKER",
  PSP: "PSP",
  CREDIT_UNION: "CREDIT_UNION",
  MICROFINANCE: "MICROFINANCE",
  MERCHANT: "MERCHANT",
  UTILITY_COMPANY: "UTILITY_COMPANY",
  INSURANCE_COMPANY: "INSURANCE_COMPANY",
  GOVERNMENT: "GOVERNMENT",
  TAX_AUTHORITY: "TAX_AUTHORITY",
  EMPLOYER: "EMPLOYER",
  PERSON: "PERSON",
  OTHER: "OTHER",
} as const;

export type EntityType = (typeof EntityType)[keyof typeof EntityType];

export const TargetType = {
  SET_ASIDE: "SET_ASIDE",
  REFILL: "REFILL",
  BALANCE: "BALANCE",
  DEBT_PAYOFF: "DEBT_PAYOFF",
} as const;

export type TargetType = (typeof TargetType)[keyof typeof TargetType];

export const TargetCadence = {
  WEEKLY: "WEEKLY",
  MONTHLY: "MONTHLY",
  YEARLY: "YEARLY",
  CUSTOM: "CUSTOM",
} as const;

export type TargetCadence = (typeof TargetCadence)[keyof typeof TargetCadence];
