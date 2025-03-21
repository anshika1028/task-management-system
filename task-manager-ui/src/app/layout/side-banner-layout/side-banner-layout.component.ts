import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { FooterComponent } from "../../components/footer/footer.component";

@Component({
  selector: "app-side-banner-layout",
  imports: [RouterOutlet, FooterComponent],
  templateUrl: "./side-banner-layout.component.html",
  styleUrl: "./side-banner-layout.component.scss",
})
export class SideBannerLayoutComponent {}
