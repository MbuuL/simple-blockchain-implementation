import * as crypto from 'crypto'

class Transaction {
  constructor(
    private ammount: number,
    private payer: string, // public key
    private payee: string, // public key
  ) { }
  toString() {
    return JSON.stringify(this)
  }
  get getAmmount() {
    return this.ammount
  }
  get getPayer() {
    return this.payer
  }
  get getPayee() {
    return this.payee
  }
}
class Block {

  public nonce = Math.round((Math.random() * 999999999) + 1)

  constructor(
    private prevHash: (string | null),
    private transaction: Transaction,
    private ts = Date.now()
  ) { }

  get hash() {
    const str = JSON.stringify(this)
    const hash = crypto.createHash('sha512')
    hash.update(str).end()
    return hash.digest('hex')
  }

  get getPrevHash() {
    return this.prevHash
  }
  get getTransaction() {
    return this.transaction
  }
  get getTs() {
    return this.ts
  }

}
export class Chain {

  public static instance =  new Chain()
  private chain: Block[]

  constructor() {
    this.chain = [new Block(null, new Transaction(100, 'genesis', 'arukafi'))];
  }

  get lastBlock() {
    return this.chain[this.chain.length - 1]
  }

  mine(nonce: number) {
    let possibleSolution = 1
    while (true) {
      const hash = crypto.createHash('md5')
      hash.update((nonce + possibleSolution).toString()).end()
      const attempt = hash.digest('hex')
      if (attempt.substr(0, 4) === '0000') {
        console.log('Solution = ', possibleSolution)
        return possibleSolution
      }
      possibleSolution ++
    }
  }

  addBlock(transaction: Transaction, senderPublicKey: string, signature: Buffer) {
    const verify = crypto.createVerify('sha512')
    verify.update(transaction.toString())
    const isValid = verify.verify(senderPublicKey, signature)
    if (isValid) {
      const newBlock = new Block(this.lastBlock.hash, transaction)
      this.mine(newBlock.nonce)
      this.chain.push(newBlock)
    }
  }

}
export class Wallet {

  private publicKey: string
  private privateKey: string

  constructor() {
    const keypair = crypto.generateKeyPairSync('rsa', {
      modulusLength: 2048,
      publicKeyEncoding: { type: 'spki', format: 'pem' },
      privateKeyEncoding: {type: 'pkcs8', format: 'pem'}
    })
    this.privateKey = keypair.privateKey
    this.publicKey = keypair.publicKey
  }

  sendBlock(ammount: number, payee: string) {
    const transaction = new Transaction(ammount, this.publicKey, payee)
    const sign = crypto.createSign('sha512')
    sign.update(transaction.toString()).end()
    const signature = sign.sign(this.privateKey)
    Chain.instance.addBlock(transaction, this.publicKey, signature)
  }

  get getPublicKey() {
    return this.publicKey
  }

}