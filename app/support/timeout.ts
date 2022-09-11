export const waitForTimeout = async (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms))
