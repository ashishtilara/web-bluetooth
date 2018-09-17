import {Component, OnInit} from '@angular/core';

export class E {
  id: string;
  name: string;
}

@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.css']
})
export class HeroesComponent implements OnInit {

  events: E[] = [];
  counter = 0;

  constructor() {
    this.events.push({ id: '-', name: 'Welcome' });
  }

  ngOnInit() {
  }

  onRegisterBluetooth(): void {
    // @ts-ignore
    navigator.bluetooth.requestDevice({acceptAllDevices: true, optionalServices: [0xffe0]})
      .then((device) => {
        // Step 2: Connect to it
        this.events.push({ id: '-', name: '> connect'});
        return device.gatt.connect();
      })
      .then((server) => {
        this.events.push({ id: '-', name: '> getPrimaryService'});
        // Step 3: Get the Service
        return server.getPrimaryService(0xffe0);
      })
      .then((service) => {
        this.events.push({ id: '-', name: '> getCharacteristic'});
        // Step 4: get the Characteristic (custom characteristic with notify property)
        return service.getCharacteristic('f000ffe1-0451-4000-b000-000000000000');
      })
      .then((characteristic) => {
        console.log('subscribe: ', characteristic);
        this.events.push({ id: '-', name: '> Subscribe'});
        characteristic.addEventListener('characteristicvaluechanged', (event) => {
          this.counter++;
          this.events.push({ id: this.counter.toString(), name: '>> Clicked !!'});
        });
        characteristic.startNotifications()
          .then(() => {
            this.events.push({ id: '-', name: '> Notifications started'});
          });
      })
      .catch((error) => {
        // And of course: error handling!
        console.error('Connection failed!', error);
      });

  }
}
