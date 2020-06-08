const fs = require("fs");
const util = require("util");
const requestData = require("./requestData");
const moment = require("moment");
const roundTo = require("round-to");

let commissions;
let userCashOuts = {};
const ROUND_TO = 2;
const DATE_FORMAT = "YYYYMMDD";

const readFile = util.promisify(fs.readFile);

requestData.getCommissions().then((result) => {
  commissions = { ...result };
  readFromFile();
});

const readFromFile = async () => {
  try {
    const data = await readFile(process.argv[2], "utf8");
    handleData(JSON.parse(data));
  } catch (err) {
    console.log(console.log(err));
  }
};

const handleData = (operations) => {
  const results = operations.map((operation) => {
    const commisionFunction = getCommissionFunction(
      operation.user_type,
      operation.type
    );
    return roundTo.up(commisionFunction(operation), ROUND_TO).toFixed(2);
  });
  results.map((x) => process.stdout.write(x + "\n"));
};

const getUserCashOuts = (user, date) => {
  const week = moment(date, DATE_FORMAT).isoWeek();
  const year = moment(date, DATE_FORMAT).year();
  if (!userCashOuts[user]) {
    return 0;
  } else if (!userCashOuts[user][year]) {
    return 0;
  } else if (!userCashOuts[user][year][week]) {
    return 0;
  } else return userCashOuts[user][year][week];
};

const setUserCashOut = (userId, amount, date) => {
  const week = moment(date, DATE_FORMAT).isoWeek();
  const year = moment(date, DATE_FORMAT).year();
  if (!getUserCashOuts(userId, date)) {
    userCashOuts[userId] = {
      [year]: {
        [week]: amount,
      },
    };
  } else {
    userCashOuts[userId][year][week] = getUserCashOuts(userId, date) + amount;
  }
};

const getCommissionFunction = (userType, operationType) => {
  if (operationType === "cash_in") {
    return calculateCashIn;
  } else {
    if (userType === "natural") {
      return calculateNatural;
    } else if (userType === "juridical") {
      return calculateJuridical;
    }
  }
};

const calculateCashIn = (operation) => {
  let commissionFee =
    operation.operation.amount * commissions.cashIn.percents / 100;
  if (commissionFee > commissions.cashIn.max.amount) {
    commissionFee = commissions.cashIn.max.amount;
  }
  return commissionFee;
};

const calculateNatural = (operation) => {
  let commissionFee = 0;
  const weekLimit = commissions.natural.week_limit.amount;
  const pastCashouts = getUserCashOuts(operation.user_id, operation.date);
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
  setUserCashOut(operation.user_id, amount, operation.date);
  return commissionFee;
};

const calculateJuridical = (operation) => {
  let commissionFee =
    (operation.operation.amount * commissions.juridical.percents) / 100;
  if (commissionFee < commissions.juridical.min.amount) {
    commissionFee = commissions.juridical.min.amount;
  }
  return commissionFee;
};