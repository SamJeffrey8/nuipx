from xrpl.clients import JsonRpcClient
from xrpl.wallet import generate_faucet_wallet
from xrpl.account import get_balance

# XRPL Testnet Client
client = JsonRpcClient("https://s.altnet.rippletest.net:51234")

# Generate new wallet and fund it
paywall_wallet = generate_faucet_wallet(client, debug=True)

print(f"✅ PAYWALL SECRET (Seed): {paywall_wallet.seed}")
print(f"✅ PAYWALL ADDRESS: {paywall_wallet.classic_address}")

# Check wallet balance
balance = get_balance(paywall_wallet.classic_address, client)
print(f"✅ Balance: {balance} XRP")
