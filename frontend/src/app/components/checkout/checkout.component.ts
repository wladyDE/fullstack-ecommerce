import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Luv2ShopFormService } from '../../services/luv2-shop-form.service';
import { Country } from '../../common/country';
import { State } from '../../common/state';

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
        firstName: [''],
        lastName: [''],
        email: ['']
      }),
      shippingAddress: this.formBuilder.group({
        street: [''],
        city: [''],
        state: [''],
        country: [''],
        zipCode: [''],
      }),
      billingAddress: this.formBuilder.group({
        street: [''],
        city: [''],
        state: [''],
        country: [''],
        zipCode: [''],
      }),
      creditCard: this.formBuilder.group({
        cardType: [''],
        nameOnCard: [''],
        cardNumber: [''],
        securityCode: [''],
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
    console.log(this.checkoutFormGroup.get('customer')?.value);
  }

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
        if(formGroupName === 'billingAddress'){
          this.billingAddressStates = data
        } else {
          this.shippingAddressStates = data
        }

        formGroup?.get('state')?.setValue(data[0])
      }
    )
  }
}
