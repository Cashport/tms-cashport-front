import { Checkbox, Flex, Typography } from "antd";
import styles from "./GroupClients.module.scss";
import { IClientsGroups } from "@/types/clientsGroups/IClientsGroups";
import { UseFormReturn } from "react-hook-form";
import { DiscountSchema } from "../../../resolvers/generalResolver";

const { Text } = Typography;

type Props = {
  clients?: IClientsGroups[];
  error: any;
  loading: boolean;
  form: UseFormReturn<DiscountSchema, any, undefined>;
};
export default function GroupClients({ clients, error, loading, form }: Props) {
  const {
    formState: { errors },
    getValues,
    setValue,
    watch
  } = form;

  const handleCkeck = (id: number, checked: boolean) => {
    const valid = { shouldValidate: true };
    console.log();
    if (!checked) {
      setValue(
        "client_groups",
        [...(getValues("client_groups")?.filter((x) => x !== id) || [])],
        valid
      );
    } else {
      setValue("client_groups", [...(getValues("client_groups") || []), id], valid);
    }
  };

  return (
    <>
      <Flex className={styles.principalContainer} gap={20} wrap justify="space-around">
        {error && <Text type="danger"></Text>}
        {clients &&
          clients.map((client) => (
            <label
              key={"cliente - " + client.id}
              className={styles.groupClients}
              htmlFor={"cliente - " + client.id}
            >
              {client.group_name}
              <Checkbox
                checked={!!watch("client_groups")?.find((x) => x == client.id)}
                onChange={(e) => handleCkeck(client.id, e.target.checked)}
                style={{ marginLeft: "1rem" }}
                id={"cliente - " + client.id}
              />
            </label>
          ))}
        {loading && <Text type="secondary">Cargando...</Text>}
      </Flex>
      <Text type="danger" hidden={!errors.client_groups}>
        {errors.client_groups?.message}
      </Text>
    </>
  );
}
