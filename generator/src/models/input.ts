import { DataType } from "../enums/data-type";

interface BaseInput {
    name: string;
    description?: string;
    required?: boolean;
}

interface StringInput extends BaseInput {
    type: DataType.string;
    default?: string;
}

interface IntegerInput extends BaseInput {
    type: DataType.integer;
    default?: number;
}

interface BooleanInput extends BaseInput {
    type: DataType.boolean;
    default?: boolean;
}

export type Input = StringInput | IntegerInput | BooleanInput;