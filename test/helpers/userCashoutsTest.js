import { assert } from "chai";
import UserCashOuts from "../../helpers/userCashOuts";

let test = new UserCashOuts();
beforeEach(function () {
  test = new UserCashOuts();
});
describe("getUserCashOuts", function () {
  it("should return 0 if user was not set previously", function () {
    assert.equal(test.getUserCashOuts(1, "2016-01-07"), 0);
  });

  it("should return 0 if year was not set previously", function () {
    test.setUserCashOut(1, 10, "2016-01-07");
    assert.equal(test.getUserCashOuts(1, "2014-01-07"), 0);
  });
  it("should return 0 if week was not set previously", function () {
    test.setUserCashOut(1, 10, "2020-06-07");
    assert.equal(test.getUserCashOuts(1, "2020-06-08"), 0);
  });
  it("should return amount that was set previously if it exists", function () {
    test.setUserCashOut(1, 10, "2020-06-07");
    assert.equal(test.getUserCashOuts(1, "2020-06-07"), 10);
  });

});
describe("setUserCashOuts", function () {
  it("should save a payment", function () {
    test.setUserCashOut(1, 10, "2020-06-05");
    assert.equal(test.getUserCashOuts(1, "2020-06-06"), 10);
  });
  it("should add payments made on the same week if there were made any", function () {
    test.setUserCashOut(1, 10, "2020-06-05");
    test.setUserCashOut(1, 10, "2020-06-07");
    assert.equal(test.getUserCashOuts(1, "2020-06-06"), 20);
  });
});
