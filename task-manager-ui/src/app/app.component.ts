import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { MetaService } from "./services/meta.service";
import { MetaStore } from "./stores/meta.store";

@Component({
  selector: "app-root",
  imports: [RouterOutlet, CommonModule],
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit {
  title = "Task Manager App";

  constructor(
    public metaStore: MetaStore,
    private metaService: MetaService
  ) {}

  ngOnInit(): void {
    this.metaService.fetchMetaData();
  }
}
