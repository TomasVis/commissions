import { request } from './services/requestData';
import { readFromFile } from './services/readFile';
import { getCommissionFunction } from './helpers/commissionFunctions';
import { up } from "round-to";

const ROUND_TO = 2;
export const forTest = () => 'hello';
export const execute = async (apiRequestFunction, fileReadFunction) => {
  try {
    const allCommissions = await apiRequestFunction();
    const data = await fileReadFunction(process.env.npm_config_path, "utf8");
    handleData(JSON.parse(data), allCommissions);
  } catch (error) {
    console.log(error);
  }
};

export const handleData = (operations, commissions) => {
  const results = operations.map((operation) => {
    const commisionFunction = getCommissionFunction(
      operation.user_type,
      operation.type
    );
    return up(commisionFunction(operation, commissions), ROUND_TO).toFixed(ROUND_TO);
  });
  results.map((x) => process.stdout.write(x + "\n"));
};

execute(request, readFromFile);