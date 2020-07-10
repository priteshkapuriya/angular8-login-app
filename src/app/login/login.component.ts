import { Component, OnInit } from "@angular/core";
import { Validators, AbstractControl, FormBuilder } from "@angular/forms";
import { Router } from "@angular/router";
import { DataService } from "../data.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent implements OnInit {
  usernames: Array<any> = [];
  passwords: Array<any> = [];
  message: string;
  errorMessage: string = "";
  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private data: DataService
  ) {}

  ngOnInit() {
    this.data.currentMessage.subscribe((message) => (this.message = message));
    this.form.get("username").setValue(this.message);
  }

  form = this.formBuilder.group({
    username: ["", [Validators.required, this.usernameValidator()]],
    password: ["", Validators.required],
  });

  usernameValidator() {
    return (control: AbstractControl): { [key: string]: any } => {
      this.usernames = JSON.parse(localStorage.getItem("usernames"));
      if (this.usernames == null || undefined) {
        this.usernames = [];
      }
      if (this.usernames.includes(control.value)) {
        return null;
      } else if (control.value == "") {
        return null;
      } else {
        return { userExist: true };
      }
    };
  }

  onRegister() {
    this.data.sendMessageToRegister(this.form.controls["username"].value);
    this.router.navigate(["register"]);
  }

  submit() {
    if (this.form.valid) {
      this.usernames = JSON.parse(localStorage.getItem("usernames"));
      this.passwords = JSON.parse(localStorage.getItem("passwords"));
      let usernameIndex = this.usernames.indexOf(this.form.value.username);
      let dbUsername = this.usernames[usernameIndex];
      let dbPassword = this.passwords[usernameIndex];
      if (
        this.form.value.username == dbUsername &&
        this.form.value.password == dbPassword
      ) {
        this.data.sendMessageToUser(dbUsername);
        this.router.navigate(["user"]);
      } else {
        this.errorMessage = "Password Is Incorrect, Please try again.";
        setTimeout(() => {
          this.errorMessage = "";
        }, 2000);
      }
    }
  }
}
