import { Button, Flex, Popover, Spin, Typography } from "antd";
import { CaretDoubleRight, X } from "phosphor-react";

import "./documentclientbr.scss";
import { useClientTypes } from "@/hooks/useClientTypes";
import { InputCreateClientType } from "@/components/atoms/inputs/InputCreateClientType/InputCreateClientType";
import { DocumentCards } from "@/components/atoms/DocumentCards/DocumentCards";
import { InputCreateDocument } from "../inputs/inputCreate/InputCreateDocument";

const { Text } = Typography;

interface Props {
  isDisabledEdit: boolean;
}

export const DocumentClientBR = ({ isDisabledEdit }: Props) => {
  const { data, loading } = useClientTypes();
  // const data = [];
  // const loading = false;
  console.log(data);

  return (
    <div className="contianerdocumentclientbr">
      <Typography.Text className="title">Documentos por cliente</Typography.Text>
      <Flex vertical className="clientTypes">
        {loading ? (
          <Spin />
        ) : (
          <Flex className="documentclientbr" vertical>
            {data?.map((document) => (
              <Flex className="clientTypeCard" vertical key={document.id}>
                <Flex justify="space-between">
                  <Text className="clientTypeCard__title">{document.clientType}</Text>
                  {!isDisabledEdit && (
                    <Button icon={<X size={"16px"} />} className="removebutton" />
                  )}
                </Flex>
                <DocumentCards clientTypeId={document.id} />

                {!isDisabledEdit && (
                  <Popover
                    content={<InputCreateDocument isEditAvailable={false} />}
                    trigger="click"
                    placement="bottom"
                  >
                    <Button
                      icon={<CaretDoubleRight size={"16px"} />}
                      className="addButtonLineSub"
                      type="text"
                    >
                      Agregar documento
                    </Button>
                  </Popover>
                )}
              </Flex>
            ))}
            {!isDisabledEdit && (
              <Popover
                content={<InputCreateClientType isEditAvailable={!isDisabledEdit} />}
                trigger="click"
                placement="bottom"
              >
                <Button
                  icon={<CaretDoubleRight size={"16px"} />}
                  className="addButtonLineSub"
                  type="text"
                >
                  Agregar cliente
                </Button>
              </Popover>
            )}
          </Flex>
        )}
      </Flex>
    </div>
  );
};
