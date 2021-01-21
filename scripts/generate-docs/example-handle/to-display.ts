import { exec } from 'child_process';
import { EXAMPLE_SCRIPT_PATH_OUTPUT } from '../config/path.config';
import * as path from 'path';
import * as fs from 'fs-extra';
export function toDisplay(input: string) {
  fs.removeSync(EXAMPLE_SCRIPT_PATH_OUTPUT);
  exec(`cpx "${path.join(input, '**/*')}" ${EXAMPLE_SCRIPT_PATH_OUTPUT}`);
}
