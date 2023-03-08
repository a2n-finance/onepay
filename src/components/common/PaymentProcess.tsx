import { useState, useEffect } from "react";
import { Progress } from "@chakra-ui/react";
import moment from "moment";

export default function PaymentProcess({ unlockPercentage, paymentAmount, paymentRequest }) {
    const [percentage, setPercentage] = useState(unlockPercentage);
    const [firstLoading, setFirstLoading] = useState(false);
    useEffect(() => {
        if (!firstLoading) {
            if (percentage < 100 && paymentRequest.status === 1) {
                let i = setInterval(function () {
                    let numberOfUnlock = Math.floor(
                        (moment().unix() - (paymentRequest.startDate/1000)) / paymentRequest.unlockEvery
                    );
                    let ua = numberOfUnlock * paymentRequest.unlockAmountPerTime
    
                    if (ua <= 0) {
                        setPercentage(0);
                    }
                    if (ua > 0 && ua <= paymentAmount) {
                        setPercentage(Math.floor(ua * 100 / paymentAmount))
                    }
    
                    if (ua >= parseFloat(paymentAmount)) {
                        setPercentage(100);
                        clearInterval(i);
                    }
                }, paymentRequest.unlockEvery * 1000)
            } else {
                setPercentage(100)
            }

            setFirstLoading(true)
    
        }
        
    }, [firstLoading])

    return (
        <Progress w={"full"} value={percentage} size='xs' colorScheme='purple' />
    )
}