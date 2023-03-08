import { Heading, Stack, Text } from "@chakra-ui/react";
import { useEffect } from "react";
import { ErrorMessage } from "src/components/recurring-payment/ErrorMessage";
import Recipients from "src/components/recurring-payment/Recipients";
import RecurringPaymentForm from "src/components/recurring-payment/RecurringPaymentForm";
import { getAddressThunk } from "src/controller/address-book/getAddressesThunk";
import { useAppDispatch, useAppSelector } from "src/controller/hooks";

export default function RecurringPayment() {
    const dispatch = useAppDispatch();
    const {account} = useAppSelector(state => state.network);
    useEffect(() => {
        dispatch(getAddressThunk());
    }, [account])
    return (
        <Stack w={"100%"}>
            <ErrorMessage />
            <RecurringPaymentForm />
            <Stack>
                <Heading fontSize={"lg"}>RECIPIENTS</Heading>
                <Text fontSize={"sm"} color="gray.500">The maximum number of recipients is 50.</Text>
            </Stack>
            <Recipients />
        </Stack>
    )
}