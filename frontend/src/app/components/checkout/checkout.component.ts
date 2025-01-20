import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Luv2ShopFormService } from '../../services/luv2-shop-form.service';
import { Country } from '../../common/country';
import { State } from '../../common/state';
import { Luv2ShopValidators } from '../../validators/luv2-shop-validators/luv2-shop-validators';
import { CartService } from '../../services/cart.service';
import { CheckoutService } from '../../services/checkout.service';
import { Router } from '@angular/router';
import { Customer } from '../../common/customer';
import { Order } from '../../common/order';
import { OrderItem } from '../../common/order-item';
import { Purchase } from '../../common/purchase';

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
    private luv2ShopFormService: Luv2ShopFormService,
    private cartService: CartService,
    private checkoutService: CheckoutService,
    private router: Router) { }

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

    this.reviewCartDetails()
  }

  onSubmit() {
    if (this.checkoutFormGroup.invalid) {
      this.checkoutFormGroup.markAllAsTouched()
      return;
    }

    let order = new Order(this.totalPrice, this.totalQuantity);

    const cartItems = this.cartService.cartItems;
    let orderItems: OrderItem[] = cartItems.map(item => new OrderItem(item));

    let purchase = new Purchase();
    purchase.customer = this.checkoutFormGroup.controls['customer'].value

    purchase.shippingAddress = this.checkoutFormGroup.controls['shippingAddress'].value
    const shippingState: State = JSON.parse(JSON.stringify(purchase.shippingAddress.state))
    const shippingCountry: Country = JSON.parse(JSON.stringify(purchase.shippingAddress.country))
    purchase.shippingAddress.state = shippingState.name
    purchase.shippingAddress.country = shippingCountry.name

    purchase.billingAddress = this.checkoutFormGroup.controls['billingAddress'].value
    const billingState: State = JSON.parse(JSON.stringify(purchase.billingAddress.state))
    const billingCountry: Country = JSON.parse(JSON.stringify(purchase.billingAddress.country))
    purchase.billingAddress.state = billingState.name
    purchase.billingAddress.country = billingCountry.name

    purchase.order = order
    purchase.orderItems = orderItems
    console.log(purchase);


    this.checkoutService.placeOrder(purchase).subscribe({
        next: response => {
          alert(`Your order has been received.\nOrder tracking number: ${response.orderTrackingNumber}`)

          this.resetCart()
        },
        error: err => {
          alert(`There was an error: ${err.message}`)
        }
      }
    )
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

  reviewCartDetails(){
    this.cartService.totalPrice.subscribe(
      data => this.totalPrice = data
    )

    this.cartService.totalQuantity.subscribe(
      data => this.totalQuantity = data
    )
  }

  resetCart(){
    this.cartService.cartItems = []
    this.cartService.totalPrice.next(0)
    this.cartService.totalQuantity.next(0)

    this.checkoutFormGroup.reset()

    this.router.navigateByUrl('/products')
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
