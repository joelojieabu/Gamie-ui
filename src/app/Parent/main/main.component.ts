import { Component } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RouterModule } from '@angular/router';
import { SideBarComponent } from "../side-bar/side-bar.component";

@Component({
  selector: 'app-main',
  imports: [MatSidenavModule, RouterModule, SideBarComponent],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
})
export class MainComponent {}
