import { FieldType } from "./field-type";

export interface Field {
    name: string;
    type: FieldType;
    required?: boolean;
}