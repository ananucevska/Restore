import Grid from "@mui/material/Grid";
import {OrderSummary} from "../../app/shared/components/OrderSummary.tsx";
import CheckoutStepper from "./CheckoutStepper.tsx";
import {loadStripe, StripeElementsOptions} from "@stripe/stripe-js";
import {Elements} from "@stripe/react-stripe-js";
import {useFetchBasketQuery} from "../basket/basketApi.ts";
import {useEffect, useMemo, useRef} from "react";
import {Typography} from "@mui/material";
import {useCreatePaymentIntentMutation} from "./checkoutApi.ts";
import {useAppSelector} from "../../app/store/store.ts";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PK);
export default function CheckoutPage() {
    const {data: basket} = useFetchBasketQuery();
    const [createPaymentIntent, {isLoading}] = useCreatePaymentIntentMutation();
    const created = useRef(false); //useffect runs twice in production, ova sprecuva da nema frki
    const {darkMode} = useAppSelector(state => state.ui);
    
    useEffect(() => {
        if (!created.current) createPaymentIntent();
        created.current = true; 
    }, [createPaymentIntent]);
    
    const options: StripeElementsOptions | undefined = useMemo(() => {
        if (!basket?.clientSecret) return undefined;
        return {
            clientSecret: basket.clientSecret,
            appearance: {
                labels: 'floating',
                theme: darkMode ? 'night' : 'stripe'
            }
        }
    }, [basket?.clientSecret, darkMode]);
    
    return (
      <Grid container spacing={2}>
          <Grid size={8}>
              {!stripePromise || !options || isLoading ? (
                  <Typography variant="h6">Loading checkout...</Typography>
              ) : (
                  <Elements stripe={stripePromise} options={options}>
                      <CheckoutStepper/>
                  </Elements>
              )}
          </Grid>
          <Grid size={4}>
              <OrderSummary/>
          </Grid>
      </Grid>
  );
}