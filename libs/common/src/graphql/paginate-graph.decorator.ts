import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { PaginateQueryGraph } from './paginate-query-graph';
import { FieldNode } from 'graphql';

// input: 'name:DESC'
// input: [ 'name:DESC' , 'id:ASC' ]
// output: [ [ 'name', 'DESC' ], [ 'id', 'ASC' ] ]
const parseSortBy = (sortBy: string | string[]): [string, string][] => {
  if (!sortBy) return [];

  // Ensure the input is always an array, whether it's a string or an array
  const inputArray = Array.isArray(sortBy) ? sortBy : [sortBy];

  return inputArray.map((entry) => {
    // Split only on the first colon, which separates column from order
    const [column, order] = entry.split(':');
    return [column, order.toUpperCase()] as [string, string];
  });
};

// input: 'filter.name:Product 1' -> output: { name: 'Product 1' }
// input: [ 'filter.name:Product 1' ] -> output: { name: 'Product 1' }
// input: [ 'price:$gte:15' , 'name:Product 1' ] -> output: { price: '$gte:15', name: 'Product 1' }
// input: [ 'filter.name:$ilike:product' , 'filter.price:$gte:15', 'filter.name:Product 1' ] output: { name: [ '$ilike:product', 'Product 1' ], price: '$gte:15' }
const parseFilter = (
  filters: string | string[],
): Record<string, string | string[]> => {
  if (!filters) return undefined;

  // Ensure the input is always an array, whether it's a string or an array
  const inputArray = Array.isArray(filters) ? filters : [filters];

  const result: Record<string, string | string[]> = {};

  inputArray.forEach((entry) => {
    const separatorIndex = entry.indexOf(':');
    if (separatorIndex === -1) return;

    const key = entry.slice(0, separatorIndex);
    const value = entry.slice(separatorIndex + 1);

    if (result[key]) {
      if (Array.isArray(result[key])) {
        result[key].push(value);
      } else {
        result[key] = [result[key], value];
      }
    } else {
      result[key] = value;
    }
  });

  return result;
};

// [
//   'field1': true,
//   'field2': true,
//   'field3': {
//     'field3_1': true,
//     'field3_2': true
//   }
// ]
const getSelectedFieldsObject = (
  fieldNode: FieldNode,
): Record<string, any> | true => {
  if (!fieldNode.selectionSet) return true;

  return fieldNode.selectionSet.selections.reduce(
    (acc, selection) => {
      if (selection.kind === 'Field') {
        acc[selection.name.value] = getSelectedFieldsObject(selection);
      }
      return acc;
    },
    {} as Record<string, any>,
  );
};

// [
//   'field1',
//   'field2',
//   'field3.field3_1',
//   'field3.field3_2'
// ]
const getSelectedFieldsFlat = (fieldNode: FieldNode, prefix = ''): string[] => {
  if (!fieldNode.selectionSet) return [prefix];

  return fieldNode.selectionSet.selections.flatMap((selection) => {
    if (selection.kind === 'Field') {
      const fieldName = prefix
        ? `${prefix}.${selection.name.value}`
        : selection.name.value;
      return getSelectedFieldsFlat(selection, fieldName);
    }
    return [];
  });
};

const getSelectedDataFields = (
  gqlInfo: any,
  format: 'object' | 'flat' = 'object',
) => {
  const pathKey = gqlInfo.path.key;
  const accessesField = gqlInfo.fieldNodes.find(
    (node) => node.name.value === pathKey,
  );
  const dataField = accessesField?.selectionSet?.selections.find(
    (selection: any) => selection.name.value === 'data',
  ) as FieldNode;

  if (!dataField) return format === 'flat' ? [] : {};

  return format === 'flat'
    ? getSelectedFieldsFlat(dataField)
    : getSelectedFieldsObject(dataField);
};

export const PaginateGraph = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    // Access the GraphQL context
    const gqlContext = GqlExecutionContext.create(ctx);
    const args: PaginateQueryGraph = gqlContext.getArgs();

    const gqlInfo = gqlContext.getInfo();
    const pathKey = gqlInfo.path.key;

    // Extract HTTP request from the GraphQL context
    const req = gqlContext.getContext().req; // Express request object

    // const selectObject = getSelectedDataFields(gqlInfo, 'object');
    // const selectFlat = getSelectedDataFields(gqlInfo, 'flat');
    // const select = selectObject;

    // Extract hostname (including protocol and port if needed)
    const protocol = req.protocol; // 'http' or 'https'
    const host = req.get('host'); // Hostname with port (e.g., example.com:3000)
    const path = `${protocol}://${host}/graphql/${pathKey}`; // Combine them

    const sortBy = parseSortBy(args.sortBy);
    const filter = parseFilter(args.filter);

    const config = Object.assign(
      {},
      args.relations && {
        relations: args.relations,
      },
      // select && { select },
    );

    return {
      query: {
        ...args,
        sortBy,
        filter,
        path,
      },
      config,
    };
  },
);
