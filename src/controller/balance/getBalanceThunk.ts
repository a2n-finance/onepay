import {createAsyncThunk} from "@reduxjs/toolkit";
import { getUserLockedTokenBalance, getUserTokenBalance } from "src/core";

import { AppState } from "../store";
export const getBalanceThunk = createAsyncThunk("balance/get-token-balances", async (_, {getState}) => {
    // @ts-ignore
    let state: AppState = getState()
    let balance = await getUserTokenBalance(state.network.account, process.env.NEXT_PUBLIC_CONTRACT_ADDRESS);
    let lockedAmount = await getUserLockedTokenBalance(state.network.account, process.env.NEXT_PUBLIC_CONTRACT_ADDRESS);
    return {
        name: "ICX",
        balance: balance,
        lockedAmount: lockedAmount
    }
})