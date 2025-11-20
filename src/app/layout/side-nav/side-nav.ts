import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NgClass } from '@angular/common';

import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-side-nav',
  standalone: true,
  imports: [
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    RouterLink,
    RouterLinkActive,
    NgClass,
  ],
  templateUrl: './side-nav.html',
  styleUrls: ['./side-nav.css'],
})
export class SideNavComponent {}
