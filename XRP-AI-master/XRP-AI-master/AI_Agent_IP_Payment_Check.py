from xrpl.clients import JsonRpcClient
from xrpl.models.requests import AccountTx

# XRPL Testnet Client
client = JsonRpcClient("https://s.altnet.rippletest.net:51234")

# Replace this with the paywall wallet address you generated
PAYWALL_ADDRESS = "rNQdP6Z8U3srypz1fKXgNdi2xN4jjxRpUa"


def check_payment(user_address):
    """Check if user has sent 10 XRP to the paywall wallet"""

    tx_request = AccountTx(account=PAYWALL_ADDRESS, ledger_index="validated")
    response = client.request(tx_request)

    if "transactions" not in response.result:
        return False, "No transactions found."

    for tx in response.result["transactions"]:
        tx_data = tx.get("tx", {})

        # Check if it's a payment transaction
        if tx_data.get("TransactionType") == "Payment":
            sender = tx_data.get("Account")
            receiver = tx_data.get("Destination")
            amount = int(tx_data.get("Amount", 0))  # Convert from drops (1 XRP = 1,000,000 drops)

            # Validate sender, receiver, and amount
            if sender == user_address and receiver == PAYWALL_ADDRESS and amount == 10_000_000:
                return True, tx_data.get("hash")  # Transaction ID

    return False, "Payment not found."


# Example usage
if __name__ == "__main__":
    user_wallet = "r9GufbCYAfkrwhjbpNXcPJcdDeWCDiCDxc"
    is_paid, tx_id = check_payment(user_wallet)
    print(f"✅ Access granted! TX ID: {tx_id}" if is_paid else f"❌ {tx_id}")