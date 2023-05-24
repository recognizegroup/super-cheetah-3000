import {FieldType} from './field-type'

export interface Field {
    name: string;
    type: FieldType;
    required?: boolean;
    sortable?: boolean;
    searchable?: boolean;
    mainProperty?: boolean;
    visibleInList?: boolean;
}
