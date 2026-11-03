import ClaimCard from './ClaimCard';

const SECTIONS = {
  decision: 'Technical decisions',
  dependency: 'Dependencies',
  blocker: 'Blockers',
  unfinished: 'Unfinished work',
  ownership: 'Ownership',
};

export default function ClaimList({ claims, sources, review, onReview, showEvidence }) {
  return (
    <div className="space-y-6">
      {Object.entries(SECTIONS).map(([type, title]) => {
        const rows = claims.filter((c) => c.type === type);
        if (!rows.length) return null;
        return (
          <section key={type} className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-mute">{title}</h3>
            {rows.map((c) => (
              <ClaimCard
                key={c.id}
                claim={c}
                source={sources[c.source]}
                value={review?.[c.id]}
                onChange={onReview && ((choice) => onReview(c.id, choice))}
                showEvidence={showEvidence}
              />
            ))}
          </section>
        );
      })}
    </div>
  );
}
