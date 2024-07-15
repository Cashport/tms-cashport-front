"use client";
import React from "react";
import "./notificationsView.scss";
import { Descriptions, Flex, Tabs } from "antd";
import UiSearchInput from "@/components/ui/search-input/search-input";
import FiltersNotifications from "@/components/atoms/Filters/FiltersNotifications/FiltersNotifications";
import { formatDateAndTime, timeAgo } from "@/utils/utils";
import { Eye } from "phosphor-react";

const ListPanel = [
  { key: "pending", value: "Pendientes" },
  { key: "opens", value: "Abiertas" },
  { key: "closed", value: "Cerradas" }
];

interface Notification {
  title: string;
  name: string;
  time: Date;
  description: string;
}

interface Notifications {
  opens: Notification[];
  pending: Notification[];
  closed: Notification[];
}
export const NotificationsView = () => {
  const notifications = {
    opens: [
      {
        title: "Notificacion 1",
        description: "Pendiente por aprobación de Santiago Pachón",
        name: "Farmatodo",
        time: new Date(Date.now() - 3600000)
      },
      {
        title: "Cambio de estado factura",
        description: "Pendiente por aprobación de Santiago Pachón",
        name: "Farmatodo",
        time: new Date(Date.now() - 3600000)
      },
      {
        title: "Notificacion 13",
        description: "Pendiente por aprobación de Santiago Pachón",
        name: "Farmatodo",
        time: new Date(Date.now() - 3600000)
      }
    ],
    pending: [
      {
        title: "Notificacion 1",
        description: "Pendiente por aprobación de Santiago Pachón",
        name: "Farmatodo",
        time: new Date(Date.now() - 3600000)
      },
      {
        title: "Actualización datos de cliente",
        description: "Pendiente por aprobación de Santiago Pachón",
        name: "Farmatodo",
        time: new Date(Date.now() - 3600000)
      },
      {
        title: "Cambio de estado factura",
        description: "Pendiente por aprobación de Santiago Pachón",
        name: "Farmatodo",
        time: new Date(Date.now() - 3600000)
      }
    ],
    closed: [
      {
        title: "Notificacion 1",
        description: "Pendiente por aprobación de Santiago Pachón",
        name: "Farmatodo",
        time: new Date(Date.now() - 3600000)
      }
    ]
  };

  const renderNotifications = (type: keyof Notifications) => {
    const currentNotifications = notifications[type];
    return currentNotifications?.map((item, index) => (
      <Flex className="notifications__container" key={index}>
        <div className="notifications__list">
          <div className="list-item">
            <div>
              <Flex gap="1rem">
                <p className="item__title">{item.title}</p>
                <p className="item__name">{item.name}</p>
                <p className="item__date">{formatDateAndTime(item.time.toString())}</p>
              </Flex>
              <p className="item__name">{item.description}</p>
            </div>
            <div className="eyeIcon">
              <Eye size={28} />
            </div>
          </div>
        </div>
      </Flex>
    ));
  };

  return (
    <div className="notificationView">
      <Tabs
        defaultActiveKey="1"
        style={{ height: 220 }}
        items={ListPanel.map((item, i) => {
          return {
            label: `${item.value}`,
            key: String(i),
            children: (
              <Flex vertical>
                <Flex className="searchBar__container">
                  <UiSearchInput
                    placeholder="Buscar"
                    onChange={(event) => {
                      setTimeout(() => {
                        console.info(event.target.value);
                      }, 1000);
                    }}
                  />
                  <FiltersNotifications />
                </Flex>
                {renderNotifications(item.key as keyof Notifications)}
              </Flex>
            )
          };
        })}
      />
    </div>
  );
};
