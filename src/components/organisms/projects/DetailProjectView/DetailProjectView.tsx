import { Button, Flex, Image, Tabs, TabsProps, Typography } from "antd";
import { CaretLeft, CaretRight, ClipboardText } from "phosphor-react";
import { useRouter } from "next/navigation";

import { SideBar } from "@/components/molecules/SideBar/SideBar";
import { ProjectInfoTab } from "@/components/molecules/tabs/Projects/ProjectInfo/ProjectInfoTab";
import { useState } from "react";
import { ProjectFormTab } from "@/components/molecules/tabs/Projects/ProjectForm/ProjectFormTab";
import { PricesStatus } from "@/components/atoms/PricesStatus/PricesStatus";
import { NotificationButton } from "@/components/atoms/NotificationButton/NotificationButton";

import "./detailproject.scss";

const { Title, Text } = Typography;

export const DetailsProjectView = () => {
  const { push } = useRouter();
  const [isEditProject, setIsEditProject] = useState(false);
  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "Proyectos",
      children: isEditProject ? (
        <ProjectFormTab onIsEditProject={() => setIsEditProject(false)} />
      ) : (
        <ProjectInfoTab onIsEditProject={() => setIsEditProject(true)} />
      )
    },
    {
      key: "2",
      label: "Reglas de Negocio",
      children: "Content of Tab Pane 2"
    },
    {
      key: "3",
      label: "Cuentas",
      children: "Content of Tab Pane 3"
    }
  ];

  return (
    <main className="mainDetailProject">
      <SideBar />
      <Flex vertical className="containerDetailProject">
        <Flex component={"navbar"} align="center" justify="space-between">
          <Flex align="center">
            <Button
              type="text"
              size="large"
              href="/"
              className="buttonGoBack"
              icon={<CaretLeft size={"1.45rem"} />}
            >
              Volver
            </Button>
            <Text className="divider">|</Text>
            <ClipboardText className="icon" size={"1.55rem"} />
            <CaretRight className="icon" size={"1.75rem"} />
            <Text className="rutesText" onClick={() => push("/")}>
              Todos los proyectos{" "}
            </Text>
            <CaretRight className="icon" size={"1.75rem"} />
            <Text className="rutesText">Cruz Verde Detalles </Text>
          </Flex>
          <Flex align="center">
            <PricesStatus />
            <NotificationButton />
          </Flex>
        </Flex>
        <Flex className="infoHeaderProject">
          <Flex>
            {/* ------------Image Project-------------- */}
            <Image
              height={"7rem"}
              src="/images/cruz-verde.png"
              alt="Cruz verde png"
              className="imageProject"
            />
          </Flex>
          {/* ------------Main Info Project-------------- */}
          <Flex vertical>
            <Title level={1} className="titleName">
              Cruz Verde
            </Title>
            <Title level={4} className="subtitleNit">
              NIT 10122012334-5
            </Title>
          </Flex>
        </Flex>
        <Flex className="tabsContainer">
          <Tabs defaultActiveKey="1" items={items} size="large" />
        </Flex>
      </Flex>
    </main>
  );
};
