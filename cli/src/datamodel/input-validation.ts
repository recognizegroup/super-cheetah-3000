import {DataType, Generator, Input} from '@recognizebv/sc3000-generator'

export const parseInputs = (generator: Generator, inputs: Record<string, unknown>): Record<string, unknown> => {
  const generatorInputs = generator.inputs
  const result: Record<string, unknown> = {}

  for (const input of generatorInputs) {
    const value = inputs[input.name]

    if (input.required && !value) {
      throw new Error(`Missing required input: ${input.name}`)
    }

    validateInputType(input, value)

    result[input.name] = value ?? input.default
  }

  return result
}

export const validateInputType = (input: Input, value: unknown): void => {
  if (input.type === DataType.string && typeof value !== 'string') {
    throw new Error(`Input ${input.name} should be a string`)
  } else if (input.type === DataType.integer && typeof value !== 'number') {
    throw new Error(`Input ${input.name} should be an integer`)
  } else if (input.type === DataType.boolean && typeof value !== 'boolean') {
    throw new Error(`Input ${input.name} should be a boolean`)
  }
}
