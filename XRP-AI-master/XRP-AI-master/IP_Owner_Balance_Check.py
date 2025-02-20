from xrpl.clients import JsonRpcClient
from xrpl.models.requests import AccountInfo

client = JsonRpcClient("https://s.altnet.rippletest.net:51234")
address = "rEEP6jnUCxKNhYiPxvJiUQ1o6kdBd8s7wt"  # Replace with your wallet address

try:
    account_info = client.request(AccountInfo(account=address))
    print(f"✅ Account Info: {account_info.result}")
except Exception as e:
    print(f"❌ Error: {e}")
