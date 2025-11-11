import JoiBase from 'joi';

type ExtendedJoiRoot = JoiBase.Root & {
  dateString: () => JoiBase.StringSchema;
};

export const Joi: ExtendedJoiRoot = JoiBase.extend(joi => ({
  type: 'dateString',
  base: joi.string(),
  messages: {
    'dateString.format': 'Date must be in YYYY-MM-DD format',
    'dateString.invalid': 'Date must be a valid calendar date',
  },
  validate(value: string, helpers) {
    // Must match YYYY-MM-DD
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      return { value, errors: helpers.error('dateString.format') };
    }

    const [year, month, day] = value.split('-').map(Number);
    const date = new Date(value);

    // Check that components match (to catch invalids like 2025-02-29)
    if (
      date.getFullYear() !== year ||
      date.getMonth() + 1 !== month ||
      date.getDate() !== day
    ) {
      return { value, errors: helpers.error('dateString.invalid') };
    }

    return { value };
  },
}));
