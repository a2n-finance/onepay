import { Box } from "@chakra-ui/react";
import { useEffect } from "react";
import ActionBar from "src/components/recurring-payment/ActionBar";
import PaymentFilter from "src/components/recurring-payment/PaymentFilter";
import PaymentList from "src/components/recurring-payment/SentPaymentList";
import { useAppDispatch, useAppSelector } from "src/controller/hooks";
import { getSenderPaymentRequestsThunk } from "src/controller/payment-list/getUserPaymentRequestThunk";
import { getSenderPaymentRequests } from "src/core";

export default function Index() {
    const dispatch = useAppDispatch();
    const {account} = useAppSelector(state => state.network);
    async function fetchData() {
       await dispatch(getSenderPaymentRequestsThunk());
    }
    useEffect(() => {
        fetchData();
        //getSenderPaymentRequests(account)
    }, [])
    return (
        <Box>
            <ActionBar />
            {/* <PaymentFilter /> */}
            <PaymentList />
        </Box>
    )
}