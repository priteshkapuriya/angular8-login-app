import {
  Component,
  OnInit,
  ViewChildren,
  AfterViewInit,
  ChangeDetectorRef,
} from "@angular/core";
import { AbstractControl, Validators, FormBuilder } from "@angular/forms";
import { Router } from "@angular/router";
import { DataService } from "../data.service";

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.css"],
})
export class RegisterComponent implements OnInit, AfterViewInit {
  usernames: Array<any> = [];
  passwords: Array<any> = [];
  message: string;
  infoMessage: string = "";
  @ViewChildren("inputRef") inputRef;
  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private data: DataService,
    private cdr: ChangeDetectorRef
  ) {}

  ngAfterViewInit() {
    this.inputRef.first.nativeElement.focus();
    this.cdr.detectChanges();
  }

  ngOnInit() {
    this.data.currentMessage.subscribe((message) => (this.message = message));
    this.registerForm.get("username").setValue(this.message);
  }

  registerForm = this.formBuilder.group(
    {
      username: ["", [Validators.required, this.usernameValidator()]],
      password: [
        "",
        Validators.compose([Validators.required, this.patternValidator()]),
      ],
      confPassword: ["", Validators.required],
    },
    {
      validator: this.MatchPassword("password", "confPassword"),
    }
  );

  usernameValidator() {
    return (control: AbstractControl): { [key: string]: any } => {
      this.usernames = JSON.parse(localStorage.getItem("usernames"));
      if (this.usernames == null || undefined) {
        this.usernames = [];
      }
      if (this.usernames.includes(control.value)) {
        return { userExist: true };
      } else {
        return null;
      }
    };
  }
  onCancel() {
    this.data.sendMessageToLogin(this.registerForm.controls["username"].value);
    this.router.navigate(["login"]);
  }

  patternValidator() {
    return (control: AbstractControl): { [key: string]: any } => {
      if (!control.value) {
        return null;
      }
      const regex = new RegExp("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$");
      const valid = regex.test(control.value);
      return valid ? null : { invalidPassword: true };
    };
  }

  MatchPassword(password: string, confirmPassword: string) {
    return (registerForm) => {
      const passwordControl = registerForm.controls[password];
      const confirmPasswordControl = registerForm.controls[confirmPassword];

      if (!passwordControl || !confirmPasswordControl) {
        return null;
      }

      if (
        confirmPasswordControl.errors &&
        !confirmPasswordControl.errors.passwordMismatch
      ) {
        return null;
      }

      if (passwordControl.value !== confirmPasswordControl.value) {
        confirmPasswordControl.setErrors({ passwordMismatch: true });
      } else {
        confirmPasswordControl.setErrors(null);
      }
    };
  }

  submit() {
    if (this.registerForm.valid) {
      this.usernames = JSON.parse(localStorage.getItem("usernames"));
      this.passwords = JSON.parse(localStorage.getItem("passwords"));
      if (this.usernames == null || undefined) {
        this.usernames = [];
      }
      if (this.passwords == null || undefined) {
        this.passwords = [];
      }
      this.usernames.push(this.registerForm.value.username);
      this.passwords.push(this.registerForm.value.password);
      localStorage.setItem("usernames", JSON.stringify(this.usernames));
      localStorage.setItem("passwords", JSON.stringify(this.passwords));
      this.infoMessage =
        "Registration Successful, You will be redirected to Login now.";
      setTimeout(() => {
        this.infoMessage = "";
        this.router.navigate(["login"]);
      }, 2000);
    } else {
      return;
    }
  }
}
