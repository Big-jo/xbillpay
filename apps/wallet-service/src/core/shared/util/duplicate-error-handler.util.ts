import { ConflictException } from '@nestjs/common';

type ResponseArgs = {
  message?: string;
  nameReplacements: Record<string, string>;
};
export const duplicateErrorHandler = (
  error: any,
  responseArgs?: ResponseArgs,
) => {
  console.log(error.code);
  if (error?.code !== 'ER_DUP_ENTRY') {
    return;
  }

  const matches = error?.sqlMessage?.match(
    /^Duplicate entry '(.*)' for key '(.*?)\.(.*?)'$/,
  );
  const duplicateValue = matches?.[1];
  const tableName = matches?.[2];

  const { message, nameReplacements = {} } = responseArgs || {};

  const tableNameReplacement = nameReplacements[tableName] || tableName;

  const errorMessage =
    message ||
    `Duplicate record with same ${tableNameReplacement} having value '${duplicateValue}' already exists.`;

  throw new ConflictException(errorMessage, 'DUPLICATE_ENTRY_ERROR');
};