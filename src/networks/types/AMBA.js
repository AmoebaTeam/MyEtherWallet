import tokens from '@/tokens/tokens-amba.json';
import contracts from '@/contracts/contract-abi-etc.json';
import amba from '@/assets/images/networks/amba.svg';
// import { EthAbi } from '../ensAbis';

export default {
  name: 'AMBA',
  name_long: 'Amoeba Coin',
  homePage: 'https://ethereumclassic.org/',
  blockExplorerTX: 'https://gastracker.io/tx/[[txHash]]',
  blockExplorerAddr: 'https://gastracker.io/address/[[address]]',
  chainID: 41825,
  tokens: tokens,
  contracts: contracts,
  ensResolver: '',
  ensAbi: '',
  icon: amba
};
