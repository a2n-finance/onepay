import {Card, CardBody, CardFooter, CardHeader, GridItem, Heading, Text} from "@chakra-ui/react";

export default function WalletItem({item, customStyle}) {
    return (
        <GridItem>
            <Card sx={customStyle}>
                <CardHeader>
                    <Heading size={"xs"}>A2N Finance - Accountant Group</Heading>
                    <Text>Manage salary payment</Text>
                </CardHeader>
                <CardBody>

                </CardBody>
                <CardFooter>
                </CardFooter>
            </Card>
        </GridItem>
    )
}