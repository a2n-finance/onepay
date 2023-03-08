import { AtSignIcon, CopyIcon, RepeatIcon, TimeIcon } from "@chakra-ui/icons";
import { Box, Heading, Stack, Text, useStyleConfig } from "@chakra-ui/react";
import { useRouter } from "next/router";
export default function Index() {
    const router = useRouter();
    const featureCardStyle = useStyleConfig("FeatureCard");
    return (
        <>
            <Stack>
                <Heading size={"xl"} mb={5} lineHeight={1.2}>
                    OnePay
                </Heading>
                <Text color={"gray.500"}>Make all your payments easier and simpler with ICON - Pay wages, disburse tokens, and issue invoices.</Text>
            </Stack>
            <Stack mt={5} gap={4}>
                <Box sx={featureCardStyle} onClick={() => router.push("/payment/recurring")} >
                    <Text>Recurring Payments</Text>
                    <RepeatIcon fontSize={"2xl"} />
                </Box>
                <Box sx={featureCardStyle} onClick={() => router.push("/payment/one-time")} >
                    <Text>One-Time Payments</Text>
                    <TimeIcon fontSize={"2xl"} />
                </Box>
                <Box sx={featureCardStyle} onClick={() => router.push("/invoices/new")} >
                    <Text>Invoice Management</Text>
                    <CopyIcon fontSize={"2xl"} />
                </Box>
                <Box sx={featureCardStyle} onClick={() => router.push("/address-book/")} >
                    <Text>Address Management</Text>
                    <AtSignIcon fontSize={"2xl"} />
                </Box>
            </Stack>
        </>

    )
}