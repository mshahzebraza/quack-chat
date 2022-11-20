/**
 * Creates a combination of both uid for chat group
 * @param {string} uidA First User Id
 * @param {string} uidB Second User Id
 * @returns {string} a concatenated id
 */
export function createChatId(uidA, uidB) {
  if (uidA > uidB) {
    return uidA + uidB;
  } else {
    return uidB + uidA;
  }
}
