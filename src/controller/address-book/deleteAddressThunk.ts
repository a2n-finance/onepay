import { createAsyncThunk } from "@reduxjs/toolkit";
import { errorToastContent, successToastContent } from "src/config/toastContent";
import { AppState } from "../store";

export const deleteAddressThunk = createAsyncThunk("address/delete", async (_, { getState }) => {

    // @ts-ignore
    let state: AppState = getState();
    try {
       await fetch(`/api/db/address/delete`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                _id: state.addressBook.selectedAddress._id,
            })
        });
        successToastContent(
            `Delete the address success`,
            ``,
        )
        return true;
    } catch (e) {
        errorToastContent(e);
        return false;
    }
})