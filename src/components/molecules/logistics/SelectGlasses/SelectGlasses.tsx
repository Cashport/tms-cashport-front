import { Select } from "antd";

import "./SelectGlasses.scss";

interface Props {
  errors: any;
  field: any;
  selected?: any;
}

export const SelectGlasses = ({ errors, field, selected }: Props) => {
  const data = {
    data: [
      {
        id: 1,
        value: "Si"
      },
      {
        id: 2,
        value: "No"
      }
    ]
  };
  const options = data?.data.map((option) => {
    return {
      value: option.id,
      label: option.value
    };
  });


    return (
      <Select
        placeholder="Selecciona"
        className={
          "selectInputGlasses"
        }
        variant="borderless"
        optionLabelProp="label"
        {...field}
        options={options}
      />
    );
};
