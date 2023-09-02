import { PrismaClient } from '@prisma/client';
import { IDataBase } from './database.interface';

export class DatabaseService extends PrismaClient implements IDataBase {
	async init(): Promise<void> {
		await this.$connect();
	}
}

