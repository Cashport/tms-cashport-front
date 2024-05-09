"use client";
import { useState } from "react";
import { Flex, Typography } from "antd";

import { SideBar } from "@/components/molecules/SideBar/SideBar";
import { NavRightSection } from "@/components/atoms/NavRightSection/NavRightSection";

import "./clientsview.scss";
import { ClientsViewTable } from "@/components/molecules/tables/ClientsViewTable/ClientsViewTable";
import AccountingAdjustmentsModal from "@/modules/clients/containers/accounting-adjustments-modal";

const { Title } = Typography;

export const CustomersView = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <main className="mainClients">
      <SideBar />
      <Flex vertical className="contentClients">
        <Flex justify="space-between" align="center">
          <Flex gap={"1rem"} align="center">
            <Title level={2} className="titleName" onClick={() => setShowModal(true)}>
              Clientes
            </Title>
          </Flex>
          <NavRightSection />
        </Flex>
        <ClientsViewTable />
      </Flex>
      <AccountingAdjustmentsModal show={showModal} onClose={() => setShowModal(false)} />
    </main>
  );
};
