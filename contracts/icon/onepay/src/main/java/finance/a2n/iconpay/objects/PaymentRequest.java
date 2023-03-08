package finance.a2n.iconpay.objects;

import java.math.BigInteger;
import java.util.Map;

import score.Address;
import score.ObjectReader;
import score.ObjectWriter;
import static java.util.Map.entry;

public class PaymentRequest {
	private final BigInteger requestId;
	private final Address sender;
	private final Address tokenAddress;
	private final boolean isNativeToken;
	private final long startDate;
	private BigInteger paymentAmount;
	private BigInteger remainingBalance;
	private int prepaidPercentage;
	private BigInteger unlockAmountPerTime;
	private int unlockEvery;
	private int numberOfUnlocks;
	private Address recipient;
	private final int whoCanCancel;
	private final int whoCanTransfer;
	private int status;
	
	public PaymentRequest(
			BigInteger requestId, 
			Address sender,
			Address tokenAddress, 
			boolean isNativeToken,
			long startDate, 
			BigInteger paymentAmount,
			BigInteger remainingBalance,
			int prepaidPercentage,
			BigInteger unlockAmountPerTime,
			int unlockEvery,
			int numberOfUnlocks,
			Address recipient,
			int whoCanCancel,
			int whoCanTransfer,
			int status
	) {
		this.requestId = requestId;
		this.sender = sender;
		this.tokenAddress = tokenAddress;
		this.isNativeToken = isNativeToken;
		this.startDate = startDate;
		this.paymentAmount = paymentAmount;
		this.remainingBalance = remainingBalance;
		this.prepaidPercentage = prepaidPercentage;
		this.unlockAmountPerTime = unlockAmountPerTime;
		this.unlockEvery = unlockEvery;
		this.numberOfUnlocks = numberOfUnlocks;
		this.recipient = recipient;
		this.whoCanCancel = whoCanCancel;
		this.whoCanTransfer = whoCanTransfer;
		this.status = status;
	}
	
	public BigInteger requestId() {
		return this.requestId;
	}
	
	public Address sender() {
		return this.sender;
	}
	
	public Address tokenAddress() {
		return this.tokenAddress;
	}
	
	public boolean isNativeToken() {
		return this.isNativeToken;
	}
	
	public long startDate() {
		return this.startDate;
	}
	
	public BigInteger paymentAmount() {
		return this.paymentAmount;
	}
	
	public BigInteger remainingBalance() {
		return this.remainingBalance;
	}

	public int prepaidPercentage() {
		return this.prepaidPercentage;
	}
	
	public int unlockEvery() {
		return this.unlockEvery;
	}
	
	public int numberOfUnlocks() {
		return this.numberOfUnlocks;
	}
	
	public Address recipient() {
		return this.recipient;
	}
	
	public BigInteger unlockAmountPerTime() {
		return this.unlockAmountPerTime;
	}
	
	public int whoCanCancel() {
		return this.whoCanCancel;
	}
	
	public int whoCanTransfer() {
		return this.whoCanTransfer;
	}
	
	public int status() {
		return this.status;
	}
	
	public void setRemainingBalance(BigInteger remainingBalance) {
		this.remainingBalance = remainingBalance;
	}
	
	public void setRecipient(Address recipient) {
		this.recipient = recipient;
	}
	
	public void setStatus(int status) {
		this.status = status;
	}
	
	
	public static void writeObject(ObjectWriter w, PaymentRequest t) {
        w.beginList(15);
        w.write(t.requestId);
        w.write(t.sender);
        w.write(t.tokenAddress);
        w.write(t.isNativeToken);
        w.write(t.startDate);
        w.write(t.paymentAmount);
        w.write(t.remainingBalance);
		w.write(t.prepaidPercentage);
		w.write(t.unlockAmountPerTime);
		w.write(t.unlockEvery);
		w.write(t.numberOfUnlocks);
        w.write(t.recipient);
        w.write(t.whoCanCancel);
        w.write(t.whoCanTransfer);
        w.write(t.status);
        w.end();
    }

    public static PaymentRequest readObject(ObjectReader r) {
        r.beginList();
        PaymentRequest t = new PaymentRequest(
        		r.readBigInteger(),
        		r.readAddress(),
                r.readAddress(),
                r.readBoolean(),
                r.readLong(),
                r.readBigInteger(),
                r.readBigInteger(),
				r.readInt(),
                r.readBigInteger(),
                r.readInt(),
				r.readInt(),
                r.readAddress(),
                r.readInt(),
                r.readInt(),
                r.readInt()
        );
        r.end();
        return t;
    }
    
    @Override
    public String toString() {
        return "PaymentRequest{" +
                "requestId=" + requestId +
                ", sender='" + sender + '\'' +
                ", tokenAddress='" + tokenAddress + '\'' +
                ", isNativeToken='" + isNativeToken + '\'' +
                ", startDate='" + startDate + '\'' +
                ", paymentAmount='" + paymentAmount + '\'' +
                ", remainingBalance='" + remainingBalance + '\'' +
				", prepaidPercentage=" + prepaidPercentage + '\'' +
				", unlockAmountPerTime=" + unlockAmountPerTime + '\'' +
				", unlockEvery=" + unlockEvery + '\'' +
				", numberOfUnlocks=" + numberOfUnlocks + '\'' +
                ", recipient=" + recipient.toString() + '\'' +
                ", whoCanCancel='" + whoCanCancel + '\'' +
                ", whoCanTransfer='" + whoCanTransfer + '\'' +
                ", status=" + status +
                '}';
    }


	public Map<String, String> toMap() {
		return Map.ofEntries(
			entry("requestId", requestId.toString()),
			entry("sender", sender.toString()),
			entry("tokenAddress", tokenAddress.toString()),
			entry("isNativeToken", String.valueOf(isNativeToken)),
			entry("startDate", String.valueOf(startDate)),
			entry("paymentAmount", paymentAmount.toString()),
			entry("remainingBalance", remainingBalance.toString()),
			entry("prepaidPercentage", String.valueOf(prepaidPercentage)),
			entry("unlockAmountPerTime", unlockAmountPerTime.toString()),
			entry("unlockEvery", String.valueOf(unlockEvery)),
			entry("numberOfUnlocks", String.valueOf(numberOfUnlocks)),
			entry("recipient", recipient.toString()),
			entry("whoCanCancel", String.valueOf(whoCanCancel)),
			entry("whoCanTransfer", String.valueOf(whoCanTransfer)),
			entry("status", String.valueOf(status))
			
		);
	}

}