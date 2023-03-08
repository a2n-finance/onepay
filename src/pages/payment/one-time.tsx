import { Box, Heading, Stack, Text } from "@chakra-ui/react";
import { useEffect } from "react";
import OneTimePaymentForm from "src/components/onetime-payment/OneTimePaymentForm";
import Recipients from "src/components/onetime-payment/Recipients";
import { getAddressThunk } from "src/controller/address-book/getAddressesThunk";
import { ErrorMessage } from "src/controller/batch-payment/ErrorMessage";
import { useAppDispatch, useAppSelector } from "src/controller/hooks";

export default function OneTimePayment() {
    const dispatch = useAppDispatch();
    const {account} = useAppSelector(state => state.network);
    useEffect(() => {
        dispatch(getAddressThunk());
    }, [account])
    return (
        <>
            <ErrorMessage />
            <OneTimePaymentForm />
            <Stack my={2}>
                <Heading fontSize={"lg"}>RECIPIENTS</Heading>
                <Text fontSize={"sm"} color="gray.500">The maximum number of recipients is 50.</Text>
            </Stack>
            <Recipients />
        </>
    )
}