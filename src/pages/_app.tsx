import {Box, ChakraProvider, Container} from '@chakra-ui/react'
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import {persistor, store} from "../controller/store";
import {theme} from "../theme/theme";
import { createStandaloneToast } from '@chakra-ui/toast'
import WithSubnavigation from 'src/components/layout/Navbar';
const { ToastContainer } = createStandaloneToast()

import NProgress from "nprogress";
import Router from "next/router";
Router.events.on("routeChangeStart", (url) => {
    NProgress.start()
})

Router.events.on("routeChangeComplete", (url) => {
    NProgress.done()
})

Router.events.on("routeChangeError", (url) => {
    NProgress.done()
})

function MyApp({ Component, pageProps }) {


    return (
        <ChakraProvider theme={theme}>
            <Provider store={store}>
                < //@ts-ignore
                    PersistGate loading={null} persistor={persistor}>
                    <WithSubnavigation />
                        <Box margin="auto" maxW={"768px"} my={5} px={5}>
                            <Component {...pageProps} />
                        </Box>

                        <ToastContainer />


                </PersistGate>
            </Provider>
        </ChakraProvider>
    )
}

export default MyApp