/* Delete thumbnails */

for (const entry = PPx.Entry.AllEntry; !entry.atEnd(); entry.moveNext()) {
  if (entry.Size || entry.Attributes & 16) {
    PPx.Execute(`*delete "${entry.Name}:thumbnail.jpg"`);
  }
}

PPx.Execute('*zoom +0');
