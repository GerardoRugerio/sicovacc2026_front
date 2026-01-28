import { Component, inject, input, Input, OnInit } from '@angular/core';
import { ValidatorsService } from '../../services/validators.service';
import { FormGroup, NgControl } from '@angular/forms';

@Component({
  selector: 'shared-warnings',
  templateUrl: './warnings.component.html',
  styles: ``
})
export class WarningsComponent implements OnInit{
  private validatorsService = inject(ValidatorsService);

  public maxlength = input<number>();
  public form = input<FormGroup>();
  public field = input<string>('');
  public touched = input<boolean>();

  ngOnInit(): void {
  }

  isValidField() {
    return this.validatorsService.isValidField(this.form()!,this.field());
  }

  getFieldLengthErrors() {
    return this.validatorsService.getFieldLengthError(this.form()!,this.field(), this.maxlength());
  }
}
