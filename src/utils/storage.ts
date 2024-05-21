
import { createClient } from '@supabase/supabase-js'
import { FCUser } from './fc';
const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!)

type User = {
  username: string;
  pfp: string;
  fid: number;
}

export const addToGatewayPluginInterestList = async (fid: number, username?: string) => {

  const { data, error } = await supabase
    .from('gateway_plugins')
    .upsert({ fid: fid, username: username }, {onConflict: 'fid'})
    .select()

  if (error) {
    throw error;
  }
}

export const addMessage = async (user: User, message: string) => {

  const { data, error } = await supabase
    .from('messages')
    .insert([
      {
        username: user.username,
        pfp: user.pfp,
        fid: user.fid,
        content: message
      },
    ])
    .select()

  if (error) {
    throw error;
  }

  return data;
}

export const addOrUpdateUserInput = async (fid: number, input: string) => {
  const { data, error } = await supabase
    .from('user_input')
    .upsert(
      {
        "fid": fid,
        "input": input
      },
      { onConflict: "fid" }
    )
    .select()

  if (error) {
    throw error;
  }

  return data;
}

export const getCurrentInputForUser = async (fid: number) => {

  let { data: user_input, error } = await supabase
    .from('user_input')
    .select('*')
    .eq("fid", fid)

  if (error) {
    throw error;
  }

  return user_input ? user_input[0] : null;
}

export const getLastFourMessages = async () => {

  let { data: messages, error } = await supabase
    .from('messages')
    .select('*')
    .limit(4)
    .order('created_at', { ascending: false });
  if (error) {
    throw error;
  }

  return messages;
}

export const addHubster = async (user: FCUser) => {
  const { data, error } = await supabase
    .from('hubsters')
    .upsert(
      user,
      { onConflict: "fid" }
    )
    .select()

  if (error) {
    throw error;
  }

  return data;
}

export const addmagic8BallRow = async (fid: number, question: string, response: string) => {
  const { data, error } = await supabase
    .from('magic_eight_ball')
    .insert([
      { fid, question, response },
    ])
    .select()

}
