import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { InputValidator } from '../../providers/input-validator';
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [InputValidator]
})
export class HomePage {
  public amount: string = "";
  public parsed_amount: any;
  public bills = [];
  constructor(
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    public inputValidator: InputValidator,
  ) {

  }

  process() {
    console.log("testing ", "amount rupiahs", this.amount);
    this.check_input(this.amount).then((val) => {
      console.log("check value: ", val);

      if (val['status'] == true) {
        this.parse_amount(val['value']);
      }
    });
  }

  check_input(val) {
    return new Promise((resolve, reject) => {
      this.inputValidator.check_blank(val).then((val) => {
        if (val['status'] == true) {
          console.log(val['check_id'], "passed! ", "Continue check: ", val['value']);
        }
        this.inputValidator.check_curr_prefix(val['value']).then((val) => {
          if (val['status'] == true) {
            console.log(val['check_id'], "passed! ", "Continue check: ", val['value']);
          }
          this.inputValidator.check_space(val['value']).then((val) => {
            if (val['status'] == true) {
              console.log(val['check_id'], "passed! ", "Continue check: ", val['value']);
            }
            this.inputValidator.check_thousand_decimal(val['value']).then((val) => {
              if (val['status'] == true) {
                console.log(val['check_id'], "passed! ", "Continue check: ", val['value']);
              }
              this.inputValidator.format_amount(val['value']).then((val) => {
                if (val['status'] == true) {
                  console.log(val['check_id'], "passed! ", "Continue parsing: ", val['value']);
                  resolve({ status: true, value: val['value'] });
                }
              }).catch((err) => {
                console.error("error happen: ", err);
                this.alert_dialog(err);
                resolve({ status: false, value: null });
              });
            }).catch((err) => {
              console.error("error happen: ", err);
              this.alert_dialog(err);
              resolve({ status: false, value: null });
              // this.amount = "";
            });
          }).catch((err) => {
            console.error("error happen: ", err);
            this.alert_dialog(err);
            resolve({ status: false, value: null });
            // this.amount = "";
          });
        }).catch((err) => {
          console.error("error happen: ", err);
          this.alert_dialog(err);
          resolve({ status: false, value: null });
          // this.amount = "";
        });
      }).catch((err) => {
        console.error("error happen: ", err);
        this.alert_dialog(err);
        resolve({ status: false, value: null });
        // this.amount = "";
      });
    });
  }

  parse_amount(nominal) {
    console.log("parsed_amount ", nominal);
    let res = this.calculate_money(nominal);
    console.log("parsed result: ", res);
    this.bills = res['bills'];
  }

  calculate_money(nominal) {
    let res = {};
    let rupiah_bills = [100000, 50000, 20000, 10000, 5000, 2000, 1000, 500, 100, 50];
    let bills = [];

    for (let i = 0; nominal > 0 && i < rupiah_bills.length; i++) {
      let value = rupiah_bills[i];

      if (value <= nominal) {
        res[value] = Math.floor(nominal / value);

        let bill = {
          bill: value,
          amount: Math.floor(nominal / value),
          color: "nominal_" + value
        };
        nominal -= value * res[value];

        bills.push(bill);
      }
    }

    if (nominal != 0) {
      let left = {
        left: nominal,
        amount: 1
      };
      bills.push(left);
    }

    let result = {
      bills: bills
    };

    return result;
  }

  alert_dialog(error_msg) {
    let alert = this.alertCtrl.create({
      title: "Oops...",
      message: error_msg,
      buttons: [{ text: "OK" }]
    });
    alert.present();
  }
}
