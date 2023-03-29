export class StringModifificationHelper {
    static toPascalCase(value: string): string {
        return value
            .split(/[\s-]/)
            .map(word => word[0].toUpperCase() + word.substr(1).toLowerCase())
            .join("");
    }

    static toCamelCase(value: string): string {
        return value[0].toLowerCase() + StringModifificationHelper.toPascalCase(value).substr(1);
    }

    static toKebabCase(value: string): string {
        return value
            .split(/[\s-]/)
            .map(word => word.toLowerCase())
            .join("-");
    }

    static toSnakeCase(value: string): string {
        return value
            .split(/[\s-]|(?=[A-Z])/)
            .map(word => word.toLowerCase())
            .join("_");
    }

    static toTitleCase(value: string): string {
        return value
            .split(/[\s-]/)
            .map(word => word[0].toUpperCase() + word.substr(1).toLowerCase())
            .join(" ");
    }

    static toSentenceCase(value: string): string {
        return value[0].toUpperCase() + value.substr(1);
    }

    static toPlural(value: string): string {
        if (value.endsWith("s")) {
            return value;
        } else if (value.endsWith("y")) {
            return value.substr(0, value.length - 1) + "ies";
        } else {
            return value + "s";
        }
    }

    static toUrlCase(value: string): string {
        return this.toKebabCase(
            this.toPlural(value),
        );
    }
        
}