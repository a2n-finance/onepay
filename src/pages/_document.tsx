import { ColorModeScript } from '@chakra-ui/react'
import { Html, Head, Main, NextScript } from 'next/document'
import { theme } from 'src/theme/theme';
export default function Document() {
    return (
        <Html lang='en'>
            <Head>
                <title>Automate Salaries & Recurring Payments</title>
                <meta name="title" content="Automate Salaries & Recurring Payments"></meta>
                <meta name="description" content="IconPay - A2N Finance"></meta>
                <link rel="icon" type="image/x-icon" href="/favicon.ico" />
                <link
                    rel="stylesheet"
                    href="https://cdnjs.cloudflare.com/ajax/libs/nprogress/0.2.0/nprogress.min.css"
                />
                <meta property="og:url" content="https://iconpay.a2n.finance/"></meta>
            </Head>
            <body>
                {/* 👇 Here's the script */}
                <ColorModeScript initialColorMode={theme.config.initialColorMode} />
                <Main />
                <NextScript />
            </body>
        </Html>
    )
}