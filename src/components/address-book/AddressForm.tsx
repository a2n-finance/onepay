import {
    Button, ButtonGroup,
    Card,
    CardBody, CardFooter,
    CardHeader, Divider,
    FormControl,
    FormHelperText,
    FormLabel,
    Heading, HStack,
    Input, InputGroup, InputLeftAddon, InputLeftElement, Select, useStyleConfig,
    VStack
} from "@chakra-ui/react";
import {
    RiWallet2Line
} from "react-icons/ri";
import {
    AiOutlineMail,
} from "react-icons/ai";

import {
    BiGroup
} from "react-icons/bi";
import { BsPerson, BsPersonPlus } from "react-icons/bs";
import { useAppDispatch, useAppSelector } from "src/controller/hooks";
import { useCallback, useEffect } from "react";
import { getGroupsThunk } from "src/controller/address-book/getGroupsThunk";
import { setAddressAttribute } from "src/controller/address-book/addressBookSlice";
import { actionNames, processKeys, updateProcessStatus } from "src/controller/process/processSlice";
import { saveAddressThunk } from "src/controller/address-book/saveAddressThunk";



export default function AddressForm() {
    const dispatch = useAppDispatch();
    const {groupList} = useAppSelector(state => state.addressBook);
    const process = useAppSelector(state => state.process)

    useEffect(() => {
        dispatch(getGroupsThunk());
    }, [process.saveAddressGroup.processing])

    const handleChange = useCallback((att: string, value: string | number) => {
        dispatch(setAddressAttribute({
            att: att,
            value: value
        }))
    }, [])

    const handleSave = useCallback(() => {
        dispatch(updateProcessStatus({
            actionName: actionNames.saveAddress,
            att: processKeys.processing,
            value: true
        }))

        dispatch(saveAddressThunk());

    }, [])

    return (
        <Card>
            <CardBody>
                <VStack>
                    <FormControl>
                        <FormLabel>Wallet Address</FormLabel>
                        <InputGroup>
                            <InputLeftAddon
                                pointerEvents='none'
                                children={<RiWallet2Line/>}
                            />
                            <Input onChange={e => handleChange("walletAddress", e.target.value)} type='text' placeholder='Wallet address' />
                        </InputGroup>
                    </FormControl>
                    <HStack gap={4} width={"full"}>
                        <FormControl>
                            <FormLabel>Name</FormLabel>

                            <InputGroup>
                                <InputLeftAddon
                                    pointerEvents='none'
                                    children={<BsPerson />}
                                />
                                <Input onChange={e => handleChange("name", e.target.value)} type='text' placeholder='Name' />
                            </InputGroup>
                        </FormControl>
                        <FormControl>
                            <FormLabel>Email</FormLabel>

                            <InputGroup>
                                <InputLeftAddon
                                    pointerEvents='none'
                                    children={<AiOutlineMail />}
                                />
                                <Input onChange={e => handleChange("email", e.target.value)} type='email' placeholder='Email' />
                            </InputGroup>
                        </FormControl>
                    </HStack>
                    <FormControl>
                        <FormLabel>Group</FormLabel>
                        <InputGroup>
                            <InputLeftAddon pointerEvents='none' children={<BiGroup />} />

                            <Select onChange={e => handleChange("groupId", e.target.value)} placeholder='Select a group'>
                                {
                                    groupList.map((group, index) => {
                                        return  <option key={`group-${index}`} value={group._id}>{group.name}</option>
                                    })
                                }
                        </Select>
                        </InputGroup>
                        
                    </FormControl>


                </VStack>

            </CardBody>
            <CardFooter>
                <ButtonGroup spacing='2'>
                    <ButtonGroup>
                        <Button onClick={() => handleSave()} isLoading={process.saveAddress.processing} leftIcon={<BsPersonPlus />} variant={"ghost"} colorScheme={"blue"}>SAVE</Button>
                        <Button variant={"ghost"} colorScheme={"purple"}>RESET</Button>
                    </ButtonGroup>
                </ButtonGroup>
            </CardFooter>
        </Card>

    )
}