"use client";
import { Col, Flex, Row } from "antd";
import { UploadDocumentButton } from "@/components/atoms/UploadDocumentButton/UploadDocumentButton";
import UploadDocumentChild from "@/components/atoms/UploadDocumentChild/UploadDocumentChild";
import styles from "./aditionalInfo.module.scss";
import { Dispatch, SetStateAction, useEffect } from "react";

interface Documents {
  id: number;
  document_type_desc: string;
  url_document: string;
  active: number | string;
}
interface Contacts {
  id: number;
  name: string;
  contact_type: number;
  contact_number: number | string;
}
interface OtherReq {
  id: number;
  id_other_requeriments: number;
  other_requirement_desc: string;
  quantity: number;
}
interface AditionalInfoProps {
  title?: string;
  documents?: Documents[];
  contacts: Contacts[];
  finalClient?: string;
  otherRequirements?: OtherReq[];
  specialInstructions?: string;
  setIsNextStepActive?: Dispatch<SetStateAction<boolean>>;
  insideCollapse?: boolean;
}

const CONTACT_TYPES = {
  ORIGIN: 1,
  DESTINATION: 2
};

export default function AditionalInfo({
  title,
  documents,
  contacts,
  specialInstructions,
  finalClient,
  otherRequirements,
  setIsNextStepActive,
  insideCollapse = false
}: Readonly<AditionalInfoProps>) {
  useEffect(() => {
    if (setIsNextStepActive) {
      documents?.length !== undefined && setIsNextStepActive(true);
    }
  }, []);

  return (
    <Flex className={insideCollapse ? "" : styles.wrapper}>
      {title && <p className={styles.sectionTitle}>{title}</p>}
      <Row style={{ width: "100%" }}>
        <Col span={24}>
          <Flex vertical style={{ width: "99%" }}>
            <p className={styles.title} style={{ marginBottom: "0.5rem" }}>
              Documentos
            </p>
            <Row>
              {documents?.map((file: any, index) => (
                <Col
                  span={12}
                  style={{
                    paddingLeft: index % 2 !== 0 ? "2.5rem" : "0px",
                    paddingRight: index % 2 == 0 ? "2.5rem" : "0px",
                    paddingBottom: "0.5rem",
                    borderRight: index % 2 === 0 ? "1px solid #f7f7f7" : ""
                  }}
                  key={`file-${file.id}`}
                >
                  <UploadDocumentButton
                    key={file.id}
                    title={file.document_type_desc}
                    isMandatory={!file.active}
                    aditionalData={file.id}
                    setFiles={() => {}}
                    disabled
                  >
                    {file?.url_document ? (
                      <UploadDocumentChild
                        linkFile={file.url_document}
                        nameFile={file.url_document.split("-").pop() || ""}
                        onDelete={() => {}}
                        showTrash={false}
                      />
                    ) : undefined}
                  </UploadDocumentButton>
                </Col>
              ))}
              <Col span={24} style={{ paddingTop: "1rem" }}>
                <hr style={{ borderTop: "1px solid #f7f7f7" }}></hr>
              </Col>
            </Row>
            <Row style={{ marginTop: "1rem" }}>
              <Col span={12}>
                <p className={styles.subtitle} style={{ marginBottom: "0.5rem" }}>
                  Datos de contacto
                </p>
                <p className={styles.bodyStrong}>Contacto inicial</p>
                {contacts
                  ?.filter((x: any) => x.contact_type == CONTACT_TYPES.ORIGIN)
                  .map((contact: any, contactIndex: number) => (
                    <Row key={`contact-origin-${contact.name}-${contactIndex}`}>
                      <Col span={12} style={{ paddingLeft: "25px" }}>
                        <p className={styles.bodyReg}>{contact.name}</p>
                      </Col>
                      <Col span={8} style={{ textAlign: "right" }}>
                        <p className={styles.bodyReg}>{contact.contact_number}</p>
                      </Col>
                    </Row>
                  ))}
                <p className={styles.bodyStrong} style={{ marginTop: "0.5rem" }}>
                  Contacto final
                </p>
                {contacts
                  ?.filter((x: any) => x.contact_type == CONTACT_TYPES.DESTINATION)
                  .map((contact: any, contactIndex: number) => (
                    <Row key={`contact-destination-${contact.name}-${contactIndex}`}>
                      <Col span={12} style={{ paddingLeft: "25px" }}>
                        <p className={styles.bodyReg}>{contact.name}</p>
                      </Col>
                      <Col span={8} style={{ textAlign: "right" }}>
                        <p className={styles.bodyReg}>{contact.contact_number}</p>
                      </Col>
                    </Row>
                  ))}
                <Row style={{ paddingTop: "1rem" }}>
                  <Col span={12}>
                    <p className={styles.subtitle}>Cliente final</p>
                  </Col>
                  <Col span={8} style={{ textAlign: "right" }}>
                    {finalClient && <p className={styles.bodyReg}>{finalClient}</p>}
                  </Col>
                </Row>
                <p className={styles.subtitle} style={{ paddingTop: "0.5rem" }}>
                  Requerimientos adicionales
                </p>
                <Row style={{ paddingTop: "0.5rem" }}>
                  <Col span={24}>
                    {otherRequirements?.map((req: any, reqIndex: number) => (
                      <div
                        className={styles.selected}
                        key={`other-req-${req.other_requirement_desc}-${reqIndex}`}
                      >
                        {req.other_requirement_desc} <small>{req.quantity}</small>
                      </div>
                    ))}
                  </Col>
                </Row>
              </Col>
              <Col span={12}>
                <p className={styles.subtitle} style={{ marginBottom: "0.25rem" }}>
                  Instrucciones especiales
                </p>
                {specialInstructions && <p className={styles.bodyReg}>{specialInstructions}</p>}
                <Flex style={{ marginTop: "1rem" }}>
                  <UploadDocumentButton
                    key={1}
                    title={"Nombre del documento"}
                    isMandatory
                    aditionalData={1}
                    setFiles={() => {}}
                    disabled
                  />
                </Flex>
              </Col>
            </Row>
          </Flex>
        </Col>
      </Row>
    </Flex>
  );
}
