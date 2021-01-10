import { Component, OnInit } from '@angular/core';
import { element } from 'protractor';
import { SettingsService } from '../../services/settings.service';

@Component({
  selector: 'app-account-settings',
  templateUrl: './account-settings.component.html',
  styles: [
  ]
})
export class AccountSettingsComponent implements OnInit {

  constructor(private settingSettings: SettingsService) { }

  ngOnInit(): void {
    this.settingSettings.checkCurrentTheme();
  }

  changeTheme( theme: string ): void {
    this.settingSettings.changeTheme(theme);
  }

}
