import { request } from './services/requestData';
import { readFromFile } from './services/readFile';
import { getCommissionFunction } from './helpers/commissionFunctions';
import { up } from "round-to";

const ROUND_TO = 2;

const execute = async () => {
  try {
    const allCommissions = await request();
    const data = await readFromFile(process.argv[2], "utf8");
    handleData(JSON.parse(data), allCommissions);
  } catch (error) {
    console.log(console.log(error));
  }
};

const handleData = (operations, commissions) => {
  const results = operations.map((operation) => {
    const commisionFunction = getCommissionFunction(
      operation.user_type,
      operation.type
    );
    return up(commisionFunction(operation, commissions), ROUND_TO).toFixed(ROUND_TO);
  });
  results.map((x) => process.stdout.write(x + "\n"));
};

execute();