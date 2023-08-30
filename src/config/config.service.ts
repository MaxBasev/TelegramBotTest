import { DotenvParseOutput, config } from 'dotenv';
import { IConfigService } from './config.interface';

export class ConfigService implements IConfigService {
	private config: DotenvParseOutput;
	constructor() {
		const { error, parsed } = config();
		if (error) {
			throw new Error('No file .env');
		}
		if (!parsed) {
			throw new Error('File .env is EMPTY');
		}
		this.config = parsed;
	}

	get(key: string): string {
		const res = this.config[key];
		if (!res) {
			throw new Error(`No key ${key}`);
		}
		return res;
	}
}