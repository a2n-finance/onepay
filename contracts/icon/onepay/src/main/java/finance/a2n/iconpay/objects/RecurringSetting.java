package finance.a2n.iconpay.objects;

import scorex.util.ArrayList;
import java.util.List;
import scorex.util.StringTokenizer;

import score.Address;

public class RecurringSetting {
	private Address tokenAddress;
	private boolean isNativeToken;
	private long startDate;
	private int whoCanCancel;
	private int whoCanTransfer;
	
	public RecurringSetting(
			Address tokenAddress,
			boolean isNativeToken,
			long startDate,
			int whoCanCancel,
			int whoCanTransfer
			) {
		
		this.tokenAddress = tokenAddress;
		this.isNativeToken = isNativeToken;
		this.startDate = startDate;
		this.whoCanCancel = whoCanCancel;
		this.whoCanTransfer = whoCanTransfer;
		
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
	
	public int whoCanCancel() {
		return this.whoCanCancel;
	}
	
	public int whoCanTransfer() {
		return this.whoCanTransfer;
	}

	
	public static RecurringSetting convertFromString(String _setting) {
		StringTokenizer params = new StringTokenizer(_setting, ",");
		List<String> settingAttributes = new ArrayList<String>();
		while(params.hasMoreTokens()) {
			settingAttributes.add(params.nextToken());
		}
		
		RecurringSetting setting = new RecurringSetting(
				Address.fromString(settingAttributes.get(0)), 
				Boolean.valueOf(settingAttributes.get(1)), 
				Long.valueOf(settingAttributes.get(2)), 
				Integer.valueOf(settingAttributes.get(3)),  
				Integer.valueOf(settingAttributes.get(4))
		);
		return setting;
		
	}
	
}