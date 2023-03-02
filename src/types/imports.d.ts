type ProviderId = import('@/functions/Wallets').ProviderId
type AnyProvider = import('@/functions/Wallets').AnyProvider
type FileWithPath = import('file-selector').FileWithPath & { normalizedPath?: string }
type AnyFile = import('@/functions/Transactions').AnyFile
type AnyTransaction = import('@/functions/Transactions').AnyTransaction
type AllRouteNames = import('@/router/index').AllRouteNames