import { Progress } from "@chakra-ui/react";
import { useAppSelector } from "src/controller/hooks";

export default function ActionProcess() {
    const {withdrawPayment, transfer, cancel} = useAppSelector(state => state.process)
    if (withdrawPayment.processing || transfer.processing || cancel.processing ) {
        return (
            <Progress size='xs' my={2} isIndeterminate />
        )
    } 

    return (
        <></>
    )
   
}