import UserCashOuts from './UserCashouts';
import { up } from "round-to";

const ROUND_TO = 2;

const myUserCashOuts = new UserCashOuts();

export const calculateCashIn = (operation, commissions) => {
  let commissionFee =
    up(operation.operation.amount * commissions.cashIn.percents / 100, ROUND_TO);
  if (commissionFee > commissions.cashIn.max.amount) {
    commissionFee = commissions.cashIn.max.amount;
  }
  return commissionFee;
};

export const calculateNatural = (operation, commissions) => {
  let commissionFee = 0;
  const weekLimit = commissions.natural.week_limit.amount;
  const pastCashouts = myUserCashOuts.getUserCashOuts(operation.user_id, operation.date);
  const amount = operation.operation.amount;
  const percents = commissions.natural.percents;

  if (pastCashouts >= weekLimit) {
    commissionFee = up(amount * percents / 100, ROUND_TO);
  } else {
    const exceededAmount = amount + pastCashouts - weekLimit;
    if (exceededAmount > 0) {
      commissionFee = up(exceededAmount * percents / 100, ROUND_TO);
    }
  }
  myUserCashOuts.setUserCashOut(operation.user_id, amount, operation.date);
  return commissionFee;
};

export const calculateJuridical = (operation, commissions) => {
  let commissionFee =
    up(operation.operation.amount * commissions.juridical.percents / 100, ROUND_TO);
  if (commissionFee < commissions.juridical.min.amount) {
    commissionFee = commissions.juridical.min.amount;
  }
  return commissionFee;
};

export const getCommissionFunction = (userType, operationType) => {
  if (operationType === 'cash_in') {
    return calculateCashIn;
  } else {
    if (userType === 'natural') {
      return calculateNatural;
    } else {
      return calculateJuridical;
    }
  }
};