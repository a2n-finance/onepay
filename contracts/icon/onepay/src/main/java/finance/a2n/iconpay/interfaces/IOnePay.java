package finance.a2n.iconpay.interfaces;
import java.math.BigInteger;
import java.util.List;
import java.util.Map;
import score.Address;

public interface IOnePay {
	public List<Map<String, String>> getSenderRequests(Address sender);
	public List<Map<String, String>> getRecipientRequests(Address sender);

}