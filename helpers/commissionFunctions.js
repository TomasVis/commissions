import UserCashOuts from './UserCashouts';

const myUserCashOuts = new UserCashOuts();

const calculateCashIn = (operation, commissions) => {
  let commissionFee =
    operation.operation.amount * commissions.cashIn.percents / 100;
  if (commissionFee > commissions.cashIn.max.amount) {
    commissionFee = commissions.cashIn.max.amount;
  }
  return commissionFee;
};

const calculateNatural = (operation, commissions) => {
  let commissionFee = 0;
  const weekLimit = commissions.natural.week_limit.amount;
  const pastCashouts = myUserCashOuts.getUserCashOuts(operation.user_id, operation.date);
  const amount = operation.operation.amount;
  const percents = commissions.natural.percents;

  if (pastCashouts >= weekLimit) {
    commissionFee = (amount * percents) / 100;
  } else if (pastCashouts < weekLimit) {
    const exceededAmount = amount + pastCashouts - weekLimit;
    if (exceededAmount > 0) {
      commissionFee = (exceededAmount * percents) / 100;
    }
  }
  myUserCashOuts.setUserCashOut(operation.user_id, amount, operation.date);
  return commissionFee;
};

const calculateJuridical = (operation, commissions) => {
  let commissionFee =
    (operation.operation.amount * commissions.juridical.percents) / 100;
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
    } else if (userType === 'juridical') {
      return calculateJuridical;
    }
  }
};