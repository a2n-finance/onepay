import { createSlice, PayloadAction } from "@reduxjs/toolkit";


type GeneralSetting = {
    tokenAddress: string,
    isNativeToken: boolean,
    startDate: number,
    isPayNow: boolean
}

type Recipient = {
    recipient: string,
    amount: number 
}

export type BatchPaymentState = {
    generalSetting: GeneralSetting,
    recipients: Recipient[],
    errorMessages?: string[]

}
const initialState: BatchPaymentState = {
    generalSetting: {
        tokenAddress: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
        isNativeToken: true,
        startDate: new Date().getTime(),
        isPayNow: true
    },
    recipients: [{
        recipient: "",
        amount: null
    }],
    errorMessages: []
}

const batchPaymentSlice = createSlice({
    name: "batchPayment",
    initialState,
    reducers: {
        changeGeneralSetting: (state: BatchPaymentState, action: PayloadAction<{att: string, value: any}>) => {
            state.generalSetting[action.payload.att] = action.payload.value;
        },
        addNewRecipient: (state: BatchPaymentState) => {
            state.recipients.push({
                recipient: "",
                amount: null
            })
        },
        removeRecipient: (state: BatchPaymentState, action: PayloadAction<{index: number}>) => {
            if (state.recipients.length > 1) {
                state.recipients.splice(action.payload.index, 1);
            }
        },
        changeRecipient: (state: BatchPaymentState, action: PayloadAction<{index: number, att: string, value: any}>) => {
            state.recipients[action.payload.index][action.payload.att] = action.payload.value;
        },
        setErrorMessages: (state: BatchPaymentState, action: PayloadAction<string[]>) => {
            state.errorMessages = action.payload;
        }
    }
})

export const { changeGeneralSetting, changeRecipient, addNewRecipient, removeRecipient, setErrorMessages  } = batchPaymentSlice.actions;

export default batchPaymentSlice.reducer;