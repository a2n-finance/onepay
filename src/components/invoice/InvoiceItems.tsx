import { DeleteIcon, MinusIcon, SmallAddIcon } from "@chakra-ui/icons";
import {
    Avatar,
    Button,
    ButtonGroup,
    FormControl, FormLabel, IconButton, Input,
    InputGroup,
    InputLeftElement,
    InputRightAddon, NumberDecrementStepper,
    NumberIncrementStepper,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    Stack,
    Table, TableContainer,
    Tbody,
    Td, Tfoot,
    Th,
    Thead,
    Tr,
    useColorModeValue,
    WrapItem
} from "@chakra-ui/react";
import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "src/controller/hooks";
import { addNewItem, changeItem, removeItem } from "src/controller/invoice/invoiceSlice";
import { useInvoice } from "../../hooks/useInvoice";

export default function InvoiceItems() {
    const { getLineItemAmount, getInvoiceAmount } = useInvoice();
    const dispatch = useAppDispatch();
    const invoiceData = useAppSelector(state => state.invoice);
    const { items } = useAppSelector(state => state.invoice)
    const handleChangeItem = useCallback((index: number, att: string, value: any) => {
        dispatch(changeItem({ index, att, value }));
    }, [])

    const handleAddItem = useCallback(() => {
        dispatch(addNewItem());
    }, [])

    const handleRemoveItem = useCallback((index: number) => {
        dispatch(removeItem({ index }));
    }, []);
    return (
        <TableContainer bg={useColorModeValue("whiteAlpha.100", "blackAlpha.900")} px={5}>
            <Table variant='simple'>
                <Thead>
                    <Tr>
                        <Th p={0}><WrapItem alignItems={"center"}><Avatar name={(items.length).toString()} size={"xs"} mr="2" /> item(s)</WrapItem></Th>
                        <Th><Button onClick={() => handleAddItem()} colorScheme="blue" variant={"outline"}>New Item</Button></Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {
                        items.map((item, index) => {
                            let lineItemAmount = getLineItemAmount(item);
                            return (
                                <Tr key={`invoice-item-${index}`}>
                                    <Td p={0}>
                                        <Stack gap={2}>
                                            <FormControl>
                                                <FormLabel>Comment</FormLabel>
                                                <InputGroup>
                                                    <Input type='text' value={item.description} onChange={(e) => handleChangeItem(index, "description", e.target.value)} />
                                                </InputGroup>
                                            </FormControl>
                                            <FormControl>
                                                <FormLabel>Quantity</FormLabel>
                                                <InputGroup>
                                                    <NumberInput value={item.qty} min={0}>
                                                        <NumberInputField onChange={(e) => handleChangeItem(index, "qty", e.target.value)} />
                                                        <NumberInputStepper>
                                                            <NumberIncrementStepper />
                                                            <NumberDecrementStepper />
                                                        </NumberInputStepper>
                                                    </NumberInput>
                                                </InputGroup>
                                            </FormControl>
                                            <FormControl>
                                                <FormLabel>Unit Price</FormLabel>
                                                <InputGroup>
                                                    <NumberInput value={item.unitPrice} min={0}>
                                                        <NumberInputField onChange={(e) => handleChangeItem(index, "unitPrice", e.target.value)} />
                                                        <NumberInputStepper>
                                                            <NumberIncrementStepper />
                                                            <NumberDecrementStepper />
                                                        </NumberInputStepper>
                                                    </NumberInput>
                                                </InputGroup>
                                            </FormControl>

                                        </Stack>

                                    </Td>
                                    <Td>
                                        <Stack gap={2}>
                                            <FormControl>
                                                <FormLabel>Discount</FormLabel>
                                                <InputGroup>
                                                    <InputLeftElement pointerEvents={"none"} children={<MinusIcon fontSize={"xs"} />} />
                                                    <Input type={"number"} value={item.discount} onChange={(e) => handleChangeItem(index, "discount", e.target.value)} />

                                                    <InputRightAddon pointerEvents={"none"} children="%" />
                                                </InputGroup>
                                            </FormControl>
                                            <FormControl>
                                                <FormLabel>Tax</FormLabel>
                                                <InputGroup>
                                                    <InputLeftElement pointerEvents={"none"} children={<SmallAddIcon />} />
                                                    <Input type='number' value={item.tax} onChange={(e) => handleChangeItem(index, "tax", e.target.value)} />
                                                    <InputRightAddon pointerEvents={"none"} children="%" />
                                                </InputGroup>
                                            </FormControl>
                                            <FormControl>
                                                <FormLabel>Line Item Price</FormLabel>

                                                <ButtonGroup>
                                                    <Button size={"lg"} px={2} isDisabled={true}>{lineItemAmount} ICX(s)</Button>
                                                    <IconButton  size={"lg"} onClick={() => handleRemoveItem(index)} aria-label='Remove Recipient' icon={<DeleteIcon />} />
                                                </ButtonGroup>
                                            </FormControl>
                                        </Stack>

                                    </Td>
                                </Tr>
                            )
                        })
                    }


                </Tbody>
                {
                    [1].map(() => {
                        const { amountWithoutTax, totalTaxAmount, totalAmount, due } = getInvoiceAmount(items);
                        return (
                            <Tfoot key="table-footer">
                                <Tr p={0}>
                                    <Td p={0}>Amount Without Tax</Td>
                                    <Td isNumeric>{amountWithoutTax} ICX(s)</Td>
                                </Tr>
                                <Tr>
                                    <Td p={0}>Total Tax Amount</Td>
                                    <Td isNumeric>{totalTaxAmount} ICX(s)</Td>
                                </Tr>
                                <Tr>
                                    <Td p={0}>Total Amount</Td>
                                    <Td isNumeric>{totalAmount} ICX(s)</Td>
                                </Tr>
                                <Tr>
                                    <Td p={0}>Due</Td>
                                    <Td isNumeric>{due} ICX(s)</Td>
                                </Tr>
                            </Tfoot>
                        )
                    })

                }

            </Table>
        </TableContainer>
    )
}