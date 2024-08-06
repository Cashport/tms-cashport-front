"use client";
import { Col, Flex, message } from "antd";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Buttons from "../../detail/components/Buttons/Buttons";
import { CaretLeft } from "@phosphor-icons/react";
import SolicitationDetail from "../../detail/components/SolicitationDetail/SolicitationDetail";
import VehicleAndDriverAsignation from "../../detail/components/VehicleAndDriverAsignation/VehicleAndDriverAsignation";
import { formatMoney } from "@/utils/utils";
import { useEffect, useRef, useState } from "react";
import styles from "./AceptCarrierDetailView.module.scss";
import { getAceptCarrierRequestById, getDriverByCarrierId, getVehiclesByCarrierId, postCarrierReject, postCarrierRequest } from "@/services/logistics/acept_carrier";
import { ICarrierRequestDetail, IMaterial } from "@/types/logistics/schema";
import { Confirmation } from "../../detail/components/Confirmation/Confirmation";

interface AceptCarrierDetailProps {
  params: { id: string };
}

export default function AceptCarrierDetailView({ params }: AceptCarrierDetailProps) {
  const [view, setView] = useState<"detail" | "asignation" | "confirmation">("detail");
  const [isNextStepActive, setIsNextStepActive] = useState<boolean>(true);
  const [vehicleSelected, setVehicleSelected] = useState<number>(0);
  const [driversSelected, setDriverSelected] = useState<number[]>([0]);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [drivers, setDrivers] = useState<any[]>([]);
  const [observation, setObservation] = useState<any>(null);
  const router = useRouter();

  const [carrier, setCarrier] = useState<ICarrierRequestDetail>();

  const [messageApi, contextHolder] = message.useMessage();

  /* Agendamiento */
  const origin = useRef<any>([]);
  const destination = useRef<any>([]);

  const [dataCarga, setDataCarga] = useState<IMaterial[]>([]);

  /* MAPBOX */
  const [routeGeometry, setRouteGeometry] = useState<any>(null);
  const [routeInfo, setRouteInfo] = useState([]);
  const [distance, setDistance] = useState<any>(null);
  const [timetravel, setTimeTravel] = useState<any>(null);

  useEffect(() => {
    return () => {
      setView("detail");
    };
  }, []);

  useEffect(() => {
    loadTransferRequests();
    //loadDrivers();
    //loadVehicles();
  }, []);

  {/*const loadVehicles = async () => {
    const result = await getVehiclesByCarrierId(String(carrier?.id_carrier));
    setVehicles(result.data.data);
  }

  const loadDrivers = async () => {
    const result = await getDriverByCarrierId(String(carrier?.id_carrier));
    setDrivers(result.data.data);
  };*/}
 
  const loadTransferRequests = async () => {
    if (carrier != undefined) return;
    //when there is more Id to consult, erase the "6" directly ID and leave the params
    // cont result = await getTransferRequestId(params.id);
    const result = await getAceptCarrierRequestById("4");
    if (result.data.data.length > 0) {
      const to: ICarrierRequestDetail = result.data.data[0];
      const driversResult = await getDriverByCarrierId(to?.id_carrier);
      setDrivers(driversResult.data.data);
      const vehiclesResult = await getVehiclesByCarrierId(to?.id_carrier);
      setVehicles(vehiclesResult.data.data);
      setCarrier(to);
      //origin.current = [to.start_location?.longitude, to.start_location?.latitude];
      //destination.current = [to.end_location?.longitude, to.end_location?.latitude];
      const routes = to.geometry;
      setRouteInfo(routes);
      // Check if any routes are returned
      if (routes !== undefined) {
        const { distance, duration, geometry } = routes[0];
        setRouteGeometry(geometry); // Set the route geometry
        setDistance(parseFloat((distance / 1000).toFixed(2)) + " Km");
        var date = new Date();
        date.setSeconds(duration);
        var hrs = date.toISOString().substr(11, 5);
        setTimeTravel(hrs + " Hrs");
      }

      to.carrier_request_material_by_trip?.forEach(async (mat) => {
        mat?.material?.forEach(async (m) => {
          const newvalue: IMaterial = m;
          setDataCarga((dataCarga) => [...dataCarga, newvalue]);
        });
      });
    }
  };

  const handleNext = async () => {
    if (view === "detail") {
      setView("asignation");
    } else if (view === "asignation") {
      setView("confirmation")
    } else {
      await postCarrierRequest(String(carrier?.id_carrier), String(carrier?.id), String(vehicleSelected), driversSelected.map(String), "1", observation)
      messageApi.open({
        content: "Aceptado"
      });
      router.push("/logistics/acept_carrier");
    }
  };

  const handleBack = () => {
    if (view === "confirmation") setView("asignation");
    else if (view === "asignation") setView("detail");
  };
  
  const handleReject = async () => {
    await postCarrierReject(String(carrier?.id_carrier), String(carrier?.id))
    messageApi.open({
      content: "Rechazado"
    });
    router.push("/logistics/acept_carrier")
  };

  const currentStepIndex = view === "detail" ? 0 : view === "asignation" ? 1 : 2;

  const steps = [
    { title: "Detalle solicitud" },
    { title: "Asignación de vehículo y conductor" },
    { title: "Confirmar servicio" }
  ];

  return (
    <>
      {contextHolder}
      <Flex className={styles.wrapper}>
        <Link href="/logistics/acept_carrier" className={styles.link}>
          <CaretLeft size={20} />
          <div>Detalle de TR {params.id}</div>
        </Link>
        <Flex className={styles.stepper}>
          <Col span={16}>
            <Flex justify="space-evenly" style={{ width: "100%" }}>
              {steps.map((step, index) => {
                const isCurrentStep = index === currentStepIndex;
                const isCompletedStep = index < currentStepIndex;
                const stepColor = isCurrentStep
                  ? "#141414"
                  : isCompletedStep
                    ? "#CBE71E"
                    : "#969696";
                const fontWeight = isCurrentStep ? "bold" : "normal";
                return (
                  <>
                    <Flex>
                      {index > 0 && <span style={{ margin: "0 8px", width: "" }}>-</span>}
                    </Flex>
                    <Flex key={index} align="center">
                      <Flex align="center">
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: 24,
                            height: 24,
                            borderRadius: "50%",
                            background: stepColor,
                            color: "white",
                            fontWeight: fontWeight
                          }}
                        >
                          {isCompletedStep ? index + 1 : index + 1}
                        </div>
                        <div style={{ marginLeft: 8, fontWeight: fontWeight }}>{step.title}</div>
                      </Flex>
                    </Flex>
                  </>
                );
              })}
            </Flex>
          </Col>
        </Flex>
        <Flex className={styles.topInfo}>
          <Flex className={styles.left}>
            <div className={styles.vehicle}>
              <b>{carrier?.vehicles}</b>
            </div>
            <div>
              Origen: <b>{carrier?.start_location}</b> - Destino:{" "}
              <b>{carrier?.end_location}</b>
            </div>
          </Flex>
          <hr style={{ borderTop: "1px solid #DDDDDD" }} />
          <Flex className={styles.right}>
            <div className={styles.total}>
              <b>{formatMoney(carrier?.amount)}</b>
            </div>
            <div>
              {distance} KM contrato #{/*carrier?.id_pricing*/}
            </div>
          </Flex>
        </Flex>

        {view === "detail" ? (
          <SolicitationDetail
            providerDetail={carrier}
            dataCarga={dataCarga}
            setIsNextStepActive={setIsNextStepActive}
            service_type={carrier?.service_type}
          />
        ) : view === "asignation" ? (
          <VehicleAndDriverAsignation
            setIsNextStepActive={setIsNextStepActive}
            drivers={drivers}
            vehicles={vehicles}
            setDriver={setDriverSelected}
            setVehicle={setVehicleSelected}
          />
        ) : (
          <Confirmation
            setIsNextStepActive={setIsNextStepActive}
            driverSelected={drivers.find(a => a.id === driversSelected[0])}
            vehicleSelected={vehicles.find(a => a.id === vehicleSelected)}
            setObservation={setObservation}
            isNextStepActive={isNextStepActive}
          />
        )}

        <Buttons
          isRightButtonActive={isNextStepActive}
          isLeftButtonActive={view !== "detail"}
          handleNext={handleNext}
          handleBack={handleBack}
          handleReject={handleReject}
        />
      </Flex>
    </>
  );
}
