const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
export type Token = {
    name: string,
    symbol: string,
    address?: string,
    decimals: number,
    logo: string,
    isNative: boolean
}
type WhiteListTokenOfChain = {
    [key: string] : Token[]
}

export const whiteListTokenOfChain: WhiteListTokenOfChain = {
    "icon": [
        {
            name: "ICX",
            symbol: "ICX",
            address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
            decimals: 18,
            logo: "/tokens/icx.png",
            isNative: true
        }, 
        {
            name: "Staked ICX",
            symbol: "sICX",
            address: "cx2d013cb55781fb54b81d629aa4b611be2daec564",
            decimals: 18,
            logo: "/tokens/stakedICX.png",
            isNative: false
        },
        {
            name: "USDT",
            symbol: "USDT",
            address: "cxa6b9e978a309e19339c349b2ee5d75ae9ea55ddb",
            decimals: 18,
            logo: "/tokens/usdt.png",
            isNative: false
        }
    ]
}

export const tokenAddressInfo = {
    "icon": {
        "cx1eec86a2e2de2cd73e3e80e48deaa703e317d6c0": {
            name: "ICX",
            symbol: "ICX",
            decimals: 18,
            logo: "/tokens/icx.png",
            isNative: true
        },
        "cx2d013cb55781fb54b81d629aa4b611be2daec564": {
            name: "Staked ICX",
            symbol: "sICX",
            address: "cx2d013cb55781fb54b81d629aa4b611be2daec564",
            decimals: 18,
            logo: "/tokens/stakedICX.png",
            isNative: false
        },
        "cxa6b9e978a309e19339c349b2ee5d75ae9ea55ddb": {
            name: "USDT",
            symbol: "USDT",
            address: "cxa6b9e978a309e19339c349b2ee5d75ae9ea55ddb",
            decimals: 18,
            logo: "/tokens/usdt.png",
            isNative: false
        }
    }
}