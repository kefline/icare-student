import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  OnChanges,
  ViewChild,
} from "@angular/core";
import { FormGroup } from "@angular/forms";
import { Field } from "../../models/field.model";
import { FieldControlService } from "../../services";
import { find } from "lodash";
import { FieldData, FieldsData } from "../../models/fields-data.model";
import { FormValue } from "../../models/form-value.model";
import { FieldComponent } from "../field/field.component";

@Component({
  selector: "app-form",
  templateUrl: "./form.component.html",
  styleUrls: ["./form.component.scss"],
})
export class FormComponent implements OnInit, OnChanges {
  @Input() fields: Field<string>[];
  @Input() dataType: any;
  @Input() isFormHorizontal: boolean;
  @Input() showSaveButton: boolean;
  @Input() fieldsData: FieldsData;
  @Input() fieldClass: string;
  @Input() shouldRenderAsCheckBoxesButton: boolean;
  @Input() shouldDisable: boolean;
  @Input() isReport: boolean;

  @Output() formUpdate: EventEmitter<any> = new EventEmitter<any>();

  values: any;

  form: FormGroup;
  payload = "";

  @ViewChild(FieldComponent, { static: false })
  fieldComponent: FieldComponent;

  constructor(private fieldControlService: FieldControlService) {}

  ngOnChanges(): void {
    this.shouldDisable = this.isReport ? true : this.shouldDisable;
    this.form = this.fieldControlService.toFormGroup(
      this.fields,
      this.fieldsData
    );
    this.values = this.form.getRawValue();
  }

  ngOnInit(): void {
    // Use coded dataType to restructure field options
    if(this.dataType && typeof (this.dataType) === 'string' && this.dataType.toLowerCase() === 'coded') {
      this.fields[0] =  {
        ...this.fields[0],
        options: (this.fields[0].options || []).map(
            (option) => {
            return {
                ...option,
                value: option?.key ? option?.key : option?.value,
            };
          }
        )
      }
    }
  }

  onSubmit(): void {
    this.formUpdate.emit(this.form.getRawValue());
  }

  onFieldUpdate(form: FormGroup): void {
    if (!this.showSaveButton && form) {
      this.formUpdate.emit(new FormValue(this.form, this.fields));

      this.values = form.getRawValue();
    }
  }

  onClear(): void {
    this.form.reset();
  }

  isFormInValid() {
    return this.form.invalid;
  }

  patchFormValueValue(objectToUpdate: any): void {
    this.fieldComponent.updateFieldOnDemand(objectToUpdate);
  }
}
