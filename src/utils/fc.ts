export type FCUser = {
    fid: number;
    username: string;
    pfp: string;
}

export const getUserByFid = async (fid: number) => {
  const res = await fetch(`https://nemes.farcaster.xyz:2281/v1/userDataByFid?fid=${fid}`)
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