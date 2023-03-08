package finance.a2n.iconpay.interfaces;

import java.math.BigInteger;
import java.util.List;

import score.Address;

public interface IUser {
	public void createRecurringPayments(String setting, String recipients);
	public void createOneTimePayments(String setting, String recipients);
	public void withdrawFromPaymentRequest(BigInteger requestId, BigInteger amount);
	public void cancelPaymentRequest(BigInteger requestId);
	public void transferPaymentRequest(BigInteger requestId, Address to);
	public BigInteger getUserTokenBalance(Address caller, Address tokenAddress);
	public BigInteger getUserLockedAmount(Address caller, Address tokenAddress);
	public List<Address> getUserTokens(Address caller);
	public void withdrawBalance(Address tokenAddress, BigInteger amount);
}
