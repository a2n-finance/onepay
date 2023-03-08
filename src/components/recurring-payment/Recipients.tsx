import { DeleteIcon } from '@chakra-ui/icons';
import {
    Avatar,
    Box,
    Button, ButtonGroup, Card, CardBody, CardFooter, Flex, FormControl, FormLabel, HStack, IconButton, Input, InputGroup, InputRightAddon, Select, Stack, StackDivider, VStack, WrapItem
} from '@chakra-ui/react';
import { useCallback } from 'react';
import { addNewRecipient, changeRecipient, removeRecipient, setErrorMessages } from 'src/controller/batch-recurring/multipleRecurringPaymentSlice';
import { useAppDispatch, useAppSelector } from 'src/controller/hooks';
import { actionNames, processKeys, updateProcessStatus } from 'src/controller/process/processSlice';
import { createdBatchRecurringPayments } from 'src/core';
import { usePaymentRequest } from 'src/hooks/usePaymentRequest';
import AddressFieldForMultiRecipient from '../address-book/AddressFieldMultiRecipient';

export default function Recipients() {
    const { account } = useAppSelector(state => state.network);
    const { generalSetting, recipients } = useAppSelector(state => state.batchRecurring);
    const { createBatchPayments } = useAppSelector(state => state.process);
    const recurringPaymentsData = useAppSelector(state => state.batchRecurring);
    const dispatch = useAppDispatch();
    const {validate} = usePaymentRequest();

    const handleChangeRecipient = useCallback((index: number, att: string, value: any) => {
        dispatch(changeRecipient({ index, att, value }));
    }, [])

    const handleAddRecipient = useCallback(() => {
        dispatch(addNewRecipient());
    }, [])

    const handleRemoveRecipient = useCallback((index: number) => {
        dispatch(removeRecipient({ index }));
    }, []);

    const handleSave = useCallback(() => {
        let errorMessages = validate({
            generalSetting: generalSetting,
            recipients: recipients,
            errorMessages: []
        });
        if (errorMessages.length) {
            dispatch(setErrorMessages(errorMessages));
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        } else {
            dispatch(setErrorMessages([]));
        }
        dispatch(updateProcessStatus({
            actionName: actionNames.createBatchPayments,
            att: processKeys.processing,
            value: true
        }))
        createdBatchRecurringPayments(account, recurringPaymentsData);
    }, [account, generalSetting, recipients])

    return (

        <Card w="full">

            <CardBody>
                <Stack divider={<StackDivider />} gap={4}>
                    {
                        recipients.map((recipient, index) => {
                            return (
                                <Box key={`recipient-${index}`}>

                                    <Flex alignItems={"center"} justifyContent="space-between">
                                        <WrapItem><Avatar name={(index + 1).toString()} size={"xs"} /></WrapItem>
                                        <ButtonGroup>

                                            <IconButton onClick={() => handleRemoveRecipient(index)} isDisabled={recipients.length == 1} aria-label='Remove Recipient' icon={<DeleteIcon />} />
                                        </ButtonGroup>
                                    </Flex>

                                    <VStack>
                                        <FormControl isRequired={true}>
                                            <FormLabel>Wallet Address</FormLabel>
                                            <AddressFieldForMultiRecipient
                                                att="recipient"
                                                index={index}
                                                value={recipient.recipient}
                                                handleChange={handleChangeRecipient}
                                            />
                                        </FormControl>

                                        <HStack gap={2} width="full">
                                            <FormControl isRequired={true}>
                                                <FormLabel>Unlock Number</FormLabel>
                                                <InputGroup>

                                                    <Input type={"number"} value={recipient.numberOfUnlocks} min={1} onChange={(e) => handleChangeRecipient(index, "numberOfUnlocks", e.target.value)} />

                                                </InputGroup>
                                            </FormControl>
                                            <FormControl isRequired={true}>
                                                <FormLabel>Amount per Time</FormLabel>
                                                <InputGroup>
                                                    <Input type={"number"} value={recipient.unlockAmountPerTime} min={0} onChange={(e) => handleChangeRecipient(index, "unlockAmountPerTime", e.target.value)} />
                                                </InputGroup>
                                            </FormControl>
                                        </HStack>

                                        <HStack gap={2} width="full">
                                            <FormControl isRequired={true}>
                                                <FormLabel>Unlock Every</FormLabel>
                                                <InputGroup>
                                                    <Input type={"number"} value={recipient.unlockEvery} min={1} onChange={(e) => handleChangeRecipient(index, "unlockEvery", e.target.value)} />
                                                    <InputRightAddon p={0} children={
                                                        <Select variant={'outline'} value={recipient.unlockEveryType} onChange={(e) => handleChangeRecipient(index, "unlockEveryType", e.target.value)} fontSize={"14px"}>
                                                            <option value={1}>Second</option>
                                                            <option value={60}>Minute</option>
                                                            <option value={3600}>Hour</option>
                                                            <option value={86400}>Day</option>
                                                            <option value={604800}>Week</option>
                                                            <option value={2592000}>Month</option>
                                                            <option value={31536000}>Year</option>
                                                        </Select>
                                                    } />
                                                </InputGroup>
                                            </FormControl>
                                            <FormControl>
                                                <FormLabel>Prepaid</FormLabel>
                                                <InputGroup>
                                                    <Input type={"number"} isRequired={true} value={recipient.prepaidPercentage} min={0} max={100} onChange={(e) => handleChangeRecipient(index, "prepaidPercentage", e.target.value)} />
                                                    <InputRightAddon children={"%"} />
                                                </InputGroup>
                                            </FormControl>

                                        </HStack>



                                    </VStack>
                                </Box>

                            )
                        })
                    }
                </Stack>
            </CardBody>
            <CardFooter justifyContent={"center"}>


                {
                    account ? (

                        <ButtonGroup w={"100%"}>
                            <Button w={"50%"} colorScheme={"blue"} variant="outline" onClick={() => handleAddRecipient()}>New recipient</Button>
                            <Button w={"50%"} isLoading={createBatchPayments.processing} colorScheme="blue" onClick={() => handleSave()}>Apply</Button>
                        </ButtonGroup>
                    )
                        : (<Button colorScheme="blue">Please connect wallet</Button>)
                }


            </CardFooter>

        </Card>


    )
}