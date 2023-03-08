package finance.a2n.iconpay.objects;

import scorex.util.ArrayList;
import java.util.List;

import score.Address;
import scorex.util.StringTokenizer;

public class OneTimePaymentSetting {
    private Address tokenAddress;
	private boolean isNativeToken;
	private long startDate;
	private boolean isPayNow;
	
	public OneTimePaymentSetting(
			Address tokenAddress,
			boolean isNativeToken,
			long startDate,
			boolean isPayNow
			) {
		
		this.tokenAddress = tokenAddress;
		this.isNativeToken = isNativeToken;
		this.startDate = startDate;
		this.isPayNow = isPayNow;
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
	
	public boolean isPayNow() {
		return this.isPayNow;
	}

	
	public static OneTimePaymentSetting convertFromString(String _setting) {
		StringTokenizer params = new StringTokenizer(_setting, ",");
		List<String> settingAttributes = new ArrayList<String>();
		while(params.hasMoreTokens()) {
			settingAttributes.add(params.nextToken());
		}
		
		OneTimePaymentSetting setting = new OneTimePaymentSetting(
				Address.fromString(settingAttributes.get(0)), 
				Boolean.valueOf(settingAttributes.get(1)), 
				Long.valueOf(settingAttributes.get(2)), 
				Boolean.valueOf(settingAttributes.get(3))
		);
		return setting;
		
	}
}
