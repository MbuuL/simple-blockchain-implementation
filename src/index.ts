import { Wallet, Chain } from './Classes'

const wallet1 = new Wallet()
const wallet2 = new Wallet()
const wallet3 = new Wallet()

wallet1.sendBlock(Math.round(Math.random()), wallet2.getPublicKey)
wallet2.sendBlock(Math.round(Math.random()), wallet3.getPublicKey)
wallet3.sendBlock(Math.round(Math.random()), wallet1.getPublicKey)

console.log(Chain.instance)