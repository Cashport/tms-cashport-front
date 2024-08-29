import { Modal } from "antd";
import { X } from "phosphor-react";
import { useEffect, useState } from "react";
import styles from "./ModalGenerateActionTO.module.scss";
import { MessageInstance } from "antd/es/message/interface";
import ActionList from "./ActionList/ActionList";
import CarrierList from "./CarrierList/CarrierList";
import PreauthorizeTrip from "./PreauthorizeTrip/PreauthorizeTrip";
import { BillingByCarrier, BillingStatusEnum } from "@/types/logistics/billing/billing";

export enum ViewEnum {
  "SELECT_ACTION" = "SELECT_ACTION",
  "SELECT_CARRIER" = "SELECT_CARRIER",
  "FINALIZE_TRIP" = "FINALIZE_TRIP",
  "CHANGE_CARRIER_VEHICLE" = "CHANGE_CARRIER_VEHICLE",
  "CANCEL_TR" = "CANCEL_TR",
  "MODIFY_REQUEST" = "MODIFY_REQUEST",
  "PREAUTHORIZE_TRIP" = "PREAUTHORIZE_TRIP"
}
type PropsModalGenerateActionTO = {
  idTR: string;
  carriersData: BillingByCarrier[];
  isOpen: boolean;
  onClose: () => void;
  messageApi: MessageInstance;
};

export default function ModalGenerateActionTO(props: Readonly<PropsModalGenerateActionTO>) {
  const { isOpen, onClose, idTR, carriersData, messageApi } = props;
  const [selectedView, setSelectedView] = useState<ViewEnum>(ViewEnum.SELECT_ACTION);
  const [selectedCarrier, setSelectedCarrier] = useState<number | null>(null);
  const billingsInStatusAcepted = carriersData.filter(
    (billing) => billing.statusDesc === BillingStatusEnum.Aceptadas
  );

  const renderView = () => {
    switch (selectedView) {
      case ViewEnum.SELECT_ACTION:
        return (
          <ActionList
            setSelectedView={setSelectedView}
            canPreauthorize={billingsInStatusAcepted.length > 0}
          />
        );
      case ViewEnum.SELECT_CARRIER:
        return (
          <CarrierList
            setSelectedCarrier={setSelectedCarrier}
            carriers={billingsInStatusAcepted}
            setSelectedView={setSelectedView}
          />
        );
      case ViewEnum.PREAUTHORIZE_TRIP:
        return (
          <PreauthorizeTrip
            idTR={idTR}
            carrier={carriersData.find((cd) => cd.id == selectedCarrier) as BillingByCarrier}
            messageApi={messageApi}
            onClose={onClose}
          />
        );
      default:
        return <ActionList setSelectedView={setSelectedView} canPreauthorize={false} />;
    }
  };

  const renderTitle = () => {
    switch (selectedView) {
      case ViewEnum.SELECT_ACTION:
        return <p className={styles.selectTitle}>Selecciona la acción que vas a realizar</p>;
      case ViewEnum.SELECT_CARRIER:
        return <p className={styles.selectTitle}>Selecciona el proveedor a preautorizar</p>;
      case ViewEnum.PREAUTHORIZE_TRIP:
        return <p className={styles.actionTitle}>Cargar preautorización</p>;
      default:
        return "";
    }
  };

  useEffect(() => {
    return () => {
      setSelectedView(ViewEnum.SELECT_ACTION);
    };
  }, [isOpen]);

  return (
    <Modal
      width={698}
      title={renderTitle()}
      styles={{ body: { maxHeight: "32rem", overflowY: "auto", paddingTop: 24 } }}
      centered
      open={isOpen}
      onClose={() => onClose()}
      closeIcon={<X size={20} weight="bold" onClick={onClose} />}
      footer={<></>}
    >
      {renderView()}
    </Modal>
  );
}
