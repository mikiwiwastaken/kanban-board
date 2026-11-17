export function getRemainingDays(iso) {
  const startDate = new Date(`${iso}T00:00:00`);
  const today = new Date();

  today.setHours(0, 0, 0, 0);

  return Math.floor((today - startDate) / (1000 * 60 * 60 * 24));
}

export function formatDate(iso) {
  return new Date(`${iso}T00:00:00`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}
