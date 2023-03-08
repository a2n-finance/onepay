import {
    Heading, Modal, ModalBody,
    ModalCloseButton, ModalContent,
    ModalHeader, ModalOverlay, Stack, Text
} from '@chakra-ui/react';
import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from 'src/controller/hooks';
import { setShowDetailModal } from 'src/controller/payment-list/paymentListSlice';
import { useAddress } from 'src/hooks/useAddress';
import { useStatus } from 'src/hooks/useStatus';

export default function DetailModal() {
    const dispatch = useAppDispatch();
    const { getShortAddress } = useAddress();
    const { getStatus } = useStatus();
    const { showDetailModal, selectedPaymentRequest } = useAppSelector((state) => state.paymentList)
    const handleClose = useCallback(() => {
        dispatch(setShowDetailModal(false));
    }, []);

    return (
        <Modal isOpen={showDetailModal} onClose={handleClose} size={{ base: "xs", md: 'md' }}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>
                    <Heading size={"sm"}>Payment Details</Heading>
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    {selectedPaymentRequest && <Stack gap={1}>
                        <Text><strong>Sender</strong>: {getShortAddress(selectedPaymentRequest.sender)}</Text>
                        <Text><strong>Recipient:</strong> {getShortAddress(selectedPaymentRequest.recipient)}</Text>
                        <Text><strong>Total Amount:</strong> {selectedPaymentRequest.paymentAmount} ICX(s)</Text>
                        <Text><strong>Withdrew:</strong> {parseFloat((selectedPaymentRequest.paymentAmount - selectedPaymentRequest.remainingBalance).toFixed(4))} ICX(s)</Text>
                        <Text><strong>Unlock Amount each Time:</strong> {selectedPaymentRequest.unlockAmountPerTime} ICX(s)</Text>
                        <Text><strong>Number of Unlocks:</strong> {selectedPaymentRequest.numberOfUnlocks}</Text>
                        <Text><strong>Unlock Every:</strong> {selectedPaymentRequest.unlockEvery} second(s)</Text>
                        <Text><strong>Status:</strong> {getStatus(selectedPaymentRequest.status)}</Text>
                    </Stack>
                    }


                </ModalBody>
            </ModalContent>
        </Modal>
    )
}