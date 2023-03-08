import { BatchPaymentState } from "src/controller/batch-payment/batchPaymentSlice";
import { MultipleRecurringPaymentState } from "src/controller/batch-recurring/multipleRecurringPaymentSlice";
import {
    hanaWalletConnect,
    iconDepositNativeToken,
    iconCreateBatchRecurringPayments,
    iconDepositIRC2Token,
    iconWithdrawFromBalance,
    iconWithdrawFromPaymentRequest,
    iconGetUserBalance,
    iconGetSenderPaymentRequests,
    iconGetRecipientPaymentRequests,
    iconGetUserLockedAmount,
    iconCreateOneTimePayments,
    iconCancelPaymentRequest,
    iconTransferPaymentRequest
} from "./icon"

const connectWallet = (walletName: string) => {
    if (walletName === "hana") {
        hanaWalletConnect();
    }
}

const depositNativeToken = async (account: string, amount: number) => {
    await iconDepositNativeToken(account, amount);
}

const createdBatchRecurringPayments = async (account: string, recurringPaymentsData: MultipleRecurringPaymentState) => {
    await iconCreateBatchRecurringPayments(account, recurringPaymentsData);
}

const createOneTimePayments = async (account: string, oneTimePaymentsData: BatchPaymentState) => {
    await iconCreateOneTimePayments(account, oneTimePaymentsData);
}

const depositIRC2Token = async (tokenAddress: string, amount: number) => {
    await iconDepositIRC2Token(tokenAddress, amount);
}

const withdrawFromPaymentRequest = async (account: string, requestId: number, amount: number) => {
    await iconWithdrawFromPaymentRequest(account, requestId, amount);
}

const cancelPaymentRequest = async (account: string, requestId: number) => {
    await iconCancelPaymentRequest(account, requestId);
}

const transferPaymentRequest = async (account: string, requestId: number, to: string) => {
    await iconTransferPaymentRequest(account, requestId, to);
}
const withdrawFromBalance = async (account: string, tokenAddress: string, amount: number) => {
    await iconWithdrawFromBalance(account, tokenAddress, amount);
}


const getUserTokenBalance = async (account: string, tokenAddress: string) => {
   let balance = await iconGetUserBalance(account, tokenAddress);
   return balance;
}

const getUserLockedTokenBalance = async (account: string, tokenAddress: string) => {
    let lockedAmount = await iconGetUserLockedAmount(account, tokenAddress);
    return lockedAmount;
}

const getSenderPaymentRequests = async (address: string) => {
    let result = await iconGetSenderPaymentRequests(address);
    return result;
}

const getRecipientPaymentRequests = async (address: string) => {
    let result = await iconGetRecipientPaymentRequests(address);
    return result;
}



export {
    connectWallet,
    depositNativeToken,
    createdBatchRecurringPayments,
    createOneTimePayments,
    depositIRC2Token,
    withdrawFromPaymentRequest,
    cancelPaymentRequest,
    transferPaymentRequest,
    withdrawFromBalance,
    getUserTokenBalance,
    getUserLockedTokenBalance,
    getSenderPaymentRequests,
    getRecipientPaymentRequests
}