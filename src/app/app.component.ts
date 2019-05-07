import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { TranslateService } from 'ng2-translate/ng2-translate';

import { HomePage } from '../pages/home/home';
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any = HomePage;

  constructor(
    public platform: Platform,
    public splashScreen: SplashScreen,
    public statusBar: StatusBar,
    public translateSvc: TranslateService,
  ) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.initTranslation();
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }

  //initialize ng2-translate
  initTranslation() {
    let defaultLang: string = 'id';
    this.translateSvc.setDefaultLang(defaultLang);
    this.translateSvc.use(defaultLang);
  }
}
