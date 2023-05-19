export const StringModificationHelper = {
  toPascalCase(value: string): string {
    return value
    .split(/[\s-]/)
    .map(word => word[0].toUpperCase() + word.slice(1).toLowerCase())
    .join('')
  },

  toCamelCase(value: string): string {
    return value[0].toLowerCase() + StringModificationHelper.toPascalCase(value).slice(1)
  },

  toKebabCase(value: string): string {
    return value
    .split(/[\s-]|(?=[A-Z])/)
    .map(word => word.toLowerCase())
    .join('-')
  },

  toSnakeCase(value: string): string {
    return value
    .split(/[\s-]|(?=[A-Z])/)
    .map(word => word.toLowerCase())
    .join('_')
  },

  toConstantCase(value: string): string {
    return this.toSnakeCase(value).toUpperCase()
  },

  toTitleCase(value: string): string {
    return value
    .split(/[\s-]/)
    .map(word => word[0].toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
  },

  toSentenceCase(value: string): string {
    return value[0].toUpperCase() + value.slice(1)
  },

  toPlural(value: string): string {
    if (value.endsWith('s')) {
      return value
    }

    if (value.endsWith('y')) {
      return value.slice(0, Math.max(0, value.length - 1)) + 'ies'
    }

    return value + 's'
  },

  toUrlCase(value: string): string {
    return this.toKebabCase(
      this.toPlural(value),
    )
  },

}
