import { exec } from 'child_process';
import { EXAMPLE_SCRIPT_PATH_INPUT, EXAMPLE_SCRIPT_PATH_OUTPUT } from '../config/path.config';
import * as path from 'path';
export function toDisplay() {
  exec(`cpx "${path.join(EXAMPLE_SCRIPT_PATH_INPUT, '**/*')}" ${EXAMPLE_SCRIPT_PATH_OUTPUT}`);
}
