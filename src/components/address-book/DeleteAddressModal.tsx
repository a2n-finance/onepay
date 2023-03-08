import {
    Button, ButtonGroup, Modal, ModalBody,
    ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text
} from '@chakra-ui/react';
import { useCallback } from 'react';
import { setShowDeleteModal } from 'src/controller/address-book/addressBookSlice';
import { deleteAddressThunk } from 'src/controller/address-book/deleteAddressThunk';
import { useAppDispatch, useAppSelector } from 'src/controller/hooks';

import { actionNames, processKeys, updateProcessStatus } from 'src/controller/process/processSlice';

export default function DeleteAddressModal() {
    const dispatch = useAppDispatch();
    const { showDeleteAddressModal, selectedAddress } = useAppSelector(state => state.addressBook);
    const { deleteAddress } = useAppSelector(state => state.process);

    const handleClose = useCallback(() => {
        dispatch(setShowDeleteModal(false));
    }, []);

    const handleDeleteAddress = useCallback(() => {

        dispatch(updateProcessStatus({
            actionName: actionNames.deleteAddress,
            att: processKeys.processing,
            value: true
        }))
        dispatch(deleteAddressThunk())


    }, [])

    return (
        <Modal isOpen={showDeleteAddressModal} onClose={handleClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader></ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Text>Do you want to delete this address?</Text>
                </ModalBody>

                <ModalFooter>
                    <ButtonGroup gap={4}>
                        <Button isLoading={deleteAddress.processing} variant="outline" onClick={() => handleDeleteAddress()} colorScheme={"red"}>Delete</Button>
                    </ButtonGroup>


                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}