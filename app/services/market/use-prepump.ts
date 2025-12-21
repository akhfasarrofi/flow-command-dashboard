// import type { TMetaData } from '@/types';
// import { internalApi } from '@/utils/instance';

// export type TRegisterExistingParam = {
//   email: string;
//   affiliator_id?: number;
//   recaptcha_token: string;
// };

// export const useFetchRegisterExisting = () => {
//   const { mutate, isLoading } = internalApi.mutation<TMetaData<null>, TRegisterExistingParam>(
//     '/komcards/api/v1/register/existing',
//     { method: 'POST', queryMutation: true },
//   );

//   return {
//     mutateRegisterExisting: mutate,
//     isLoadingRegisterExisting: isLoading,
//   };
// };
