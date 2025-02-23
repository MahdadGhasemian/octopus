import { IdentifierQuery } from '../interfaces';

export const getPaginationConfig = (
  defaultConfig,
  identifierQuery: IdentifierQuery,
) => {
  const config = { ...defaultConfig };
  Object.assign(
    config,
    !!Object.keys(identifierQuery).length && { where: identifierQuery },
  );

  return config;
};
