import { InputGroup, InputLeftAddon, Select, Tag } from "@chakra-ui/react";
import { whiteListTokenOfChain } from "src/config/whitelistTokens";
import { useAppSelector } from "src/controller/hooks";
import {
    BiBitcoin
} from 'react-icons/bi';

export default function TokenSelector({handleOnChange}) {
    const {chain} = useAppSelector(state => state.network)
    return (
        <InputGroup>
        <InputLeftAddon children={<BiBitcoin />} />
        <Select required onChange={(e) => handleOnChange("tokenAddress", e.target.value)}>
            {
                whiteListTokenOfChain[chain].map((token) => {
            
                    return <option key={`option-${token.symbol}`} disabled={!token.isNative} value={token.address}>
                        {token.isNative ? token.name : token.name.concat(" (upcoming)")}
                        </option>
                })
            }
        </Select>
    
        </InputGroup>
    )
        
}