import { Component } from '@angular/core';
import {IonButtons, IonRouterLink, IonApp, IonRouterOutlet, IonMenu, IonHeader, IonToolbar,IonTitle, IonContent, IonList, IonItem } from '@ionic/angular/standalone';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [IonButtons, IonApp, IonRouterLink, IonRouterOutlet, IonMenu, IonMenu, IonHeader, IonToolbar, IonContent, IonTitle, IonList, IonItem],
})
export class AppComponent {
  constructor() {}
}
