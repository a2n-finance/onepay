import {Card, CardBody, CardHeader, Heading, Text, useStyleConfig} from "@chakra-ui/react";

export default function LatestProposal() {
    const customBoldCard = useStyleConfig("CustomBoldCard");
    return (
        <Card sx={customBoldCard}>
            <CardHeader>
                <Heading size={"xs"}>Do Mass Payment</Heading>
                <Text>Pay salaries for 30 employees</Text>
            </CardHeader>
            <CardBody>

            </CardBody>
        </Card>
    )
}