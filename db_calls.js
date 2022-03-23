import supabase from "./supabase.js";

export async function getFromDB()
{
  
  const { data, error } = await supabase
          .from('todo_table')
          .select();

  return {error, data};
}

export async function insertIntoDB(input_text, completed_state, saved_state)
{
  const { data, error } = await supabase
    .from('todo_table')
    .insert([
        { text: input_text, completed: completed_state, saved: saved_state }
    ]);
}

export async function deleteFromDB(id)
{
  const { data, error } = await supabase
    .from('todo_table')
    .delete()
    .match({ id: id });
}

export async function updateSavedState(id, val)
{
  const { data, error } = await supabase
  .from('todo_table')
  .update({ saved: val })
  .match({ id: id });
}

export async function updateCompletedState(id, val)
{
  const { data, error } = await supabase
  .from('todo_table')
  .update({ completed: val })
  .match({ id: id });
}

export async function updateText(id, val)
{
  const { data, error } = await supabase
  .from('todo_table')
  .update({ text: val })
  .match({ id: id });
}

export async function updateCompletedAt(id, val)
{
  const { data, error } = await supabase
  .from('todo_table')
  .update({ completed_at: val })
  .match({ id: id });
}

// export async function getCompletedAt(id)
// {
//   const { data, error } = await supabase
//           .from('todo_table')
//           .select('completed_at')
//           .match({id: id});
//   return {data, error};
// }