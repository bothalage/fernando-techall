import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import api from "../api/client";
import Hex from "../components/Hex.jsx";
import { CheckCircle2 } from "lucide-react";

export default function BillingSuccess() {
  const [sp] = useSearchParams();
  const [state, setState] = useState({ loading: true });

  useEffect(() => {
    // PayPal returns token and PayerID in query params after approval
    const token = sp.get("token");
    if (!token) return setState({ loading: false, ok: false });
    // Capture the payment
    api.post("/payments/capture", { orderId: token })
      .then(({ data }) => {
        if (data.ok) {
          setState({ loading: false, ok: true, plan: data.plan });
        } else {
          setState({ loading: false, ok: false });
        }
      })
      .catch(() => setState({ loading: false, ok: false }));
  }, [sp]);

  return (
    <div className="max-w-md mx-auto mt-24 card text-center">
      <div className="flex justify-center mb-3"><Hex size={72}><CheckCircle2/></Hex></div>
      {state.loading ? <p>Confirming your payment...</p> : state.ok ? (
        <>
          <h2 className="text-2xl font-bold">Welcome to {state.plan?.toUpperCase()}</h2>
          <p className="text-muted mt-2">Your subscription is active. A confirmation email is on its way.</p>
          <Link to="/dashboard" className="btn-primary inline-block mt-5">Go to Dashboard</Link>
        </>
      ) : (
        <>
          <h2 className="text-2xl font-bold">Hmm, we couldn't confirm that</h2>
          <p className="text-muted mt-2">If you were charged, refresh your dashboard in a minute.</p>
          <Link to="/pricing" className="btn-primary inline-block mt-5">Back to Pricing</Link>
        </>
      )}
    </div>
  );
}
