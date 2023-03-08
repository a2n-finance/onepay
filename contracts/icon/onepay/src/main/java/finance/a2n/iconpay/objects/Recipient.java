package finance.a2n.iconpay.objects;

import java.math.BigInteger;
import scorex.util.ArrayList;
import java.util.List;
import scorex.util.StringTokenizer;

import score.Address;

public class Recipient {
	
	private Address recipient;
	private int unlockEvery;
	private BigInteger unlockAmountPerTime;
	private int numberOfUnlocks;
	private int prepaidPercentage;

	public Recipient(Address recipient, int unlockEvery, BigInteger unlockAmountPerTime, int numberOfUnlocks, int prepaidPercentage) {
		this.recipient = recipient;
		this.unlockEvery = unlockEvery;
		this.unlockAmountPerTime = unlockAmountPerTime;
		this.numberOfUnlocks = numberOfUnlocks;
		this.prepaidPercentage = prepaidPercentage;
	}
	
	public Address recipient() {
		return this.recipient;
	}
	
	public int unlockEvery() {
		return this.unlockEvery;
	}

	public BigInteger unlockAmountPerTime() {
		return this.unlockAmountPerTime;
	}

	public int numberOfUnlocks() {
		return this.numberOfUnlocks;
	}
	
	public int prepaidPercentage() {
		return this.prepaidPercentage;
	}

	public static List<Recipient> convertFromString(String _recipients) {
		
		List<Recipient> recipients = new ArrayList<Recipient>();
		
		StringTokenizer params = new StringTokenizer(_recipients, ";");
		while(params.hasMoreTokens()) {
			recipients.add(fromString(params.nextToken()));
		}
		return recipients;
		
	}
	
	protected static Recipient fromString(String _recipient) {
		StringTokenizer params = new StringTokenizer(_recipient, ",");
		List<String> recipientAttributes = new ArrayList<String>();
		while(params.hasMoreTokens()) {
			recipientAttributes.add(params.nextToken());
		}
		Recipient recipient = new Recipient(
				Address.fromString(recipientAttributes.get(0)), 
				Integer.valueOf(recipientAttributes.get(1)),
				new BigInteger(recipientAttributes.get(2)),
				Integer.valueOf(recipientAttributes.get(3)),
				Integer.valueOf(recipientAttributes.get(4))
		);
		return recipient;
	}

}
