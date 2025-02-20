from xrpl.clients import JsonRpcClient
from xrpl.models.transactions import Payment
from xrpl.transaction import submit_and_wait
from xrpl.wallet import Wallet

# XRPL Testnet Client
client = JsonRpcClient("https://s.altnet.rippletest.net:51234")

def send_xrp(sender_seed, receiver_address, amount_xrp):
    """Send XRP from sender to receiver"""

    sender_wallet = Wallet.from_seed(sender_seed)

    # Convert XRP to drops (1 XRP = 1,000,000 drops)
    amount_drops = str(amount_xrp * 1_000_000)

    # Create payment transaction
    payment_txn = Payment(
        account=sender_wallet.classic_address,
        amount=amount_drops,
        destination=receiver_address,
    )

    # Sign and submit transaction
    payment_response = submit_and_wait(payment_txn, client, sender_wallet)

    return payment_response

# Example usage
if __name__ == "__main__":
    sender_seed = "sEdTpJPjRNoqx3yGBTVk2uLgYBoxjAX"  # Replace with real sender seed
    receiver_address = "rEEP6jnUCxKNhYiPxvJiUQ1o6kdBd8s7wt"  # Replace with recipient address
    response = send_xrp(sender_seed, receiver_address, 10)
    print(response)
