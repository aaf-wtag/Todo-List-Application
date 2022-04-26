import supabase from "./supabase.js";

export const  getFromDB = async (searchText) => {
  const { data, error } = await supabase
    .from('todo_table')
    .select()
    .ilike('text', `%${searchText}%`)
    .order('created_at', { ascending: false });
          
  return {error, data};
}

export const insertIntoDB = async (inputText, completedState, savedState) => {
  const { data, error } = await supabase
    .from('todo_table')
    .insert([
        { text: inputText, completed: completedState, saved: savedState }
    ]);
}

export const deleteFromDB = async (id) => {
  const { data, error } = await supabase
    .from('todo_table')
    .delete()
    .match({ id: id });
}

export const updateSavedState = async (id, val) => {
  const { data, error } = await supabase
    .from('todo_table')
    .update({ saved: val })
    .match({ id: id });
  }

export const updateCompletedState = async (id, val) => {
  const { data, error } = await supabase
    .from('todo_table')
    .update({ completed: val })
    .match({ id: id });
}

export const updateText = async (id, val) => {
  const { data, error } = await supabase
    .from('todo_table')
    .update({ text: val })
    .match({ id: id });
}

export const updateCompletedAt = async (id, val) => {
  const { data, error } = await supabase
    .from('todo_table')
    .update({ completed_at: val })
    .match({ id: id });
}

export const getDataWithCompletionStatus = async (searchText, isCompleted) => {
  const { data, error } = await supabase
    .from('todo_table')
    .select()
    .match({completed : isCompleted})
    .ilike('text', `%${searchText}%`)
    .order('created_at', { ascending: false });

  return {error, data};
}