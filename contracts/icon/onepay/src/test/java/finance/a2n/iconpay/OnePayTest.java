package finance.a2n.iconpay;

import java.math.BigInteger;
import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import com.iconloop.score.test.Account;
import com.iconloop.score.test.Score;
import com.iconloop.score.test.ServiceManager;
import com.iconloop.score.test.TestBase;

import finance.a2n.iconpay.OnePay;
import finance.a2n.iconpay.objects.PaymentRequest;
import score.Address;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.mockito.Mockito.reset;
import static org.mockito.Mockito.spy;
import static org.mockito.Mockito.verify;

public class OnePayTest extends TestBase {
	private static ServiceManager sm = getServiceManager();
	private Account[] senders;
	private Score recurringPaymentScore;
	private OnePay recurringPaymentSpy;
	private long currentTime;

	@BeforeEach
	void setup() throws Exception {
		// setup accounts and deploy
		senders = new Account[3];
		for (int i = 0; i < senders.length; i++) {
			senders[i] = sm.createAccount(100);
		}
		recurringPaymentScore = sm.deploy(senders[0], OnePay.class);
		// setup spy
		recurringPaymentSpy = (OnePay) spy(recurringPaymentScore.getInstance());
		recurringPaymentScore.setInstance(recurringPaymentSpy);
		this.currentTime = new Date().getTime() + 100 * 1000;
	}

	@Test
	void fallback() {
		sm.transfer(senders[0], recurringPaymentScore.getAddress(), ICX);
		verify(recurringPaymentSpy).Deposit(senders[0].getAddress(), ICX);
	}

	@Test
	void testDeposit() {
		sm.transfer(senders[1], recurringPaymentScore.getAddress(), ICX);
		var balance = recurringPaymentScore.call("getUserTokenBalance", senders[1].getAddress(),
				recurringPaymentScore.getAddress());
		assertEquals(balance, ICX);
	}

	@Test
	void tokenFallback() {
		byte[] data = "test".getBytes();
		recurringPaymentScore.invoke(senders[0], "tokenFallback", senders[0].getAddress(), ICX, data);
		verify(recurringPaymentSpy).DepositToken(senders[0].getAddress(), ICX, data);
	}
	
	@Test 
	void createRecurringPayments() {
		sm.transfer(senders[0], recurringPaymentScore.getAddress(), ICX.multiply(BigInteger.valueOf(10)));
		String settings = new String(
				recurringPaymentScore.getAddress().toString() + ","
				+ "true" + "," 
				+ this.currentTime + ","
				+ "0" + ","
				+ "0" + ","
				);
		String recipients = new String(
				senders[1].getAddress().toString() + ","
				+ "1,"
				+ ICX.toString() + ","
				+ "5,"
				+ "0"
		);
		
		
		recurringPaymentScore.invoke(senders[0], "createRecurringPayments", settings, recipients);
		
		@SuppressWarnings("unchecked")
		List<Map<String, String>> list =  (List<Map<String, String>>) recurringPaymentScore.call("getSenderRequests", senders[0].getAddress());
		assertEquals(list.get(0).get("unlockAmountPerTime"), ICX.toString());
	}

	@Test 
	void createOneTimePaymentsNow() {
		sm.transfer(senders[0], recurringPaymentScore.getAddress(), ICX.multiply(BigInteger.valueOf(10)));
		String settings = new String(
				recurringPaymentScore.getAddress().toString() + ","
				+ "true" + "," 
				+ this.currentTime + ","
				+ "true"
				);
		String recipients = new String(
				senders[1].getAddress().toString() + ","
				+ ICX.toString()
		);
		
		
		recurringPaymentScore.invoke(senders[0], "createOneTimePayments", settings, recipients);

		var balance = recurringPaymentScore.call("getUserTokenBalance", senders[0].getAddress(),
		recurringPaymentScore.getAddress());
		
		//@SuppressWarnings("unchecked")
		// List<PaymentRequest> list =  (List<PaymentRequest>) recurringPaymentScore.call("getSenderRequests", senders[0].getAddress());
		assertEquals(balance, ICX.multiply(BigInteger.valueOf(9)));
	}

	@Test 
	void createOneTimePaymentsSpecificDate() {
		sm.transfer(senders[0], recurringPaymentScore.getAddress(), ICX.multiply(BigInteger.valueOf(10)));
		String settings = new String(
				recurringPaymentScore.getAddress().toString() + ","
				+ "true" + "," 
				+ this.currentTime + ","
				+ "false"
				);
		String recipients = new String(
				senders[1].getAddress().toString() + ","
				+ ICX.toString()
		);
		
		
		recurringPaymentScore.invoke(senders[0], "createOneTimePayments", settings, recipients);
		
		@SuppressWarnings("unchecked")
		List<Map<String, String>> list =  (List<Map<String, String>>) recurringPaymentScore.call("getSenderRequests", senders[0].getAddress());
		assertEquals(list.get(0).get("unlockAmountPerTime"), ICX.toString());
	}

	@Test
	void testGetRecipientRequests() {
		sm.transfer(senders[0], recurringPaymentScore.getAddress(), ICX.multiply(BigInteger.valueOf(10)));
		String settings = new String(
				recurringPaymentScore.getAddress().toString() + ","
				+ "true" + "," 
				+ this.currentTime + ","
				+ "0" + ","
				+ "0" + ","
				);
		String recipients = new String(
				senders[1].getAddress().toString() + ","
				+ "1,"
				+ ICX.toString() + ","
				+ "5,"
				+ "0"
		);
		
		
		recurringPaymentScore.invoke(senders[0], "createRecurringPayments", settings, recipients);
		
		// @SuppressWarnings("unchecked")
		// List<PaymentRequest> list =  (List<PaymentRequest>) recurringPaymentScore.call("getRecipientRequests", senders[1].getAddress());
		// assertEquals(list.get(0).unlockAmountPerTime(), BigInteger.valueOf(1));
	}

	@Test
	void cancelRequestPayment() {
		sm.transfer(senders[0], recurringPaymentScore.getAddress(), ICX.multiply(BigInteger.valueOf(10)));
		String settings = new String(
				recurringPaymentScore.getAddress().toString() + ","
				+ "true" + "," 
				+ this.currentTime + ","
				+ "0" + ","
				+ "0" + ","
				);
		String recipients = new String(
				senders[1].getAddress().toString() + ","
				+ "1,"
				+ ICX.toString() + ","
				+ "5,"
				+ "0"
		);
		
		
		recurringPaymentScore.invoke(senders[0], "createRecurringPayments", settings, recipients);
		recurringPaymentScore.invoke(senders[0], "cancelPaymentRequest", BigInteger.ZERO);
		@SuppressWarnings("unchecked")
		List<Map<String, String>> list =  (List<Map<String, String>>) recurringPaymentScore.call("getSenderRequests", senders[0].getAddress());
		assertEquals(list.get(0).get("remainingBalance"), "0");
	}

	@Test
	void getBlockTimeStamp() {
		// Return in microseconds (1 microsecond  = 1/1000 milisecond)
		var timeStamp = recurringPaymentScore.call("getBlockTimeStamp");
		assertNotEquals(1000, timeStamp);
	}

}
