import { useEffect, useState } from "react";
import { Button, ColorPicker, Flex, Select, Typography } from "antd";
import { Controller, useForm } from "react-hook-form";
import { ArrowsClockwise, CaretLeft, Pencil } from "phosphor-react";

// components
import { SelectCountries } from "@/components/molecules/selects/SelectCountries/SelectCountries";
import { SelectCurrencies } from "@/components/molecules/selects/SelectCurrencies/SelectCurrencies";
import { ModalChangeStatus } from "@/components/molecules/modals/ModalChangeStatus/ModalChangeStatus";
import { IUpdateFormProject } from "@/types/projects/IUpdateFormProject";
import { UploadImg } from "@/components/atoms/UploadImg/UploadImg";

//interfaces
import { IProject } from "@/types/projects/IProject";
import { InputForm } from "@/components/atoms/inputs/InputForm/InputForm";

import "./projectformtab.scss";
import { ModalBillingPeriod } from "@/components/molecules/modals/ModalBillingPeriod/ModalBillingPeriod";

const { Title, Text } = Typography;
const { Option } = Select;

interface Props {
  idProjectForm?: string;
  data?: IProject;
  disabled?: boolean;
  // eslint-disable-next-line no-unused-vars
  onEditProject?: () => void;
  // eslint-disable-next-line no-unused-vars
  onSubmitForm?: (data: any) => void;
  onActiveProject?: () => void;
  onDesactivateProject?: () => void;
  statusForm: "create" | "edit" | "review";
}
export type ProyectType = {
  general: {
    name: string;
    nit: string;
    currencies: string[];
    country: string[];
    address: string;
  };
  contact: {
    name: string;
    email: string;
    phone: string;
  };
  personalization: {
    color: any;
  };
};
export const ProjectFormTab = ({
  onEditProject = () => {},
  onSubmitForm = () => {},
  statusForm = "review",
  data = {} as IProject,
  onActiveProject = () => {},
  onDesactivateProject = () => {}
}: Props) => {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isBillingPeriodOpen, setIsBillingPeriodOpen] = useState(false);
  const [imageFile, setImageFile] = useState(data.LOGO);
  const [imageError, setImageError] = useState(false);
  const defaultValues = statusForm === "create" ? {} : dataToProjectFormData(data);
  const {
    watch,
    setValue,
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty }
  } = useForm<IUpdateFormProject>({
    defaultValues,
    disabled: statusForm === "review"
  });

  const generalDSOCurrentlyYear = watch("general.DSO_currenly_year");

  useEffect(() => {
    if (generalDSOCurrentlyYear === "Sí") {
      setValue("general.DSO_days", undefined);
    }
  }, [generalDSOCurrentlyYear, setValue]);

  console.log("data ", data);

  const validationButtonText =
    statusForm === "create"
      ? "Crear nuevo proyecto"
      : statusForm === "edit"
        ? "Guardar Cambios"
        : "Editar Proyecto";

  const onSubmit = (data: any) => {
    if (!imageFile) return setImageError(true);
    setImageError(false);
    onSubmitForm({ ...data, logo: imageFile });
    reset(data);
  };

  return (
    <>
      <form className="mainProyectsForm" onSubmit={handleSubmit(onSubmit)}>
        <Flex component={"header"} className="headerProyectsForm">
          <Button
            type="text"
            size="large"
            href="/"
            className="buttonGoBack"
            icon={<CaretLeft size={"1.45rem"} />}
          >
            Ver Proyectos
          </Button>
          <Flex gap={"1rem"}>
            {(statusForm === "review" || statusForm === "edit") && (
              <Button
                style={{ display: "flex" }}
                htmlType="button"
                onClick={(e) => {
                  e.preventDefault();
                  setIsOpenModal(true);
                }}
                icon={<ArrowsClockwise size={"1.45rem"} />}
              >
                Cambiar Estado
              </Button>
            )}
            {statusForm === "review" ? (
              <Button
                style={{ display: "flex" }}
                htmlType="button"
                onClick={(e) => {
                  e.preventDefault();
                  onEditProject();
                }}
                icon={<Pencil size={"1.45rem"} />}
              >
                {validationButtonText}
              </Button>
            ) : (
              ""
            )}
          </Flex>
        </Flex>
        <Flex component={"main"} flex="1" vertical>
          {/* ------------Image Project-------------- */}
          <UploadImg
            disabled={statusForm === "review"}
            imgDefault={data.LOGO}
            setImgFile={setImageFile}
          />
          {imageError && <Text className="textError">{"Logo del proyecto es obligatorio *"}</Text>}
          {/* -----------------------------------General--------------------------------------- */}
          <Title className="title" level={4}>
            Informacion General
          </Title>
          <Flex component={"section"} className="generalProject" justify="flex-start">
            <InputForm
              titleInput="Nombre del Proyecto"
              nameInput="general.name"
              control={control}
              error={errors.general?.name}
            />
            <InputForm
              titleInput="NIT"
              nameInput="general.nit"
              control={control}
              error={errors.general?.nit}
            />
            <Flex vertical className="containerInput">
              <Title className="title" level={5}>
                Divisas
              </Title>
              <Controller
                name="general.currencies"
                control={control}
                rules={{ required: true }}
                render={({ field }) => <SelectCurrencies errors={errors} field={field} />}
              />
              <Text className="textError">
                {errors?.general?.currencies && "Divisa es obligatorio *"}
              </Text>
            </Flex>
            <Flex vertical className="containerInput">
              <Title className="title" level={5}>
                País
              </Title>
              <Controller
                name="general.country"
                control={control}
                rules={{ required: true }}
                render={({ field }) => <SelectCountries errors={errors} field={field} />}
              />
              <Text className="textError">
                {errors?.general?.country && "Pais es obligatorio *"}
              </Text>
            </Flex>
            <InputForm
              titleInput="Direccion"
              nameInput="general.address"
              control={control}
              error={errors.general?.address}
            />
            <InputForm
              titleInput="Período de facturación"
              nameInput="general.billing_period"
              control={control}
              error={errors.general?.billing_period}
            />

            <Flex vertical className="containerInput">
              <Title className="title" level={5}>
                Fecha de vigencia de factura
              </Title>
              <Controller
                name="general.accept_date"
                control={control}
                rules={{ required: true }}
                render={({ field }) => {
                  return (
                    <Select
                      placeholder="Fecha de aceptación"
                      className={errors?.general?.accept_date ? "selectInputError" : "selectInput"}
                      loading={false}
                      variant="borderless"
                      optionLabelProp="label"
                      {...field}
                    >
                      <Option value={`Fecha de aceptación`} key={1}>
                        Fecha de aceptación
                      </Option>
                      <Option value={`Fecha de emisión`} key={2}>
                        Fecha de emisión
                      </Option>
                    </Select>
                  );
                }}
              />
              <Text className="textError">
                {errors?.general?.accept_date && "Campo obligatorio *"}
              </Text>
            </Flex>
            <Flex vertical className="containerInput">
              <Title className="title" level={5}>
                DSO - Calculo solo del año actual
              </Title>
              <Controller
                name="general.DSO_currenly_year"
                control={control}
                rules={{ required: true }}
                render={({ field }) => {
                  return (
                    <Select
                      placeholder="Si | No"
                      className={
                        errors?.general?.DSO_currenly_year ? "selectInputError" : "selectInput"
                      }
                      loading={false}
                      variant="borderless"
                      optionLabelProp="label"
                      {...field}
                    >
                      <Option value={`Sí`} key={1}>
                        {`Sí`}
                      </Option>
                      <Option value={`No`} key={2}>
                        {`No`}
                      </Option>
                    </Select>
                  );
                }}
              />
              <Text className="textError">
                {errors?.general?.DSO_currenly_year && "Campo obligatorio *"}
              </Text>
            </Flex>
            <InputForm
              disabled={generalDSOCurrentlyYear === "Sí"}
              titleInput="DSO - Días de ventas para el cálculo"
              nameInput="general.DSO_days"
              typeInput="number"
              validationRules={{
                required: generalDSOCurrentlyYear === "Sí" ? false : "Campo obligatorio *",
                min: {
                  value: 1,
                  message: "El valor debe ser mayor que 1"
                }
              }}
              control={control}
              error={errors.general?.DSO_days}
            />
          </Flex>

          {/* -----------------------------------Contact----------------------------------- */}
          <Title className="title" level={4}>
            Informacion de Contacto
          </Title>
          <Flex component={"section"} className="generalProject" justify="flex-start">
            <InputForm
              titleInput="Nombre"
              nameInput="contact.name"
              control={control}
              error={errors.contact?.name}
            />
            <InputForm
              typeInput="email"
              titleInput="Correo"
              nameInput="contact.email"
              control={control}
              error={errors.contact?.email}
            />
            <InputForm
              typeInput="tel"
              titleInput="Telefono"
              nameInput="contact.phone"
              control={control}
              error={errors.contact?.phone}
            />
          </Flex>
          {/* -----------------------------------Project Config----------------------------------- */}
          <Title className="title" level={4}>
            Personalizer Proyecto
          </Title>
          <Flex component={"section"} className="generalProject" justify="flex-start">
            <Flex vertical className="containerInput">
              <Title className="title" level={5}>
                Color Personalizado
              </Title>
              <Controller
                name="personalization.color"
                rules={{ required: true, maxLength: 123 }}
                control={control}
                render={({ field }) => (
                  <ColorPicker format="rgb" size="large" showText {...field} />
                )}
              />
              <Text className="textError">
                {errors?.personalization?.color && "Color Personalizado es obligatorio *"}
              </Text>
            </Flex>
          </Flex>
          <Flex className="buttonNewProject">
            {statusForm === "edit" && (
              <Button
                disabled={!isDirty}
                className={`button ${isDirty ? "active" : ""}`}
                style={{ display: "flex" }}
                htmlType={"submit"}
              >
                {validationButtonText}
              </Button>
            )}
          </Flex>
        </Flex>
      </form>
      <ModalBillingPeriod
        isOpen={isBillingPeriodOpen}
        setIsBillingPeriodOpen={setIsBillingPeriodOpen}
      />
      <ModalChangeStatus
        isActiveStatus={data?.IS_ACTIVE!}
        isOpen={isOpenModal}
        onClose={() => setIsOpenModal(false)}
        onActive={onActiveProject}
        onDesactivate={onDesactivateProject}
      />
    </>
  );
};
const dataToProjectFormData = (data: IProject) => {
  const currenciesFormated = data?.CURRENCY?.map(
    (currency) => `${currency.id}-${currency.CURRENCY_NAME ?? currency.currency_name}`
  );

  return {
    general: {
      name: data.PROJECT_DESCRIPTION,
      nit: data.NIT,
      currencies: currenciesFormated,
      country: `${data.COUNTRY_ID}-${data.COUNTRY_NAME}`,
      address: data.ADDRESS,
      billing_period: data.BILLING_PERIOD,
      DSO_currenly_year: data.DSO_CURRENLY_YEAR === 0 ? "No" : "Sí",
      DSO_days: data.DSO_DAYS,
      accept_date: data?.ACCEPT_DATE === 0 ? "Fecha de emisión" : "Fecha de aceptación"
    },
    contact: {
      name: data.CONTACT,
      position: "",
      email: data.EMAIL,
      phone: data.PHONE
    },
    personalization: {
      color: data.RGB_CONFIG
    }
  };
};
