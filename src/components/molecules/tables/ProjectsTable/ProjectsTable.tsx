import { useEffect, useState } from "react";
import { Avatar, Button, Flex, Table, Typography } from "antd";
import type { TableProps } from "antd";
import { Clipboard, DotsThree, Eye, Plus, Triangle } from "phosphor-react";

import { FilterProjects } from "@/components/atoms/FilterProjects/FilterProjects";
import { useProjects } from "@/hooks/useProjects";
import { useAppStore } from "@/lib/store/store";
import { IProject } from "@/types/projects/IProjects";

import "./projectstable.scss";
import UiSearchInput from "@/components/ui/search-input";
import { countries } from "@/utils/countries";

const { Text } = Typography;

export const ProjectTable = () => {
  const [selectFilters, setSelectFilters] = useState({
    country: [] as string[],
    currency: [] as string[]
  });
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const { loading, data } = useProjects({
    page: selectFilters.country.length !== 0 || selectFilters.currency.length !== 0 ? 1 : page,
    currencyId: selectFilters.currency,
    countryId: selectFilters.country
  });

  const projects = useAppStore((state) => state.projects);
  const setProjects = useAppStore((state) => state.getProjects);

  const onChangePage = (pagePagination: number) => {
    setPage(pagePagination);
  };

  useEffect(() => {
    if (data.data?.length === 0) return;
    setProjects(
      data.data
        ?.filter((f) => f.ID !== 44)
        .map((data) => {
          return { ...data, key: data.ID };
        })
    );
  }, [data, setProjects]);

  const invFiltered =
    projects &&
    projects.filter((f) => {
      return f.PROJECT_DESCRIPTION.toLowerCase().includes(search.trim().toLowerCase());
    });

  return (
    <main className="mainProjectsTable">
      <Flex justify="space-between" className="mainProjectsTable_header">
        <Flex gap={"10px"}>
          <UiSearchInput
            className="search"
            placeholder="Buscar"
            onChange={(event) => {
              setTimeout(() => {
                setSearch(event.target.value);
              }, 1000);
            }}
          />
          <FilterProjects setSelecetedProjects={setSelectFilters} />
          <Button className="options" icon={<DotsThree size={"1.5rem"} />} />
        </Flex>
        <Button type="primary" className="buttonNewProject" size="large" href="/proyectos/new">
          Nuevo Proyecto
          {<Plus weight="bold" size={14} />}
        </Button>
      </Flex>
      <Table
        loading={loading}
        scroll={{ y: "61dvh", x: undefined }}
        columns={columns as TableProps<any>["columns"]}
        pagination={{
          pageSize: 25,
          showSizeChanger: false,
          total: data.pagination.totalRows,
          onChange: onChangePage,
          itemRender: (page, type, originalElement) => {
            if (type === "prev") {
              return <Triangle size={".75rem"} weight="fill" className="prev" />;
            } else if (type === "next") {
              return <Triangle size={".75rem"} weight="fill" className="next" />;
            } else if (type === "page") {
              return <Flex className="pagination">{page}</Flex>;
            }
            return originalElement;
          }
        }}
        dataSource={invFiltered}
      />
    </main>
  );
};

const columns: TableProps<IProject>["columns"] = [
  {
    title: "Proyecto",
    dataIndex: "name",
    className: "tableTitle",
    key: "name",
    render: (_, { LOGO }) => (
      <>
        {LOGO ? (
          <Avatar
            shape="square"
            size={70}
            src={<img src={LOGO ?? ""} style={{ objectFit: "contain" }} alt="avatar" />}
          />
        ) : (
          <Avatar shape="square" className="imageWithoutImage" size={65} icon={<Clipboard />} />
        )}
      </>
    )
  },
  {
    title: "Nombre",
    dataIndex: "PROJECT_DESCRIPTION",
    className: "tableTitle",
    key: "PROJECT_DESCRIPTION",
    render: (text) => <Text>{text}</Text>
  },
  {
    title: "País",
    dataIndex: "COUNTRY_NAME",
    className: "tableTitle",
    key: "COUNTRY_NAME",
    render: (text) => (
      <Text className="text">
        {countries(text)}
        {text}
      </Text>
    )
  },
  {
    title: "Dirección",
    className: "tableTitle",
    dataIndex: "ADDRESS",
    key: "ADDRESS"
  },
  {
    title: "Contacto",
    key: "CONTACT",
    className: "tableTitle",
    dataIndex: "CONTACT",
    render: (text) => <Text>{text}</Text>
  },
  {
    title: "Teléfono",
    key: "PHONE",
    className: "tableTitle",
    dataIndex: "PHONE",
    render: (text) => <Text>{text}</Text>
  },
  {
    title: "Usuarios",
    key: "NUMBER_USERS",
    className: "tableTitle",
    dataIndex: "NUMBER_USERS",
    render: (text) => <Text>{text}</Text>
  },
  {
    title: "Divisas",
    key: "CURRENCY",
    className: "tableTitle",
    dataIndex: "CURRENCY",
    render: (_, { CURRENCY }) => {
      return (
        <>
          {CURRENCY.map(({ CURRENCY_NAME, currency_name = "", id }) => {
            const currencyName = CURRENCY_NAME ?? currency_name;
            return <Text key={`${id}-${currencyName}`}>{currencyName.toUpperCase() + " "}</Text>;
          })}
        </>
      );
    }
  },
  {
    title: "Estado",
    key: "status",
    className: "tableTitle",
    width: "130px",
    dataIndex: "status",
    render: (_, { IS_ACTIVE }) => (
      <Flex>
        <Flex
          align="center"
          className={IS_ACTIVE ? "statusContainerActive" : "statusContainerInactive"}
        >
          <div className={IS_ACTIVE ? "statusActive" : "statusInactive"} />
          <Text>{IS_ACTIVE ? "Activo" : "Inactivo"}</Text>
        </Flex>
      </Flex>
    )
  },
  {
    title: "",
    key: "buttonSee",
    width: "54px",
    dataIndex: "",
    render: (_, { ID }) => (
      <Button href={`/proyectos/review/${ID}`} className="icon-detail" icon={<Eye size={20} />} />
    )
  }
];
