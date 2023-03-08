import {Grid, useStyleConfig} from "@chakra-ui/react";
import WalletItem from "./WalletItem";

export default function WalletList() {
    const customGeneralCard = useStyleConfig("CustomGeneralCard");
    return (
        <Grid templateColumns='repeat(4, 1fr)'
              gap={4}>
            <WalletItem item={null} customStyle={customGeneralCard} />
        </Grid>
    )
}