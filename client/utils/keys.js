import { secp256k1 } from 'ethereum-cryptography/secp256k1';
import { toHex } from 'ethereum-cryptography/utils';
import { keccak256 } from 'ethereum-cryptography/keccak';

export function generatePrivateKey() {
  return toHex(secp256k1.utils.randomPrivateKey());
}

export function getPublicKey(PRIVATE_KEY) {
  return toHex(
    keccak256(secp256k1.getPublicKey(PRIVATE_KEY).slice(1)).slice(-20)
  );
}
