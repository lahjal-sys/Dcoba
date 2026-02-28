import { ASPECT_RATIOS } from '../lib/pollinations';

export default function AspectRatioSelector({ selected, onChange }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', margin: '10px 0' }}>
      {ASPECT_RATIOS.map(ratio => (
        <button
          key={ratio.value}
          type="button"
          onClick={() => onChange(ratio.value)}
          className={`ratio-btn ${selected === ratio.value ? 'active' : ''}`}
          style={{ fontSize: '12px', padding: '6px 12px' }}
        >
          {ratio.label}
        </button>
      ))}
    </div>
  );
}
