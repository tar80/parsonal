/* Delete thumbnails */

for (const entry = PPx.Entry.AllEntry; !entry.atEnd(); entry.moveNext()) {
  if (entry.Size) {
    PPx.Execute(`*delete "${entry.Name}:thumbnail.jpg"`);
  }
}
