<template>
<div>

  <div class="login-container main-container">
    <div class="info">
      <!-- Welcome view -->
      <div v-if="step==0">
        <img :src="'static/img/chain/ki-chain.png'" style="margin-top:30px;margin-bottom:30px;">
        <h1>Mainnet <span>{{$t('webwallet_generator')}}</span></h1>
        <div class="mnemonic-description">
          <b-row>
            <b-col cols="2"></b-col>
            <b-col style="text-align:center">

              <div><img :src="'static/img/chain/wallet-k.png'" style="margin-top:40px;margin-bottom:50px;height:271px"></div>

              <div style="margin-bottom:10px;">
                <p>{{$t('welcome_text_1')}}</p>
                <p>{{$t('welcome_text_2')}}</p>
              </div>

            </b-col>
            <b-col cols="2"></b-col>
          </b-row>
        </div>
      </div>

      <!-- Form views -->
      <div style="margin-bottom:20px">
        <div class="mnemonic-form">
          <b-row v-if="step!=0" style="margin-bottom:40px">
            <b-col cols="2"></b-col>
            <!-- Mnemonic views -->
            <b-col v-if="step==1 || step==2">
              <b-row style="margin-bottom:10px;">
                <b-col cols="6">
                  <h5>Your mnemonic</h5>
                </b-col>
                <b-col></b-col>
                <b-col style="text-align:right">
                  <a class="stealth-link" @click="step=1;generateWallet()">Generate new</a>
                </b-col>
              </b-row>
              <b-row style="margin-bottom:20px;">
                <b-col v-if="step==1">Write down this mnemonic before you proceed</b-col>
                <b-col v-if="step==2">Fill in the missing words to verify</b-col>
              </b-row>

              <div class="contents">
                <!-- Generated mnemonic array -->
                <div v-if="step==1" class="phrases">
                  <ul>
                    <li v-for="(item, idx) in mnemonic_array">
                      <div style="display:flex; flex-direction: row; justify-content: center; align-items: center">
                        <label style="margin-bottom:0;" :for="'w'+idx">{{idx+1}}.</label> <input :id="'w'+idx" type="text" v-model="mnemonic_array[idx]"></input>
                      </div>
                    </li>
                  </ul>
                </div>
                <!-- Generated mnemonic array - verify -->
                <div v-if="step==2" class="phrases">
                  <ul>
                    <li v-for="(item, idx) in mnemonic_array_sub" :ref="'ws'+idx">
                      <div style="display:flex; flex-direction: row; justify-content: center; align-items: center">
                        <label style="margin-bottom:0;" :for="'ws'+idx">{{idx+1}}.</label> <input :id="'ws'+idx" type="text" v-model="mnemonic_array_sub[idx]"></input>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </b-col>
            <!-- Key data view -->
            <b-col v-if="step==3">
              <b-row style="margin-bottom:10px;">
                <b-col cols="6">
                  <h5>Your public Ki data</h5>
                </b-col>
              </b-row>
              <b-row style="margin-bottom:20px;">
                <b-col>This key is sharable with anyone, it allows you to recieve Ki tokens</b-col>
              </b-row>
              <b-row style="margin-bottom:10px;">
                <b-col>
                  <div class="final-form">
                    <ul>
                      <li class="token">
                        <label>You address (Bech32)</label>
                        <textarea class="warning" v-model="address" rows="1" disabled></textarea>
                      </li>
                      <li class="token">
                        <label>You public key (Hex)</label>
                        <textarea class="warning" v-model="public_key" rows="2" disabled></textarea>
                      </li>
                    </ul>
                  </div>
                </b-col>
              </b-row>

              <b-row style="margin-top:20px;margin-bottom:10px;">
                <b-col cols="6">
                  <h5>Your private Ki data</h5>
                </b-col>
              </b-row>
              <b-row style="margin-bottom:20px;">
                <b-col>This data must <span style="color:red"> never</span> be shared with anyone</b-col>
              </b-row>

              <b-row style="margin-bottom:10px;">
                <b-col>

                  <div class="final-form">
                    <ul>
                      <li class="token">
                        <label>You mnemonic</label>
                        <textarea class="danger" v-model="mnemonic" rows="3" disabled></textarea>
                      </li>
                      <li class="token">
                        <label>You private key (Hex)</label>
                        <textarea class="danger" v-model="private_key" rows="2" disabled></textarea>
                      </li>
                    </ul>
                  </div>
                </b-col>
              </b-row>
            </b-col>

            <!-- Account data view -->
            <b-col v-if="step==4">
              <b-row style="margin-bottom:10px;">
                <b-col cols="6">
                  <h5>Your genesis account data </h5>
                </b-col>
              </b-row>
              <b-row style="margin-bottom:10px;">
                <b-col>
                  <div class="contents">
                    <div class="save">
                      <ul>
                        <li>
                          <label style="color:#2c363f; margin-bottom:20px;">You address</label>
                          <div style="display:flex; flex-direction: row; justify-content: center; align-items: center">
                            <label style="margin-bottom:0;" for="address-save">@</label> <input id="address-save" v-model="address" disabled></input>
                          </div>
                        </li>
                      </ul>
                    </div>
                    <div style="margin-bottom:15px;margin-top:20px;font-size: 0.9rem;">
                      <b-form-checkbox id="checkbox-1" v-model="confirmed" name="checkbox-1" :state="confirmed">
                        <span style="vertical-align: sub;">{{$t('account_confirm')}}</span>
                      </b-form-checkbox>
                    </div>

                    <div style="margin-bottom:25px;margin-top:102px;font-size:1rem">
                      <span style="text-align:justify">{{$t('account_text')}}</span>
                    </div>
                    <div class="save" style="margin-bottom:101px">
                      <ul>
                        <li ref="as">
                          <label style="color:#2c363f; margin-bottom:20px;">How many tokens are you expecting to receive?</label>
                          <div style="display:flex; flex-direction: row; justify-content: center; align-items: center">
                            <label style="margin-bottom:0;" for="amount-save">ҟ</label> <input id="amount-save" @input="handleInput($event)" v-bind:value="amount"></input>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                </b-col>
              </b-row>
            </b-col>

            <!-- Final view -->
            <b-col v-if="step==5">
              <!-- Process success message -->
              <b-row aling-v="center" class="success-msg">
                <b-col> <img :src="'static/img/chain/check-mark.png'" style="width:30px; margin-right:15px"> {{$t('thankyou_text_1')}}</b-col>
              </b-row>

              <!-- Process final information message -->
              <b-row style="margin-bottom:20px;">
                <b-col style="text-align:justify">{{$t('thankyou_text_2')}}</b-col>
              </b-row>

              <!-- Process success neki img -->
              <b-row style="margin-bottom:30px;">
                <b-col cols="2"></b-col>
                <b-col style="text-align:center">
                  <img :src="'static/img/chain/rocket.png'" style="margin-top:30px;margin-bottom:30px; height: 317px;">
                </b-col>
                <b-col cols="2"></b-col>
              </b-row>

              <!-- Process success nav links -->
              <b-row style="margin-top:10px">
                <b-col cols="2"></b-col>
                <b-col style="text-align:right">
                  <a class="stealth-link" @click="step=4">
                    <span>Back</span>
                  </a></b-col>
                <b-col>
                  <a class="stealth-link" @click="resetModal">
                    <span>Home</span>
                  </a>
                </b-col>
                <b-col cols="2"></b-col>
              </b-row>
            </b-col>
            <b-col cols="2"></b-col>
          </b-row>

          <!-- Main button section -->
          <b-row v-if="step!=5">
            <b-col cols="2"></b-col>
            <!-- Main button warning section -->
            <b-col>
              <b-row v-if="step==0 || step==4" align-v="center">
                <b-col cols="1">
                  <img :src="'static/img/chain/warning.png'" style="width:30px">
                </b-col>
                <b-col>
                <div v-if="step==0">
                  <span class="warning-msg" style="font-size: 14px;">{{$t('warning_details')}}</span>
                </div>
                <div v-if="step==4">
                  <span class="warning-msg" style="font-size: 12px;">{{$t('warning_save')}}</span>
                </div>
              </b-col>
              </b-row>
              <!-- Main button -->
              <button class="btn" style=" ;width:100%" @click="proceed">
                <span>{{$t(workflow[step])}}</span>
              </button>
            </b-col>
            <b-col cols="2"></b-col>
          </b-row>
          <!-- Main button reset section -->
          <b-row v-if="step==1 || step==2" style="margin-top:4px">
            <b-col cols="2"></b-col>
            <b-col style="text-align:center">
              <a class="stealth-link" @click="resetModal; step=0">
                <span>reset all and restart from beginning</span>
              </a>
            </b-col>
            <b-col cols="2"></b-col>
          </b-row>
        </div>
      </div>
    </div>
  </div>
  <footer class="copyright">KiFoundation 2020</footer>

</div>
</template>
<script>


import Vue from 'vue'
import * as numeral from 'numeral';
import {
  createWalletFromMnemonic
} from '@tendermint/sig';

import {
  BRow,
  BCol,
  BTab,
  BFormCheckbox,
} from 'bootstrap-vue'
Vue.component('b-row', BRow);
Vue.component('b-col', BCol);
Vue.component('b-tab', BTab);
Vue.component('b-form-checkbox', BFormCheckbox);

export default {
  data() {
    return {
      prefix: 'ki',
      workflow: ['generate', 'proceed', 'verify', 'end', 'save'],
      step: 0,
      blockchain_lowercase: '',
      address: '',
      amount: '0',
      private_key: '',
      public_key: '',
      mnemonic: '',
      proceedable: true,
      mnemonic_array: [],
      mnemonic_array_sub: [],
      confirmed: null,
    }
  },

  methods: {
    generateWallet() {
      const bip39 = require('bip39')
      this.mnemonic = bip39.generateMnemonic(256);
      const wallet = createWalletFromMnemonic(this.mnemonic, "", this.prefix);
      this.address = wallet.address;
      this.public_key = wallet.publicKey.toString('hex');;
      this.private_key = wallet.privateKey.toString('hex');;
      this.mnemonic_array = this.mnemonic.split(" ")
      this.mnemonic_array_sub = [...this.mnemonic_array]
      var subed = [];

      while (subed.length < 6) {
        var r = Math.floor(Math.random() * 24);
        if (subed.indexOf(r) === -1) {
          this.mnemonic_array_sub[r] = "";
          subed.push(r);
        };
      }
    },

    verify() {
      var difference = this.mnemonic_array.filter(x => this.mnemonic_array_sub.indexOf(x) === -1);
      var ok = this.mnemonic_array.filter(x => this.mnemonic_array_sub.indexOf(x) != -1);

      ok.forEach(x => {
        if (this.mnemonic_array.indexOf(x) === this.mnemonic_array_sub.indexOf(x)) {
          let ref = 'ws' + this.mnemonic_array.indexOf(x)
          this.$refs[ref][0].style.borderBottomColor = 'rgb(224, 224, 224)'
        }
      })

      difference.forEach(x => {
        let ref = 'ws' + this.mnemonic_array.indexOf(x)
        this.$refs[ref][0].style.borderBottomColor = 'red'
      })

      return this.mnemonic_array_sub.join(' ') == this.mnemonic_array.join(' ')
    },

    proceed(e) {

      switch (this.step) {

        case 0:
          this.generateWallet();
          this.step++;
          break;

        case 1:
          this.step++;
          break;

        case 2:
          if (this.verify()) {
            this.step++;
          }
          break;

        case 3:
          this.eraseKey();
          this.step++;
          break;

        case 4:
          if (this.proceedable) {
            if (this.downloadAccountData()){
              this.step++;
            };
          }
          break;
      }
    },

    eraseKey() {
      this.mnemonic = '';
      this.private_key = '';
      this.public_key = '';
      this.mnemonic = '';
      this.mnemonic_array = [];
      this.mnemonic_array_sub = [];
    },

    resetModal() {
      this.address = '';
      this.amount = '0';
      this.step = 0;
    },

    formatNumber(num) {
      this.proceedable = !(/[^0-9\.,]/g.test(num))
      this.$refs['as'].style.borderBottomColor = (/[^0-9\.,]/g.test(num)) ? 'red' : 'rgb(224, 224, 224)'

      var stuff = numeral(num).format('0,0.[000000]')
      return stuff
    },

    handleInput(event) {
      this.amount = this.formatNumber(event.target.value)
    },

    downloadAccountData() {
      if (!this.confirmed || this.confirmed==null){
        this.confirmed = false
        return false
      }
      var json = {
        "address": this.address,
        "coins": [{
          "amount": (numeral(this.amount).value() * Math.pow(10, 6)).toString(),
          "denom": "uxki"
        }]
      }

      var blob1 = new Blob([JSON.stringify(json)], {
        type: "text/plain;charset=utf-8"
      });

      //Check the Browser.
      var isIE = false || !!document.documentMode;
      if (isIE) {
        window.navigator.msSaveBlob(blob1, "account.json");
      } else {
        var url = window.URL || window.webkitURL;
        var link = url.createObjectURL(blob1);
        var a = document.createElement("a");
        a.download = "account.json";
        a.href = link;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
      return true
    }
  }
}
</script>
