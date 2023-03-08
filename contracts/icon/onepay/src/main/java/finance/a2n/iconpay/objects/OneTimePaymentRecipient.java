package finance.a2n.iconpay.objects;

import java.math.BigInteger;
import scorex.util.ArrayList;
import java.util.List;
import scorex.util.StringTokenizer;

import score.Address;

public class OneTimePaymentRecipient {
	
	private Address recipient;
	private BigInteger amount;

	public OneTimePaymentRecipient(Address recipient, BigInteger amount) {
		this.recipient = recipient;
		this.amount = amount;
	}
	
	public Address recipient() {
		return this.recipient;
	}
	
	public BigInteger amount() {
		return this.amount;
	}

	public static List<OneTimePaymentRecipient> convertFromString(String _recipients) {
		
		List<OneTimePaymentRecipient> recipients = new ArrayList<OneTimePaymentRecipient>();
		
		StringTokenizer params = new StringTokenizer(_recipients, ";");
		while(params.hasMoreTokens()) {
			recipients.add(fromString(params.nextToken()));
		}
		return recipients;
		
	}
	
	protected static OneTimePaymentRecipient fromString(String _recipient) {
		StringTokenizer params = new StringTokenizer(_recipient, ",");
		List<String> recipientAttributes = new ArrayList<String>();
		while(params.hasMoreTokens()) {
			recipientAttributes.add(params.nextToken());
		}
		OneTimePaymentRecipient recipient = new OneTimePaymentRecipient(
				Address.fromString(recipientAttributes.get(0)), 
				new BigInteger(recipientAttributes.get(1))
			
		);
		return recipient;
	}

}
