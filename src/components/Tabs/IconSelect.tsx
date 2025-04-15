import Select, { components, StylesConfig } from "react-select";
import { iconMap, IconName } from "@/store/slice/iconMap"; // ✅ adjust path
import { Control, Controller } from "react-hook-form";
import { TabFormType } from "./AddEditTab"; // adjust path if needed

const iconOptions = Object.entries(iconMap).map(([name, Icon]) => ({
    value: name as IconName,
    label: name,
    Icon,
}));

const customStyles: StylesConfig<any, false> = {
    control: (provided, state) => ({
        ...provided,
        backgroundColor: "var(--color-light)",
        // borderColor: state.isFocused ? "hsl(var(--primary))" : "hsl(var(--border))",
        boxShadow: state.isFocused ? "0 0 0 1px hsl(var(--primary))" : "none",
        "&:hover": {
          borderColor: "hsl(var(--primary))",
        },
      }),
    option: (provided) => ({
        ...provided,
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
    }),
    singleValue: (provided) => ({
        ...provided,
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
    }),
};

const IconOption = (props: any) => {
    const {
        data: { Icon, label },
    } = props;
    return (
        <components.Option {...props}>
            <Icon className="text-lg" />
            {label}
        </components.Option>
    );
};

const IconSingleValue = (props: any) => {
    const {
        data: { Icon, label },
    } = props;
    return (
        <components.SingleValue {...props}>
            <Icon className="text-lg" />
            {label}
        </components.SingleValue>
    );
};
interface Props {
    control: Control<TabFormType>;
}

const IconSelect: React.FC<Props> = ({ control }) => {
    // const { control } = useFormContext();

    return (
        <div className={`w-[400px]`}>
        <Controller
            name="iconName"
            control={control}
            render={({ field }) => (
                <Select
                    {...field}
                    options={iconOptions}
                    getOptionLabel={(e) => e.label}
                    getOptionValue={(e) => e.value}
                    styles={customStyles}
                    components={{ Option: IconOption, SingleValue: IconSingleValue }}
                    value={iconOptions.find((o) => o.value === field.value)}
                    onChange={(val) => field.onChange(val?.value)}
                />
            )}
        />
        </div>
    );
};

export default IconSelect;
