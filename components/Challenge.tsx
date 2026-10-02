export default function Challenge({ challenge }: { challenge: Record<string, unknown> }) {
  const requirements = Array.isArray(challenge.requirements) ? challenge.requirements.map(String) : [];
  const hints = Array.isArray(challenge.hints) ? challenge.hints.map(String) : [];
  const criteria = Array.isArray(challenge.acceptanceCriteria) ? challenge.acceptanceCriteria.map(String) : [];
  return (
    <div className="challenge">
      <div className="lesson-meta"><span>Challenge</span></div>
      <h2>{String(challenge.title ?? "چالش")}</h2>
      <p>{String(challenge.brief ?? "")}</p>
      <h3>نیازمندی‌ها</h3><ul>{requirements.map((x) => <li key={x}>{x}</li>)}</ul>
      {hints.length > 0 && <><h3>راهنما</h3><ul>{hints.map((x) => <li key={x}>{x}</li>)}</ul></>}
      {criteria.length > 0 && <><h3>معیار پذیرش</h3><ul>{criteria.map((x) => <li key={x}>{x}</li>)}</ul></>}
    </div>
  );
}
