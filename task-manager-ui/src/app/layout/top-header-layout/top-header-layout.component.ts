import { Component } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from '../../components/footer/footer.component';

@Component({
  selector: 'app-top-header-layout',
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  templateUrl: './top-header-layout.component.html',
  styleUrl: './top-header-layout.component.scss',
})
export class TopHeaderLayoutComponent {}
