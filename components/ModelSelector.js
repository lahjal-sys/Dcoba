import { MODELS, FREE_MODELS, LIMITED_MODELS, LIMITED_GENERATE_COUNT } from '../lib/pollinations';
import { getGenerateCount } from '../lib/storage';

export default function ModelSelector({ selectedModel, onModelChange, onLimitReached }) {
  const allModels = [
    { value: MODELS.FLUX, label: 'Flux ⚡', limited: false },
    { value: MODELS.ZIMAGE_TURBO, label: 'ZImage Turbo 🎨', limited: false },
    { value: MODELS.KONTEXT, label: 'Kontext 🧠', limited: true },
    { value: MODELS.KLEIN, label: 'Klein 🪶', limited: true },
  ];

  const handleModelClick = (model) => {
    if (model.limited) {
      const count = getGenerateCount(model.value);
      if (count >= LIMITED_GENERATE_COUNT) {
        onLimitReached?.(model.value);
        return;
      }
    }
    onModelChange(model.value);
  };

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', margin: '10px 0' }}>
      {allModels.map(model => {
        const count = model.limited ? getGenerateCount(model.value) : null;
        const remaining = model.limited ? LIMITED_GENERATE_COUNT - count : null;
        
        return (
          <button
            key={model.value}
            onClick={() => handleModelClick(model)}
            className={`model-btn ${selectedModel === model.value ? 'active' : ''} ${model.limited ? 'limited' : ''}`}
            disabled={model.limited && count >= LIMITED_GENERATE_COUNT}
            title={model.limited ? `${remaining} generates remaining` : undefined}
          >
            {model.label}
            {model.limited && remaining !== null && remaining > 0 && (
              <span style={{ fontSize: '11px', opacity: 0.8 }}> ({remaining})</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
