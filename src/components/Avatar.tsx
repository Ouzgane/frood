import { Friend, ME } from "../types";

export function friendName(id: string, friends: Friend[]): string {
  if (id === ME) return "Toi";
  return friends.find((f) => f.id === id)?.name ?? "?";
}

export function friendAvatar(id: string, friends: Friend[]): string {
  if (id === ME) return "🙂";
  return friends.find((f) => f.id === id)?.avatar ?? "👤";
}

export default function Avatar({ id, friends, small }: { id: string; friends: Friend[]; small?: boolean }) {
  return (
    <span className={`avatar ${small ? "avatar--sm" : ""} ${id === ME ? "avatar--me" : ""}`} title={friendName(id, friends)}>
      {friendAvatar(id, friends)}
    </span>
  );
}

export function AvatarStack({ ids, friends, max = 5 }: { ids: string[]; friends: Friend[]; max?: number }) {
  const shown = ids.slice(0, max);
  const extra = ids.length - shown.length;
  return (
    <span className="avatar-stack">
      {shown.map((id) => (
        <Avatar key={id} id={id} friends={friends} small />
      ))}
      {extra > 0 && <span className="avatar avatar--sm avatar--extra">+{extra}</span>}
    </span>
  );
}
