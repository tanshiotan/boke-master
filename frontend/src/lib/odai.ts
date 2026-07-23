export function pickRandomOdai(odaiList: readonly string[]): string {
  const index = Math.floor(Math.random() * odaiList.length);
  return odaiList[index];
}
