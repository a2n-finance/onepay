import {
    Button, ButtonGroup,
    Card,
    CardBody, CardFooter,
    CardHeader, Divider,
    FormControl,
    FormHelperText,
    FormLabel,
    Heading, HStack,
    Input, InputGroup, InputLeftAddon, InputLeftElement, Select, Textarea, useStyleConfig,
    VStack
} from "@chakra-ui/react";
import {
    RiWallet2Line
} from "react-icons/ri";

import {
    AiOutlineUsergroupAdd
} from "react-icons/ai";

import {
    BiGroup
} from "react-icons/bi";
import { BsPersonPlus } from "react-icons/bs";
import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "src/controller/hooks";
import { saveGroupThunk } from "src/controller/address-book/saveGroupThunk";
import { setGroupAttribute } from "src/controller/address-book/addressBookSlice";
import { updateProcessStatus, actionNames } from "src/controller/process/processSlice";

export default function GroupForm() {
    const dispatch = useAppDispatch();
    const process = useAppSelector(state => state.process);
    
    const handleSave = useCallback(() => {
        dispatch(updateProcessStatus({
            actionName: actionNames.saveAddressGroup,
            att: "processing",
            value: true
        }))
        dispatch(saveGroupThunk());
    }, [])

    const handleChange = useCallback((att: string, value: string | number) => {

        dispatch(setGroupAttribute({att, value}));
    }, [])

    return (
        <Card>
            <CardBody>
                <VStack>
                    <FormControl>
                        <FormLabel>Name</FormLabel>
                        <InputGroup>
                            <InputLeftAddon
                                pointerEvents='none'
                                children={<BiGroup/>}
                            />
                            <Input type='text' onChange={(e) => handleChange("name", e.target.value)} placeholder='Group name' />
                        </InputGroup>
                    </FormControl>
                    <FormControl>
                        <FormLabel>Description</FormLabel>
                        <InputGroup>
                            <Textarea onChange={(e) => handleChange("description", e.target.value)} />
                        </InputGroup>
                    </FormControl>


                </VStack>

            </CardBody>
            <CardFooter>
                <ButtonGroup spacing='2'>
                    <ButtonGroup>
                        <Button isLoading={process.saveAddressGroup.processing} onClick={() => handleSave()} leftIcon={<AiOutlineUsergroupAdd />} variant={"ghost"} colorScheme={"blue"}>SAVE</Button>
                        <Button variant={"ghost"} colorScheme={"purple"}>RESET</Button>
                    </ButtonGroup>
                </ButtonGroup>
            </CardFooter>
        </Card>

    )
}