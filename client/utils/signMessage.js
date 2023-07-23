import { secp256k1 } from 'ethereum-cryptography/secp256k1';
import { keccak256 } from 'ethereum-cryptography/keccak';
import { utf8ToBytes } from 'ethereum-cryptography/utils';

function hashMessage(message) {
  const bytes = utf8ToBytes(message);
  const hash = keccak256(bytes);
  return hash;
}

export async function signMessage(MESSAGE, PRIVATE_KEY) {
  return secp256k1.sign(hashMessage(MESSAGE), PRIVATE_KEY, {
    extraEntropy: true,
  });
}
