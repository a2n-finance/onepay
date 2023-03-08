import {
    Tab,
    TabList,
    TabPanel,
    TabPanels,
    Tabs
} from "@chakra-ui/react";
import DeleteAddressModal from "src/components/address-book/DeleteAddressModal";
import AddressForm from "../../components/address-book/AddressForm";
import AddressList from "../../components/address-book/AddressList";
import GroupForm from "../../components/address-book/GroupForm";

export default function Index() {
    return (


        <Tabs variant='soft-rounded' colorScheme='green'>
            <TabList justifyContent="center">
                <Tab fontSize={{base: "xs", md: "md"}}>Address List</Tab>
                <Tab fontSize={{base: "xs", md: "md"}}>New Address</Tab>
                <Tab fontSize={{base: "xs", md: "md"}}>New Group</Tab>
            </TabList>
            <TabPanels>
                <TabPanel px={0}>
                    <AddressList />
                    <DeleteAddressModal />
                </TabPanel>
                <TabPanel px={0}>
                    <AddressForm />
                </TabPanel>
                <TabPanel px={0}>
                    <GroupForm />
                </TabPanel>
            </TabPanels>
        </Tabs>

    )
}