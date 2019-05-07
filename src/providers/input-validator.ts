import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import * as accounting from '../assets/library/accounting';
import { TranslateService } from 'ng2-translate/ng2-translate';

@Injectable()
export class InputValidator {
  public static TAG: string = "Input Validator";

  constructor(
    public translateSvc: TranslateService
  ) {

  }

  public check_blank(input) {
    console.log("check blank input");
    return new Promise((resolve, reject) => {
      input = input.trim();
      if (input != '') {
        resolve({ status: true, value: input, check_id: 'check_blank' });
      }
      else {
        reject(this.translateSvc.get("alert.input_cannot_blank")['value']);
      }
    });
  }

  public check_curr_prefix(nominal) {
    console.log("check currency prefix");
    return new Promise((resolve, reject) => {
      nominal = nominal.trim();
      let removed_space_0;
      let removed_space_1;
      let split;

      split = nominal.split(/rp/i);
      console.log("split val", split);
      console.log("split length", split.length);
      if (split.length > 1) {
        if (split.length <= 2) {
          removed_space_0 = split[0].replace(/ /g, '');
          console.log("removed space 0", removed_space_0);
          removed_space_1 = split[1].replace(/ /g, '');
          console.log("removed space 1", removed_space_1);

          if (removed_space_0 != '') {
            reject(this.translateSvc.get("alert.prefix_position_invalid")['value']);
            return;
          }

          if (removed_space_1 == '') {
            reject(this.translateSvc.get("alert.no_amount_money_input")['value']);
            return;
          }
          // return value without white space
          // split[1] = split[1].replace(/ /g, "");
          split[1] = split[1].trim();
          resolve({ status: true, value: split[1], check_id: 'check_curr_prefix' });
        }
        else {
          reject(this.translateSvc.get("alert.invalid_input")['value']);
        }
      }
      else {
        // return value without white space
        // split[0] = split[0].replace(/ /g, "");
        split[0] = split[0].trim();
        resolve({ status: true, value: split[0], check_id: 'check_curr_prefix' });
      }
    });
  }

  public check_space(nominal) {
    return new Promise((resolve, reject) => {
      let check_space = nominal.match(/\s/g);
      if (check_space == null) {
        resolve({ status: true, value: nominal, check_id: 'check_space' });
      }
      else {
        reject(this.translateSvc.get("alert.invalid_separator")['value']);
      }
    });
  }

  public check_thousand_decimal(nominal) {
    return new Promise((resolve, reject) => {
      // check if the nominal have thousand or decimal separator
      // if doesn't have dot & commas, resolve(true)
      let check_dot = nominal.match(/\./g);
      console.log("check dot, ", check_dot);
      let check_comma = nominal.match(/\,/g);
      console.log("check comma, ", check_comma);

      if (check_dot == null && check_comma == null) {
        resolve({ status: true, value: nominal, check_id: 'check_thousand_decimal' });
        return;
      }

      // let regex = /^[0-9]\d*(((.\d{3}){1})?(\,\d{0,2})?)$/;
      // let regex = /^\d+([.,]\d{1,2})?$/;
      // let regex = /(\d)(?=(\d{3})+(?!\d))/g;
      let regex = /^(?!0\,00)[0-9]\d{0,2}(\.\d{3})*(\,\d\d)?$/g;
      let regex_test = regex.test(nominal);
      console.log("regex check thousand decimal, ", regex_test);
      if (regex_test == true) {
        resolve({ status: true, value: nominal, check_id: 'check_thousand_decimal' });
      }
      else {
        reject(this.translateSvc.get("alert.invalid_thousand_decimal")['value']);
      }
    });
  }

  public format_amount(nominal) {
    return new Promise((resolve, reject) => {
      let format = accounting.unformat(nominal);
      resolve({ status: true, value: format, check_id: 'format_amount' });
    });
  }

  public check_currency_format(nominal) {
    let check = accounting.checkCurrencyFormat(nominal);
    console.log("check currency format accounting.js ", check);
  }

}
