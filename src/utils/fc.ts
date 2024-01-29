export const getUserByFid = async (fid: number) => {
  const res = await fetch(`https://nemes.farcaster.xyz:2281/v1/userDataByFid?fid=${fid}`)
  const json = await res.json();
  const { messages } = json;
  const username = messages[0].data.userDataBody.value;
  const pfp = messages[1].data.userDataBody.value;
  return {
    fid: fid, 
    username, 
    pfp
  }
}