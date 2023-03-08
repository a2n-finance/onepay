import moment from "moment";
import { BatchPaymentState } from "src/controller/batch-payment/batchPaymentSlice";
import { MultipleRecurringPaymentState } from "src/controller/batch-recurring/multipleRecurringPaymentSlice";
import { PaymentRequest } from "src/controller/payment-list/paymentListSlice";

export const usePaymentRequest = () => {
    const getUnlockSetting = (paymentRequest: PaymentRequest) => {
        let unlockEvery = paymentRequest.unlockEvery;
        let unlockEveryType = "second";
        let unlockAmountPerTime = paymentRequest.unlockAmountPerTime;
        let startDate = paymentRequest.startDate;
        let numberOfUnlocks = paymentRequest.numberOfUnlocks;
        let withdrewAmount = paymentRequest.paymentAmount - paymentRequest.remainingBalance;

        let now = new Date().getTime();

        let diffTime = now - startDate;
        if (diffTime >= 0) {
            if (diffTime / (1000 * unlockEvery) <= numberOfUnlocks) {
                numberOfUnlocks = diffTime / (1000 * unlockEvery);
            }
        } else {
            numberOfUnlocks = 0;
        }



        if (unlockEvery / 60 >= 1) {
            unlockEvery = unlockEvery / 60;
            unlockEveryType = "minute"
        } else if (unlockEvery / 3600 >= 1) {
            unlockEvery = unlockEvery / 3600;
            unlockEveryType = "hour"
        } else if (unlockEvery / (3600 * 24) >= 1) {
            unlockEvery = unlockEvery / (3600 * 24)
            unlockEveryType = "day"
        } else if (unlockEvery / (3600 * 24 * 30) >= 1) {
            unlockEvery = unlockEvery / (3600 * 24 * 30);
            unlockEveryType = "month";
        }

        let unlockedAmount = unlockAmountPerTime * numberOfUnlocks;
        if (paymentRequest.prepaidPercentage > 0) {
            unlockedAmount += ((paymentRequest.numberOfUnlocks * unlockAmountPerTime) * paymentRequest.prepaidPercentage / 100)
        }
        return {
            unlockSettings: `${unlockAmountPerTime} / ${unlockEvery} ${unlockEveryType}(s)`,
            unlockedAmount: unlockAmountPerTime * numberOfUnlocks,
            withdrewAmount: withdrewAmount
        }

    };

    const getStats = (paymentRequests: PaymentRequest[]) => {
        let stat = 0;
        for (let i = 0; i < paymentRequests.length; i++) {
            let p = paymentRequests[i];
            stat += p.paymentAmount;
        }
        return stat.toFixed(4);
    };


    const validate = (recurringPaymentData: MultipleRecurringPaymentState) => {
        let errorMessages: string[] = []
        let generalSetting = recurringPaymentData.generalSetting;
        // validate general setting
        if (moment().unix() * 1000 > generalSetting.startDate) {
            errorMessages.push("Start date must be greater than now");
        }

        let recipients = recurringPaymentData.recipients;

        // validate recipient 

        for (let i = 0; i < recipients.length; i++) {
            let recipient = recipients[i];

            if (!recipient.recipient) {
                errorMessages.push(`Wallet address of recipient ${i + 1} cannot be empty`);
            }

            let isAddress = true;
            // try {
            //     Address.parse(recipient.recipient);
            // } catch(e) {
            //     isAddress = false;
            // }

            if (recipient.recipient && !isAddress) {
                errorMessages.push(`Wallet address of recipient ${i + 1} is incorrect`);
            }

            if (!recipient.numberOfUnlocks || recipient.numberOfUnlocks <= 0) {
                errorMessages.push(`Number of unlocks of recipient ${i + 1} must be greater than 0.`)
            }

            if (!recipient.unlockAmountPerTime || recipient.unlockAmountPerTime <= 0) {
                errorMessages.push(`Unlocked amount each time of recipient ${i + 1} must be greater than 0.`)
            }

            if (!recipient.unlockEvery || recipient.unlockEvery <= 0) {
                errorMessages.push(`Unlock every of recipient ${i + 1} must be greater than 0.`)
            }

            if (recipient.prepaidPercentage.toString() === "" || recipient.prepaidPercentage < 0 || recipient.prepaidPercentage > 100) {
                errorMessages.push(`Prepaid percentage of recipient ${i + 1} must be between 0 and 100.`)
            }
        }

        return errorMessages;
    }

    const validateOneTime = (paymentData: BatchPaymentState) => {
        let errorMessages: string[] = [];
        let generalSetting = paymentData.generalSetting;
        let recipients = paymentData.recipients;

        // validate general settings

        if (!generalSetting.isPayNow) {
            if (moment().unix() * 1000 > generalSetting.startDate) {
                errorMessages.push("Start date must be greater than now");
            }
        }

        // validate recipients
        for (let i = 0; i < recipients.length; i++) {
            let recipient = recipients[i];

            if (!recipient.recipient) {
                errorMessages.push(`Wallet address of recipient ${i + 1} cannot be empty`);
            }

            let isAddress = true;
            // try {
            //     Address.parse(recipient.recipient);
            // } catch(e) {
            //     isAddress = false;
            // }

            if (recipient.recipient && !isAddress) {
                errorMessages.push(`Wallet address of recipient ${i + 1} is incorrect.`);
            }

            if (!recipient.amount || recipient.amount <= 0) {
                errorMessages.push(`The amount sent to recipient ${i + 1} must be a positive number and cannot be zero or negative.`)
            }
        }

        return errorMessages;

    }

    return { getUnlockSetting, getStats, validate, validateOneTime };
};