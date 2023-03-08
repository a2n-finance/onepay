import { Box, Flex, Image, Stat, StatLabel, StatNumber, useColorModeValue } from "@chakra-ui/react";
import { useEffect } from "react";
import CancelModal from "src/components/recurring-payment/CancelModal";
import DetailModal from "src/components/recurring-payment/DetailModal";
import SentPaymentList from "src/components/recurring-payment/SentPaymentList";
import TransferModal from "src/components/recurring-payment/TransferModal";
import { useAppDispatch, useAppSelector } from "src/controller/hooks";
import { getSenderPaymentRequestsThunk } from "src/controller/payment-list/getUserPaymentRequestThunk";
import { usePaymentRequest } from "src/hooks/usePaymentRequest";

export default function SentPayment() {
    const dispatch = useAppDispatch();
    const {account} = useAppSelector(state => state.network);
    const {getStats} = usePaymentRequest();
    const { paymentRequests } = useAppSelector(state => state.paymentList)
    async function fetchData() {
       await dispatch(getSenderPaymentRequestsThunk());
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
                    backgroundColor={useColorModeValue("purple.400", "purple.900")}
                    rounded={'lg'}>
                    <Flex justifyContent={'space-between'} color="white">
                        <Box pl={{ base: 2, md: 4 }}>
                            <StatLabel fontWeight={'medium'} isTruncated>
                                Total Sent Amount
                            </StatLabel>
                            <StatNumber fontSize={'2xl'} fontWeight={'medium'}>

                                {getStats(paymentRequests)} ICX(s)

                            </StatNumber>
                        </Box>
                        <Box
                            my={'auto'}
                            color={useColorModeValue('gray.800', 'gray.200')}
                            alignContent={'center'}>
                            <Image src="/tokens/icx.png" w={"50px"} />
                        </Box>
                    </Flex>
                </Stat>
            </Box>
            <SentPaymentList />
            <CancelModal />
            <TransferModal />
            <DetailModal />
        </Box>
    )
}