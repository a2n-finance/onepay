import { Card, CardBody, CardHeader, Heading, Stack, Text } from "@chakra-ui/react";
import { useAppSelector } from "src/controller/hooks";

export function ErrorMessage() {
    const { errorMessages } = useAppSelector(state => state.batchRecurring);
    if (errorMessages.length == 0) {
        return (<></>)
    }
    return (
        <Card bgColor={"red.900"} color={"whiteAlpha.800"}>
            <CardHeader>
                <Text>Please fix these errors</Text>
            </CardHeader>
            <CardBody>
                <Stack>
                    {
                        errorMessages.map(e => {
                            return <Text>
                                - {e}
                            </Text>
                        })
                    }
                </Stack>
            </CardBody>
        </Card>
    )
}