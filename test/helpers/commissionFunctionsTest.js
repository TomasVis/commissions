import { assert } from "chai";
import { calculateCashIn, getCommissionFunction, calculateJuridical, calculateNatural } from "../../helpers/commissionFunctions";
import "babel-polyfill";

const mockData = [
  {
    date: "2016-01-05",
    user_id: 1,
    user_type: "natural",
    type: "cash_in",
    operation: { amount: 200, currency: "EUR" },
  },
  {
    date: "2016-01-06",
    user_id: 2,
    user_type: "juridical",
    type: "cash_out",
    operation: { amount: 300, currency: "EUR" },
  },
  {
    date: "2016-01-06",
    user_id: 1,
    user_type: "natural",
    type: "cash_out",
    operation: { amount: 326800, currency: "EUR" },
  },
  {
    date: "2016-01-07",
    user_id: 5,
    user_type: "natural",
    type: "cash_out",
    operation: { amount: 700, currency: "EUR" },
  },
  {
    date: "2016-01-07",
    user_id: 5,
    user_type: "natural",
    type: "cash_out",
    operation: { amount: 800, currency: "EUR" },
  },
  {
    date: "2016-01-10",
    user_id: 1,
    user_type: "natural",
    type: "cash_out",
    operation: { amount: 100, currency: "EUR" },
  },
  {
    date: "2016-01-10",
    user_id: 2,
    user_type: "juridical",
    type: "cash_in",
    operation: { amount: 1000000, currency: "EUR" },
  },
  {
    date: "2016-01-10",
    user_id: 3,
    user_type: "natural",
    type: "cash_out",
    operation: { amount: 1000, currency: "EUR" },
  },
  {
    date: "2016-02-15",
    user_id: 1,
    user_type: "natural",
    type: "cash_out",
    operation: { amount: 300, currency: "EUR" },
  },
  {
    date: "2016-01-06",
    user_id: 2,
    user_type: "juridical",
    type: "cash_out",
    operation: { amount: 40, currency: "EUR" },
  },
];
const mockApi = {
  cashIn: { percents: 0.03, max: { amount: 5, currency: "EUR" } },
  natural: { percents: 0.3, week_limit: { amount: 1000, currency: "EUR" } },
  juridical: { percents: 0.3, min: { amount: 0.5, currency: "EUR" } },
};
describe("getCommissionFunction", function () {
  it("should return calculateCashIn function", function () {
    assert.equal(getCommissionFunction(
      mockData[0].user_type, 
      mockData[0].type
      ), calculateCashIn);
  });
  it("should return calculateNatural function", function () {
    assert.equal(getCommissionFunction(
      mockData[2].user_type, 
      mockData[2].type
      ), calculateNatural);
  });
  it("should return calculateJuridical function", function () {
    assert.equal(getCommissionFunction(
      mockData[1].user_type, 
      mockData[1].type
      ), calculateJuridical);
  });
});

describe("calculateCashIn", function () {
  it("should calculate correct commision for cash-in", function () {
    assert.equal(calculateCashIn(mockData[0], mockApi), 0.06);
  });
  it("should return type number", function () {
    assert.typeOf(calculateCashIn(mockData[0], mockApi), 'number');
  });
});

describe("calculateNatural", function () {
  it("should calculate correct commision for natural user type", function () {
    assert.equal(calculateNatural(mockData[2], mockApi), 977.40);
  });
  it("should calculate correct commision for natural user type with previous payments", function () {
    calculateNatural(mockData[3], mockApi);
    assert.equal(calculateNatural(mockData[4], mockApi), 1.5);
  });
  it("should return type number", function () {
    assert.typeOf(calculateCashIn(mockData[2], mockApi), 'number');
  });
});

describe("calculateJuridical", function () {
  it("should calculate correct commision for juridical user type", function () {
    assert.equal(calculateJuridical(mockData[1], mockApi), 0.90);
  });
  it("should calculate correct commision for juridical user, when amount less than 0.5", function () {
    assert.equal(calculateJuridical(mockData[9], mockApi), 0.50);
  });
  it("should return type number", function () {
    assert.typeOf(calculateCashIn(mockData[1], mockApi), 'number');
  });
});
