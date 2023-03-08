import { SettingsIcon } from '@chakra-ui/icons';
import { Box, HStack, IconButton, Menu, MenuButton, MenuItem, MenuList, Stack, Text, VStack } from '@chakra-ui/react';
import { useCallback } from 'react';
import { chains } from 'src/config/chainSettings';
import { useAppDispatch, useAppSelector } from 'src/controller/hooks';
import { PaymentRequest, setSelectedPaymentRequest, setShowCancelModal, setShowDetailModal, setShowTransferModal, setShowWithdrawModal } from 'src/controller/payment-list/paymentListSlice';
import { useAddress } from 'src/hooks/useAddress';
import { usePaymentRequest } from 'src/hooks/usePaymentRequest';
import { useStatus } from 'src/hooks/useStatus';
import PaymentProcess from '../common/PaymentProcess';
import UnlockedAmount from '../common/UnlockedAmount';
export default function ReceivedPaymentList() {
    const dispatch = useAppDispatch();
    const { getShortAddress } = useAddress();
    const { getUnlockSetting } = usePaymentRequest();
    const { getStatus, checkPaymentDisabledActions } = useStatus();
    const { receivedPaymentRequests } = useAppSelector(state => state.paymentList);
    const { chain } = useAppSelector(state => state.network);

    const handleCancel = useCallback((item: PaymentRequest) => {
        dispatch(setSelectedPaymentRequest(item));
        dispatch(setShowCancelModal(true));
    }, [])

    const handleTransfer = useCallback((item: PaymentRequest) => {
        dispatch(setSelectedPaymentRequest(item));
        dispatch(setShowTransferModal(true));

    }, [])

    const handleWithdraw = useCallback((item: PaymentRequest) => {
        dispatch(setSelectedPaymentRequest(item));
        dispatch(setShowWithdrawModal(true));

    }, [])

    const handleViewDetail = useCallback((item: PaymentRequest) => {
        dispatch(setShowDetailModal(true));
        dispatch(setSelectedPaymentRequest(item));
    }, [])

    return (
        <Stack gap={4}>
            {
                receivedPaymentRequests.map((p: PaymentRequest, index) => {
                    let startDate = new Date(p.startDate).toLocaleString();
                    let { unlockSettings, unlockedAmount } = getUnlockSetting(p);
                    let shortAddress = <a href={chains[chain].explorer.concat("address/").concat(p.recipient)} target="_blank">
                        {getShortAddress(p.recipient)}
                    </a>
                    let unlockPercentage = Math.floor((unlockedAmount / p.paymentAmount) * 100);
                    let { isAllowCancel, isAllowTransfer, isAllowWithdraw } = checkPaymentDisabledActions(p, false);
                    return (
                        <VStack key={`received-payment-${p.requestId}`} gap={1}>
                            <HStack justifyContent={"space-between"} w={"full"}>
                                <Box>
                                    <Text fontSize={"xs"} fontWeight={"medium"}>From {shortAddress}</Text>
                                    <Text fontSize={"xs"}>Since {startDate}</Text>
                                </Box>
                                <HStack>
                                    <UnlockedAmount
                                        unlockedAmount={unlockedAmount}
                                        paymentAmount={p.paymentAmount}
                                        paymentRequest={p} />
                                    <Menu>
                                        <MenuButton icon={<SettingsIcon />} as={IconButton} />
                                        <MenuList>
                                            <MenuItem key="withdraw" onClick={() => handleWithdraw(p)} isDisabled={!isAllowWithdraw}>Withdraw</MenuItem>
                                            <MenuItem key="cancel" onClick={() => handleCancel(p)} isDisabled={!isAllowCancel}>Cancel</MenuItem>
                                            <MenuItem key="transfer" onClick={() => handleTransfer(p)} isDisabled={!isAllowTransfer}>Transfer</MenuItem>
                                            <MenuItem key={"details"} onClick={() => handleViewDetail(p)}>View Details</MenuItem>
                                        </MenuList>
                                    </Menu>
                                </HStack>
                            </HStack>
                            <PaymentProcess
                                unlockPercentage={unlockPercentage}
                                paymentAmount={p.paymentAmount}
                                paymentRequest={p} />
                        </VStack>
                    )
                })
            }
        </Stack>

    )
}