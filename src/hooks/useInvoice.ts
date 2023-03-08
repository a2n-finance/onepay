import { GeneralSetting, Invoice, InvoiceItem } from "src/controller/invoice/invoiceSlice";

export const useInvoice = () => {
    const getLineItemAmount = (item: InvoiceItem) => {
        let lineItemAmountWithoutTax = item.unitPrice * item.qty * (100 - item.discount) / 100;
        let lineItemAamountWithTax = lineItemAmountWithoutTax * item.tax / 100;
        return (lineItemAmountWithoutTax + lineItemAamountWithTax);
    };

    const getInvoiceAmount = (items: InvoiceItem[]) => {
        let amountWithoutTax = 0;
        let totalTaxAmount = 0;
        let totalAmount = 0;
        let due = 0;
        for (let i = 0; i < items.length; i++) {
            let item = items[i];
            amountWithoutTax += (item.qty * item.unitPrice * (100 - item.discount) / 100);
            totalTaxAmount += (item.unitPrice * item.qty * (100 - item.discount) * item.tax / 10000);
        }
        totalAmount = (amountWithoutTax + totalTaxAmount);
        due = totalAmount;
        return {
            amountWithoutTax: amountWithoutTax,
            totalTaxAmount: totalTaxAmount,
            totalAmount: totalAmount,
            due: due
        }
    }


    const checkInvoiceActionable = (invoice: Invoice, isSender: boolean) => {
        let status = invoice.status;
        let allowCancel = false;
        let allowPause = false;
        let allowActive = false;
        let allowPay = false;
        let allowReject = false;
        if (isSender) {
            switch (status) {
                case 1:
                    allowPause = true;
                    allowCancel = true;
                    break;
                case 2:
                    break;
                case 3:
                    allowActive = true;
                    allowCancel = true;
                    break;
                case 4:
                    break;
                case 5:
                    break;
                default:
                    break;
            }
        } else {
            switch (status) {
                case 1:
                    allowPay = true;
                    allowReject = true;
                    break;
                case 2:
                    break;
                case 3:
                    allowReject = true;
                    break;
                case 4:
                    break;
                case 5:
                    break;
                default:
                    break;
            }
        }

        return {
            allowCancel: allowCancel,
            allowPause: allowPause,
            allowActive: allowActive,
            allowPay: allowPay,
            allowReject: allowReject
        }
    }

    const validate = (generalSetting: GeneralSetting, items: InvoiceItem[]) => {
        let errorMessages: string[] = [];

        // validate recipient address
        let recipient = generalSetting.recipient;
        if (!recipient) {
            errorMessages.push("Client address cannot be empty.");
        }

        let isAddress = true;

        // try {
        //     Address.parse(recipient);
        // } catch (e) {
        //     isAddress = false;
        // }

        if (recipient && !isAddress) {
            errorMessages.push("Recipient address is not correct.");
        }

        for (let i = 0; i < items.length; i++) {
            let item: InvoiceItem = items[i];
            if (!item.unitPrice || item.unitPrice <= 0) {
                errorMessages.push(`Unit price of item ${i+1} must be greater than 0.`)
            }

            if (!item.qty || item.qty <= 0) {
                errorMessages.push(`Quantity of item ${i+1} must be greater than 0.`);
            }
        }

        return errorMessages;
    }


    return { getLineItemAmount,  getInvoiceAmount, checkInvoiceActionable, validate};
};