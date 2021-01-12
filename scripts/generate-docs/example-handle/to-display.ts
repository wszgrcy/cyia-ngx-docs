import { exec } from 'child_process';
import { EXAMPLE_SCRIPT_PATH_OUTPUT } from '../config/path.config';
import * as path from 'path';
export function toDisplay(input: string) {
  exec(`cpx "${path.join(input, '**/*')}" ${EXAMPLE_SCRIPT_PATH_OUTPUT}`);
}
