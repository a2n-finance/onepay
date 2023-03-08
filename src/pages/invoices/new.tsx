import { Button, ButtonGroup, Flex, Heading, Stack, Text } from "@chakra-ui/react";
import { useCallback, useEffect } from "react";
import { ErrorMessage } from "src/components/invoice/ErrorMessage";
import InvoiceItems from "src/components/invoice/InvoiceItems";
import { getAddressThunk } from "src/controller/address-book/getAddressesThunk";
import { useAppDispatch, useAppSelector } from "src/controller/hooks";
import { createInvoiceThunk } from "src/controller/invoice/createInvoiceThunk";
import { setErrorMessages } from "src/controller/invoice/invoiceSlice";
import { actionNames, processKeys, updateProcessStatus } from "src/controller/process/processSlice";
import { useInvoice } from "src/hooks/useInvoice";
import InvoiceForm from "../../components/invoice/InvoiceForm";

export default function NewInvoice() {
    const dispatch = useAppDispatch();
    const { account } = useAppSelector(state => state.network);
    const {generalSetting, items} = useAppSelector(state => state.invoice)
    const { createInvoice } = useAppSelector(state => state.process);
    const {validate} = useInvoice();
    
    useEffect(() => {
        dispatch(getAddressThunk());
    }, [account])

    const handleSave = useCallback(() => {
        let errorMessages = validate(generalSetting, items);
        if (errorMessages.length) {
            dispatch(setErrorMessages(errorMessages));
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        } else {
            dispatch(setErrorMessages([]));
        }
        dispatch(updateProcessStatus({
            actionName: actionNames.createInvoice,
            att: processKeys.processing,
            value: true
        }))
        dispatch(createInvoiceThunk());
    }, [generalSetting, items])
    return (
        <>
            <ErrorMessage />
            <InvoiceForm />
            <Stack mb={2}>
                <Heading fontSize={"lg"}>INVOICE ITEMS</Heading>
                <Text fontSize={"sm"} color="gray.500">You can add an unlimited number of items.</Text>
            </Stack>
            <InvoiceItems />
            <Flex justifyContent={"center"} mt="5">
                {account ? (<ButtonGroup w={"full"}>
                    <Button w={"50%"} variant={"outline"} colorScheme={"blue"}>Reset</Button>
                    <Button w={"50%"} onClick={() => handleSave()} isLoading={createInvoice.processing} colorScheme={"blue"}>Send</Button>
                </ButtonGroup>) :
                    (<Button colorScheme="blue">Please connect wallet</Button>)
                }
            </Flex>
        </>

    )
}