import { Injectable } from '@nestjs/common';
import Stripe from "stripe"
@Injectable()
export class StripeService {
    private stripe;
    constructor(){
           this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY,{apiVersion:"2024-04-10"})
    }
}
