import { promisify } from 'util';
import { readFile } from 'fs';

export const readFromFile = promisify(readFile);
