import "./style.css";
import { supabase } from "./supabase";

const list = document.querySelector<HTMLUListElement>("#todos")!;

function show(items: string[], muted = false) {
  list.replaceChildren(
    ...items.map((text) => {
      const li = document.createElement("li");
      li.textContent = text;
      if (muted) li.className = "muted";
      return li;
    }),
  );
}

const { data, error } = await supabase
  .from("todos")
  .select("title, done")
  .order("created_at", { ascending: false })
  .limit(5);

if (error) show([`Couldn't reach the list: ${error.message}`], true);
else if (!data.length) show(["The list is empty."], true);
else show(data.map((t) => (t.done ? `✓ ${t.title}` : t.title)));
