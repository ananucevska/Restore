import {FieldValues, useController, UseControllerProps} from "react-hook-form";
import {FormControl, FormHelperText, InputLabel, MenuItem, Select} from "@mui/material";

type Props<T extends FieldValues> = {
    label: string
    name: keyof T
    items: string[] | { value: string; label: string }[]
} & UseControllerProps<T>

export default function AppSelectInput<T extends FieldValues>(props: Props<T>) {
    const {fieldState, field} = useController({...props});
    return (
        <FormControl fullWidth error={!!fieldState.error}>
            <InputLabel>{props.label}</InputLabel>
            <Select 
                value={field.value || ''}
                label={props.label}
                onChange={field.onChange}
            >
                {props.items.map((item: string | { value: string; label: string }, index: number) => {
                    const value = typeof item === 'string' ? item : item.value;
                    const label = typeof item === 'string' ? item : item.label;
                    return (
                        <MenuItem value={value} key={index}>{label}</MenuItem>
                    );
                })}
            </Select>
            <FormHelperText>{fieldState.error?.message}</FormHelperText>
        </FormControl>
    )
}