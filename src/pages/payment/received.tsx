import { Box, Flex, Image, Stat, StatLabel, StatNumber, useColorModeValue } from "@chakra-ui/react";
import { useEffect } from "react";
import CancelModal from "src/components/recurring-payment/CancelModal";
import DetailModal from "src/components/recurring-payment/DetailModal";
import ReceivedPaymentList from "src/components/recurring-payment/ReceivedPaymentList";
import TransferModal from "src/components/recurring-payment/TransferModal";
import WithdrawModal from "src/components/recurring-payment/WithdrawModal";
import { useAppDispatch, useAppSelector } from "src/controller/hooks";
import { getReceivedPaymentRequestsThunk } from "src/controller/payment-list/getReceivedPaymentRequestThunk";
import { usePaymentRequest } from "src/hooks/usePaymentRequest";

export default function ReceivedPayment() {
    const dispatch = useAppDispatch();
    const {account} = useAppSelector(state => state.network);
    const {getStats} = usePaymentRequest();
    const {receivedPaymentRequests} = useAppSelector(state => state.paymentList);
    async function fetchData() {
       await dispatch(getReceivedPaymentRequestsThunk());
    }
    useEffect(() => {
        fetchData();
    }, [account])
    return (
        <Box>
            <Box>
                <Stat
                    mb="5"
                    px={{ base: 2, md: 4 }}
                    py={'5'}
                    shadow={'xs'}
                    backgroundColor={useColorModeValue("blue.400", "blue.900")}
                    rounded={'lg'}>
                    <Flex justifyContent={'space-between'} color="white">
                        <Box pl={{ base: 2, md: 4 }}>
                            <StatLabel fontWeight={'medium'} isTruncated>
                                Total Received Amount
                            </StatLabel>
                            <StatNumber fontSize={'2xl'} fontWeight={'medium'}>
                                {getStats(receivedPaymentRequests)} ICX(s)
                            </StatNumber>
                        </Box>
                        <Box
                            my={'auto'}
                            color={useColorModeValue('gray.800', 'gray.200')}
                            alignContent={'center'}>
                            <Image src="/tokens/icx.png" w={"50px"}/>
                        </Box>
                    </Flex>
                </Stat>
            </Box>
            <ReceivedPaymentList />
            <CancelModal />
            <TransferModal />
            <WithdrawModal />
            <DetailModal />
        </Box>
    )
}