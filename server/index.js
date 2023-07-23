const express = require('express');
const secp = require('ethereum-cryptography/secp256k1');
const { keccak256 } = require('ethereum-cryptography/keccak');
const { toHex, utf8ToBytes } = require('ethereum-cryptography/utils');

const app = express();
const cors = require('cors');

const port = 3042;

app.use(cors());
app.use(express.json());

const balances = {
  '045796d736866f26d4c7d826db847958dd5efcf8e2f150f2db040acb9cec6bcd2ba8c50604a8077aa0974ebcebf0b48c872dad2fc0812c108b69ec80c9782eb900': 100,
  // 9ca540158a4dbdc9e04995e65649c16842d2287ca4a1c8b552e3df870b1c5049
  '046586e0d245b35ce2c453c4d24c3c7fd9371e6d9f0476d2c71b8fedd80ddc9a135cd72bf26ee5831e6d56c94e8aa3d34f9a7ccc5c91baba751a0bc5f9ce3cec8b': 50,
  // a75edacc40da041f3e2591257152d6a5ae8c3a4819b12f0819e27caf3bf127ff
  '04c7dcf070868f0bf1ac5692be89838ab8aad3b390ecf680ce260a908da44c7307f222374f39fb3756372aabb3beef9e0b614185264b0f40efc83470d78f5d4911': 75,
  // 57ec0734b645537e9b751d5531e0b74cb47158db58860466d5c1cbed45504c14
};

app.get('/balance/:address', (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post('/send', async (req, res) => {
  const { sender, recipient, amount, signature, recovery } = req.body;

  if (!signature) res.status(404).send({ message: 'Signature not provided' });
  if (!recovery) res.status(400).send({ message: 'Recovery not provided' });

  try {
    const bytes = utf8ToBytes(JSON.stringify({ sender, recipient, amount }));
    const hash = keccak256(bytes);

    const sig = new Uint8Array(signature);

    const publicKey = await secp.recoverPublicKey(hash, sig, recovery);

    if (toHex(publicKey) !== sender) {
      res.status(400).send({ message: 'Signature is not valid' });
    }

    setInitialBalance(sender);
    setInitialBalance(recipient);

    if (balances[sender] < amount) {
      res.status(400).send({ message: 'Not enough funds!' });
    } else {
      balances[sender] -= amount;
      balances[recipient] += amount;
      res.send({ balance: balances[sender] });
    }
  } catch (error) {
    console.log(error.message);
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
