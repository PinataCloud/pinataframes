export type FCUser = {
    fid: number;
    username: string;
    pfp: string;
}

export const getUserByFid = async (fid: number) => {
  const res = await fetch(`https://hub.pinata.cloud/v1/userDataByFid?fid=${fid}`)
  const json = await res.json();
  const { messages } = json;
  const usernamePayload = messages.find((m: any) => m.data.userDataBody.type === "USER_DATA_TYPE_USERNAME")
  const username = usernamePayload.data.userDataBody.value;
  const pfpPayload = messages.find((m: any) => m.data.userDataBody.type === "USER_DATA_TYPE_PFP")
  const pfp = pfpPayload.data.userDataBody.value;
  return {
    fid: fid, 
    username, 
    pfp
  }
}

export const getConnectedAddressForUser = async (fid: number) => {
  const res = await fetch(`https://hub.pinata.cloud/v1/verificationsByFid?fid=${fid}`)
  const json = await res.json();

  return json.messages.map((m: any) => m.data.verificationAddAddressBody.address)
}

`[
  {
      "body": {
          "id": 4823,
          "address": "0x7F9A6992A54dc2f23F1105921715BD61811E5b71",
          "username": "polluterofminds",
          "displayName": "Justin Hunter",
          "bio": "Writer. Building @pinatacloud. Tinkering with a Farcaster native alternative to GoodReads: https://readcast.xyz \\ https://polluterofminds.com",
          "followers": 10724,
          "following": 825,
          "avatarUrl": "https://i.seadn.io/gae/lhGgt7yK1JiBVYz_HBxcAmYLRtP03aw5xKX4FgmFT9Ai7kLD5egzlLvb0lkuRNl28shtjr07DC8IHzLUkTqlWUMndUzC9R5_MSxH3g?w=500&auto=format",
          "isVerifiedAvatar": false,
          "registeredAt": 1667557564293
      },
      "connectedAddress": "0xcdcdc174901b12e87cc82471a2a2bd6181c89392",
      "connectedAddresses": [
          "0xcdcdc174901b12e87cc82471a2a2bd6181c89392",
          "0x1612c6dff0eb5811108b709a30d8150495ce9cc5"
      ]
  }
]`