/* Delete thumbnails */

for (let i = PPx.EntryDisplayCount; i--;) {
  const entry = PPx.Entry.Item(i);

  if (entry.Size) {
    PPx.Execute(`*delete "${entry.Name}:thumbnail.jpg"`);
  }
}
