package finance.a2n.iconpay;

import score.Address;
import score.ArrayDB;
import score.BranchDB;
import score.Context;
import score.DictDB;
import score.VarDB;
import score.annotation.EventLog;
import score.annotation.External;
import score.annotation.Payable;

import java.math.BigInteger;
import java.util.List;
import java.util.Map;

import finance.a2n.iconpay.interfaces.IUser;
import finance.a2n.iconpay.interfaces.IOnePay;
import finance.a2n.iconpay.objects.OneTimePaymentRecipient;
import finance.a2n.iconpay.objects.OneTimePaymentSetting;
import finance.a2n.iconpay.objects.PaymentRequest;
import finance.a2n.iconpay.objects.Recipient;
import finance.a2n.iconpay.objects.RecurringSetting;

/**
 * 
 * @author Levia2n
 * @version 1.0.0
 * @since 20230126
 * 
 * Need defend Reentrancy Need pausable contract
 *
 */
public class OnePay implements IOnePay, IUser {

	private VarDB<BigInteger> requestsCount = Context.newVarDB("requestsCount", BigInteger.class);
	private VarDB<Address> contractOwner = Context.newVarDB("contractOwner", Address.class);
	private DictDB<BigInteger, PaymentRequest> paymentRequests = Context.newDictDB("paymentRequests",
			PaymentRequest.class);
	private BranchDB<Address, ArrayDB<BigInteger>> senderToRequests = Context.newBranchDB("senderToRequests",
			BigInteger.class);
	private BranchDB<Address, ArrayDB<BigInteger>> recipientToRequests = Context.newBranchDB("recipientToRequests",
			BigInteger.class);

	private BranchDB<Address, ArrayDB<Address>> usersTokens = Context.newBranchDB("usersTokens", Address.class);
	private BranchDB<Address, DictDB<Address, BigInteger>> usersBalance = Context.newBranchDB("usersBalance",
			BigInteger.class);
	private BranchDB<Address, DictDB<Address, BigInteger>> usersLockedAmount = Context.newBranchDB("usersLockedAmount",
			BigInteger.class);


	public OnePay() {
		this.contractOwner.set(Context.getCaller());
	}

	@External(readonly = true)
	public String name() {
		return "OnePay - A2N Finance";
	}

	@External
	public void tokenFallback(Address _from, BigInteger _value, byte[] _data) {
		Context.require(_value.compareTo(BigInteger.ZERO) > 0);
		if (this.usersBalance.at(_from).getOrDefault(Context.getCaller(), null) == null) {
			this.usersTokens.at(_from).add(Context.getCaller());
		}

		BigInteger balance = this.usersBalance.at(_from).getOrDefault(Context.getCaller(), BigInteger.ZERO);
		this.usersBalance.at(_from).set(Context.getCaller(), balance.add(_value));
		DepositToken(_from, _value, _data);
	}

	@Payable
	public void fallback() {
		Address _from = Context.getCaller();
		BigInteger _value = Context.getValue();
		Context.require(_value.compareTo(BigInteger.ZERO) > 0);

		if (this.usersBalance.at(_from).getOrDefault(Context.getAddress(), null) == null) {
			this.usersTokens.at(_from).add(Context.getAddress());
		}
		BigInteger currentBalance = this.usersBalance.at(_from).getOrDefault(Context.getAddress(), BigInteger.ZERO);
		this.usersBalance.at(_from).set(Context.getAddress(), currentBalance.add(_value));
		Deposit(_from, _value);
	}

	@External(readonly = true)
	public List<Map<String, String>> getSenderRequests(Address caller) {
		int len = this.senderToRequests.at(caller).size();
		
		@SuppressWarnings("unchecked")
		Map<String, String>[] entries = new Map[len];

		for (int i = 0; i < len; i++) {
			BigInteger requestId = this.senderToRequests.at(caller).get(i);
			entries[i] = this.paymentRequests.get(requestId).toMap();
		}
		return List.of(entries);

	}

	@External(readonly = true)
	public List<Map<String, String>> getRecipientRequests(Address caller) {
		int len = this.recipientToRequests.at(caller).size();
		
		@SuppressWarnings("unchecked")
		Map<String, String>[] entries = new Map[len];

		for (int i = 0; i < len; i++) {
			BigInteger requestId = this.recipientToRequests.at(caller).get(i);
			entries[i] = this.paymentRequests.get(requestId).toMap();
		}
		return List.of(entries);
	}

	@External(readonly = true)
	public BigInteger getRequestCount() {
		return this.requestsCount.getOrDefault(BigInteger.ZERO);
	}

	@External
	public void createRecurringPayments(String _setting, String _recipients) {
		RecurringSetting setting = RecurringSetting.convertFromString(_setting);
		List<Recipient> recipients = Recipient.convertFromString(_recipients);
		validateSetting(setting);
		
		BigInteger count = this.requestsCount.getOrDefault(BigInteger.ZERO);
		Address sender = Context.getCaller();
		BigInteger totalAmount = BigInteger.ZERO;

		BigInteger userTokenBalance = this.usersBalance.at(sender).getOrDefault(setting.tokenAddress(), BigInteger.ZERO);
		BigInteger userLockedTokenBalance = this.usersLockedAmount.at(sender).getOrDefault(setting.tokenAddress(), BigInteger.ZERO);

		Recipient recipient = null;
		BigInteger payAmount = BigInteger.ZERO;
		// Need to check total amount < balance - unlocked amount

		for (int i=0; i < recipients.size(); i++) {
			
			recipient = recipients.get(i);

			payAmount = recipient.unlockAmountPerTime().multiply(
					BigInteger.valueOf(recipient.numberOfUnlocks())
			);

			if (recipient.prepaidPercentage() > 0) {
				payAmount = getAmountWithPrepaid(payAmount, recipient.prepaidPercentage());
			}

			totalAmount = totalAmount.add(payAmount);
		}

		Context.require(userTokenBalance.subtract(userLockedTokenBalance).compareTo(totalAmount) >= 0, "totalAmount>remainBalance");

		for (int i = 0; i < recipients.size(); i++) {
			recipient = recipients.get(i);
			payAmount = recipient.unlockAmountPerTime().multiply(
					BigInteger.valueOf(recipient.numberOfUnlocks())
			);

			if (recipient.prepaidPercentage() > 0) {
				payAmount = getAmountWithPrepaid(payAmount, recipient.prepaidPercentage());
			}

			BigInteger localCount = count.add(BigInteger.valueOf(i));
			PaymentRequest request = new PaymentRequest(
				localCount, 
				sender, 
				setting.tokenAddress(),
				setting.isNativeToken(), 
				setting.startDate(),
				payAmount, 
				payAmount, 
				recipient.prepaidPercentage(),
				recipient.unlockAmountPerTime(),
				recipient.unlockEvery(), 
				recipient.numberOfUnlocks(),
				recipient.recipient(), 
				setting.whoCanCancel(), 
				setting.whoCanTransfer(), 
				1
			);
			this.senderToRequests.at(sender).add(localCount);
			this.recipientToRequests.at(recipients.get(i).recipient()).add(localCount);
			this.paymentRequests.set(localCount, request);
		}
		this.requestsCount.set(count.add(BigInteger.valueOf(recipients.size())));

		BigInteger lockedAmount = this.usersLockedAmount.at(sender)
				.getOrDefault(setting.tokenAddress(), BigInteger.ZERO).add(totalAmount);

		this.usersLockedAmount.at(sender).set(setting.tokenAddress(), lockedAmount);

		// Emit event log
		CreateRecurringPayments(sender, totalAmount);

	}

	@External
	public void createOneTimePayments(String _setting, String _recipients) {
		Address caller = Context.getCaller();
		BigInteger count = this.requestsCount.getOrDefault(BigInteger.ZERO);
		OneTimePaymentSetting setting = OneTimePaymentSetting.convertFromString(_setting);

		List<OneTimePaymentRecipient> recipients = OneTimePaymentRecipient.convertFromString(_recipients);
		
		BigInteger totalAmount = BigInteger.ZERO;

		BigInteger userTokenBalance = this.usersBalance.at(caller).getOrDefault(setting.tokenAddress(), BigInteger.ZERO);
		BigInteger userLockedTokenBalance = this.usersLockedAmount.at(caller).getOrDefault(setting.tokenAddress(), BigInteger.ZERO);

		OneTimePaymentRecipient recipient = null;

		for (int i=0; i < recipients.size(); i++) {
			
			recipient = recipients.get(i);

			totalAmount = totalAmount.add(recipient.amount());
		}

		Context.require(userTokenBalance.subtract(userLockedTokenBalance).compareTo(totalAmount) >= 0, "totalAmount>remainBalance");

		if (setting.isPayNow()) {

			this.usersBalance.at(caller).set(setting.tokenAddress(), userTokenBalance.subtract(totalAmount));

			for (int i=0; i < recipients.size(); i++) {
				recipient = recipients.get(i);
				if (setting.isNativeToken() || setting.tokenAddress().equals(Context.getAddress())) {

					Context.transfer(recipient.recipient(), recipient.amount());
					
				} else {
					Context.call(setting.tokenAddress(), "transfer", recipient.recipient(), recipient.amount());
				}
			}
			
			
		} else {
			Context.require(setting.startDate() * 1000 >= Context.getBlockTimestamp(), "startdate<blocktime");
			for (int i = 0; i < recipients.size(); i++) {
				recipient = recipients.get(i);
	
				BigInteger localCount = count.add(BigInteger.valueOf(i));

				PaymentRequest request = new PaymentRequest(
					localCount, 
					caller, 
					setting.tokenAddress(),
					setting.isNativeToken(), 
					setting.startDate(),
					recipient.amount(), 
					recipient.amount(), 
					0,
					recipient.amount(),
					1, 
					1,
					recipient.recipient(), 
					3, 
					3, 
					1
				);
				this.senderToRequests.at(caller).add(localCount);
				this.recipientToRequests.at(recipient.recipient()).add(localCount);
				this.paymentRequests.set(localCount, request);
			}
			this.requestsCount.set(count.add(BigInteger.valueOf(recipients.size())));
	
			BigInteger lockedAmount = this.usersLockedAmount.at(caller)
					.getOrDefault(setting.tokenAddress(), BigInteger.ZERO).add(totalAmount);
	
			this.usersLockedAmount.at(caller).set(setting.tokenAddress(), lockedAmount);
		}

		CreateOneTimePayments(caller, totalAmount);
	}

	@External
	public void withdrawFromPaymentRequest(BigInteger requestId, BigInteger amount) {
		onlyRecipient(requestId);
		Context.require(amount.signum() > 0, "amount<=0");
		PaymentRequest paymentRequest = this.paymentRequests.getOrDefault(requestId, null);
		Context.require(paymentRequest != null, "!requestId");

		BigInteger unlockedAmount = getRecipientUnlockedAmount(paymentRequest);
		
		BigInteger withdrewAmount = paymentRequest.paymentAmount().subtract(paymentRequest.remainingBalance());

		BigInteger senderBalance = this.usersBalance.at(paymentRequest.sender()).getOrDefault(paymentRequest.tokenAddress(), BigInteger.ZERO);

		BigInteger senderLockedBalance = this.usersLockedAmount.at(paymentRequest.sender()).getOrDefault(paymentRequest.tokenAddress(), BigInteger.ZERO);

		Context.require(unlockedAmount.subtract(withdrewAmount).compareTo(amount) >= 0, "Available amount < amount");

		paymentRequest.setRemainingBalance(paymentRequest.remainingBalance().subtract(amount));

		if(paymentRequest.remainingBalance().signum() == 0) {
			paymentRequest.setStatus(3);
		}
		
		this.paymentRequests.set(requestId, paymentRequest);

		this.usersBalance.at(paymentRequest.sender()).set(paymentRequest.tokenAddress(), senderBalance.subtract(amount));
		this.usersLockedAmount.at(paymentRequest.sender()).set(paymentRequest.tokenAddress(), senderLockedBalance.subtract(amount));

		if (paymentRequest.isNativeToken()) {
			Context.transfer(paymentRequest.recipient(), amount);
		} else {
			Context.call(paymentRequest.tokenAddress(), "transfer", paymentRequest.recipient(), amount);
		}

		// Emit event log
		WithdrawFromPaymentRequest(Context.getCaller(), requestId, amount);

	}

	@External
	public void cancelPaymentRequest(BigInteger requestId) {
		PaymentRequest paymentRequest = this.paymentRequests.getOrDefault(requestId, null);
		
		Context.require(paymentRequest != null, "!requsetId");
		Context.require(paymentRequest.status() == 1, "!active");
		// Check permission who can cancel
		Address caller = Context.getCaller();
		// Check permission who can transfer
		if (paymentRequest.whoCanCancel() == 0) {
			
			Context.require(caller.equals(paymentRequest.sender()), "caller!=sender");

		} else if (paymentRequest.whoCanCancel() == 1) {
			
			Context.require(caller.equals(paymentRequest.recipient()), "caller!=recipient");
		} else {
			Context.require(caller.equals(paymentRequest.sender()) || caller.equals(paymentRequest.recipient()), "!caller");
		}
		// Status 1: active, 2: canceled, 3: completed

		BigInteger recipientUnlockedAmount = getRecipientUnlockedAmount(paymentRequest);

		BigInteger availableRecipientAmount = recipientUnlockedAmount.subtract(
			paymentRequest.paymentAmount().subtract(paymentRequest.remainingBalance())
		);

		BigInteger remainSenderAmount = paymentRequest.paymentAmount().subtract(recipientUnlockedAmount);

		paymentRequest.setRemainingBalance(BigInteger.ZERO);
		paymentRequest.setStatus(2);

		this.paymentRequests.set(requestId, paymentRequest);
		
		BigInteger userTokenBalance = this.usersBalance.at(paymentRequest.sender()).get(paymentRequest.tokenAddress());

		BigInteger userLockedTokenBalance = this.usersLockedAmount.at(paymentRequest.sender()).get(paymentRequest.tokenAddress());

		this.usersBalance.at(paymentRequest.sender()).set(paymentRequest.tokenAddress(), 
			userTokenBalance.subtract(availableRecipientAmount)
		);
		
		this.usersLockedAmount.at(paymentRequest.sender()).set(paymentRequest.tokenAddress(),
		 	userLockedTokenBalance.subtract(remainSenderAmount.add(availableRecipientAmount))
		);

		if (paymentRequest.isNativeToken()) {
			Context.transfer(paymentRequest.recipient(), availableRecipientAmount);
		} else {
			Context.call(paymentRequest.tokenAddress(), "transfer", paymentRequest.recipient(), availableRecipientAmount);
		}
		
		// Emit event log
		CancelPaymentRequest(Context.getCaller(), requestId);
	}

	@External
	public void transferPaymentRequest(BigInteger requestId, Address to) {
		// Check permission
		PaymentRequest paymentRequest = this.paymentRequests.getOrDefault(requestId, null);
		
		Context.require(paymentRequest != null, "!requsetId");
		Context.require(paymentRequest.status() == 1, "!active");
		Address caller = Context.getCaller();
		// Check permission who can transfer
		if (paymentRequest.whoCanTransfer() == 0) {

			Context.require(caller.equals(paymentRequest.sender()), "caller!=sender");
		} else if (paymentRequest.whoCanTransfer() == 1) {
			Context.require(caller.equals(paymentRequest.recipient()), "caller!=recipient");
		} else {
			Context.require(caller.equals(paymentRequest.sender()) || caller.equals(paymentRequest.recipient()), "!caller");
		}
		// Status 1: active, 2: canceled, 3: completed

		BigInteger recipientUnlockedAmount = getRecipientUnlockedAmount(paymentRequest);

		BigInteger availableRecipientAmount = recipientUnlockedAmount.subtract(
			paymentRequest.paymentAmount().subtract(paymentRequest.remainingBalance())
		);

		paymentRequest.setRemainingBalance(paymentRequest.remainingBalance().subtract(availableRecipientAmount));

		BigInteger userTokenBalance = this.usersBalance.at(paymentRequest.sender()).get(paymentRequest.tokenAddress());

		BigInteger userLockedTokenBalance = this.usersLockedAmount.at(paymentRequest.sender()).get(paymentRequest.tokenAddress());

		this.usersBalance.at(paymentRequest.sender()).set(paymentRequest.tokenAddress(), 
			userTokenBalance.subtract(availableRecipientAmount)
		);

		this.usersLockedAmount.at(paymentRequest.sender()).set(paymentRequest.tokenAddress(), 
			userLockedTokenBalance.subtract(availableRecipientAmount)
		);

		paymentRequest.setRecipient(to);
		
		this.paymentRequests.set(requestId, paymentRequest);

		if (paymentRequest.isNativeToken()) {
			Context.transfer(paymentRequest.recipient(), availableRecipientAmount);
		} else {
			Context.call(paymentRequest.tokenAddress(), "transfer", paymentRequest.recipient(), availableRecipientAmount);
		}
		
		// Emit event log
		TransferPaymentRequest(Context.getCaller(), to, requestId);
	}

	@External
	public void withdrawBalance(Address tokenAddress, BigInteger amount) {
		Context.require(amount.signum() > 0, "amount<=0");
		Address caller = Context.getCaller();
		BigInteger userBalance = this.usersBalance.at(caller).getOrDefault(tokenAddress, amount);
		BigInteger userLockedBalance = this.usersLockedAmount.at(caller).getOrDefault(tokenAddress, amount);
		Context.require(userBalance.subtract(userLockedBalance).compareTo(amount) >=0, "amount>availableBalance");
		this.usersBalance.at(caller).set(tokenAddress, userBalance.subtract(amount));
		if (tokenAddress.equals(Context.getAddress())) {
			Context.transfer(caller, amount);
		} else {
			Context.call(tokenAddress, "transfer", caller, amount);
		}

		WithdrawBalance(caller, amount);
	}

	@External(readonly = true)
	public BigInteger getUserTokenBalance(Address userAddress, Address tokenAddress) {

		BigInteger amount = this.usersBalance.at(userAddress).getOrDefault(tokenAddress, BigInteger.ZERO);
		return amount;
	}

	@External(readonly = true)
	public BigInteger getUserLockedAmount(Address userAddress, Address tokenAddress) {
		return this.usersLockedAmount.at(userAddress).getOrDefault(tokenAddress, BigInteger.ZERO);
	}

	@External(readonly = true)
	public List<Address> getUserTokens(Address userAddress) {
		ArrayDB<Address> addresses = this.usersTokens.at(userAddress);
		int len = addresses.size();
		Address[] array = new Address[len];
		for (int i = 0; i < len; i++) {
			array[i] = addresses.get(i);
		}
		return List.of(array);
	}

	private BigInteger getAmountWithPrepaid(BigInteger paymentAmount, int prepaidPercentage) {
		
		BigInteger prepaidAmount = paymentAmount.multiply(
			BigInteger.valueOf(prepaidPercentage)
		).divide(BigInteger.valueOf(10000));

		return paymentAmount.add(prepaidAmount);
		
	}

	private BigInteger getRecipientUnlockedAmount(PaymentRequest paymentRequest) {
		BigInteger unlockedAmount = BigInteger.ZERO;

		long diffTime = Context.getBlockTimestamp() - paymentRequest.startDate() * 1000;
		
		
		if (diffTime < 0) {
			return BigInteger.ZERO;
		} 


		long numberOfUnlock = diffTime / (paymentRequest.unlockEvery() * 1000 * 1000);



		if (numberOfUnlock >= paymentRequest.numberOfUnlocks()) {
			unlockedAmount = paymentRequest.paymentAmount();
		} else {
			unlockedAmount = paymentRequest.unlockAmountPerTime().multiply(BigInteger.valueOf(numberOfUnlock));
		}

		if (paymentRequest.prepaidPercentage() > 0) {
			BigInteger prepaidAmount = paymentRequest.paymentAmount().multiply(
				BigInteger.valueOf(paymentRequest.prepaidPercentage())
			).divide(BigInteger.valueOf(10000 + paymentRequest.prepaidPercentage()));
			unlockedAmount = unlockedAmount.add(prepaidAmount);
		}

		return unlockedAmount;
	}

	/*
	 * Assertion methods
	 */

	private void onlyOwner() {
		assert (Context.getAddress() != null);
		Context.require(Context.getAddress().equals(Context.getCaller()));
	}

	private void onlyRecipient(BigInteger requestId) {
		assert (Context.getAddress() != null);
		PaymentRequest paymentRequest = this.paymentRequests.getOrDefault(requestId, null);
		assert (paymentRequest != null);
		Context.require(paymentRequest.recipient().equals(Context.getCaller()));
	}

	private void validateSetting(RecurringSetting setting) {
		Context.require(setting.startDate() * 1000 >= Context.getBlockTimestamp(), "start date < blocktime");
	}
	
	@External(readonly = true)
	public long getBlockTimeStamp() {
		return Context.getBlockTimestamp();
	}
	/*
	 * Event logs
	 */

	@EventLog(indexed = 1)
	protected void CreateRecurringPayments(Address _sender, BigInteger _totalAmount) {
	}

	@EventLog(indexed = 1) 
	protected void CreateOneTimePayments(Address _sender, BigInteger _totalAmount) {}

	@EventLog(indexed = 1)
	protected void WithdrawFromPaymentRequest(Address _sender, BigInteger _requestId, BigInteger _amount) {
	}

	@EventLog(indexed = 1)
	protected void WithdrawBalance(Address _caller, BigInteger _amount) {
	}

	@EventLog(indexed = 1)
	protected void CancelPaymentRequest(Address _sender, BigInteger _requestId) {
	}

	@EventLog(indexed = 1)
	protected void TransferPaymentRequest(Address _sender, Address _to, BigInteger _requestId) {
	}

	@EventLog(indexed = 1)
	protected void Deposit(Address _sender, BigInteger _value) {
	}

	@EventLog(indexed = 1)
	protected void DepositToken(Address _sender, BigInteger _value, byte[] _data) {}

}
