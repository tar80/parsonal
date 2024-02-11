/* Delete thumbnails */

let item = PPx.Entry.Item;

for (let i = PPx.EntryDisplayCount; i--; ) {
  const entry = item(i);

  if (entry.Size) {
    PPx.Execute(`*delete "${entry.Name}:thumbnail.jpg"`);
  }
}
