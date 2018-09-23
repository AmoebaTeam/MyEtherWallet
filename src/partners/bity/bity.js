/*eslint-disable*/
import { getRates, openOrder, getStatus, login } from './call';
import {currencies as currencyDetails} from '../config'

export default class BitySwap {
  constructor() {
    this.SERVERURL = 'https://bity.myetherapi.com';
    this.BITYRATEAPI = 'https://bity.com/api/v1/rate2/';
    this.decimals = 6;
    this.ethExplorer = 'https://etherscan.io/tx/[[txHash]]';
    this.btcExplorer = 'https://blockchain.info/tx/[[txHash]]';
    this.validStatus = ['RCVE', 'FILL', 'CONF', 'EXEC'];
    this.invalidStatus = ['CANC'];
    this.mainPairs = ['REP', 'ETH'];
    this.min = 0.01;
    this.max = 3;
    this.currentRates = [];
    this.fiatCurrencies = ['CHF', 'USD', 'EUR'];
    this.allAvailable = [];
    this.fromAvailable = new Map();
    this.toAvailable = new Map();
    this.currentOrderStatus = ''; // temporary placeholder variable
    this.currentOrder = {};  // temporary placeholder variable
  }

  async getRate() {
    // const rate = await fetch();
  }

  async getRates() {
    const rates = await getRates()
      .catch(err => {
        return err;
      });
    console.log(rates); // todo remove dev item

    const data = rates.objects;
    data.forEach(pair => {
      if (this.mainPairs.indexOf(pair.pair.substring(3)) !== -1) {
        // this.currentRates[pair.pair] = parseFloat(pair.rate_we_sell);
        if (pair.is_enabled && !this.fiatCurrencies.includes(pair.source)) {
          this.addRateEntry(
            pair.source,
            pair.target,
            parseFloat(pair.rate_we_sell)
          );
        }
      } else if (this.mainPairs.indexOf(pair.pair.substring(0, 3)) !== -1) {
        if (pair.is_enabled && !this.fiatCurrencies.includes(pair.source)) {
          this.addRateEntry(
            pair.source,
            pair.target,
            parseFloat(pair.rate_we_buy)
          );
        }

        // this.currentRates[pair.pair] = parseFloat(pair.rate_we_buy);
      }
    });
    console.log(this.currentRates); // todo remove dev item
    return this.currentRates;
  }

  addPairEntry(from, to){
    this.allAvailable.push({from: from, to: to})
  }

  addRateEntry(from, to, rate, isFrom) {
    if(isFrom){
      this.fromAvailable.set(from, { from: from, to: to, rate: rate})
    } else {
      this.toAvailable.set(to, { from: from, to: to, rate: rate})
    }

    this.currentRates.push({ from: from, to: to, rate: rate});
  }

  buildOrder() {
    // finalize order, update estimate, etc.
  }

  submitOrder(orderObject) {
    var order = {
      amount: orderObject.amount,
      mode: orderObject.isFrom ? 0 : 1, // check how I should handle this now
      pair: orderObject.fromCoin + orderObject.toCoin,
      destAddress: orderObject.toAddress
    };
    return this.openOrder(order)
      .then(data => {
        this.currentOrder = data;
        this.currentOrder.swapOrder = orderObject;
        return this.currentOrder
      })
  }

  processOrder(id) {
    this.getStatus({
      orderid: id
    })
      .then(this.updateStatus);
  }

  updateStatus(data) {
    return new Promise(resolve => {
      if (this.validStatus.indexOf(data.status) !== -1) {
        this.currentOrderStatus = 'RCVE';
        resolve(false); // order finalized: false
      }
      if (this.currentOrderStatus === 'OPEN' && this.validStatus.indexOf(data.input.status) !== -1) {
        this.currentOrderStatus = 'RCVE';
        resolve(false); // order finalized: false
      } else if (this.currentOrderStatus === 'RCVE' && this.validStatus.indexOf(data.output.status) !== -1) {
        this.currentOrderStatus = 'FILL';
        resolve(true); // order finalized: true
      } else if (this.invalidStatus.indexOf(data.status) !== -1) {
        this.currentOrderStatus = 'CANC';
        resolve(true); // order finalized: true
      }
    });
  }

  openOrder(orderInfo) {
    return post('/order', orderInfo);
  }

  getStatus(orderInfo) {
    return post('/status', orderInfo);
  }

  requireLogin(callback) {
    if (this.token) callback();
    else this.login(callback);
  }

}