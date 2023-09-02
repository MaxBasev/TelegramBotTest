import { Telegraf } from 'telegraf';
import { IConfigService } from './config/config.interface';
import { ConfigService } from './config/config.service';
import { IBotContext } from './context/context.interface';
import { Command } from './commands/command.class';
import { StartCommand } from './commands/start.command';
import LocalSession from 'telegraf-session-local';
import { DatabaseService } from './database/database.service';
import { CryptomusService } from './cryptomus/cryptomus.service';
import { ICryptomusService } from './cryptomus/cryptomus.interface';
import { IDataBase } from './database/database.interface';
import { CronService } from './cron/cron.service';

class Bot {

	bot: Telegraf<IBotContext>
	commands: Command[] = [];

	constructor(
		private readonly configService: IConfigService,
		private readonly databaseService: IDataBase,
		private readonly cryptomusService: ICryptomusService) {
		this.bot = new Telegraf<IBotContext>(this.configService.get('TOKEN'));
		this.bot.use(new LocalSession({ database: 'sessions.json' }).middleware());
	}

	async init() {
		await new CronService(this.databaseService, this.cryptomusService, this.bot).init();
		await this.databaseService.init();
		this.commands = [new StartCommand(this.bot, this.cryptomusService, this.databaseService)];
		for (const command of this.commands) {
			command.handle();
		}
		this.bot.launch();
	}

}

const config = new ConfigService();
const cryptomusService = new CryptomusService(config);
const database = new DatabaseService();
const bot = new Bot(config, database, cryptomusService);
bot.init();