import {Card, CardBody, CardFooter, CardHeader, GridItem, Heading, Text, useStyleConfig} from "@chakra-ui/react";

export default function ProposalItem() {
    return (
        <GridItem>
            <Card>
                <CardHeader>
                    <Heading size={"xs"}>Do Mass Payment</Heading>
                </CardHeader>
                <CardBody>
                    <Text>Pay salaries for 30 employees</Text>
                </CardBody>
                <CardFooter>
                </CardFooter>
            </Card>
        </GridItem>
    )
}