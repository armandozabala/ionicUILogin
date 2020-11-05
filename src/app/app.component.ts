import { Component } from '@angular/core';

import { AlertController, Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  public selectedIndex = 0;
  public appPages = [
    {
      title: "Home",
      url: "/home",
      icon: "list",
    },
    {
      title: "Pets",
      url: "/pets",
      icon: "settings",
    },
    {
      title: "Calendar",
      url: "/calendar",
      icon: "settings",
    },
    {
      title: "Settings",
      url: "/settings",
      icon: "settings",
    },
    {
      title: "Profile",
      url: "/profile",
      icon: "person",
    }

  ];

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    public alertController: AlertController,
    private authService: AuthService,
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });

    this.platform.backButton.subscribeWithPriority(-1, () => {
      console.log("Handler called to force close!");
      this.showExitConfirm();
    });
  }

  showExitConfirm() {
    this.alertController
      .create({
        header: "App termination",
        message: "Do you want to close the app?",
        backdropDismiss: false,
        buttons: [
          {
            text: "Stay",
            role: "cancel",
            handler: () => {
              console.log("Application exit prevented!");
            },
          },
          {
            text: "Exit",
            handler: () => {
              navigator["app"].exitApp();
            },
          },
        ],
      })
      .then((alert) => {
        alert.present();
      });
  }

  
  logout() {
    this.authService.logout();
  }

  exit() {
    this.showExitConfirm();
  }
}
