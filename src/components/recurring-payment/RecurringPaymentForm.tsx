import {
    Box,
    Button, ButtonGroup,
    Card,
    CardBody, CardFooter,
    CardHeader, Divider,
    FormControl,
    FormHelperText,
    FormLabel,
    Heading, HStack,
    Input, InputGroup, InputLeftAddon, InputLeftElement, InputRightElement, Select, SimpleGrid, useColorMode, useColorModeValue, useStyleConfig,
    VStack
} from "@chakra-ui/react";
import {
    BsPersonDash,
    BsPersonCheck
} from 'react-icons/bs';
import TokenSelector from "../common/TokenSelector";
import { useDropzone } from "react-dropzone";
import { parse } from "csv";
import { useCallback } from "react";
import { userPermissions } from "src/config/permission";
import { useAppDispatch, useAppSelector } from "src/controller/hooks";
import { addNewRecipients, changeGeneralSetting } from "src/controller/batch-recurring/multipleRecurringPaymentSlice";
import { CheckCircleIcon, DownloadIcon, DragHandleIcon, TimeIcon } from "@chakra-ui/icons";
export default function RecurringPaymentForm() {
    const dispatch = useAppDispatch();
    const { generalSetting } = useAppSelector(state => state.batchRecurring);

    const onDrop = useCallback(acceptedFiles => {
        const reader = new FileReader();

        reader.onabort = () => console.log("file reading was aborted");
        reader.onerror = () => console.log("file reading failed");
        reader.onload = () => {
            // Parse CSV file
            // @ts-ignore
            parse(reader.result, (err, data) => {
                data.shift();
                let recipients = data.map(item => {
                    return {
                        recipient: item[0],
                        numberOfUnlocks: parseInt(item[1]),
                        unlockAmountPerTime: parseFloat(item[2]),
                        unlockEvery: parseInt(item[3]),
                        unlockEveryType: parseInt(item[4]),
                        prepaidPercentage: parseInt(item[5])
                    }
                });
                dispatch(addNewRecipients(recipients));
            });
        };

        // read file contents
        acceptedFiles.forEach(file => reader.readAsBinaryString(file));
    }, []);


    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

    const handleChangeSetting = useCallback((att: string, value: any) => {
        dispatch(changeGeneralSetting({ att, value }));
    }, [])


    return (
        <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={5}>
            <Card>
                <CardHeader>General settings</CardHeader>
                <CardBody>

                    <VStack>
                        <FormControl>
                            <FormLabel>Token</FormLabel>
                            <TokenSelector handleOnChange={handleChangeSetting} />

                        </FormControl>
                        <FormControl>
                            <FormLabel>Start Date</FormLabel>

                            <InputGroup>
                                <InputLeftAddon
                                    pointerEvents='none'
                                    children={<TimeIcon />}
                                />
                                <Input type='datetime-local' placeholder='Name' onChange={(e) => handleChangeSetting("startDate", new Date(e.target.value).getTime())} />
                            </InputGroup>
                        </FormControl>
                        <VStack width="full">
                            <FormControl>
                                <FormLabel>Cancel Permission</FormLabel>
                                <InputGroup>
                                    <InputLeftAddon children={<BsPersonDash />} />
                                    <Select onChange={(e) => handleChangeSetting("whoCanCancel", e.target.value)}>
                                        {
                                            userPermissions.map((p, index) => {
                                                return <option key={`cancel-${index}`} value={p.value}>{p.label}</option>
                                            })
                                        }
                                    </Select>

                                </InputGroup>
                            </FormControl>
                            <FormControl>
                                <FormLabel>Transfer Permission</FormLabel>
                                <InputGroup>
                                    <InputLeftAddon children={<BsPersonCheck />} />
                                    <Select onChange={(e) => handleChangeSetting("whoCanTransfer", e.target.value)}>
                                        {
                                            userPermissions.map((p, index) => {
                                                return <option key={`transfer-${index}`} value={p.value}>{p.label}</option>
                                            })
                                        }
                                    </Select>
                                </InputGroup>
                            </FormControl>
                        </VStack>



                    </VStack>
                </CardBody>
            </Card>
            <Card>
                <CardHeader>Add recipients using file .csv</CardHeader>
                <CardBody>
                    <VStack>
                        <Box
                            w={"full"}
                            py="130px"
                            textAlign={"center"}
                            border={useColorModeValue("2px dotted blue", "1px dotted white")}
                            {...getRootProps()}>
                            <input {...getInputProps()} />
                            <p><DragHandleIcon /> Drop 'n' Drag .csv file here or click to upload</p>
                        </Box>
                    </VStack>
                </CardBody>
                <CardFooter>
                    <Button colorScheme={"purple"} onClick={() => window.open("/recipients_sample_file.csv")} leftIcon={<DownloadIcon />} variant={"ghost"}>Download sample CSV file</Button>
                </CardFooter>
            </Card>

        </SimpleGrid>
    )
}