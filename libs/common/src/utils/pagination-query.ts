import { PaginateConfig } from 'nestjs-paginate';
import { IdentifierQuery } from '../interfaces';

export const getPaginationConfig = (
  defaultConfig,
  input: { identifierQuery?: IdentifierQuery; config?: PaginateConfig<any> },
) => {
  const config = { ...defaultConfig };

  if (input?.identifierQuery && Object.keys(input.identifierQuery).length) {
    Object.assign(config, { where: input.identifierQuery });
  }

  if (input?.config) {
    Object.assign(config, { ...input.config });
  }

  return config;
};
