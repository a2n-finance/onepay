import { Text } from "@chakra-ui/react";
import moment from "moment";
import { useEffect, useState } from "react";

export default function UnlockedAmount({ unlockedAmount, paymentAmount, paymentRequest }) {
    const [amount, setAmount] = useState(unlockedAmount);
    const [firstLoading, setFirstLoading] = useState(false)
    useEffect(() => {
        if (!firstLoading) {
            if (unlockedAmount < paymentAmount && paymentRequest.status == 1) {
                let i = setInterval(function () {
                    let numberOfUnlock = Math.floor(
                        (moment().unix() - (paymentRequest.startDate/1000)) / paymentRequest.unlockEvery
                    );
                    let ua = numberOfUnlock * paymentRequest.unlockAmountPerTime;
                    if (ua <= 0) {
                        setAmount(0);
                    }
    
                    if (ua > 0 && ua < paymentAmount) {
                        setAmount(ua)
                    }
    
                    if (ua >= paymentAmount) {
                        setAmount(paymentAmount);
                        clearInterval(i);
                    }
                }, paymentRequest.unlockEvery * 1000)
            } else {
                setAmount(paymentAmount);
            }

            setFirstLoading(true);
        }
    
    }, [firstLoading])
    return (
        <Text fontWeight={"medium"} fontSize={"sm"}>{parseFloat(amount.toFixed(4))} / {parseFloat(paymentAmount.toFixed(4))} ICX(s)</Text>
    )
}