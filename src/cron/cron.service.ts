import { Telegraf } from 'telegraf';
import { IDataBase } from '../database/database.interface';
import { IBotContext } from '../context/context.interface';
import cron from 'node-cron';
import { ICryptomusService } from '../cryptomus/cryptomus.interface';
import { ICronService } from './cron.interface';

export class CronService implements ICronService {
	constructor(private readonly databaseService: IDataBase, private readonly cryptomusService: ICryptomusService,
		private readonly bot: Telegraf<IBotContext>) {

	}

	async init() {
		cron.schedule('*/5 * * * *', async () => {
			const payments = await this.databaseService.payment.findMany({
				where: {
					isFinal: false,
				}
			});
			for (const payment of payments) {
				const res = await this.cryptomusService.checkPayment(payment.uuid);
				if (!res) {
					console.log("Error");
					continue;
				}
				if (res.result.is_final) {
					this.bot.telegram.sendMessage(payment.chatId, res.result.status);
				}
				await this.databaseService.payment.update({
					where: {
						uuid: payment.uuid
					},
					data: {
						uuid: res.result.uuid,
						orderId: res.result.order_id,
						status: res.result.status,
						amount: res.result.amount,
						paymentAmount: res.result.payment_amount,
						isFinal: res.result.is_final,
						url: res.result.url,
						chatId: payment.id
					}
				})
			}
		})
	}
}