import { assert } from "chai";
import chai from "chai";
import { request } from "../../services/requestData";
chai.use(require("chai-as-promised"));
import "babel-polyfill";

it("Should return correct data from api", async () => {
    assert.deepEqual(await request(), {
        cashIn: { percents: 0.03, max: { amount: 5, currency: "EUR" } },
        natural: { percents: 0.3, week_limit: { amount: 1000, currency: "EUR" } },
        juridical: { percents: 0.3, min: { amount: 0.5, currency: "EUR" } }
      });
});
