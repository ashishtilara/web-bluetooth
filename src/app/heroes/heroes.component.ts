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
  device: any;
  services: any[];
  chars: any = {};

  constructor() {
    this.events.push({id: '-', name: 'Welcome'});
  }

  ngOnInit() {
  }

  setListener(characteristic) {
    console.log('subscribe: ', characteristic);
    this.events.push({id: '-', name: '> Subscribe'});
    characteristic.addEventListener('characteristicvaluechanged', (event) => {
      this.counter++;
      this.events.push({id: this.counter.toString(), name: '>> Clicked !!'});
    });
    characteristic.startNotifications()
      .then(() => {
        this.events.push({id: '-', name: '> Notifications started'});
      }).catch((error) => {
      // And of course: error handling!
      console.error('Connection failed!', error);
    });
  }

  getCharacteristic(service): void {
    service.getCharacteristics()
      .then(chars => {
        console.log(chars);
        this.chars[service.uuid] = chars;
      })
      .catch((error) => {
        // And of course: error handling!
        console.error('Connection failed!', error);
      });
  }

  onRegisterBluetooth(): void {
    // @ts-ignore
    navigator.bluetooth.requestDevice({acceptAllDevices: true, optionalServices: [0xffe0]})
      .then((device) => {
        // Step 2: Connect to it
        this.events.push({id: '-', name: '> connect'});
        this.device = device;
        console.log(device);
        return device.gatt.connect();
      })
      .then((server) => {
        this.events.push({id: '-', name: '> getPrimaryService'});
        // Step 3: Get the Service
        return server.getPrimaryServices();
      })
      .then((services) => {
        console.log(services);
        this.services = services;
      })
      .catch((error) => {
        // And of course: error handling!
        console.error('Connection failed!', error);
      });

  }
}
