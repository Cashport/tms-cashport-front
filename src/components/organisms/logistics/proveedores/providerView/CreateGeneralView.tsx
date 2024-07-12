import { Flex, Typography, message, Row, Col, Table, AutoComplete, Input, Tabs } from "antd";
import React, { useRef, useEffect, useState, useContext } from "react";
import type { TabsProps } from "antd";

// components
import { SideBar } from "@/components/molecules/SideBar/SideBar";
import { NavRightSection } from "@/components/atoms/NavRightSection/NavRightSection";

import { IListData, ILocation } from "@/types/logistics/schema";

//locations
import { getAllLocations } from "@/services/logistics/locations";

import { useRouter } from "next/navigation";

import "../../../../../styles/_variables_logistics.css";

import "./createGeneralView.scss";
import { CarrierTable } from "@/components/molecules/tables/logistics/carrierTable/carrierTable";


const { Title } = Typography;

export const CreateGeneralView = () => {
  const { push } = useRouter();
  const [messageApi, contextHolder] = message.useMessage();
  const [renderAllInfo, setRenderInfo] = useState(true);
  const [value, setValue] = useState("1");

  return (
    <>
      {contextHolder}
      <main className="mainCreateOrder">
        <SideBar />
        <Flex vertical className="containerCreateOrder">
          <Flex className="infoHeaderOrder">
            <Flex gap={"2rem"}>
              <Title level={2} className="titleName">
                Proveedores
              </Title>
            </Flex>
            <Flex component={"navbar"} align="center" justify="space-between">
              <NavRightSection />
            </Flex>
          </Flex>
          {/* ------------Main Info Order-------------- */}
          <Flex className="orderContainer">
            <Row style={{ width: "100%" }}>
              <Col span={24}>
                <CarrierTable />
              </Col>
            </Row>
          </Flex>
        </Flex>
      </main>
    </>
  );
};
