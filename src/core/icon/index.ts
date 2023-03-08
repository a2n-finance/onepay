import IconService from 'icon-sdk-js';
import BigNumber from "bignumber.js";
import { MultipleRecurringPaymentState } from 'src/controller/batch-recurring/multipleRecurringPaymentSlice';
import { concat } from 'ethers/lib/utils';
import { PaymentRequestOrigin, PaymentRequest } from 'src/controller/payment-list/paymentListSlice';
import { BatchPaymentState } from 'src/controller/batch-payment/batchPaymentSlice';
const httpProvider = new IconService.HttpProvider('https://lisbon.net.solidwallet.io/api/v3');
const iconService = new IconService(httpProvider);
let contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
const hanaWalletConnect = async () => {
  window.dispatchEvent(
    new CustomEvent('ICONEX_RELAY_REQUEST', {
      detail: {
        type: 'REQUEST_ADDRESS',
      },
    })
  );

}

const iconDepositNativeToken = async (account: string, amount: number) => {
  let icxTransactionBuilder = new IconService.IconBuilder.IcxTransactionBuilder();
  const icxTransferData = icxTransactionBuilder
    .from(account)
    .to(contractAddress)
    .nid(IconService.IconConverter.toBigNumber(0x2))
    .value(IconService.IconAmount.of(amount, IconService.IconAmount.Unit.ICX).toLoop())
    .timestamp(new Date().getTime() * 1000)
    .version(IconService.IconConverter.toBigNumber(3))
    .stepLimit(IconService.IconConverter.toBigNumber(1000000))
    .build();

  let transactionWalletRequest = JSON.stringify({
    jsonrpc: '2.0',
    method: 'icx_sendTransaction',
    params: IconService.IconConverter.toRawTransaction(icxTransferData),
    id: 50889,
  });

  var parsed = JSON.parse(transactionWalletRequest);

  window.dispatchEvent(
    new CustomEvent('ICONEX_RELAY_REQUEST', {
      detail: {
        type: 'REQUEST_JSON-RPC',
        payload: parsed,
      },
    })
  );
}

const iconSendTransaction = async (account: string, method: string, params: any) => {
  let callTransactionBuilder = new IconService.IconBuilder.CallTransactionBuilder();
  const icxTransferData = callTransactionBuilder
    .from(account)
    .to(contractAddress)
    .method(method)
    .nid(IconService.IconConverter.toBigNumber(0x2))
    .timestamp(new Date().getTime() * 1000)
    .params(
      params
    )
    .nonce(IconService.IconConverter.toBigNumber(1))
    .version(IconService.IconConverter.toBigNumber(3))
    .stepLimit(IconService.IconConverter.toBigNumber(1000000))
    .build();

  let transactionWalletRequest = JSON.stringify({
    jsonrpc: '2.0',
    method: 'icx_sendTransaction',
    params: IconService.IconConverter.toRawTransaction(icxTransferData),
    id: 50889,
  });

  var parsed = JSON.parse(transactionWalletRequest);

  window.dispatchEvent(
    new CustomEvent('ICONEX_RELAY_REQUEST', {
      detail: {
        type: 'REQUEST_JSON-RPC',
        payload: parsed,
      },
    })
  );
}

const iconCreateBatchRecurringPayments = async (account: string, recurringPaymentsData: MultipleRecurringPaymentState) => {

  let setting = recurringPaymentsData.generalSetting;
  let recipients = recurringPaymentsData.recipients;

  let settingString = setting.tokenAddress.concat(",")
    .concat(setting.tokenAddress == process.env.NEXT_PUBLIC_CONTRACT_ADDRESS ? "true" : "false").concat(",")
    .concat(setting.startDate.toString()).concat(",")
    .concat(setting.whoCanCancel.toString()).concat(",")
    .concat(setting.whoCanTransfer.toString());

  let recipientsStringArr = recipients.map((recipient, index) => {

    let recipientString = recipient.recipient.concat(",")
      .concat((recipient.unlockEvery * recipient.unlockEveryType).toString()).concat(",")
      .concat(
        IconService.IconAmount.of(recipient.unlockAmountPerTime, IconService.IconAmount.Unit.ICX).toLoop().toString()
      ).concat(",")
      .concat(recipient.numberOfUnlocks.toString()).concat(",")
      .concat(recipient.prepaidPercentage.toString())
    return recipientString;

  })

  let recipientsString = recipientsStringArr.join(";");

  let params = {
    _setting: settingString,
    _recipients: recipientsString
  };

  await iconSendTransaction(account, "createRecurringPayments", params);
}

const iconCreateOneTimePayments = async (account: string, oneTimePaymentsData: BatchPaymentState) => {
  let setting = oneTimePaymentsData.generalSetting;
  let recipients = oneTimePaymentsData.recipients;

  let settingString = setting.tokenAddress.concat(",")
    .concat(setting.tokenAddress == process.env.NEXT_PUBLIC_CONTRACT_ADDRESS ? "true" : "false").concat(",")
    .concat(setting.startDate.toString()).concat(",")
    .concat(setting.isPayNow.toString())

  let recipientsStringArr = recipients.map((recipient, index) => {

    let recipientString = recipient.recipient.concat(",")
      .concat(
        IconService.IconAmount.of(recipient.amount, IconService.IconAmount.Unit.ICX).toLoop().toString()
      );
    return recipientString;

  })

  let recipientsString = recipientsStringArr.join(";");

  let params = {
    _setting: settingString,
    _recipients: recipientsString
  };
  await iconSendTransaction(account, "createOneTimePayments", params);
}

const iconDepositIRC2Token = (tokenAddress: string, amount: number) => {

}

const iconWithdrawFromPaymentRequest = async (account: string, requestId: number, amount: number) => {


  let params = {
    requestId: IconService.IconConverter.toBigNumber(requestId),
    amount: IconService.IconAmount.of(amount, IconService.IconAmount.Unit.ICX).toLoop()
  };

  await iconSendTransaction(account, "withdrawFromPaymentRequest", params);
}

const iconCancelPaymentRequest = async (account: string, requestId: number) => {

  let params = {
    requestId: IconService.IconConverter.toBigNumber(requestId),
  };

  iconSendTransaction(account, "cancelPaymentRequest", params);
}

const iconTransferPaymentRequest = async (account: string, requestId: number, to: string) => {
  
  let params = {
    requestId: IconService.IconConverter.toBigNumber(requestId),
    to: to
  };

  iconSendTransaction(account, "transferPaymentRequest", params);
}

const iconWithdrawFromBalance = async (account: string, tokenAddress: string, amount: number) => {
  let params = {
    tokenAddress: tokenAddress,
    amount: IconService.IconAmount.of(amount, IconService.IconAmount.Unit.ICX).toLoop()
  };

  iconSendTransaction(account, "withdrawBalance", params);
}

const iconGetUserBalance = async (account: string, tokenAddress: string) => {
  let callBuilder = new IconService.IconBuilder.CallBuilder();
  const tx = callBuilder
    .to(contractAddress)
    .method('getUserTokenBalance')
    .params({
      userAddress: account,
      tokenAddress: tokenAddress
    })
    .build()
  let result = await iconService.call(tx).execute();
  return parseFloat(IconService.IconAmount.fromLoop(new BigNumber(result.toString()), "ICX").toString());
}

const iconGetUserLockedAmount = async (account: string, tokenAddress: string) => {
  let callBuilder = new IconService.IconBuilder.CallBuilder();
  const tx = callBuilder
    .to(contractAddress)
    .method('getUserLockedAmount')
    .params({
      userAddress: account,
      tokenAddress: tokenAddress
    })
    .build()
  let result = await iconService.call(tx).execute();
  return parseFloat(IconService.IconAmount.fromLoop(new BigNumber(result.toString()), "ICX").toString());
}

const iconGetPaymentRequests = async () => {
  let callBuilder = new IconService.IconBuilder.CallBuilder();
  const callRequest = callBuilder
    .to(contractAddress)
    .method('getPaymentRequests')
    .build()
  let result = await iconService.call(callRequest).execute();
  console.log(result);
}

const iconGetSenderPaymentRequests = async (address: string) => {
  let callBuilder = new IconService.IconBuilder.CallBuilder();
  const callRequest = callBuilder
    .to(contractAddress)
    .method('getSenderRequests')
    .params({
      caller: address
    })
    .build()
  let result = await iconService.call(callRequest).execute();
  let paymentList: PaymentRequest[] = [];

  if (result.length) {
    for (let i = 0; i < result.length; i++) {
      paymentList.push(convertPaymentRequest(result[i]));
    }
  }
  return paymentList;
}

const iconGetRecipientPaymentRequests = async (address: string) => {
  let callBuilder = new IconService.IconBuilder.CallBuilder();
  const callRequest = callBuilder
    .to(contractAddress)
    .method('getRecipientRequests')
    .params({
      caller: address
    })
    .build()
  let result = await iconService.call(callRequest).execute();
  let paymentList: PaymentRequest[] = [];

  if (result.length) {
    for (let i = 0; i < result.length; i++) {
      paymentList.push(convertPaymentRequest(result[i]));
    }
  }
  return paymentList;
}

const convertPaymentRequest = (pr: PaymentRequestOrigin): PaymentRequest => {
  const convertedPaymentRequest: PaymentRequest = {
    requestId: parseInt(pr.requestId),
    sender: pr.sender,
    tokenAddress: pr.tokenAddress,
    isNativeToken: pr.isNativeToken == "true" ? true : false,
    startDate: parseInt(pr.startDate),
    paymentAmount: parseFloat(IconService.IconAmount.fromLoop(pr.paymentAmount, "ICX").toString()),
    remainingBalance: parseFloat(IconService.IconAmount.fromLoop(pr.remainingBalance, "ICX").toString()),
    prepaidPercentage: parseInt(pr.prepaidPercentage),
    unlockAmountPerTime: parseFloat(IconService.IconAmount.fromLoop(pr.unlockAmountPerTime, "ICX").toString()),
    unlockEvery: parseInt(pr.unlockEvery),
    numberOfUnlocks: parseInt(pr.numberOfUnlocks),
    recipient: pr.recipient,
    whoCanCancel: parseInt(pr.whoCanCancel),
    whoCanTransfer: parseInt(pr.whoCanTransfer),
    status: parseInt(pr.status),
    transactionHash: ""
  }

  return convertedPaymentRequest;
}

export {
  hanaWalletConnect,
  iconDepositNativeToken,
  iconCreateBatchRecurringPayments,
  iconCreateOneTimePayments,
  iconDepositIRC2Token,
  iconWithdrawFromPaymentRequest,
  iconCancelPaymentRequest,
  iconTransferPaymentRequest,
  iconWithdrawFromBalance,
  iconGetUserBalance,
  iconGetUserLockedAmount,
  iconGetPaymentRequests,
  iconGetSenderPaymentRequests,
  iconGetRecipientPaymentRequests
}