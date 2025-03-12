import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

const getCurrentUserByContext = (context: ExecutionContext): unknown => {
  const type = context.getType<string>();

  if (type === 'http') {
    return context.switchToHttp().getRequest().user;
  } else if (type === 'graphql') {
    const ctx = GqlExecutionContext.create(context);
    const gqlContext = ctx.getContext();
    return gqlContext.req?.user;
  }
};

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext) =>
    getCurrentUserByContext(context),
);
