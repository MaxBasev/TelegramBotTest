import axios from 'axios';
import { ConfigService } from '../config/config.service';
import { CreatePaymentResult, ICryptomusService } from './cryptomus.interface';
import crypto from 'crypto';

export class CryptomusService implements ICryptomusService {
	private apiKey: string;
	private merchantId: string;

	constructor(private readonly configService: ConfigService) {
		this.apiKey = configService.get('CRYPTOMUS_API_KEY');
		this.merchantId = configService.get('CRYPTOMUS_MERCHANT_ID');
	}

	getHeader(payload: string) {
		const sign = crypto
			.createHash('md5')
			.update(Buffer.from(payload).toString('base64') + this.apiKey)
			.digest('hex');
		return {
			merchant: this.merchantId,
			sign,
		}
	}
	async createPayment(amount: number, orderId: string) {
		try {
			const payload = {
				amount: amount.toString(),
				currency: 'USD',
				order_id: orderId,
			};
			const { data } = await axios.post<CreatePaymentResult>(
				'https://api.cryptomus.com/v1/payment',
				payload,
				{ headers: this.getHeader(JSON.stringify(payload)), });

			return data;
		}
		catch (e) {
			console.error(e)
		}
	}
	async checkPayment(uuid: string): Promise<CreatePaymentResult | undefined> {
		try {
			const payload = {
				uuid,
			};
			const { data } = await axios.post<CreatePaymentResult>(
				'https://api.cryptomus.com/v1/payment/info',
				payload,
				{ headers: this.getHeader(JSON.stringify(payload)), });

			return data;
		}
		catch (e) {
			console.error(e)
		}
	}
}