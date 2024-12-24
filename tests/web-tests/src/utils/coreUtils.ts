export function extractNumberFromText(text: string) {
  return parseFloat(text.match(/[\d.]+/)![0]);
}
