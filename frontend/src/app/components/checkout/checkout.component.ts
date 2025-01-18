import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Luv2ShopFormService } from '../../services/luv2-shop-form.service';
import { Country } from '../../common/country';
import { State } from '../../common/state';
import { Luv2ShopValidators } from '../../validators/luv2-shop-validators/luv2-shop-validators';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [ReactiveFormsModule, CurrencyPipe, CommonModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss'
})
export class CheckoutComponent implements OnInit {

  checkoutFormGroup!: FormGroup

  totalPrice: number = 0
  totalQuantity: number = 0

  creditCardYears: number[] = []
  creditCardMonths: number[] = []

  countries: Country[] = []
  shippingAddressStates: State[] = []
  billingAddressStates: State[] = []

  constructor(private formBuilder: FormBuilder,
    private luv2ShopFormService: Luv2ShopFormService) { }

  ngOnInit(): void {
    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: new FormControl('',
          [
            Validators.required,
            Validators.minLength(2),
            Luv2ShopValidators.notOnlyWhitespace
          ]),
        lastName: new FormControl('',
          [
            Validators.required,
            Validators.minLength(2),
            Luv2ShopValidators.notOnlyWhitespace
          ]),
        email: new FormControl('',
          [
            Validators.required,
            Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')
          ])
      }),
      shippingAddress: this.formBuilder.group({
        street: new FormControl('',
          [
            Validators.required,
            Validators.minLength(2),
            Luv2ShopValidators.notOnlyWhitespace
          ]),
        city: new FormControl('',
          [
            Validators.required,
            Validators.minLength(2),
            Luv2ShopValidators.notOnlyWhitespace
          ]),
        state: new FormControl('', [ Validators.required ]),
        country: new FormControl('', [ Validators.required ]),
        zipCode: new FormControl('',
          [
            Validators.required,
            Validators.minLength(2),
            Luv2ShopValidators.notOnlyWhitespace
          ]),
      }),
      billingAddress: this.formBuilder.group({
        street: new FormControl('',
          [
            Validators.required,
            Validators.minLength(2),
            Luv2ShopValidators.notOnlyWhitespace
          ]),
        city: new FormControl('',
          [
            Validators.required,
            Validators.minLength(2),
            Luv2ShopValidators.notOnlyWhitespace
          ]),
        state: new FormControl('', [ Validators.required ]),
        country: new FormControl('', [ Validators.required ]),
        zipCode: new FormControl('',
          [
            Validators.required,
            Validators.minLength(2),
            Luv2ShopValidators.notOnlyWhitespace
          ]),
      }),
      creditCard: this.formBuilder.group({
        cardType: new FormControl('', [ Validators.required ]),
        nameOnCard: new FormControl('',
          [
            Validators.required,
            Validators.minLength(2),
            Luv2ShopValidators.notOnlyWhitespace
          ]),
        cardNumber: new FormControl('',
          [
            Validators.required,
            Validators.pattern('[0-9]{16}')
          ]),
        securityCode: new FormControl('',
          [
            Validators.required,
            Validators.pattern('[0-9]{3}'),
            Luv2ShopValidators.notOnlyWhitespace
          ]),
        expirationMonth: [''],
        expirationYear: [''],
      })
    })

    const startMonth: number = new Date().getMonth() + 1

    this.luv2ShopFormService.getCreditCardMonths(startMonth).subscribe(
      data => {
        this.creditCardMonths = data;
      }
    )

    this.luv2ShopFormService.getCreditCardYears().subscribe(
      data => {
        this.creditCardYears = data;
      }
    )

    this.luv2ShopFormService.getCountries().subscribe(
      data => {
        this.countries = data;
      }
    )
  }

  onSubmit() {
    if (this.checkoutFormGroup.invalid) {
      this.checkoutFormGroup.markAllAsTouched()
    }
  }

  get firstName() { return this.checkoutFormGroup.get('customer.firstName') }
  get lastName() { return this.checkoutFormGroup.get('customer.lastName') }
  get email() { return this.checkoutFormGroup.get('customer.email') }

  get shippingAddressStreet() { return this.checkoutFormGroup.get('shippingAddress.street') }
  get shippingAddressCity() { return this.checkoutFormGroup.get('shippingAddress.city') }
  get shippingAddressState() { return this.checkoutFormGroup.get('shippingAddress.state') }
  get shippingAddressCountry() { return this.checkoutFormGroup.get('shippingAddress.country') }
  get shippingAddressZipCode() { return this.checkoutFormGroup.get('shippingAddress.zipCode') }

  get billingAddressStreet() { return this.checkoutFormGroup.get('billingAddress.street') }
  get billingAddressCity() { return this.checkoutFormGroup.get('billingAddress.city') }
  get billingAddressState() { return this.checkoutFormGroup.get('billingAddress.state') }
  get billingAddressCountry() { return this.checkoutFormGroup.get('billingAddress.country') }
  get billingAddressZipCode() { return this.checkoutFormGroup.get('billingAddress.zipCode') }

  get creditCardType() { return this.checkoutFormGroup.get('creditCard.cardType') }
  get creditCardNameOnCard() { return this.checkoutFormGroup.get('creditCard.nameOnCard') }
  get creditCardNumber() { return this.checkoutFormGroup.get('creditCard.cardNumber') }
  get creditCardSecurityCode() { return this.checkoutFormGroup.get('creditCard.securityCode') }

  copyShippingAddressToBillingAddress(event: Event): void {
    const checkbox = event.target as HTMLInputElement;

    if (checkbox.checked) {
      this.checkoutFormGroup.get('billingAddress')
        ?.setValue(this.checkoutFormGroup.get('shippingAddress')?.value);

      this.billingAddressStates = this.shippingAddressStates
    } else {
      this.checkoutFormGroup.get('billingAddress')?.reset();

      this.billingAddressStates = []
    }
  }

  handleMonthsAndYears() {
    const creditCardFormGroup = this.checkoutFormGroup.get('creditCard')

    const currentYear: number = new Date().getFullYear()
    const selectedYear: number = Number(creditCardFormGroup?.value.expirationYear)

    let startMonth: number

    if (currentYear === selectedYear) {
      startMonth = new Date().getMonth() + 1
    } else {
      startMonth = 1
    }

    this.luv2ShopFormService.getCreditCardMonths(startMonth).subscribe(
      data => {
        this.creditCardMonths = data
      }
    )
  }

  getStates(formGroupName: 'billingAddress' | 'shippingAddress'): void {
    const formGroup = this.checkoutFormGroup.get(formGroupName)
    const countryCode = formGroup?.value.country.code

    this.luv2ShopFormService.getStates(countryCode).subscribe(
      data => {
        if (formGroupName === 'billingAddress') {
          this.billingAddressStates = data
        } else {
          this.shippingAddressStates = data
        }

        formGroup?.get('state')?.setValue(data[0])
      }
    )
  }
}
