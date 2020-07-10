import { Component, OnInit } from "@angular/core";
import { DataService } from "../data.service";

@Component({
  selector: "app-user",
  templateUrl: "./user.component.html",
  styleUrls: ["./user.component.css"],
})
export class UserComponent implements OnInit {
  message: string;
  constructor(private data: DataService) {}

  ngOnInit() {
    this.data.currentMessage.subscribe((message) => (this.message = message));
  }
}
