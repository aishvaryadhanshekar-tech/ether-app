export async function simulateDelay(ms = 250) {
  await new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}
