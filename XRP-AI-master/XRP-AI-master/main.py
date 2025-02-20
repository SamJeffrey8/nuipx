from fastapi import FastAPI, HTTPException
from AI_Agent_IP_Payment_Check import check_payment

app = FastAPI()


@app.get("/protected-endpoint")
def protected_api(user_address: str):
    """Restrict access unless 10 XRP payment is received"""

    is_paid, tx_id = check_payment(user_address)

    if not is_paid:
        raise HTTPException(status_code=403, detail="❌ You must send 10 XRP to access this endpoint.")

    return {"message": "✅ Access granted!", "transaction_id": tx_id}
