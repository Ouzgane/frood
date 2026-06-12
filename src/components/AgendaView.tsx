import { Activity, Friend, ME } from "../types";
import { leadingSlot, myslot } from "../lib/store";
import ActivityCard from "./ActivityCard";

interface Props {
  activities: Activity[];
  friends: Friend[];
  onOpen: (id: string) => void;
}

export default function AgendaView({ activities, friends, onOpen }: Props) {
  const mine = activities
    .filter((a) => a.hostId === ME || myslot(a) !== undefined)
    .sort((a, b) => leadingSlot(a).start.localeCompare(leadingSlot(b).start));

  const hosted = mine.filter((a) => a.hostId === ME);
  const joined = mine.filter((a) => a.hostId !== ME);

  return (
    <div className="view">
      <header className="view__header">
        <h1>Mes sorties</h1>
        <p className="muted">Tout ce que tu organises ou as rejoint, au même endroit.</p>
      </header>

      {mine.length === 0 && <p className="empty">Ton agenda est vide — va voir ce que proposent tes amis 👀</p>}

      {hosted.length > 0 && (
        <>
          <h2 className="section-title">Tu organises</h2>
          {hosted.map((a) => (
            <ActivityCard key={a.id} activity={a} friends={friends} onOpen={onOpen} />
          ))}
        </>
      )}

      {joined.length > 0 && (
        <>
          <h2 className="section-title">Tu participes</h2>
          {joined.map((a) => (
            <ActivityCard key={a.id} activity={a} friends={friends} onOpen={onOpen} />
          ))}
        </>
      )}
    </div>
  );
}
