import { SetMetadata } from '@nestjs/common';

export const NO_CACHE_KEY = 'noCache';
export const GENERAL_CACHE_KEY = 'generalCache';
export const FORCE_TO_CLEAR_CACHE_KEY = 'forceToClearCache';

export const NoCache = () => SetMetadata(NO_CACHE_KEY, true);
export const GeneralCache = () => SetMetadata(GENERAL_CACHE_KEY, true);
export const FoceToClearCache = (key) =>
  SetMetadata(FORCE_TO_CLEAR_CACHE_KEY, key);
