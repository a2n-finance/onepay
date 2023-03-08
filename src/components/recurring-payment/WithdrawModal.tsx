import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    Text,
    InputGroup,
    InputLeftAddon,
    Input,
    ButtonGroup,
} from '@chakra-ui/react'
import { useCallback, useState } from 'react';
import { BiBitcoin } from 'react-icons/bi';
import { RiWallet2Line } from 'react-icons/ri';
import { useAppDispatch, useAppSelector } from 'src/controller/hooks'
import { setShowWithdrawModal } from 'src/controller/payment-list/paymentListSlice';
import { withdrawPaymentRequestThunk } from 'src/controller/payment-list/withdrawPaymentRequestThunk';
import { actionNames, processKeys, updateProcessStatus } from 'src/controller/process/processSlice';

export default function WithdrawModal() {
    const dispatch = useAppDispatch();
    const { showWithdrawModal, selectedPaymentRequest } = useAppSelector(state => state.paymentList);
    const { withdrawPayment } = useAppSelector(state => state.process);
    const [amount, setAmount] = useState(null);

    const handleClose = useCallback(() => {
        dispatch(setShowWithdrawModal(false));
    }, []);

    const handleWithdrawPaymentRequest = useCallback((amount: number) => {

        dispatch(updateProcessStatus({
            actionName: actionNames.withdrawPayment,
            att: processKeys.processing,
            value: true
        }))
        dispatch(withdrawPaymentRequestThunk(amount))

    }, [amount])

    return (
        <Modal isOpen={showWithdrawModal} onClose={handleClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Withdraw Payment Request</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <InputGroup>
                        <InputLeftAddon pointerEvents={"none"} children={<BiBitcoin />} />
                        <Input type={"text"} placeholder="Withdraw amount" value={amount} onChange={(e) => setAmount(e.target.value)} />
                    </InputGroup>
                </ModalBody>

                <ModalFooter>
                    <ButtonGroup gap={4}>
                        <Button isLoading={withdrawPayment.processing} variant='outline' onClick={() => handleWithdrawPaymentRequest(amount)} colorScheme={"purple"}>Withdraw</Button>
                        <Button variant={"outline"} colorScheme='blue' mr={3} onClick={handleClose}>
                            Close
                        </Button>
                    </ButtonGroup>


                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}